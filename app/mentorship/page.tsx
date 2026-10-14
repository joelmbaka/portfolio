import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, GraduationCap, Users } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Software Development Mentorship & Practical Training | Joeltech Geek Systems',
  description: 'Learn about practical software developer mentorship at Joeltech Geek Systems: React Native/Expo mobile apps, Next.js/TypeScript web apps, Python/FastAPI, PostgreSQL and applied AI integrations.',
  alternates: { canonical: '/mentorship' },
  openGraph: {
    title: 'Software Engineering Mentorship | Joeltech Geek Systems',
    description: 'A founder-led approach to practical software development learning, project feedback and engineering growth.',
    type: 'website', url: '/mentorship',
  },
};

const tracks = [
  {
    title: 'React Native & Expo mobile development',
    body: 'TypeScript fundamentals, navigation, state, authentication, API-backed screens, device features, mobile testing and Android/iOS delivery workflows.',
  },
  {
    title: 'Next.js, React & TypeScript web applications',
    body: 'Component architecture, responsive UX, authenticated dashboards, backend integration, forms, accessibility and browser testing.',
  },
  {
    title: 'Python, FastAPI & PostgreSQL backends',
    body: 'REST endpoints, schemas, relational modeling, migrations, permissions, validation, testing and business-state correctness.',
  },
  {
    title: 'Applied AI & third-party integrations',
    body: 'How to connect existing AI, speech and other provider APIs into practical products with validation, cost control and user-focused outcomes. This is not machine-learning model training.',
  },
];

export default function MentorshipPage() {
  const base = SITE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Software engineering mentorship at Joeltech Geek Systems',
    url: `${base}/mentorship`,
    about: { '@id': `${base}/#organization` },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-4xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-palm-green"><GraduationCap className="h-5 w-5" aria-hidden /> Mentorship & practical learning</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Learn software engineering by solving real problems.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Joeltech Geek Systems supports emerging developers through practical guidance from founder Joel Mbaka. We emphasize understanding users, building complete features, explaining code decisions, testing and learning how software reaches production.
        </p>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          This is our mentorship and learning focus—not a claim of operating an accredited school, awarding qualifications, running a fixed cohort, or guaranteeing internships or jobs. Structured training opportunities depend on capacity and published arrangements.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-3xl font-bold">What we mentor developers in</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Focused technology choices make collaboration easier and help learners move beyond tutorials. Our primary mobile framework is React Native rather than Flutter or separate Swift/Kotlin tracks.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {tracks.map((track) => (
            <article key={track.title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/60">
              <Code2 className="h-7 w-7 text-palm-green" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{track.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{track.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60">
          <BookOpen className="h-8 w-8 text-palm-green" aria-hidden />
          <h2 className="mt-5 text-2xl font-bold">Our learning philosophy</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
            Developers improve through scoped tasks, code review, debugging, testing, API integration, technical communication and reflection on how their work helps a user.
          </p>
        </div>
        <div className="rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60">
          <Users className="h-8 w-8 text-palm-green" aria-hidden />
          <h2 className="mt-5 text-2xl font-bold">Mentorship versus paid engineering work</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
            Mentorship is a learning activity. An internship is a separately agreed placement. Production engineering and professional roles may be paid under their own contract or employment terms; a mentorship enquiry is not a job offer.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 p-7 dark:border-gray-800 sm:p-9">
        <h2 className="text-2xl font-bold">Interested in learning or collaborating?</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Tell us what you&apos;re building, your current experience and the kind of guidance you&apos;re seeking. Opportunities are considered individually; there is no promise of immediate intake, certification, staffing placement or relocation.
        </p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
          <Link href="/careers" className="inline-flex items-center gap-2 text-palm-green hover:underline">Internships & career opportunities <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/founder" className="inline-flex items-center gap-2 text-palm-green hover:underline">Meet the founder <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <a href="mailto:mbakajoe26@gmail.com?subject=Developer%20Mentorship%20Enquiry" className="inline-flex items-center gap-2 text-palm-green hover:underline">Ask about mentorship <ArrowRight className="h-4 w-4" aria-hidden /></a>
        </div>
      </section>
    </main>
  );
}
