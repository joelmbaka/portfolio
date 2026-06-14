'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  FileText,
  Loader2,
  Mail,
  RefreshCcw,
  XCircle,
} from 'lucide-react';

type ActivityNote = {
  id: string;
  text: string;
  created_at: string;
};

type ApplicationEvent = {
  id: string;
  status: string;
  label: string;
  note?: string;
  created_at: string;
};

export type JobRow = {
  application_id?: string;
  source?: string;
  source_detail?: string;
  job_id?: string;
  job_url?: string;
  apply_url?: string;
  title?: string;
  company?: string;
  location?: string;
  compensation?: string;
  posted_age?: string;
  posted_age_days?: number | string | null;
  posted_at_estimated?: string | null;
  posted_age_confidence?: string | null;
  category?: string;
  status?: string;
  rank_score?: number;
  matched_criteria?: string[];
  rejected_criteria?: string[];
  has_apply_button?: boolean;
  employer_name?: string;
  employer_url?: string;
  employer_website?: string;
  employer_summary?: string;
  employer_type?: string;
  startup_stage?: string;
  employer_priority_score?: number;
  product_signal_terms?: string[];
  follow_up_angle?: string;
  application_status?: string;
  ai_fit_score?: number;
  ai_reason?: string;
  ai_rejected_criteria?: string[];
  cv_version?: string;
  cover_letter?: string | null;
  follow_up_email?: string | null;
  applied_at?: string;
  follow_up_due_at?: string;
  follow_up_status?: string | null;
  follow_up_sent_at?: string | null;
  expires_at?: string;
  expired_at?: string;
  review_decision?: string;
  activity_notes?: ActivityNote[];
  application_events?: ApplicationEvent[];
};

type CrmDashboardClientProps = {
  enriched: JobRow[];
  review: JobRow[];
  rejected: JobRow[];
  rawRejected: JobRow[];
  rawAccepted: JobRow[];
  rawReview: JobRow[];
  wellfound: JobRow[];
  yc: JobRow[];
  applications: JobRow[];
};

type RunStatus = {
  ok?: boolean;
  run_ok?: boolean;
  finished_at?: string;
  scrape_finished_at?: string;
  enrichment_finished_at?: string;
  scraped_count?: number;
  new_scraped_count?: number;
  shortlist_candidate_count?: number;
  sources?: {
    yc?: { ok?: boolean; count?: number; new_count?: number };
    wellfound?: { ok?: boolean; count?: number; new_count?: number };
    linkedin?: { ok?: boolean; count?: number; new_count?: number; enabled?: boolean };
  };
  shortlist?: {
    accepted_count?: number;
    needs_review_count?: number;
    rejected_count?: number;
  };
  enrichment?: {
    candidate_count?: number;
    eligible_count?: number;
    input_count?: number;
    skipped_existing_count?: number;
    accepted_count?: number;
    needs_review_count?: number;
    rejected_count?: number;
    failed_enrichments?: number;
  };
  prepared?: {
    ready_to_apply?: number;
    ai_used?: number;
    ai_missing_or_failed?: number;
  };
  synced?: {
    upserted?: number;
    total?: number;
  };
};

function sourceLabel(source?: string) {
  if (source === 'wellfound') return 'Wellfound';
  if (source === 'yc') return 'YC';
  if (source === 'linkedin') return 'LinkedIn';
  return source || 'Source';
}

function externalUrl(job: JobRow) {
  return job.job_url || job.apply_url || job.employer_url || job.employer_website;
}

function formatScore(score?: number) {
  if (typeof score !== 'number') return '-';
  return `${Math.round(score * 100)}%`;
}

function cleanLabel(value?: string) {
  return value ? value.replaceAll('_', ' ') : 'unknown';
}

