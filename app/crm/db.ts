import { Pool } from 'pg';
import type { JobRow } from './CrmDashboardClient';

let pool: Pool | undefined;

function databaseUrlForPg() {
  if (!process.env.DATABASE_URL) return null;
  const url = new URL(process.env.DATABASE_URL);
  // node-postgres does not need Neon/Postgres channel binding params, and leaving
  // them in can make serverless connection failures hang until the function dies.
  url.searchParams.delete('channel_binding');
  return url.toString();
}

function getPool() {
  const connectionString = databaseUrlForPg();
  if (!connectionString) return null;
  pool ||= new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10_000,
    max: 1,
  });
  return pool;
}

function rowFromDb(row: { raw: Record<string, unknown> }) {
  return row.raw as JobRow;
}

export async function readDbRows(where: string, params: unknown[] = []) {
  const db = getPool();
  if (!db) return null;
  try {
    const result = await db.query(`select raw from job_leads ${where}`, params);
    return result.rows.map(rowFromDb);
  } catch (error) {
    console.error('[CRM_DB_READ]', error);
    return null;
  }
}

export async function upsertDbRow(row: JobRow) {
  const db = getPool();
  if (!db || !row.source || !row.job_id) return null;
  const raw = { ...row };
  try {
    await db.query(
    `insert into job_leads (
      source, job_id, application_id, status, application_status, title, company, location,
      compensation, job_url, apply_url, employer_name, employer_type, ai_fit_score,
      cover_letter, follow_up_email, follow_up_status, applied_at, follow_up_due_at,
      follow_up_sent_at, expires_at, raw
    ) values (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19,
      $20, $21, $22
    )
    on conflict (source, job_id) do update set
      application_id = excluded.application_id,
      status = excluded.status,
      application_status = excluded.application_status,
      title = excluded.title,
      company = excluded.company,
      location = excluded.location,
      compensation = excluded.compensation,
      job_url = excluded.job_url,
      apply_url = excluded.apply_url,
      employer_name = excluded.employer_name,
      employer_type = excluded.employer_type,
      ai_fit_score = excluded.ai_fit_score,
      cover_letter = excluded.cover_letter,
      follow_up_email = excluded.follow_up_email,
      follow_up_status = excluded.follow_up_status,
      applied_at = excluded.applied_at,
      follow_up_due_at = excluded.follow_up_due_at,
      follow_up_sent_at = excluded.follow_up_sent_at,
      expires_at = excluded.expires_at,
      raw = excluded.raw,
      updated_at = now()`,
    [
      row.source,
      row.job_id,
      row.application_id || `${row.source}:${row.job_id}`,
      row.status || null,
      row.application_status || null,
      row.title || null,
      row.company || row.employer_name || null,
      row.location || null,
      row.compensation || null,
      row.job_url || null,
      row.apply_url || null,
      row.employer_name || row.company || null,
      row.employer_type || null,
      row.ai_fit_score || row.rank_score || null,
      row.cover_letter || null,
      row.follow_up_email || null,
      row.follow_up_status || null,
      row.applied_at || null,
      row.follow_up_due_at || null,
      row.follow_up_sent_at || null,
      row.expires_at || null,
      raw,
    ]
    );
  } catch (error) {
    console.error('[CRM_DB_UPSERT]', error);
    return null;
  }
  return row;
}

export async function updateDbRow(input: { application_id?: string; source?: string; job_id?: string }, updater: (row: JobRow) => JobRow) {
  const db = getPool();
  if (!db) return null;
  try {
    const result = await db.query(
      `select raw from job_leads where ($1::text is not null and application_id = $1) or ($2::text is not null and $3::text is not null and source = $2 and job_id = $3) limit 1`,
      [input.application_id || null, input.source || null, input.job_id || null]
    );
    if (!result.rows[0]) return null;
    const updated = updater(rowFromDb(result.rows[0]));
    await upsertDbRow(updated);
    return updated;
  } catch (error) {
    console.error('[CRM_DB_UPDATE]', error);
    return null;
  }
}

export async function expireStaleDbRows() {
  const db = getPool();
  if (!db) return null;
  try {
    const result = await db.query(
      `select raw from job_leads
       where expires_at is not null
         and expires_at <= now()
         and coalesce(application_status, '') not in ('expired', 'rejected_by_ai')`
    );
    const now = new Date().toISOString();
    const applications = [];
    for (const resultRow of result.rows) {
      const row = rowFromDb(resultRow);
      const updated = {
        ...row,
        application_status: 'expired',
        expired_at: row.expired_at || now,
      };
      await upsertDbRow(updated);
      applications.push(updated);
    }
    return { expired: applications.length, applications };
  } catch (error) {
    console.error('[CRM_DB_EXPIRE]', error);
    return null;
  }
}
