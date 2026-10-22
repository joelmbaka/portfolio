import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, MoveUpRight } from 'lucide-react';
import { careerOpportunities, findCareerOpportunity } from '@/config/career-opportunities';
import { SITE_URL } from '@/lib/site';
import { SalesAgentApplicationForm } from '@/components/SalesAgentApplicationForm';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return careerOpportunities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findCareerOpportunity(slug);
  if (!item) return { title: 'Opportunity not found', robots: { index: false } };
  const canonical = '/careers/' + item.slug;
  return {
    title: item.seoTitle,
    description: item.description,
    alternates: { canonical },
    openGraph: { type: 'website', url: canonical, title: item.seoTitle, description: item.description },
    twitter: { card: 'summary_large_image', title: item.seoTitle, description: item.description },
  };
}

export default async function CareerOpportunityPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findCareerOpportunity(slug);
  if (!item) return notFound();

  const canonical = SITE_URL + '/careers/' + item.slug;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: SITE_URL + '/careers' },
      { '@type': 'ListItem', position: 3, name: item.title, item: canonical },
    ],
  };
  return (
    <main className="site-container pb-16 pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Link href="/careers" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All opportunities
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">{item.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">{item.title}</h1>
        <p className="mt-5 text-xl font-medium leading-8 text-gray-700 dark:text-gray-200">{item.summary}</p>
        <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-300">{item.introduction}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {item.highlights.map((highlight) => (
            <span key={highlight} className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{highlight}</span>
          ))}
        </div>
        {item.slug === 'agents' && (
          <Link href="#apply" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-palm-green px-6 py-3 font-semibold text-white transition hover:opacity-90">
            Apply as a sales agent <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        )}
      </header>

      {item.slug === 'agents' && (
        <section id="apply" className="mt-10 scroll-mt-28 grid gap-7 rounded-3xl bg-emerald-50/70 p-5 dark:bg-emerald-950/20 sm:p-7 lg:grid-cols-[0.85fr_1.15fr] lg:p-10" aria-labelledby="sales-agent-apply-heading">
          <div className="self-start lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">Independent sales partnership</p>
            <h2 id="sales-agent-apply-heading" className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Know businesses that could use better software?
            </h2>
            <p className="mt-4 text-base leading-8 text-gray-700 dark:text-gray-300">
              Introduce business owners who need a custom app, website or management system. We handle technical discovery, proposals and development. You can earn 20%–30% commission on qualifying client projects under agreed terms.
            </p>
            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-300">
              Students, IT professionals and independent business developers are welcome. You don&apos;t need to code or have a current client to express interest.
            </p>
          </div>
          <SalesAgentApplicationForm />
        </section>
      )}

      <div className="mt-14 grid min-w-0 gap-5 lg:grid-cols-2">
        {[
          { heading: 'What you could do', points: item.responsibilities },
          { heading: 'Who this suits', points: item.suitableFor },
        ].map((section) => (
          <section key={section.heading} className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.heading}</h2>
            <ul className="mt-6 space-y-4">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-palm-green" aria-hidden /><span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {item.examples && (
        <section className="mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">Potential customers</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Business opportunities you can spot</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300">
            These are examples of software we could scope with a client, not promises of off-the-shelf products in every category.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {item.examples.map((example) => (
              <article key={example.name} className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/60">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{example.name}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{example.need}</p>
              </article>
            ))}
          </div>
          <Link href="/services" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
            Explore software services <MoveUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      )}

      {item.slug === 'saas' && (
        <section className="mt-14 rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products to explore</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">Understand the actual capabilities and customer fit before introducing prospects.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/rentpayor" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-5 py-2 font-semibold text-palm-green hover:border-palm-green dark:border-gray-700">RentPayor <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/schoolpey" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-5 py-2 font-semibold text-palm-green hover:border-palm-green dark:border-gray-700">SchoolPey <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </section>
      )}

      <section className="mt-16">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">Process</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">How it works</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {item.steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
              <p className="text-sm font-bold text-palm-green">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{step.description}</p>
            </article>
          ))}
        </div>
      </section>


      {item.commissionTiers && (
        <section className="mt-16" aria-labelledby="sales-commission-heading">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">Your earning potential</p>
          <h2 id="sales-commission-heading" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Generous, percentage-based commissions
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300">
            Earn a percentage of eligible development fees collected from successful new client projects. Your agreed tier depends on your contribution.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {item.commissionTiers.map((tier) => (
              <article key={tier.title} className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60">
                <p className="text-4xl font-bold tracking-tight text-palm-green">{tier.rate}</p>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{tier.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{tier.description}</p>
              </article>
            ))}
          </div>
          {item.commissionExamples && (
            <div className="mt-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Example agent earnings</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {item.commissionExamples.map((example) => (
                  <div key={example.name} className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{example.name}</p>
                    <p className="mt-1 text-xs leading-6 text-gray-600 dark:text-gray-300">
                      KES {example.eligibleFee.toLocaleString('en-KE')} development fee · {example.rate === 30 ? 'up to ' : ''}{example.rate}%
                    </p>
                    <p className="mt-2 text-lg font-bold text-palm-green">
                      {example.rate === 30 ? 'Up to ' : ''}KES {(example.eligibleFee * example.rate / 100).toLocaleString('en-KE')}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-gray-500 dark:text-gray-400">
                Illustrations only, not guaranteed prices, earnings or tier approvals. Commission applies to eligible fees collected under the written agreement.
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-14 rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.termsHeading}</h2>
        <ul className="mt-5 space-y-4">
          {item.terms.map((term) => (
            <li key={term} className="flex gap-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-palm-green" aria-hidden /><span>{term}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">FAQs</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Good to know</h2>
        <div className="mt-6 space-y-3">
          {item.faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/60">
              <summary className="cursor-pointer pr-4 font-semibold text-gray-900 dark:text-white">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="express-interest" className="mt-16 scroll-mt-28 rounded-3xl bg-emerald-50 p-7 dark:bg-emerald-950/30 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">Interested?</p>
        <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Express your interest</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-gray-700 dark:text-gray-300">{item.interestInstructions}</p>
        <Link href={item.slug === 'agents' ? '#apply' : '/contact'} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-palm-green px-6 py-3 font-semibold text-white transition hover:opacity-90">
          {item.slug === 'agents' ? 'Apply as a sales agent' : 'Express Interest'} <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
        <p className="mt-3 text-xs leading-6 text-gray-600 dark:text-gray-400">
          {item.slug === 'agents'
            ? 'Applications are reviewed individually. We will contact suitable applicants; submitting does not guarantee acceptance.'
            : 'You\'ll reach the Contact page, where you can get in touch with the founder directly. Mention this opportunity so your enquiry has the right context. An enquiry does not guarantee acceptance.'}
        </p>
      </section>

      <nav className="mt-14 border-t border-gray-200 pt-7 dark:border-gray-800" aria-label="Other opportunities">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore other opportunities</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {careerOpportunities.filter((other) => other.slug !== item.slug).map((other) => (
            <Link key={other.slug} href={'/careers/' + other.slug} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-palm-green transition hover:border-palm-green dark:border-gray-700">
              {other.title} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
