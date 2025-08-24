import { NextResponse } from 'next/server';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/stt – proxy to ElevenLabs Speech-to-Text
 * Expects multipart/form-data with field "audio" containing a Blob (e.g. audio/webm).
 * Returns: { text: string }
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const audio = form.get('audio');

    if (!(audio instanceof Blob)) {
      return NextResponse.json({ detail: 'Field "audio" (Blob) is required' }, { status: 422 });
    }

    // Prepare request to ElevenLabs STT (Scribe v1)
    const elForm = new FormData();
    const file = audio instanceof Blob ? new File([audio], 'audio.webm', { type: audio.type || 'audio/webm' }) : (audio as unknown as File);
    elForm.append('file', file);
    elForm.append('model_id', 'scribe_v1');

    const elRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY ?? '',
      },
      body: elForm,
    });

    if (!elRes.ok) {
      const errText = await elRes.text();
      console.error('[STT_UPSTREAM_ERROR]', errText);
      return NextResponse.json({ detail: 'STT upstream error' }, { status: 502 });
    }

    const data: any = await elRes.json();
    const text: string = typeof data.text === 'string' ? data.text : '';

    return NextResponse.json({ text });
  } catch (err) {
    console.error('[STT_ROUTE_ERROR]', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
