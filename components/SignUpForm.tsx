'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (password.length < 8) throw new Error('Password must be at least 8 characters')
      if (password !== confirm) throw new Error('Passwords do not match')
      const siteUrl = (
        process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
      )?.replace(/\/$/, '')
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: siteUrl || undefined,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign up'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We sent a confirmation link to {email}. Click the link to verify your account, then return to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Confirm password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
