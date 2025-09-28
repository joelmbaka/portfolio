'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface SignInFormProps {
  onSuccess?: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onSuccess?.()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in'
      setError(msg)
    } finally {
      setLoading(false)
    }
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
