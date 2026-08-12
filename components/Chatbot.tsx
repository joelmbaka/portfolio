'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { X, Bot, Mic, Square, Play, Copy, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string; audioUrl?: string; loadingAudio?: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [shake, setShake] = useState(false);
  const CHAT_ENDPOINT = '/api/chat';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        setIsRecording(false);
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'recording.webm');
        try {
          const resp = await fetch('/api/stt', { method: 'POST', body: fd });
          const { text } = await resp.json();
          if (text && typeof text === 'string') {
            setInput(text);
            setShouldSpeak(true);
            (document.getElementById('chat-input-form') as HTMLFormElement | null)?.requestSubmit();
          }
        } catch (err) {
          console.error('[STT_ERROR]', err);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic permission error', err);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handlePlay = async (index: number) => {
    const msg = messages[index];
    if (msg.role !== 'bot') return;
    if (msg.audioUrl) {
      new Audio(msg.audioUrl).play();
      return;
    }

    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], loadingAudio: true };
      return copy;
    });

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setMessages((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], loadingAudio: false, audioUrl: url };
        return copy;
      });
      new Audio(url).play();
    } catch (err) {
      console.error('[TTS_PLAY_ERROR]', err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], loadingAudio: false };
        return copy;
      });
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  useEffect(() => {
    if (shake) {
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [shake]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-palm-green bg-[var(--background)] text-palm-green shadow-lg transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-palm-green/60 dark:hover:bg-gray-900 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      >
        <Bot size={22} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:justify-end"
            onClick={() => setShake(true)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex max-h-[88dvh] w-full flex-col rounded-t-2xl bg-white shadow-lg dark:bg-gray-900 sm:mb-8 sm:mr-4 sm:w-[22rem] sm:rounded-2xl md:mb-16 md:mr-10 md:w-[26rem] lg:w-[28rem]"
              role="dialog"
              aria-modal="true"
              aria-label="Chat with Joel's personal AI agent"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <h3 className="text-base font-semibold leading-6 sm:text-lg">Chat with Joel&apos;s personal AI agent</h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 ${shake ? 'animate-bounce' : ''}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="min-h-[160px] flex-1 space-y-2 overflow-y-auto bg-gray-50 px-3 py-2 dark:bg-gray-800 sm:px-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`break-words whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'ml-auto max-w-[82%] bg-palm-green text-white sm:max-w-[75%]'
                        : 'mr-auto max-w-[94%] bg-white text-gray-600 shadow-sm dark:bg-gray-900/70 dark:text-gray-300 sm:max-w-[90%]'
                    }`}
                  >
                    <span>{msg.text}</span>
                    {msg.role === 'bot' && (
                      <div className="mt-1 flex gap-2">
                        <button
                          onClick={() => handlePlay(idx)}
                          aria-label="Play"
                          disabled={msg.loadingAudio}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-800"
                        >
                          {msg.loadingAudio ? (
                            <Loader2 className="animate-spin text-palm-green" size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.text)}
                          aria-label="Copy text"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form
                id="chat-input-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const question = input.trim();
                  if (!question) return;

                  setMessages((prev) => [...prev, { role: 'user', text: question }]);
                  setInput('');
                  setIsLoading(true);

                  try {
                    const res = await fetch(CHAT_ENDPOINT, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ question }),
                    });

                    if (!res.ok) {
                      throw new Error('Network response was not ok');
                    }

                    const data = await res.json();
                    const answerRaw: unknown = (data && (data.raw ?? data.answer ?? data.message)) ?? data;
                    let answer: string;
                    if (typeof answerRaw === 'string') {
                      answer = answerRaw;
                    } else {
                      try {
                        answer = JSON.stringify(answerRaw, null, 2);
                      } catch {
                        answer = 'Sorry, I could not parse the response.';
                      }
                    }

                    const botIndex = messages.length;
                    setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
                    if (shouldSpeak) {
                      setShouldSpeak(false);
                      setTimeout(() => handlePlay(botIndex), 0);
                    }
                  } catch (error) {
                    console.error(error);
                    setMessages((prev) => [
                      ...prev,
                      { role: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
                    ]);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 px-3 pb-4 pt-3 sm:px-4 sm:pb-5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Joel’s work…"
                  disabled={isLoading}
                  className="min-h-11 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-palm-green/60 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg bg-palm-green px-3 py-2 text-sm font-medium text-white hover:bg-palm-green-dark focus:outline-none focus:ring-2 focus:ring-palm-green/60 disabled:opacity-50 sm:px-4"
                  disabled={isLoading}
                >
                  {isLoading ? '…' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  aria-label={isRecording ? 'Stop recording' : 'Record a voice question'}
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                  disabled={isLoading}
                >
                  {isRecording ? <Square size={16} /> : <Mic size={16} />}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