function titleCaseLabel(value?: string) {
  return cleanLabel(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function companyName(job: JobRow) {
  return job.employer_name || job.company || 'Unknown company';
}

function jobKey(job: JobRow) {
  return `${job.source || ''}:${job.job_id || job.job_url || job.title || companyName(job)}`;
}

function uniqueRows(rows: JobRow[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = jobKey(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function postedAgeDays(job: JobRow) {
  if (typeof job.posted_age_days === 'number') return Number.isFinite(job.posted_age_days) ? job.posted_age_days : 999999;
  if (typeof job.posted_age_days === 'string' && job.posted_age_days.trim()) {
    const parsed = Number(job.posted_age_days);
    return Number.isFinite(parsed) ? parsed : 999999;
  }
  return 999999;
}

function sortByFreshness(rows: JobRow[]) {
  return [...rows].sort((a, b) => {
    const ageDelta = postedAgeDays(a) - postedAgeDays(b);
    if (ageDelta !== 0) return ageDelta;
    return jobKey(a).localeCompare(jobKey(b));
  });
}

function postedAgeLabel(job: JobRow) {
  return job.posted_age || 'Age unknown';
}

function isDueNow(value?: string | null) {
  if (!value) return false;
  const dueAt = new Date(value).getTime();
  return Number.isFinite(dueAt) && dueAt <= Date.now();
}

function isExpired(job: JobRow) {
  return Boolean(job.expires_at && isDueNow(job.expires_at));
}

function daysRemaining(value?: string | null) {
  if (!value) return null;
  const target = new Date(value).getTime();
  if (!Number.isFinite(target)) return null;
  return Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
}

function formatDateTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRunTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '-';
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const POST_APPLY_STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview_scheduled', label: 'Interview scheduled' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected_after_apply', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'followup_sent', label: 'Follow-up sent' },
];

const POST_APPLY_STATUS_VALUES = new Set(POST_APPLY_STATUS_OPTIONS.map((option) => option.value));
const FINAL_APPLICATION_STATUS_VALUES = new Set(['hired', 'rejected_after_apply', 'withdrawn', 'expired']);

function applicationStatusLabel(status?: string) {
  return POST_APPLY_STATUS_OPTIONS.find((option) => option.value === status)?.label || titleCaseLabel(status);
}

function RunStatusStrip({ status }: { status: RunStatus | null }) {
  const enrichment = status?.enrichment;
  const prepared = status?.prepared;
  const yc = status?.sources?.yc;
  const wellfound = status?.sources?.wellfound;
  const linkedin = status?.sources?.linkedin;
  const blocked = (enrichment?.failed_enrichments ?? 0) + (prepared?.ai_missing_or_failed ?? 0);
  const ready = prepared?.ready_to_apply ?? enrichment?.accepted_count ?? 0;
  const shortlistAccepted = status?.shortlist?.accepted_count ?? 0;
  const shortlistReview = status?.shortlist?.needs_review_count ?? 0;
  const shortlistCandidates = status?.shortlist_candidate_count ?? shortlistAccepted + shortlistReview;
  const eligibleToEnrich = enrichment?.eligible_count ?? enrichment?.input_count ?? 0;
  const linkedinScrapeDetail = linkedin?.enabled ? ` · LI ${linkedin.ok ? linkedin.count ?? 0 : 'blocked'}` : '';
  const linkedinNewDetail = linkedin?.enabled ? ` · LI ${linkedin.ok ? linkedin.new_count ?? 0 : 'blocked'}` : '';
  const scrapeDetail = `YC ${yc?.count ?? 0} · WF ${wellfound?.count ?? 0}${linkedinScrapeDetail}`;
  const newScrapeDetail = `YC ${yc?.new_count ?? 0} · WF ${wellfound?.new_count ?? 0}${linkedinNewDetail}`;

  const items = [
    {
      label: 'Last scrape',
      value: status ? formatRunTime(status.scrape_finished_at || status.finished_at) : 'Loading',
      detail: status?.run_ok === false ? 'Issue' : scrapeDetail,
    },
    {
      label: 'New scraped',
      value: status?.new_scraped_count ?? '-',
      detail: newScrapeDetail,
    },
    {
      label: 'Shortlisted',
      value: status ? shortlistCandidates : '-',
      detail: `${shortlistAccepted} accepted · ${shortlistReview} review`,
    },
    {
      label: 'To enrich',
      value: status ? eligibleToEnrich : '-',
      detail: `${enrichment?.skipped_existing_count ?? 0} already known`,
    },
    {
      label: 'Last enrichment',
      value: status ? formatRunTime(status.enrichment_finished_at || status.finished_at) : 'Loading',
      detail: `${ready} ready · ${enrichment?.input_count ?? 0} processed`,
    },
    {
      label: 'Blocked',
      value: blocked,
      detail: `${enrichment?.failed_enrichments ?? 0} enrich · ${prepared?.ai_missing_or_failed ?? 0} draft`,
    },
  ];

  return (
    <section className="grid shrink-0 grid-cols-2 gap-2 border-b border-[var(--neutral-border)] bg-background px-4 py-2 sm:grid-cols-3 xl:grid-cols-6 lg:px-8">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-[var(--neutral-border)] bg-muted/40 px-3 py-2">
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">{item.label}</div>
            <div className="mt-0.5 truncate text-sm font-semibold">{item.value}</div>
          </div>
          <div className="max-w-[9rem] truncate text-right text-[11px] leading-4 text-muted-foreground">{item.detail}</div>
        </div>
      ))}
    </section>
  );
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const classes = {
    brand: 'bg-[var(--brand-soft)] text-[var(--brand-strong)] ring-[var(--brand-border)]',
    success: 'bg-[var(--success-soft)] text-[var(--success)] ring-[var(--success-border)]',
    warning: 'bg-[var(--warning-soft)] text-amber-700 ring-[var(--warning-border)]',
    danger: 'bg-[var(--danger-soft)] text-[var(--danger)] ring-[var(--danger-border)]',
    info: 'bg-[var(--info-soft)] text-[var(--info)] ring-[var(--info-border)]',
    neutral: 'bg-background text-muted-foreground ring-[var(--neutral-border)]',
  }[tone];
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${classes}`}>{children}</span>;
}

type PipelineMode = 'approved' | 'sent' | 'followups';
type EnrichmentMode = 'jobs' | 'dropped' | 'followedup';
type WorkspaceMode = 'activity' | 'intel' | 'draft' | 'followup';

function ToolbarTab({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex h-8 items-center justify-center whitespace-nowrap rounded-md border px-2 text-xs font-medium transition-colors hover:bg-background hover:text-foreground ${
          active
            ? 'border-[var(--brand-border)] bg-background text-[var(--brand-strong)] shadow-sm ring-1 ring-[var(--brand-border)]'
            : 'border-transparent text-muted-foreground'
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <span
      className={`flex h-8 items-center justify-center whitespace-nowrap rounded-md border px-2 text-xs font-medium ${
        active
          ? 'border-[var(--brand-border)] bg-background text-[var(--brand-strong)] shadow-sm ring-1 ring-[var(--brand-border)]'
          : 'border-transparent text-muted-foreground'
      }`}
    >
      {children}
    </span>
  );
}

function QueueCard({
  job,
  badge,
  badgeStatus,
  meta,
  active,
  isGeneratingDrafts,
  onSelect,
}: {
  job: JobRow;
  badge: string;
  badgeStatus?: string;
  meta?: string;
  active?: boolean;
  isGeneratingDrafts?: boolean;
  onSelect: () => void;
}) {
  const badgeToneKey = badgeStatus || badge;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full rounded-md border bg-background p-3 text-left text-xs transition-colors hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]/25 ${
        active ? 'border-[var(--brand-border)] bg-[var(--brand-soft)]/45 ring-1 ring-[var(--brand-border)]' : 'border-[var(--neutral-border)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{companyName(job)}</div>
          <div className="mt-0.5 truncate text-muted-foreground">{job.title || 'Untitled role'}</div>
        </div>
        <Badge
          tone={
            isGeneratingDrafts
              ? 'warning'
              : badgeToneKey === 'ready' || badgeToneKey === 'hired' || badgeToneKey === 'offer'
                ? 'success'
                : badgeToneKey === 'rejected' || badgeToneKey === 'rejected_after_apply' || badgeToneKey === 'withdrawn'
                  ? 'danger'
                  : 'brand'
          }
        >
          {isGeneratingDrafts ? 'drafting' : badge}
        </Badge>
      </div>
      <div className="mt-2 line-clamp-2 text-muted-foreground">
        {isGeneratingDrafts ? 'Generating cover letter and follow-up email with AI.' : job.ai_reason || job.employer_summary || job.follow_up_angle || 'No summary stored yet.'}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-muted-foreground">
        <span className="truncate">{job.compensation || 'No cash shown'}</span>
        <span className="shrink-0">{postedAgeLabel(job)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-muted-foreground">
        <span className="truncate">{meta || sourceLabel(job.source)}</span>
      </div>
    </button>
  );
}

function RejectedCard({ job, active, onSelect }: { job: JobRow; active?: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full rounded-md border bg-background p-3 text-left text-xs transition-colors hover:border-[var(--danger-border)] hover:bg-[var(--danger-soft)]/30 ${
        active
          ? 'border-l-4 border-[var(--danger)] bg-[var(--danger-soft)]/70 shadow-sm ring-2 ring-[var(--danger-border)]'
          : 'border-[var(--neutral-border)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium">{companyName(job)}</div>
          <div className="mt-0.5 truncate text-muted-foreground">{job.title || 'Rejected role'}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {active ? <Badge tone="danger">selected</Badge> : null}
          <XCircle className="size-4 text-[var(--danger)]" aria-hidden />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {((job.ai_rejected_criteria || job.rejected_criteria) || ['rejected']).slice(0, 4).map((item) => (
          <Badge key={item} tone="danger">{item}</Badge>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-muted-foreground">
        <span className="truncate">{job.compensation || 'No cash shown'}</span>
        <span className="shrink-0">{postedAgeLabel(job)}</span>
      </div>
    </button>
  );
}

function FollowedUpCard({ job, active, onSelect }: { job: JobRow; active?: boolean; onSelect: () => void }) {
  const remaining = daysRemaining(job.expires_at);
  const remainingLabel = remaining === null ? 'No expiry set' : `${remaining} day${remaining === 1 ? '' : 's'} remaining`;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full rounded-md border bg-background p-3 text-left text-xs transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)]/30 ${
        active ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]/45 ring-1 ring-[var(--accent-border)]' : 'border-[var(--neutral-border)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium">{companyName(job)}</div>
          <div className="mt-0.5 truncate text-muted-foreground">{job.title || 'Followed-up role'}</div>
        </div>
        <Badge tone="brand">sent</Badge>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-muted-foreground">
        <span className="truncate">Sent {job.follow_up_sent_at || 'recently'}</span>
        <span className="shrink-0 font-medium text-[var(--accent-strong)]">{remainingLabel}</span>
      </div>
    </button>
  );
}

function InfoLine({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-medium">{value || '-'}</div>
    </div>
  );
}

function ActivityItem({
  title,
  detail,
  tone = 'brand',
  timestamp,
}: {
  title: string;
  detail: string;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  timestamp?: string;
}) {
  const dot = {
    brand: 'bg-[var(--brand)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]',
    info: 'bg-[var(--info)]',
  }[tone];
  return (
    <div className="rounded-md border border-[var(--neutral-border)] bg-background p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`size-2 shrink-0 rounded-full ${dot}`} />
          <span className="truncate font-medium">{title}</span>
        </div>
        {timestamp ? <span className="shrink-0 text-[11px] text-muted-foreground">{timestamp}</span> : null}
      </div>
      <div className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</div>
    </div>
  );
}

function excerpt(value?: string | null, limit = 260) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function DraftPreview({ job, onOpenDraft }: { job: JobRow; onOpenDraft: () => void }) {
  return (
    <div className="rounded-md border border-[var(--brand-border)] bg-background p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 font-medium">
          <FileText className="size-4 shrink-0 text-[var(--brand)]" aria-hidden />
          Draft preview
        </div>
        <button
          type="button"
          onClick={onOpenDraft}
          className="inline-flex h-8 shrink-0 items-center rounded-md border border-[var(--brand-border)] px-2.5 text-xs font-medium text-[var(--brand-strong)] hover:bg-[var(--brand-soft)]"
        >
          Review drafts
        </button>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-[var(--neutral-border)] p-3">
          <div className="text-xs font-medium">Cover letter</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{excerpt(job.cover_letter)}</p>
        </div>
        <div className="min-w-0 rounded-md border border-[var(--neutral-border)] p-3">
          <div className="text-xs font-medium">Follow-up email</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{excerpt(job.follow_up_email)}</p>
        </div>
      </div>
    </div>
  );
}

function FollowUpPanel({
  job,
  copiedDraft,
  isMarkingFollowUpSent,
  onCopyDraft,
  onMarkFollowUpSent,
}: {
  job: JobRow;
  copiedDraft: 'cover' | 'followup' | null;
  isMarkingFollowUpSent: boolean;
  onCopyDraft: (kind: 'cover' | 'followup', value?: string | null) => void;
  onMarkFollowUpSent: (job: JobRow) => void;
}) {
  return (
    <div className="rounded-md border border-[var(--accent-border)] bg-background p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">Follow-up due now</div>
          <div className="mt-1 text-xs text-muted-foreground">{job.follow_up_due_at || 'Due date not stored'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyDraft('followup', job.follow_up_email)}
            disabled={!job.follow_up_email}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--neutral-border)] px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Clipboard className="size-3.5" aria-hidden />
            {copiedDraft === 'followup' ? 'Copied' : 'Copy email'}
          </button>
          <button
            type="button"
            onClick={() => onMarkFollowUpSent(job)}
            disabled={isMarkingFollowUpSent}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-[var(--accent-brand)] px-2.5 text-xs font-medium text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Mail className="size-3.5" aria-hidden />
            {isMarkingFollowUpSent ? 'Saving' : 'Mark sent'}
          </button>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {job.follow_up_email || 'No follow-up email draft stored yet.'}
      </p>
    </div>
  );
}

function LeadWorkspace({
  job,
  mode,
  onSetMode,
  copiedDraft,
  onCopyDraft,
  isMarkingApplied,
  onMarkApplied,
  isMarkingFollowUpSent,
  onMarkFollowUpSent,
  isReviewActionPending,
  isGeneratingDrafts,
  isReenriching,
  onApproveReview,
  onDropReview,
  onReenrich,
  isSavingActivity,
  onSaveActivity,
}: {
  job?: JobRow;
  mode: WorkspaceMode;
  onSetMode: (mode: WorkspaceMode) => void;
  copiedDraft: 'cover' | 'followup' | null;
  onCopyDraft: (kind: 'cover' | 'followup', value?: string | null) => void;
  isMarkingApplied: boolean;
  onMarkApplied: (job: JobRow) => void;
  isMarkingFollowUpSent: boolean;
  onMarkFollowUpSent: (job: JobRow) => void;
  isReviewActionPending: boolean;
  isGeneratingDrafts: boolean;
  isReenriching: boolean;
  onApproveReview: (job: JobRow) => void;
  onDropReview: (job: JobRow) => void;
  onReenrich: (job: JobRow) => void;
  isSavingActivity: boolean;
  onSaveActivity: (job: JobRow, input: { application_status?: string; note?: string }) => void;
}) {
  const [noteDraft, setNoteDraft] = React.useState('');
  const [statusDraft, setStatusDraft] = React.useState('applied');
  React.useEffect(() => {
    setNoteDraft('');
    setStatusDraft(job?.application_status || 'applied');
  }, [job?.application_status, job?.job_id, job?.source]);

  if (!job) {
    return <div className="text-sm text-muted-foreground">Select a row to see that lead&apos;s outreach timeline.</div>;
  }

  const explicitRejected = job.application_status === 'rejected_by_ai' || job.status === 'rejected';
  const needsReview = !explicitRejected && (job.application_status === 'needs_review' || job.status === 'needs_review');
  const rejected = explicitRejected;
  const rejectionReason = [...(job.ai_rejected_criteria || []), ...(job.rejected_criteria || [])].join(', ');
  const hasOutreachDrafts = Boolean(job.cover_letter && job.follow_up_email);
  const followUpDue = POST_APPLY_STATUS_VALUES.has(job.application_status || '') && !FINAL_APPLICATION_STATUS_VALUES.has(job.application_status || '') && Boolean(job.follow_up_due_at) && job.follow_up_status !== 'sent' && isDueNow(job.follow_up_due_at);
  const statusLabel = needsReview ? 'review' : applicationStatusLabel(job.application_status) || (rejected ? 'rejected' : 'ready');
  const statusTone = rejected ? 'danger' : needsReview ? 'warning' : 'success';

  const activityFeed = [
    ...(job.activity_notes || []).map((note) => ({
      key: note.id,
      at: note.created_at,
      title: 'Note',
      detail: note.text,
      tone: 'info' as const,
    })),
    ...(job.application_events || []).map((event) => ({
      key: event.id,
      at: event.created_at,
      title: `Status: ${event.label || applicationStatusLabel(event.status)}`,
      detail: event.note || `Application moved to ${applicationStatusLabel(event.status)}.`,
      tone: event.status === 'hired' || event.status === 'offer' ? 'success' as const : event.status === 'rejected_after_apply' || event.status === 'withdrawn' ? 'danger' as const : 'brand' as const,
    })),
    ...(job.applied_at ? [{
      key: 'applied_at',
      at: job.applied_at,
      title: 'Status: Applied',
      detail: 'External application was marked applied.',
      tone: 'success' as const,
    }] : []),
    ...(job.follow_up_sent_at ? [{
      key: 'follow_up_sent_at',
      at: job.follow_up_sent_at,
      title: 'Status: Follow-up sent',
      detail: 'Direct follow-up email was marked sent.',
      tone: 'brand' as const,
    }] : []),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const canTrackPostApply = Boolean(job.application_status && POST_APPLY_STATUS_VALUES.has(job.application_status));

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-background p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{sourceLabel(job.source)}</Badge>
              <Badge tone={statusTone}>{statusLabel}</Badge>
              {!needsReview && !rejected && hasOutreachDrafts ? <Badge tone="brand">drafts ready</Badge> : null}
            </div>
            <h3 className="mt-3 text-base font-semibold">{job.title}</h3>
            {mode === 'intel' ? (
              <p className="mt-1 text-sm text-muted-foreground">{[companyName(job), job.location].filter(Boolean).join(' · ')}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {mode === 'intel' ? (
              <button
                type="button"
                onClick={() => onReenrich(job)}
                disabled={isReenriching}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--neutral-border)] px-2.5 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw className={`size-4 ${isReenriching ? 'animate-spin' : ''}`} aria-hidden />
                {isReenriching ? 'Re-enriching' : 'Re-enrich'}
              </button>
            ) : null}
            {mode === 'draft' && !rejected && job.application_status === 'ready_to_apply' ? (
              <button
                type="button"
                onClick={() => onMarkApplied(job)}
                disabled={isMarkingApplied}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-[var(--brand)] px-2.5 text-sm font-medium text-white hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                {isMarkingApplied ? 'Saving' : 'Mark applied'}
              </button>
            ) : null}
            {needsReview ? (
              <>
                <button
                  type="button"
                  onClick={() => onApproveReview(job)}
                  disabled={isReviewActionPending}
                  className="inline-flex h-8 items-center gap-1 rounded-md bg-[var(--brand)] px-2.5 text-sm font-medium text-white hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingDrafts ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
                  {isGeneratingDrafts ? 'Drafting' : isReviewActionPending ? 'Saving' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => onDropReview(job)}
                  disabled={isReviewActionPending}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--danger-border)] px-2.5 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle className="size-4" aria-hidden />
                  Drop
                </button>
              </>
            ) : null}
            {mode === 'intel' && !needsReview && !rejected && job.application_status === 'ready_to_apply' ? (
              <button
                type="button"
                onClick={() => onDropReview(job)}
                disabled={isReviewActionPending}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--danger-border)] px-2.5 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XCircle className="size-4" aria-hidden />
                {isReviewActionPending ? 'Dropping' : 'Drop'}
              </button>
            ) : null}
            {!rejected && job.application_status === 'applied' && isDueNow(job.follow_up_due_at) ? (
              <button
                type="button"
                onClick={() => onMarkFollowUpSent(job)}
                disabled={isMarkingFollowUpSent}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-[var(--accent-brand)] px-2.5 text-sm font-medium text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Mail className="size-4" aria-hidden />
                {isMarkingFollowUpSent ? 'Saving' : 'Mark follow-up sent'}
              </button>
            ) : null}
            {mode === 'draft' && externalUrl(job) ? (
              <Link href={externalUrl(job) || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--neutral-border)] px-2.5 text-sm font-medium hover:bg-muted">
                <ArrowUpRight className="size-4" aria-hidden />
                Open
              </Link>
            ) : null}
          </div>
        </div>
        {mode === 'intel' ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InfoLine label="Compensation" value={job.compensation} />
            <InfoLine label="Fit score" value={formatScore(job.ai_fit_score || job.rank_score)} />
            <InfoLine label="Employer" value={cleanLabel(job.employer_type)} />
            <InfoLine label="Posted" value={postedAgeLabel(job)} />
            <InfoLine label="Source" value={sourceLabel(job.source)} />
          </div>
        ) : null}
      </div>

      {mode === 'activity' ? (
        <>
          {canTrackPostApply ? (
            <div className="rounded-md border border-[var(--brand-border)] bg-background p-3 text-sm">
              <div className="grid gap-3 md:grid-cols-[12rem,1fr,auto]">
                <label className="min-w-0">
                  <span className="text-xs font-medium text-muted-foreground">Application status</span>
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[var(--neutral-border)] bg-background px-2 text-sm outline-none focus:border-[var(--brand-border)]"
                  >
                    {POST_APPLY_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0">
                  <span className="text-xs font-medium text-muted-foreground">Activity note</span>
                  <textarea
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    rows={2}
                    placeholder="Add interview notes, recruiter feedback, next action..."
                    className="mt-1 min-h-9 w-full resize-none rounded-md border border-[var(--neutral-border)] bg-background px-2 py-2 text-sm outline-none focus:border-[var(--brand-border)]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onSaveActivity(job, {
                      application_status: statusDraft,
                      note: noteDraft,
                    });
                    setNoteDraft('');
                  }}
                  disabled={isSavingActivity || (!noteDraft.trim() && statusDraft === job.application_status)}
                  className="self-end inline-flex h-9 items-center justify-center rounded-md bg-[var(--brand)] px-3 text-sm font-medium text-white hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingActivity ? 'Saving' : 'Save'}
                </button>
              </div>
            </div>
          ) : null}
          {activityFeed.map((item) => (
            <ActivityItem
              key={item.key}
              title={item.title}
              detail={item.detail}
              tone={item.tone}
              timestamp={formatDateTime(item.at)}
            />
          ))}
          {isReenriching ? (
            <ActivityItem title="Re-enriching lead" detail="Refreshing the job detail page, employer intel, fit analysis, and outreach drafts." tone="warning" />
          ) : null}
          {isGeneratingDrafts ? (
            <ActivityItem title="Generating outreach" detail="AI is drafting the cover letter and follow-up email before this lead moves into Ready." tone="warning" />
          ) : null}
          <ActivityItem
            title={rejected ? 'Job rejected' : 'Job analyzed'}
            detail={rejected ? rejectionReason || job.ai_reason || 'Rejected by fit filters.' : job.ai_reason || 'Deterministic criteria accepted this job for Joel.'}
            tone={rejected ? 'danger' : 'success'}
          />
          <ActivityItem title="Employer enriched" detail={job.employer_summary || 'Employer summary is not available yet.'} tone="info" />
          {hasOutreachDrafts ? (
            <ActivityItem title="Outreach ready" detail="Cover letter and follow-up email are drafted. Open the Draft tab to review before applying." tone="brand" />
          ) : null}
          {hasOutreachDrafts ? <DraftPreview job={job} onOpenDraft={() => onSetMode('draft')} /> : null}
          {followUpDue ? (
            <ActivityItem title="Follow-up due now" detail="Open the Follow-up tab to copy the email and mark it sent." tone="warning" />
          ) : null}
          <ActivityItem
            title={job.application_status === 'applied' || job.application_status === 'followup_sent' ? 'Follow-up scheduled' : 'Follow-up angle drafted'}
            detail={followUpDue ? 'Due now' : job.follow_up_due_at || job.follow_up_angle || 'Use founder-engineer execution, React/Next/React Native/Python, and AI product shipping angle.'}
            tone="brand"
          />
        </>
      ) : null}

      {mode === 'intel' ? (
        <div className="space-y-4">
          <div className="rounded-md border bg-background p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">Employer intelligence</div>
              <Badge tone="brand">{cleanLabel(job.startup_stage)}</Badge>
            </div>
            <p className="mt-3 leading-6 text-muted-foreground">{job.employer_summary || 'Employer summary is not available yet.'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InfoLine label="Employer type" value={cleanLabel(job.employer_type)} />
              <InfoLine label="Priority" value={formatScore(job.employer_priority_score)} />
              <InfoLine label="Source" value={sourceLabel(job.source)} />
            </div>
          </div>
          <div className="rounded-md border bg-background p-4 text-sm">
            <div className="font-medium">Product signals</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(job.product_signal_terms?.length ? job.product_signal_terms : job.matched_criteria || ['No signals stored']).slice(0, 10).map((signal) => (
                <Badge key={signal} tone="info">{signal}</Badge>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {mode === 'draft' ? (
        <div className="space-y-4">
          <div className="rounded-md border bg-background p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">Cover letter</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCopyDraft('cover', job.cover_letter)}
                  disabled={!job.cover_letter}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--neutral-border)] px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Clipboard className="size-3.5" aria-hidden />
                  {copiedDraft === 'cover' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {job.cover_letter || (rejected ? 'No cover letter generated for rejected jobs.' : 'Cover letter draft will appear here after application preparation.')}
            </p>
          </div>
          <div className="rounded-md border bg-background p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">Follow-up email</div>
              <div className="flex items-center gap-2">
                <Badge tone="neutral">{job.follow_up_status || (rejected ? 'blocked' : 'not applied')}</Badge>
                <button
                  type="button"
                  onClick={() => onCopyDraft('followup', job.follow_up_email)}
                  disabled={!job.follow_up_email}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--neutral-border)] px-2.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Clipboard className="size-3.5" aria-hidden />
                  {copiedDraft === 'followup' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {job.follow_up_email || (rejected ? 'No follow-up generated for rejected jobs.' : 'Follow-up draft appears after application preparation.')}
            </p>
          </div>
        </div>
      ) : null}

      {mode === 'followup' ? (
        <FollowUpPanel
          job={job}
          copiedDraft={copiedDraft}
          isMarkingFollowUpSent={isMarkingFollowUpSent}
          onCopyDraft={onCopyDraft}
          onMarkFollowUpSent={onMarkFollowUpSent}
        />
      ) : null}
    </div>
  );
}

export function CrmDashboardClient({
  enriched,
  review,
  rejected,
  rawRejected,
  rawAccepted,
  rawReview,
  wellfound,
  yc,
  applications,
}: CrmDashboardClientProps) {
  const [applicationRows, setApplicationRows] = React.useState(applications);
  const [reviewRows, setReviewRows] = React.useState(review);
  const [rejectedRows, setRejectedRows] = React.useState(rejected);
  const [markingAppliedKey, setMarkingAppliedKey] = React.useState<string | null>(null);
  const [markingFollowUpSentKey, setMarkingFollowUpSentKey] = React.useState<string | null>(null);
  const [savingActivityKey, setSavingActivityKey] = React.useState<string | null>(null);
  const [reviewActionKey, setReviewActionKey] = React.useState<string | null>(null);
  const [draftingReviewKey, setDraftingReviewKey] = React.useState<string | null>(null);
  const [reenrichingKey, setReenrichingKey] = React.useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = React.useState<'cover' | 'followup' | null>(null);
  const [runStatus, setRunStatus] = React.useState<RunStatus | null>(null);
  React.useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);
  React.useEffect(() => {
    let cancelled = false;
    async function loadRunStatus() {
      try {
        const response = await fetch('/api/crm/run-status', { cache: 'no-store' });
        const payload = (await response.json()) as RunStatus;
        if (!cancelled && response.ok && payload.ok) setRunStatus(payload);
      } catch (error) {
        console.error('[CRM_RUN_STATUS_LOAD]', error);
      }
    }
    loadRunStatus();
    const timer = window.setInterval(loadRunStatus, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);
  const activeStatuses = new Set(['ready_to_apply', ...POST_APPLY_STATUS_OPTIONS.map((option) => option.value)]);
  const activeApplications = sortByFreshness(applicationRows.filter((job) => activeStatuses.has(job.application_status || '') && !isExpired(job)));
  const workingAccepted = sortByFreshness(applicationRows.length ? activeApplications : enriched.length ? enriched : rawAccepted);
  const reviewDecisionKeys = new Set(applicationRows.map((job) => jobKey(job)));
  const workingReview = sortByFreshness((reviewRows.length ? reviewRows : rawReview).filter((job) => !reviewDecisionKeys.has(jobKey(job))));
  const allRejected = React.useMemo(
    () => sortByFreshness(uniqueRows([
      ...rejectedRows,
      ...rawRejected,
      ...applicationRows.filter((job) => job.application_status === 'rejected_by_ai' || job.application_status === 'expired' || isExpired(job)),
    ])),
    [applicationRows, rawRejected, rejectedRows]
  );
  const [selectedKey, setSelectedKey] = React.useState(() => jobKey(workingAccepted[0] || workingReview[0] || allRejected[0] || {}));
  const [pipelineMode, setPipelineMode] = React.useState<PipelineMode>('approved');
  const [enrichmentMode, setEnrichmentMode] = React.useState<EnrichmentMode>('jobs');
  const [workspaceMode, setWorkspaceMode] = React.useState<WorkspaceMode>('activity');
  const selectedJob = [...workingAccepted, ...workingReview, ...allRejected].find((job) => jobKey(job) === selectedKey) || workingAccepted[0] || workingReview[0] || allRejected[0];
  const selectedFollowUpDue =
    POST_APPLY_STATUS_VALUES.has(selectedJob?.application_status || '') &&
    !FINAL_APPLICATION_STATUS_VALUES.has(selectedJob?.application_status || '') &&
    Boolean(selectedJob.follow_up_due_at) &&
    selectedJob.follow_up_status !== 'sent' &&
    isDueNow(selectedJob.follow_up_due_at);

  const totalScraped = wellfound.length + yc.length;
  const appliedJobs = workingAccepted.filter((job) => POST_APPLY_STATUS_VALUES.has(job.application_status || ''));
  const followUpSentJobs = applicationRows.filter((job) => (job.application_status === 'followup_sent' || job.follow_up_status === 'sent') && !isExpired(job));
  const dueFollowUpJobs = workingAccepted.filter(
    (job) =>
      POST_APPLY_STATUS_VALUES.has(job.application_status || '') &&
      !FINAL_APPLICATION_STATUS_VALUES.has(job.application_status || '') &&
      Boolean(job.follow_up_due_at) &&
      job.follow_up_status !== 'sent' &&
      isDueNow(job.follow_up_due_at)
  );
  const pipelineRowsByMode: Record<PipelineMode, JobRow[]> = {
    approved: workingAccepted.filter(
      (job) => !job.application_status || job.application_status === 'ready_to_apply'
    ),
    sent: appliedJobs,
    followups: dueFollowUpJobs,
  };
  const pipelineRows = pipelineRowsByMode[pipelineMode];
  const pipelineModeLabels: Record<PipelineMode, string> = {
    approved: 'ready applications',
    sent: 'applied applications',
    followups: 'follow-ups',
  };

  function openPipelineMode(mode: PipelineMode) {
    setPipelineMode(mode);
    setWorkspaceMode('draft');
  }

  async function markApplied(job: JobRow) {
    const key = jobKey(job);
    const readyQueue = pipelineRowsByMode.approved;
    const currentIndex = readyQueue.findIndex((row) => jobKey(row) === key);
    setMarkingAppliedKey(key);
    try {
      const response = await fetch('/api/crm/applications/mark-applied', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: `${job.source}:${job.job_id}`,
          source: job.source,
          job_id: job.job_id,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; related_applications?: JobRow[]; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not mark applied');
      }
      const changedRows = [payload.application, ...(payload.related_applications || [])];
      setApplicationRows((current) =>
        changedRows.reduce((rows, changedRow) => upsertRow(rows, changedRow), current)
      );
      if (payload.related_applications?.length) {
        setRejectedRows((current) => payload.related_applications!.reduce((rows, changedRow) => upsertRow(rows, changedRow), current));
      }
      const changedKeys = new Set(changedRows.map((changedRow) => jobKey(changedRow)));
      const nextReady =
        readyQueue.slice(currentIndex + 1).find((row) => !changedKeys.has(jobKey(row))) ||
        readyQueue.find((row) => !changedKeys.has(jobKey(row)));
      if (nextReady) {
        setSelectedKey(jobKey(nextReady));
      }
      setPipelineMode('approved');
      setWorkspaceMode('draft');
    } catch (error) {
      console.error('[CRM_MARK_APPLIED]', error);
    } finally {
      setMarkingAppliedKey(null);
    }
  }

  async function markFollowUpSent(job: JobRow) {
    const key = jobKey(job);
    setMarkingFollowUpSentKey(key);
    try {
      const response = await fetch('/api/crm/applications/mark-followup-sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: `${job.source}:${job.job_id}`,
          source: job.source,
          job_id: job.job_id,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not mark follow-up sent');
      }
      setApplicationRows((current) =>
        current.map((row) => (jobKey(row) === key ? { ...row, ...payload.application } : row))
      );
      setSelectedKey(jobKey(payload.application));
      setPipelineMode('sent');
    } catch (error) {
      console.error('[CRM_MARK_FOLLOWUP_SENT]', error);
    } finally {
      setMarkingFollowUpSentKey(null);
    }
  }

  async function saveActivity(job: JobRow, input: { application_status?: string; note?: string }) {
    const key = jobKey(job);
    setSavingActivityKey(key);
    try {
      const response = await fetch('/api/crm/applications/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: `${job.source}:${job.job_id}`,
          source: job.source,
          job_id: job.job_id,
          application_status: input.application_status,
          note: input.note,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not save activity');
      }
      setApplicationRows((current) =>
        current.map((row) => (jobKey(row) === key ? { ...row, ...payload.application } : row))
      );
      setSelectedKey(jobKey(payload.application));
    } catch (error) {
      console.error('[CRM_SAVE_ACTIVITY]', error);
    } finally {
      setSavingActivityKey(null);
    }
  }

  async function approveReview(job: JobRow) {
    const key = jobKey(job);
    setReviewActionKey(key);
    setDraftingReviewKey(key);
    try {
      const response = await fetch('/api/crm/applications/approve-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not approve review job');
      }
      setApplicationRows((current) => {
        const exists = current.some((row) => jobKey(row) === key);
        return exists
          ? current.map((row) => (jobKey(row) === key ? { ...row, ...payload.application } : row))
          : [payload.application as JobRow, ...current];
      });
      setSelectedKey(jobKey(payload.application));
      setPipelineMode('approved');
      setWorkspaceMode('draft');
    } catch (error) {
      console.error('[CRM_APPROVE_REVIEW]', error);
    } finally {
      setReviewActionKey(null);
      setDraftingReviewKey(null);
    }
  }

  async function copyDraft(kind: 'cover' | 'followup', value?: string | null) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedDraft(kind);
      window.setTimeout(() => setCopiedDraft((current) => (current === kind ? null : current)), 1800);
    } catch (error) {
      console.error('[CRM_COPY_DRAFT]', error);
    }
  }

  async function dropReview(job: JobRow) {
    const key = jobKey(job);
    setReviewActionKey(key);
    try {
      const response = await fetch('/api/crm/applications/drop-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; related_applications?: JobRow[]; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not drop review job');
      }
      const droppedRows = [payload.application, ...(payload.related_applications || [])];
      setApplicationRows((current) => {
        return droppedRows.reduce((rows, droppedRow) => upsertRow(rows, droppedRow), current);
      });
      setRejectedRows((current) => droppedRows.reduce((rows, droppedRow) => upsertRow(rows, droppedRow), current));
      setSelectedKey(jobKey(payload.application));
      setEnrichmentMode('dropped');
    } catch (error) {
      console.error('[CRM_DROP_REVIEW]', error);
    } finally {
      setReviewActionKey(null);
    }
  }

  function upsertRow(rows: JobRow[], next: JobRow) {
    const key = jobKey(next);
    const exists = rows.some((row) => jobKey(row) === key);
    return exists ? rows.map((row) => (jobKey(row) === key ? { ...row, ...next } : row)) : [next, ...rows];
  }

  function removeRow(rows: JobRow[], next: JobRow) {
    const key = jobKey(next);
    return rows.filter((row) => jobKey(row) !== key);
  }

  async function reenrichJob(job: JobRow) {
    const key = jobKey(job);
    setReenrichingKey(key);
    try {
      const response = await fetch('/api/crm/applications/reenrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: job.source,
          job_id: job.job_id,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; application?: JobRow; error?: string };
      if (!response.ok || !payload.ok || !payload.application) {
        throw new Error(payload.error || 'Could not re-enrich job');
      }

      const updated = payload.application;
      const updatedStatus = updated.application_status || updated.status;
      if (updatedStatus === 'needs_review') {
        setReviewRows((current) => upsertRow(current, updated));
        setRejectedRows((current) => removeRow(current, updated));
        setApplicationRows((current) => removeRow(current, updated));
        setEnrichmentMode('jobs');
      } else if (updatedStatus === 'rejected_by_ai' || updated.status === 'rejected') {
        setRejectedRows((current) => upsertRow(current, updated));
        setReviewRows((current) => removeRow(current, updated));
        setApplicationRows((current) => upsertRow(current, updated));
        setEnrichmentMode('dropped');
      } else {
        setApplicationRows((current) => upsertRow(current, updated));
        setReviewRows((current) => removeRow(current, updated));
        setRejectedRows((current) => removeRow(current, updated));
        setPipelineMode('approved');
      }
      setSelectedKey(jobKey(updated));
      setWorkspaceMode('activity');
    } catch (error) {
      console.error('[CRM_REENRICH]', error);
    } finally {
      setReenrichingKey(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] overflow-hidden bg-muted text-foreground"
      style={
        {
          '--header-height': '4rem',
          '--brand': '#1D6B5B',
          '--brand-strong': '#11483D',
          '--brand-soft': '#E7F4EF',
          '--brand-border': '#B9DCCE',
          '--accent-brand': '#B7791F',
          '--accent-strong': '#8A4F13',
          '--accent-soft': '#FFF4DF',
          '--accent-border': '#F3D5A0',
          '--success': '#1F7A4D',
          '--success-soft': '#E8F6EE',
          '--success-border': '#BCE2C9',
          '--warning': '#B7791F',
          '--warning-soft': '#FFF8E8',
          '--warning-border': '#F5D7A8',
          '--danger': '#B42318',
          '--danger-soft': '#FFF0EF',
          '--danger-border': '#F2BEB9',
          '--info': '#2563EB',
          '--info-soft': '#EFF6FF',
          '--info-border': '#BBD7F8',
          '--neutral-border': '#E4E7EC',
        } as React.CSSProperties
      }
    >
      <div className="mx-auto flex h-full w-full max-w-[112rem] flex-col">
        <header className="flex h-[var(--header-height)] items-center gap-3 border-b border-[var(--neutral-border)] bg-background px-4 lg:px-8">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--brand-border)] bg-[var(--brand-soft)] text-[var(--brand-strong)]">
            <BriefcaseBusiness className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold">Outreach CRM</h1>
            <p className="text-xs text-muted-foreground">Email-first workflow for job applications and employer follow-up</p>
          </div>
          <div className="min-w-0 flex-1" />
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden h-9 items-center gap-2 rounded-md border border-[var(--neutral-border)] bg-background px-3 text-sm font-medium hover:bg-muted sm:inline-flex">
              Portfolio
            </Link>
            <button type="button" onClick={() => window.location.reload()} className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--brand)] px-3 text-sm font-medium text-white hover:bg-[var(--brand-strong)]">
              <RefreshCcw className="size-4" aria-hidden />
              Refresh
            </button>
          </div>
        </header>
        <RunStatusStrip status={runStatus} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 lg:gap-5 lg:p-6">
          <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(22rem,0.95fr)_minmax(22rem,0.85fr)_minmax(20rem,0.7fr)]">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--brand-border)] bg-background shadow-sm">
              <div className="border-b border-[var(--neutral-border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                      <span className="rounded-md bg-[var(--brand-soft)] p-1.5 text-[var(--brand-strong)]">
                        <Mail className="size-4" aria-hidden />
                      </span>
                      Email Pipeline
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pipelineRows.length} {pipelineModeLabels[pipelineMode]} {pipelineRows.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <button type="button" onClick={() => window.location.reload()} className="inline-flex h-8 items-center rounded-md border border-[var(--neutral-border)] px-3 text-xs font-medium hover:bg-muted">
                    Refresh
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 rounded-lg bg-muted p-1">
                  <ToolbarTab active={pipelineMode === 'approved'} onClick={() => openPipelineMode('approved')}>
                    Ready ({pipelineRowsByMode.approved.length})
                  </ToolbarTab>
                  <ToolbarTab active={pipelineMode === 'sent'} onClick={() => openPipelineMode('sent')}>
                    Applied ({pipelineRowsByMode.sent.length})
                  </ToolbarTab>
                  <ToolbarTab
                    active={pipelineMode === 'followups'}
                    onClick={() => {
                      openPipelineMode('followups');
                      if (dueFollowUpJobs[0]) {
                        setSelectedKey(jobKey(dueFollowUpJobs[0]));
                      }
                    }}
                  >
                    Follow-ups ({pipelineRowsByMode.followups.length})
                  </ToolbarTab>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[var(--brand-soft)]/20 p-4">
                {pipelineRows.length === 0 ? (
                  <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">
                    No {pipelineModeLabels[pipelineMode]} in this queue.
                  </div>
                ) : (
                  pipelineRows.map((job) => (
                    <QueueCard
                      key={jobKey(job)}
                      job={job}
                      badge={pipelineMode === 'followups' ? 'follow-up' : pipelineMode === 'sent' ? applicationStatusLabel(job.application_status) : 'ready'}
                      badgeStatus={pipelineMode === 'sent' ? job.application_status : undefined}
                      meta={sourceLabel(job.source)}
                      active={jobKey(job) === selectedKey}
                      onSelect={() => {
                        setSelectedKey(jobKey(job));
                        setWorkspaceMode('draft');
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--accent-border)] bg-background shadow-sm">
              <div className="border-b border-[var(--neutral-border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                      <span className="rounded-md bg-[var(--accent-soft)] p-1.5 text-[var(--accent-strong)]">
                        <FileText className="size-4" aria-hidden />
                      </span>
                      Lead Workspace
                    </h2>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{selectedJob ? companyName(selectedJob) : 'Pick a lead to inspect activity and drafts'}</p>
                  </div>
                  <div className={`grid ${selectedFollowUpDue ? 'grid-cols-4' : 'grid-cols-3'} rounded-lg bg-muted p-1`}>
                    <ToolbarTab active={workspaceMode === 'activity'} onClick={() => setWorkspaceMode('activity')}>Activity</ToolbarTab>
                    <ToolbarTab active={workspaceMode === 'intel'} onClick={() => setWorkspaceMode('intel')}>Intel</ToolbarTab>
                    <ToolbarTab active={workspaceMode === 'draft'} onClick={() => setWorkspaceMode('draft')}>Draft</ToolbarTab>
                    {selectedFollowUpDue ? <ToolbarTab active={workspaceMode === 'followup'} onClick={() => setWorkspaceMode('followup')}>Follow-up</ToolbarTab> : null}
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--accent-soft)]/25 p-4">
                <LeadWorkspace
                  job={selectedJob}
                  mode={workspaceMode}
                  onSetMode={setWorkspaceMode}
                  copiedDraft={copiedDraft}
                  onCopyDraft={copyDraft}
                  isMarkingApplied={Boolean(selectedJob && markingAppliedKey === jobKey(selectedJob))}
                  onMarkApplied={markApplied}
                  isMarkingFollowUpSent={Boolean(selectedJob && markingFollowUpSentKey === jobKey(selectedJob))}
                  onMarkFollowUpSent={markFollowUpSent}
                  isReviewActionPending={Boolean(selectedJob && reviewActionKey === jobKey(selectedJob))}
                  isGeneratingDrafts={Boolean(selectedJob && draftingReviewKey === jobKey(selectedJob))}
                  isReenriching={Boolean(selectedJob && reenrichingKey === jobKey(selectedJob))}
                  isSavingActivity={Boolean(selectedJob && savingActivityKey === jobKey(selectedJob))}
                  onApproveReview={approveReview}
                  onDropReview={dropReview}
                  onReenrich={reenrichJob}
                  onSaveActivity={saveActivity}
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border-2 border-[var(--accent-border)] bg-background shadow-sm">
              <div className="border-b border-[var(--neutral-border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                      <span className="rounded-md bg-[var(--accent-soft)] p-1.5 text-[var(--accent-strong)]">
                        <CheckCircle2 className="size-4" aria-hidden />
                      </span>
                      Enrichment Review
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {enrichmentMode === 'jobs'
                        ? `${workingReview.length} review job${workingReview.length === 1 ? '' : 's'}`
                        : enrichmentMode === 'followedup'
                          ? `${followUpSentJobs.length} followed-up job${followUpSentJobs.length === 1 ? '' : 's'}`
                        : `${allRejected.length} dropped job${allRejected.length === 1 ? '' : 's'}`}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 rounded-lg bg-muted p-1">
                    <ToolbarTab active={enrichmentMode === 'jobs'} onClick={() => setEnrichmentMode('jobs')}>
                      Review ({workingReview.length})
                    </ToolbarTab>
                    <ToolbarTab active={enrichmentMode === 'dropped'} onClick={() => setEnrichmentMode('dropped')}>
                      Dropped ({allRejected.length})
                    </ToolbarTab>
                    <ToolbarTab active={enrichmentMode === 'followedup'} onClick={() => setEnrichmentMode('followedup')}>
                      Followed ({followUpSentJobs.length})
                    </ToolbarTab>
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[var(--accent-soft)]/25 p-4">
                {enrichmentMode === 'jobs' && (
                  workingReview.length === 0 ? (
                    <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">No jobs need enrichment review.</div>
                  ) : (
                    workingReview.slice(0, 40).map((job) => (
                      <QueueCard
                        key={jobKey(job)}
                        job={job}
                        badge="review"
                        meta={sourceLabel(job.source)}
                        active={jobKey(job) === selectedKey}
                        isGeneratingDrafts={draftingReviewKey === jobKey(job)}
                        onSelect={() => setSelectedKey(jobKey(job))}
                      />
                    ))
                  )
                )}
                {enrichmentMode === 'followedup' && (
                  followUpSentJobs.length === 0 ? (
                    <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">No follow-up sent jobs yet.</div>
                  ) : (
                    followUpSentJobs.slice(0, 80).map((job) => (
                      <FollowedUpCard
                        key={jobKey(job)}
                        job={job}
                        active={jobKey(job) === selectedKey}
                        onSelect={() => setSelectedKey(jobKey(job))}
                      />
                    ))
                  )
                )}
                {enrichmentMode === 'dropped' && (
                  allRejected.length === 0 ? (
                    <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">No dropped jobs in this queue.</div>
                  ) : (
                    allRejected.slice(0, 80).map((job) => (
                      <RejectedCard
                        key={jobKey(job)}
                        job={job}
                        active={jobKey(job) === selectedKey}
                        onSelect={() => setSelectedKey(jobKey(job))}
                      />
                    ))
                  )
                )}
              </div>
            </div>
          </section>

          <div className="sr-only">
            Total scraped {totalScraped}. Ready {workingAccepted.length}. Rejected {allRejected.length}.
          </div>
        </main>
      </div>
    </div>
  );
}
