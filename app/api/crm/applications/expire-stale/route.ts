import { NextResponse } from 'next/server';
import { expireStaleDbRows } from '@/app/crm/db';

export async function POST() {
  try {
    const result = await expireStaleDbRows();
    if (!result) {
      return NextResponse.json({ ok: false, error: 'database is not configured' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('[EXPIRE_STALE_APPLICATIONS_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to expire stale applications' }, { status: 500 });
  }
}
