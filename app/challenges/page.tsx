'use client'

import { useMemo } from 'react'
import ChallengeCard from '@/components/ChallengeCard'
import Link from 'next/link'

// Landing page only: no product form here

export default function ChallengesPage() {
  const siteUrl = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    return raw ? raw.replace(/\/$/, '') : ''
  }, [])
  const backendUrl = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || ''
    return raw ? raw.replace(/\/$/, '') : ''
  }, [])

  const challenges = [
    {
      key: 'warrantyit',
      title: 'WarrantyIT',
      description: 'Add and list products with warranty tracking.',
      href: '/challenges/warrantyit',
    },
  ] as const

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
      <div className="mb-6">
        <Link href="/" className="text-sm text-ocean-blue dark:text-ocean-blue hover:underline">← Home</Link>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Challenges</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome! Explore and try the challenges below.</p>
      {(siteUrl || backendUrl) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 space-y-1">
          {siteUrl && <p>Site URL: {siteUrl}</p>}
          {backendUrl && <p>Backend URL: {backendUrl}</p>}
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">Available challenges</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {challenges.map((c) => (
            <li key={c.key}>
              <ChallengeCard title={c.title} description={c.description} href={c.href} />
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">WarrantyIT take-home: product manager</p>

      <section className="mt-10">
        <h3 className="text-md font-medium mb-2">Future challenges</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>Implement backend API with Supabase (Postgres) and Row Level Security</li>
          <li>Create dynamic routes like /challenges/task1, /challenges/task2 for future assignments</li>
          <li>Add products list with retrieval endpoint</li>
        </ul>
      </section>
    </main>
  )
}
