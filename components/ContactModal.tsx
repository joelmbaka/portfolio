'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Contact API error');
    }

    setStatus('sent');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Contact Joel Mbaka"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-zinc-900 p-5 pb-7 text-white shadow-xl sm:rounded-2xl sm:p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              ×
            </button>

            {status === 'sent' ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 px-2 text-center">
                <h3 className="text-2xl font-semibold">Thank you!</h3>
                <p className="text-gray-300">I will get back to you shortly.</p>
                <button
                  className="mt-2 min-h-11 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 sm:w-auto"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="pr-12">
                  <h3 className="text-xl font-semibold">Send me a message</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-400">Tell me what you’re building or the role you’re hiring for.</p>
                </div>

                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="min-h-12 w-full rounded-xl bg-zinc-800 px-3 py-2.5 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="min-h-12 w-full rounded-xl bg-zinc-800 px-3 py-2.5 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Your message"
                  className="w-full resize-y rounded-xl bg-zinc-800 px-3 py-2.5 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="min-h-12 w-full rounded-xl bg-blue-600 py-2.5 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
