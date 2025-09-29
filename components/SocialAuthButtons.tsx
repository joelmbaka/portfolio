'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Github } from 'lucide-react'

export function SocialAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<null | 'google' | 'github'>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleOAuth(provider: 'google' | 'github') {
    try {
      setError(null)
      setLoadingProvider(provider)
      const redirectTo = typeof window !== 'undefined' ? window.location.href.trim() : undefined
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      })
      if (error) throw error
      // Supabase will redirect; on return, onAuthStateChange in AuthButton will close the modal
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start social sign-in'
      setError(msg)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={() => handleOAuth('google')}
        disabled={loadingProvider !== null}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 py-2.5 font-medium transition hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Continue with Google"
      >
        {/* Simple G badge */}
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-5 h-5 rounded-sm"
          style={{ background: '#fff' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C31.66,6.053,28.045,4.5,24,4.5c-10.77,0-19.5,8.73-19.5,19.5 s8.73,19.5,19.5,19.5S43.5,34.77,43.5,24C43.5,22.659,43.393,21.355,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.818C14.465,16.23,18.897,13.5,24,13.5c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C31.66,6.053,28.045,4.5,24,4.5C16.318,4.5,9.656,8.838,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,43.5c5.164,0,9.81-1.977,13.285-5.197l-6.141-5.197C29.101,35.916,26.715,36.75,24,36.75 c-5.202,0-9.619-3.317-11.273-7.951l-6.526,5.027C9.51,39.074,16.227,43.5,24,43.5z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.999,5.607 c0.001-0.001,0.003-0.002,0.004-0.003l6.141,5.197C36.93,39.33,43.5,34.5,43.5,24C43.5,22.659,43.393,21.355,43.611,20.083z"/>
          </svg>
        </span>
        <span>{loadingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
      </button>

      <button
        type="button"
        onClick={() => handleOAuth('github')}
        disabled={loadingProvider !== null}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 text-white py-2.5 font-medium transition hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Continue with GitHub"
      >
        <Github className="w-5 h-5" />
        <span>{loadingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}</span>
      </button>
    </div>
  )
}
