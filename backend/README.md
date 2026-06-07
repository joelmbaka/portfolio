# Portfolio Jobs Scraper

Wellfound-targeted job discovery scraper. First pass writes JSON/CSV so we can inspect
selectors and result quality before persisting anything.

## Criteria

Include:

- Web development, web apps, dashboards, websites, frontend/full-stack product engineering.
- React, Next.js, TypeScript, JavaScript, or non-framework-specific web development.
- React Native or Expo mobile roles.
- Generative AI, LLM, agent, chatbot, or AI-powered product roles where reasoning/product integration matters.
- Python backend work supporting web, mobile, or AI apps.

Exclude:

- Swift, Kotlin, native iOS, native Android, or Java Android mobile roles.
- Vue, Svelte, jQuery, Angular-only, or other explicitly non-React frontend roles.
- MLOps, ML platform, data infrastructure, model training, computer vision research, or data science roles.
- DevOps/SRE/infrastructure-only roles.

## Setup

```bash
cd backend
cp .env.example .env
uv sync
uv run playwright install chromium
```

Run the first scrape:

```bash
uv run python scripts/scrape_wellfound_roles.py --headed --oldest-days 31 --format json --out exports/wellfound_jobs.json
uv run python scripts/scrape_wellfound_roles.py --headed --oldest-days 31 --format csv --out exports/wellfound_jobs.csv
```

If the bundled Playwright Chromium keeps returning to the Cloudflare checkbox, use installed
Chrome with a dedicated profile:

```bash
uv run python scripts/scrape_wellfound_roles.py \
  --headed \
  --browser-executable /usr/bin/google-chrome \
  --user-data-dir .wellfound-chrome-profile \
  --role software_engineer \
  --out exports/manual_test.json
```

If Wellfound only works in your normal logged-in Chrome, start Chrome with a remote debugging
port, then attach the scraper to that live session:

```bash
google-chrome --remote-debugging-port=9222
uv run python scripts/scrape_wellfound_roles.py \
  --cdp-url http://127.0.0.1:9222 \
  --role software_engineer \
  --out exports/manual_test.json
```

Run the timer-friendly once command:

```bash
uv run python scripts/run_wellfound_once.py
```

That command scrapes every configured role page, dedupes by Wellfound job id, writes timestamped
JSON and CSV files, updates `exports/wellfound/latest.json` and `latest.csv`, prints one JSON
summary, and exits. This is the command the systemd service runs.

Initial role pages:

- https://wellfound.com/role/r/software-engineer
- https://wellfound.com/role/r/mobile-engineer
- https://wellfound.com/role/r/frontend-engineer

The scraper dedupes by Wellfound job id and scrolls until results stop changing or the oldest
visible posting reaches roughly one month old.

Wellfound currently shows Cloudflare challenges to non-browser HTTP/headless sessions. Use
`--headed` with the persistent `WELLFOUND_USER_DATA_DIR`; if a challenge appears, solve it in
the opened browser once, then rerun with the same profile.

## systemd timer

Production job discovery runs YC + Wellfound hourly, rebuilds the shortlist, and enriches job
details. It does not overwrite `exports/applications/latest.json`, so applied/follow-up CRM state
stays separate from discovery refreshes.

Install the production user units:

```bash
mkdir -p ~/.config/systemd/user
cp systemd/wellfound-debug-chrome.service ~/.config/systemd/user/
cp systemd/job-discovery.service ~/.config/systemd/user/
cp systemd/job-discovery.timer ~/.config/systemd/user/
systemctl --user daemon-reload
loginctl enable-linger "$USER"
systemctl --user enable --now wellfound-debug-chrome.service
systemctl --user enable --now job-discovery.timer
systemctl --user list-timers job-discovery.timer
```

Run production discovery once immediately:

```bash
systemctl --user start job-discovery.service
journalctl --user -u job-discovery.service -f
```

Install the wake-from-sleep hook:

```bash
sudo install -m 755 systemd/job-discovery-resume /lib/systemd/system-sleep/job-discovery-resume
```

The production defaults are hourly, YC stale-scroll limit `3`, YC scroll pause `800ms`,
Wellfound oldest age `14` days, Wellfound stale-scroll limit `4`, Wellfound scroll pause `1600ms`,
and detail enrichment capped at `25` accepted plus `50` review rows per run.

### Wellfound-only timer

Install the user units:

```bash
mkdir -p ~/.config/systemd/user
cp systemd/wellfound-debug-chrome.service ~/.config/systemd/user/
cp systemd/wellfound-scraper.service ~/.config/systemd/user/
cp systemd/wellfound-scraper.timer ~/.config/systemd/user/
cp systemd/wellfound-scraper-test.timer ~/.config/systemd/user/
systemctl --user daemon-reload
```

Allow the user timer to run after system boot before you log in:

```bash
loginctl enable-linger "$USER"
```

Test every 20 seconds:

```bash
systemctl --user enable --now wellfound-debug-chrome.service
systemctl --user enable --now wellfound-scraper-test.timer
systemctl --user list-timers wellfound-scraper*
journalctl --user -u wellfound-debug-chrome.service -f
journalctl --user -u wellfound-scraper.service -f
```

Switch to hourly:

```bash
systemctl --user disable --now wellfound-scraper-test.timer
systemctl --user enable --now wellfound-scraper.timer
```

Run once immediately after wake from sleep/hibernate:

```bash
sudo install -m 755 systemd/wellfound-scraper-resume /lib/systemd/system-sleep/wellfound-scraper-resume
```

The resume hook starts `wellfound-debug-chrome.service` and then `wellfound-scraper.service`
in your user systemd manager on every
`post suspend`, `post hibernate`, `post hybrid-sleep`, and `post suspend-then-hibernate`.
If the Linux username is not `joel`, edit `USER_NAME` in the hook or set
`WELLFOUND_SCRAPER_USER` inside the script.
