'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { SignInForm } from '@/components/SignInForm'
import { SignUpForm } from '@/components/SignUpForm'
import { createPortal } from 'react-dom'

export type AuthMode = 'signin' | 'signup'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onSignedIn?: () => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange, onSignedIn }: AuthModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const modal = (
    <>
      <div className="fixed inset-0 w-screen h-screen z-[9998] bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-2xl bg-white text-black dark:bg-zinc-900 dark:text-white shadow-2xl ring-1 ring-black/10 dark:ring-white/10 p-6"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mb-4 flex items-center gap-4">
            <button
              onClick={() => onModeChange('signin')}
              className={`px-3 py-1.5 rounded-full text-sm ${mode === 'signin' ? 'bg-transparent border border-palm-green text-palm-green' : 'bg-zinc-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => onModeChange('signup')}
              className={`px-3 py-1.5 rounded-full text-sm ${mode === 'signup' ? 'bg-transparent border border-palm-green text-palm-green' : 'bg-zinc-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100'}`}
            >
              Create account
            </button>
          </div>
          {mode === 'signin' ? (
            <SignInForm onSuccess={onSignedIn} />
          ) : (
            <SignUpForm />
          )}
        </div>
      </div>
    </>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modal, document.body)
}
