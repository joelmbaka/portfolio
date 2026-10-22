# Sales Agent registration

Source page: `/careers/agents`. Next.js route: `POST /api/sales-agent-applications`.

## Deployment prerequisites

1. Run `supabase/sales-agent-applications.sql` against the **portfolio** PostgreSQL database referenced by `DATABASE_URL`. Do not apply it to RentPayor's database. Database changes are deliberately **not** executed automatically.
2. Set the server-only `DATABASE_URL` in Vercel (already used by the private job CRM if configured).
3. Set the existing server-only `RESEND_API_KEY` and a domain-verified `RESEND_FROM` sender in Vercel. Do not use the expired joelmbaka.com sender domain. You may override the internal recipient using `AGENT_APPLICATION_NOTIFY_TO`; otherwise the current contact inbox is used.
4. Recommended: configure a separate random server-only `AGENT_APPLICATION_HASH_SECRET` for HMAC rate-limit identifiers; until set, the server uses the existing database connection secret as the HMAC key. Never use a NEXT_PUBLIC_ variable for these secrets.
5. Preview-deploy `dev/joeltechgeek`, check form on narrow mobile screens and desktop, and submit one real test application before production deploy.

No additional Python service is required. Applications are written to PostgreSQL before a notification is attempted. Email delivery failures are recorded with `notification_status = 'failed'`; they do **not** discard applications or falsely mark them active. A duplicate email is not submitted or notified again. Each applicant remains `status = 'new'` until reviewed.

## Useful verification queries

```sql
select id, full_name, phone, email, location, background, source, status,
       notification_status, created_at
from sales_agent_applications order by created_at desc limit 20;

select id, full_name, email, notification_error, created_at
from sales_agent_applications
where notification_status = 'failed'
order by created_at desc;
```

Check 400 invalid/unchecked consent, honeypot no-write, duplicate email no-repeat, >8 attempts per hour from one address (429), missing DATABASE_URL (503), and email failure saved as `failed`. Do not send unsolicited follow-up from inside the API.

## Outreach attribution

For group-message outreach use `https://joeltechgeek.com/careers/agents?utm_source=whatsapp`. The source is recorded server-side and visitors can also apply organically. Approval and commission remain subject to individually agreed written terms, not an automatic account activation.
