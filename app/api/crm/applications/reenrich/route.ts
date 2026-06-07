import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';

const execFileAsync = promisify(execFile);

type ReenrichInput = {
  source?: string;
  job_id?: string;
};

type ReenrichPayload = {
  ok?: boolean;
  application?: unknown;
  error?: string;
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function backendDir() {
  return path.join(process.cwd(), 'backend');
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as ReenrichInput;
    if (!input.source || !input.job_id) {
      return NextResponse.json({ ok: false, error: 'source and job_id are required' }, { status: 400 });
    }

    const { stdout, stderr } = await execFileAsync(
      'uv',
      [
        'run',
        'python',
        'scripts/reenrich_job_lead.py',
        '--source',
        input.source,
        '--job-id',
        input.job_id,
        '--pause-ms',
        '900',
      ],
      {
        cwd: backendDir(),
        env: {
          ...process.env,
          WELLFOUND_CDP_URL: process.env.WELLFOUND_CDP_URL || 'http://127.0.0.1:9222',
        },
        maxBuffer: 1024 * 1024 * 8,
        timeout: 180_000,
      }
    );

    const payload = JSON.parse(stdout || '{}') as ReenrichPayload;
    if (!payload.ok || !payload.application) {
      return NextResponse.json({ ok: false, error: payload.error || stderr || 're-enrich failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, application: payload.application });
  } catch (error) {
    console.error('[REENRICH_ERROR]', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'failed to re-enrich job',
      },
      { status: 500 }
    );
  }
}
