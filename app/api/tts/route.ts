import { NextResponse } from 'next/server';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/tts – ElevenLabs Text-to-Speech proxy
 * Body: { text: string, voice_id?: string, model_id?: string }
 * Returns: audio/mpeg stream
 */
export async function POST(req: Request) {
  try {
    const { text, voice_id, model_id } = (await req.json()) as {
      text?: string;
      voice_id?: string;
      model_id?: string;
    };

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ detail: 'Field "text" is required' }, { status: 422 });
    }

    // Choose defaults
    const voiceId = voice_id ?? 'EXAVITQu4vr4xnSDxMaL'; // default voice (Rachel)
    const chosenModel = model_id ?? 'eleven_multilingual_v2';

    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY ?? '',
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({ text, model_id: chosenModel, optimize_streaming_latency: 0 }),
      });

    if (!upstream.ok || !upstream.body) {
      const err = await upstream.text();
      console.error('[TTS_UPSTREAM_ERROR]', err);
      return NextResponse.json({ detail: 'TTS upstream error' }, { status: 502 });
    }

    // Buffer audio then return (avoids streaming issues on Vercel)
    const arrayBuf = await upstream.arrayBuffer();

    return new Response(Buffer.from(arrayBuf), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[TTS_ROUTE_ERROR]', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
