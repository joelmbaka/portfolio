'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { LogIn, LogOut } from 'lucide-react'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { AuthModal, type AuthMode } from './AuthModal'

export function AuthButton() {
  const [session, setSession] = useState<Session | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<AuthMode>('signin')

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!mounted) return
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, _session: Session | null) => {
      setSession(_session)
      if (_session) setShowModal(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        title={session.user.email ?? 'Log out'}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Log out</span>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          setMode('signin')
          setShowModal(true)
        }}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        title="Sign in"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Sign in</span>
      </button>

      {showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode={mode}
          onModeChange={setMode}
          onSignedIn={() => setShowModal(false)}
        />
      )}
    </>
  )
}
