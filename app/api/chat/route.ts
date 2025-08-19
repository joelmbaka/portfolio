/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

// Forward chat requests from the frontend to the external portfolio AI API.
// This avoids CORS issues because the browser calls a same-origin URL (/api/chat)
// and the server-side route makes the cross-origin request.

const EXTERNAL_API_BASE =
  process.env.CHAT_API_URL ?? 'https://portfolio-ai-api.onrender.com';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { detail: 'Field "question" is required' },
        { status: 422 },
      );
    }

    const upstream = await fetch(`${EXTERNAL_API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const apiData = await upstream.json();

    // Normalise to a simple answer string regardless of nesting
    const extract = (d: any): string | undefined => {
      if (!d) return undefined;
      if (typeof d === 'string') return d;
      if (typeof d.raw === 'string') return d.raw;
      if (typeof d.answer === 'string') return d.answer;
      return undefined;
    };

    let answer: string | undefined = extract(apiData?.answer) ?? extract(apiData);

    if (!answer && Array.isArray(apiData?.tasks_output)) {
      for (const item of apiData.tasks_output) {
        answer = extract(item) ?? extract(item?.answer);
        if (answer) break;
      }
    }

    const payload = { answer: answer ?? 'Sorry, I could not find an answer.' };

    return NextResponse.json(payload, { status: upstream.status });
  } catch (err) {
    console.error('[CHAT_PROXY_ERROR]', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
