'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [pendingSetPassword, setPendingSetPassword] = useState(false)
  const [hasSetPassword, setHasSetPassword] = useState(false)

  function getPasswordRules(p: string) {
    const length = p.length >= 8
    const lower = /[a-z]/.test(p)
    const upper = /[A-Z]/.test(p)
    const digit = /\d/.test(p)
    const symbol = /[^A-Za-z0-9]/.test(p)
    return { length, lower, upper, digit, symbol }
  }

  const rules = getPasswordRules(password)
  const allValid = rules.length && rules.lower && rules.upper && rules.digit && rules.symbol

  const waitForSession = useCallback(async (maxAttempts = 15, delayMs = 200) => {
    for (let i = 0; i < maxAttempts; i++) {
      const { data } = await supabase.auth.getSession()
      const sess = data.session
      if (sess?.access_token) return data.session
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
    const { data } = await supabase.auth.getSession()
    return data.session
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!allValid) throw new Error('Password is too weak. Please meet all requirements below.')
      if (password !== confirm) throw new Error('Passwords do not match')
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification code'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // After session is established (SIGNED_IN), set the password once
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' && pendingSetPassword && !hasSetPassword) {
        await waitForSession()
        const { error: uErr } = await supabase.auth.updateUser({ password })
        if (uErr) {
          setError(uErr.message)
        } else {
          setError(null)
        }
        setPendingSetPassword(false)
        setHasSetPassword(true)
      }
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [pendingSetPassword, password, hasSetPassword, waitForSession])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setError(null)
    try {
      if (code.length !== 6) throw new Error('Enter the 6-digit code')
      const { error: vErr } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
      if (vErr) throw vErr
      // Wait for a fully established session (with refresh token) before updating password
      const session = await waitForSession()
      if (!session) {
        setPendingSetPassword(true)
      } else {
        let { error: uErr } = await supabase.auth.updateUser({ password })
        if (uErr && /Invalid Refresh Token/i.test(uErr.message)) {
          // brief retry after a short wait
          await new Promise((resolve) => setTimeout(resolve, 400))
          const session2 = await waitForSession(5, 300)
          if (session2) {
            const res2 = await supabase.auth.updateUser({ password })
            uErr = res2.error
          }
        }
        if (uErr) throw uErr
        setHasSetPassword(true)
      }
      // on success, AuthButton's onAuthStateChange will close the modal
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
    } finally {
      setVerifying(false)
    }
  }

  async function handleResend() {
    setResending(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code'
      setError(msg)
    } finally {
      setResending(false)
    }
  }

  if (sent) {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <h3 className="text-lg font-semibold">Enter the 6-digit code</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We sent a code to {email}. Enter it below to verify your email and finish creating your account.
        </p>

        <input
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
          className="w-full tracking-widest text-center text-lg rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border-none focus:outline-none focus:ring-2 focus:ring-palm-green/60 caret-palm-green text-black dark:text-white"
          aria-label="Verification code"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={verifying || code.length !== 6}
          className="w-full rounded-xl bg-transparent border border-palm-green text-black dark:text-white py-2.5 font-medium transition hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-palm-green/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? 'Verifying…' : 'Verify and create account'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full text-sm text-gray-600 dark:text-gray-300 underline"
        >
          {resending ? 'Sending…' : 'Resend code'}
        </button>

        <button
          type="button"
          onClick={() => { setSent(false); setCode('') }}
          className="w-full text-sm text-gray-500 dark:text-gray-400"
        >
          Change email
        </button>
      </form>
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
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border-none focus:outline-none focus:ring-2 focus:ring-palm-green/60 caret-palm-green text-black dark:text-white"
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
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border-none focus:outline-none focus:ring-2 focus:ring-palm-green/60 caret-palm-green text-black dark:text-white"
        />
        <ul className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-400">
          <li className={rules.length ? 'text-green-600 dark:text-green-400' : ''}>• At least 8 characters</li>
          <li className={rules.lower ? 'text-green-600 dark:text-green-400' : ''}>• Includes a lowercase letter</li>
          <li className={rules.upper ? 'text-green-600 dark:text-green-400' : ''}>• Includes an uppercase letter</li>
          <li className={rules.digit ? 'text-green-600 dark:text-green-400' : ''}>• Includes a number</li>
          <li className={rules.symbol ? 'text-green-600 dark:text-green-400' : ''}>• Includes a symbol</li>
        </ul>
      </div>
      <div>
        <label className="block text-sm mb-1">Confirm password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2.5 border-none focus:outline-none focus:ring-2 focus:ring-palm-green/60 caret-palm-green text-black dark:text-white"
        />
        {confirm && (
          <p className={`mt-1 text-xs ${confirm === password ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {confirm === password ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading || !allValid || password !== confirm}
        className="w-full rounded-xl bg-transparent border border-palm-green text-black dark:text-white py-2.5 font-medium transition hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-palm-green/60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending code…' : 'Send code'}
      </button>
    </form>
  )
}
