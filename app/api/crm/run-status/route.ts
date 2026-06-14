import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';

const execFileAsync = promisify(execFile);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DiscoveryStage = {
  name?: string;
  ok?: boolean;
  started_at?: string;
  finished_at?: string;
  summary?: Record<string, unknown> | null;
};

type DiscoveryRun = {
  ok?: boolean;
  started_at?: string;
  finished_at?: string;
  stages?: DiscoveryStage[];
};

function jsonRunsFromJournal(output: string) {
  const runs: DiscoveryRun[] = [];
  let buffer: string[] = [];
  let depth = 0;
  let inJson = false;

  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!inJson && trimmed === '{') {
      inJson = true;
      depth = 0;
      buffer = [];
    }
    if (!inJson) continue;

    buffer.push(line);
    for (const char of line) {
      if (char === '{') depth += 1;
      if (char === '}') depth -= 1;
    }

    if (depth === 0) {
      inJson = false;
      try {
        const parsed = JSON.parse(buffer.join('\n')) as DiscoveryRun;
        if (Array.isArray(parsed.stages)) runs.push(parsed);
      } catch {
        // Ignore partial/non-run journal JSON.
      }
    }
  }

  return runs;
}

function stage(run: DiscoveryRun, name: string) {
  return run.stages?.find((item) => item.name === name);
}

function num(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function latestIso(...values: Array<string | undefined>) {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

export async function GET() {
  try {
    const { stdout } = await execFileAsync(
      'journalctl',
      ['--user', '-u', 'job-discovery.service', '--since', 'today', '-o', 'cat', '--no-pager'],
      { timeout: 5000, maxBuffer: 1024 * 1024 * 4 }
    );
    const runs = jsonRunsFromJournal(stdout);
    const run = runs.at(-1);

    if (!run) {
      return NextResponse.json({ ok: false, error: 'No discovery run found today' }, { status: 404 });
    }

    const yc = stage(run, 'yc');
    const wellfound = stage(run, 'wellfound');
    const linkedin = stage(run, 'linkedin');
    const shortlist = stage(run, 'shortlist');
    const enrich = stage(run, 'enrich');
    const prepare = stage(run, 'prepare_applications');
    const sync = stage(run, 'sync_db');

    const ycSummary = yc?.summary || {};
    const wellfoundSummary = wellfound?.summary || {};
    const linkedinSummary = linkedin?.summary || {};
    const shortlistSummary = shortlist?.summary || {};
    const enrichSummary = enrich?.summary || {};
    const prepareSummary = prepare?.summary || {};
    const syncSummary = sync?.summary || {};
    const enrichmentInputCount = num(enrichSummary.input_count);
    const skippedExistingCount = num(enrichSummary.skipped_existing_count);

    return NextResponse.json({
      ok: true,
      run_ok: Boolean(run.ok),
      started_at: run.started_at,
      finished_at: run.finished_at,
      scrape_finished_at: latestIso(yc?.finished_at, wellfound?.finished_at, linkedin?.finished_at),
      enrichment_finished_at: enrich?.finished_at,
      sources: {
        yc: {
          ok: Boolean(yc?.ok),
          count: num(ycSummary.count),
          new_count: num(ycSummary.new_count),
        },
        wellfound: {
          ok: Boolean(wellfound?.ok),
          count: num(wellfoundSummary.count),
          new_count: num(wellfoundSummary.new_count),
        },
        linkedin: {
          ok: Boolean(linkedin?.ok),
          count: num(linkedinSummary.count),
          new_count: num(linkedinSummary.new_count),
          enabled: Boolean(linkedin),
        },
      },
      scraped_count: num(shortlistSummary.raw_count) || num(ycSummary.count) + num(wellfoundSummary.count) + num(linkedinSummary.count),
      new_scraped_count: num(ycSummary.new_count) + num(wellfoundSummary.new_count) + num(linkedinSummary.new_count),
      shortlist_candidate_count: num(shortlistSummary.accepted_count) + num(shortlistSummary.needs_review_count),
      shortlist: {
        accepted_count: num(shortlistSummary.accepted_count),
        needs_review_count: num(shortlistSummary.needs_review_count),
        rejected_count: num(shortlistSummary.rejected_count),
      },
      enrichment: {
        candidate_count: num(enrichSummary.candidate_count) || enrichmentInputCount + skippedExistingCount,
        eligible_count: num(enrichSummary.eligible_count) || enrichmentInputCount,
        input_count: enrichmentInputCount,
        skipped_existing_count: skippedExistingCount,
        accepted_count: num(enrichSummary.accepted_count),
        needs_review_count: num(enrichSummary.needs_review_count),
        rejected_count: num(enrichSummary.rejected_count),
        failed_enrichments: num(enrichSummary.failed_enrichments),
      },
      prepared: {
        ready_to_apply: num(prepareSummary.ready_to_apply),
        ai_used: num(prepareSummary.ai_used),
        ai_missing_or_failed: num(prepareSummary.ai_missing_or_failed),
      },
      synced: {
        upserted: num(syncSummary.upserted),
        total: num(syncSummary.total),
      },
    });
  } catch (error) {
    console.error('[CRM_RUN_STATUS]', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'failed to read run status' },
      { status: 500 }
    );
  }
}
