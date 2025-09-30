'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, ArrowUpRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { AuthModal, type AuthMode } from '@/components/AuthModal'
import Link from 'next/link'

// Small building blocks to keep typing minimal and UX smooth
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur p-6 md:p-8"
    >
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-palm-green">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      {children}
    </motion.section>
  )
}

function ChipCheckbox({
  label,
  value,
  selected,
  onChange,
}: {
  label: string
  value: string
  selected: boolean
  onChange: (val: string, checked: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !selected)}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors select-none ${
        selected
          ? 'bg-transparent text-palm-green border-palm-green hover:bg-transparent ring-1 ring-palm-green dark:bg-transparent dark:border-palm-green dark:hover:bg-transparent dark:ring-palm-green'
          : 'bg-transparent dark:bg-transparent text-gray-700 dark:text-white border-sandy-beach dark:border-sandy-beach hover:bg-transparent dark:hover:bg-transparent hover:ring-1 hover:ring-sandy-beach/50'
      }`}
      aria-pressed={selected}
    >
      {selected ? <Check className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border border-current opacity-40" />}
      {label}
    </button>
  )
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-ocean-blue">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors ${
              value === opt
                ? 'bg-transparent text-palm-green border-palm-green ring-1 ring-palm-green dark:bg-transparent dark:border-palm-green dark:ring-palm-green dark:hover:bg-transparent'
                : 'bg-transparent dark:bg-transparent text-gray-700 dark:text-white border-sandy-beach dark:border-sandy-beach hover:bg-transparent dark:hover:bg-transparent hover:ring-1 hover:ring-sandy-beach/50'
            }`}
            aria-pressed={value === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChipsMulti({
  label,
  values,
  options,
  onChange,
}: {
  label: string
  values: string[]
  options: { label: string; value: string }[]
  onChange: (values: string[]) => void
}) {
  const toggle = (val: string, checked: boolean) => {
    if (checked) onChange(Array.from(new Set([...(values || []), val])))
    else onChange((values || []).filter((v) => v !== val))
  }
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-ocean-blue">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <ChipCheckbox
            key={opt.value}
            label={opt.label}
            value={opt.value}
            selected={(values || []).includes(opt.value)}
            onChange={toggle}
          />
        ))}
      </div>
    </div>
  )
}

 

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (val: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-palm-green dark:text-palm-green">{label}</div>
      <textarea
        className="min-h-[100px] w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-sandy-beach/60 dark:bg-sandy-beach/60 px-3 py-2 outline-none focus:ring-2 focus:ring-ocean-blue/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  id,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  id?: string
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-ocean-blue">{label}{required ? ' *' : ''}</div>
      <input
        id={id}
        className={`w-full rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-ocean-blue/60 scroll-mt-28 ${
          id === 'website-name'
            ? 'bg-gradient-to-r from-sandy-beach/80 via-sunset-yellow/30 to-ocean-blue/10 dark:bg-gradient-to-r dark:from-[#111827] dark:via-[#0b1320] dark:to-[#0b1320] text-palm-green dark:text-palm-green caret-palm-green dark:caret-palm-green placeholder:text-gray-500 dark:placeholder:text-palm-green/70'
            : 'bg-sandy-beach/60 dark:bg-sandy-beach/60'
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

 

const pageOptions = [
  'Home',
  'About',
  'Services',
  'Pricing',
  'Portfolio / Case Studies',
  'Blog',
  'Careers',
  'Contact',
  'FAQ',
  'Testimonials',
  'Privacy Policy',
  'Terms & Conditions',
  'Landing pages',
  'Product pages',
  'Category pages',
  'Custom page(s)'
]

const adminModulesOptions = [
  { label: 'Content management', value: 'cms' },
  { label: 'User management & roles', value: 'users' },
  { label: 'Orders & payments', value: 'orders' },
  { label: 'Analytics & reports', value: 'analytics' },
  { label: 'Settings & configurations', value: 'settings' },
  { label: 'Support & tickets', value: 'support' },
]

 

const integrationsOptions = [
  { label: 'Google Analytics', value: 'ga' },
  { label: 'Search Console', value: 'gsc' },
  { label: 'CRM (HubSpot/Pipedrive)', value: 'crm' },
  { label: 'Email (Resend/Mailchimp)', value: 'email' },
  { label: 'Calendly / Scheduling', value: 'calendly' },
  { label: 'Maps & Location', value: 'maps' },
  { label: 'Chat (Intercom/Drift)', value: 'chat' },
  { label: 'Slack notifications', value: 'slack' },
]

const contactOptions = [
  { label: 'Contact form', value: 'form' },
  { label: 'Chatbot', value: 'chatbot' },
  { label: 'Schedule calls (Calendly)', value: 'schedule' },
]

const mediaOptions = [
  { label: 'Image gallery', value: 'images' },
  { label: 'Video embeds', value: 'videos' },
  { label: 'Audio / Podcast', value: 'audio' },
]
 


export default function WebsiteRequirementsPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')

  const [form, setForm] = useState({
    // Basics
    websiteName: '',
    // Contact & engagement
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredContact: 'Email',
    timezone: '',
    engagement: 'Project-based', // Project-based | Hourly | Monthly retainer | Hybrid

    // Overview
    projectType: 'New website', // New website | Redesign | Migration | Landing page | E‑commerce | Web app
    industry: 'Technology',
    goals: ['lead_gen'] as string[],
    audience: 'B2B',
    timeline: '2-4 weeks',
    budget: '$3k–7k',

    // Pages
    pages: ['Home', 'About', 'Services', 'Contact'] as string[],
    approxPages: '4-8',

    // Features
    auth: 'None', // None | Email & password | Social login | SSO | Magic link
    adminDashboard: 'No', // Yes | No
    adminModules: [] as string[],
    animations: 'Subtle', // None | Subtle | Moderate | Rich
    contactOptions: ['form'] as string[],
    media: [] as string[],
    i18n: 'Single language',
    integrations: ['ga', 'gsc'] as string[],
    notifications: ['email'] as string[],

    // Content & brand
    contentReadiness: ['Have content'] as string[], // Have content | Need copywriting | Need graphics/illustrations
    logo: [] as string[], // Have logo | Need logo design
    colorPalette: [] as string[], // Have color palette | Need to create

    // Conditional details
    adminRoles: [] as string[],

    // Misc
    otherNotes: '',
  })

  // Load & persist to localStorage so clients can return later
  useEffect(() => {
    try {
      const saved = localStorage.getItem('website_requirements_form')
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<typeof form> & Record<string, unknown>
        // Remove legacy fields that no longer exist in the form (without creating unused vars)
        const cleaned: Partial<typeof form> & Record<string, unknown> = { ...parsed }
        delete cleaned['cms']
        delete cleaned['blogFeatures']
        setForm((current) => ({ ...current, ...(cleaned as Partial<typeof form>) }))
      }
    } catch (e) {
      console.warn('Failed to load saved form data:', e)
    }
  }, [])

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setForm((f) => ({ ...f, timezone: tz || f.timezone }))
    } catch {}
  }, [])

  // Session gate
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setAuthLoading(false)
      // Do not auto-open auth modal; user can click Sign in
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, _session: Session | null) => {
      setSession(_session)
      if (_session) setShowAuthModal(false)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem('website_requirements_form', JSON.stringify(form))
      } catch {}
    }, 300)
    return () => clearTimeout(id)
  }, [form])

  const requiredOk = useMemo(() => !!form.websiteName?.trim() && (form.pages?.length ?? 0) > 0, [form.websiteName, form.pages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      // Clean payload - remove any legacy fields that may have been cached (without introducing unused vars)
      const payload: Record<string, unknown> = { ...form } as unknown as Record<string, unknown>
      delete payload['cms']
      delete payload['blogFeatures']
      payload['submittedAt'] = new Date().toISOString()
      payload['pageUrl'] = typeof window !== 'undefined' ? window.location.href : ''
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const token = session?.access_token
      const res = await fetch(`${backendUrl}/website-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-24">
      <div className="mb-6">
        <Link href="/" className="text-sm text-ocean-blue dark:text-ocean-blue hover:underline">← Home</Link>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-palm-green">Website Requirements Questionnaire</h1>
        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400">
          Kindly take 10–15 minutes to fill out your website requirements
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {authLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="h-8 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </motion.div>
        ) : !session ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-auto max-w-lg text-center"
          >
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} onSignedIn={() => setShowAuthModal(false)} />
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur p-8">
              <h2 className="text-2xl font-semibold">Sign in to continue</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">You need an account to submit your website requirements.</p>
              <div className="mt-6">
                <button
                  onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                  className="inline-flex items-center justify-center rounded-full bg-transparent text-black border border-palm-green px-6 py-3 font-medium hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-ocean-blue/70 dark:bg-transparent dark:text-white dark:border-palm-green dark:hover:bg-transparent"
                >
                  Sign in
                </button>
              </div>
            </div>
          </motion.div>
        ) : submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-lg text-center rounded-2xl border border-green-200 dark:border-green-900 bg-green-50/70 dark:bg-green-950/20 p-10"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold">Submission received!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Thanks — I will review your requirements and get back to you shortly.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <Section title="Project basics" description="A quick identifier for your project.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  id="website-name"
                  label="Website name"
                  value={form.websiteName}
                  onChange={(v) => setForm((f) => ({ ...f, websiteName: v }))}
                  placeholder="e.g., Acme Health"
                  required
                />
              </div>
            </Section>

            <Section title="Pages & sitemap" description="Select the pages you want included.">
              <ChipsMulti
                label="Pages"
                values={form.pages}
                options={pageOptions.map((p) => ({ label: p, value: p }))}
                onChange={(vals) => setForm((f) => ({ ...f, pages: vals }))}
              />
              <div className="mt-4">
                <ChoiceGroup label="Approximate number of pages" value={form.approxPages} options={["1-3", "4-8", "9-15", "16-30", "30+"]} onChange={(v) => setForm((f) => ({ ...f, approxPages: v }))} />
              </div>
            </Section>

            <Section title="Features" description="Pick what you need — minimal typing.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChoiceGroup
                  label="Authentication"
                  value={form.auth}
                  options={["None", "Email & password", "Social login", "Magic link", "SSO"]}
                  onChange={(v) => setForm((f) => ({ ...f, auth: v }))}
                />
                <ChoiceGroup
                  label="Admin dashboard"
                  value={form.adminDashboard}
                  options={["No", "Yes"]}
                  onChange={(v) => setForm((f) => ({ ...f, adminDashboard: v }))}
                />
                <ChoiceGroup
                  label="Animations"
                  value={form.animations}
                  options={["None", "Subtle", "Moderate", "Rich"]}
                  onChange={(v) => setForm((f) => ({ ...f, animations: v }))}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChipsMulti label="Contact & communication" values={form.contactOptions} options={contactOptions} onChange={(vals) => setForm((f) => ({ ...f, contactOptions: vals }))} />
                <ChipsMulti label="Media" values={form.media} options={mediaOptions} onChange={(vals) => setForm((f) => ({ ...f, media: vals }))} />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6">
                <ChoiceGroup label="Languages" value={form.i18n} options={["Single language", "Multi-language"]} onChange={(v) => setForm((f) => ({ ...f, i18n: v }))} />
              </div>

              <AnimatePresence initial={false}>
                {form.adminDashboard === 'Yes' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 overflow-hidden">
                    <ChipsMulti
                      label="Admin modules"
                      values={form.adminModules}
                      options={adminModulesOptions}
                      onChange={(vals) => setForm((f) => ({ ...f, adminModules: vals }))}
                    />
                    <ChipsMulti
                      label="Admin roles"
                      values={form.adminRoles}
                      options={[{ label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }, { label: 'Viewer', value: 'viewer' }, { label: 'Support', value: 'support' }]}
                      onChange={(vals) => setForm((f) => ({ ...f, adminRoles: vals }))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            <Section title="Tech & infrastructure" description="Happy to recommend the best stack for your needs.">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <ChipsMulti label="Integrations" values={form.integrations} options={integrationsOptions} onChange={(vals) => setForm((f) => ({ ...f, integrations: vals }))} />
              </div>
            </Section>

            <Section title="Content & brand" description="Zero-pressure — I can help with content and design if needed.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ChipsMulti
                  label="Content readiness"
                  values={form.contentReadiness}
                  options={[{ label: 'Have content', value: 'have' }, { label: 'Need copywriting', value: 'copy' }, { label: 'Need graphics/illustrations', value: 'graphics' }]}
                  onChange={(vals) => setForm((f) => ({ ...f, contentReadiness: vals }))}
                />
                <ChipsMulti
                  label="Logo"
                  values={form.logo}
                  options={[{ label: 'Have logo', value: 'have_logo' }, { label: 'Need logo design', value: 'need_logo' }]}
                  onChange={(vals) => setForm((f) => ({ ...f, logo: vals }))}
                />
                <ChipsMulti
                  label="Color palette"
                  values={form.colorPalette}
                  options={[{ label: 'Have color palette', value: 'have_palette' }, { label: 'Need to create', value: 'need_palette' }]}
                  onChange={(vals) => setForm((f) => ({ ...f, colorPalette: vals }))}
                />
              </div>
              <div className="mt-4">
                <TextArea label="Anything else? (optional)" value={form.otherNotes} onChange={(v) => setForm((f) => ({ ...f, otherNotes: v }))} placeholder="Links to references/inspiration, existing site, competitors, constraints, etc." />
              </div>
            </Section>

            <div className="flex items-center justify-between gap-4">
              {(!requiredOk && !submitting) ? (
                <span className="text-xs font-medium text-ocean-blue inline-flex items-center gap-2">
                  <span>You must enter a website name to submit this form</span>
                  <a href="#website-name" className="inline-flex items-center gap-1 underline hover:no-underline ml-1">
                    Go to field <ArrowUpRight className="h-3 w-3" />
                  </a>
                </span>
              ) : <span />}
              <button
                type="submit"
                disabled={!requiredOk || submitting}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-blue/70 ${
                  !requiredOk || submitting
                    ? 'bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-sandy-beach text-palm-green border border-palm-green hover:bg-sandy-beach dark:bg-transparent dark:text-white dark:border-sandy-beach dark:hover:bg-transparent'
                }`}
                aria-disabled={!requiredOk || submitting}
                title={!requiredOk ? 'Enter website name' : undefined}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </motion.form>
        )}
      </AnimatePresence>
    </main>
  )
}
