'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  // Reset status each time modal is closed so it shows the form again
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
    }
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative z-10 w-full max-w-md rounded-lg bg-zinc-900 p-6 text-white shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              ×
            </button>

            {status === 'sent' ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
                <h3 className="text-2xl font-semibold">Thank you!</h3>
                <p>I will get back to you shortly.</p>
                <button
                  className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold">Send me a message</h3>

                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded bg-zinc-800 p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="w-full rounded bg-zinc-800 p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Your message"
                  className="w-full rounded bg-zinc-800 p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded bg-blue-600 py-2 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
                >
                  {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
