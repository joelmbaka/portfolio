import type { Metadata } from 'next';
import { CrmDashboardClient } from './CrmDashboardClient';
import { readDbRows } from './db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Job Hunt CRM',
  description: 'Private job-hunt CRM for scraped, enriched, and ranked opportunities.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const freshFirstOrder = "order by coalesce(nullif(raw->>'posted_age_days', '')::double precision, 999999), updated_at desc";

export default async function CrmPage() {
  const dbApplications = await readDbRows(
    `where application_status in (
      'ready_to_apply',
      'applied',
      'interview_scheduled',
      'interviewing',
      'offer',
      'hired',
      'rejected_after_apply',
      'withdrawn',
      'followup_sent',
      'rejected_by_ai',
      'expired'
    ) ${freshFirstOrder}`
  );
  const dbReview = await readDbRows(
    `where coalesce(status, '') != 'rejected' and (application_status = 'needs_review' or (application_status is null and status = 'needs_review')) ${freshFirstOrder}`
  );
  const dbRejected = await readDbRows(
    `where status = 'rejected' or application_status in ('rejected_by_ai', 'expired') ${freshFirstOrder}`
  );
  const dbAccepted = await readDbRows(
    `where status = 'accepted' and application_status is null ${freshFirstOrder}`
  );

  return (
    <CrmDashboardClient
      enriched={dbAccepted || []}
      review={dbReview || []}
      rejected={dbRejected || []}
      rawRejected={[]}
      rawAccepted={[]}
      rawReview={[]}
      wellfound={[]}
      yc={[]}
      applications={dbApplications || []}
    />
  );
}
