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
  // shake cue for X icon
  const [shake, setShake] = useState(false);
  // Same-origin endpoint that proxies to the external AI API
  const CHAT_ENDPOINT = '/api/chat';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle microphone recording and send to ElevenLabs STT
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
            // call existing submission flow
            setInput(text);
            setShouldSpeak(true);
            // auto-submit the form
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

  /**
   * Copy helper
   */
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  /**
   * Fetch speech and play it. Caches per message.
   */
  const handlePlay = async (index: number) => {
    const msg = messages[index];
    if (msg.role !== 'bot') return;
    if (msg.audioUrl) {
      new Audio(msg.audioUrl).play();
      return;
    }

    // mark loading
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

  // disable body scroll while modal open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // reset shake after animation
  useEffect(() => {
    if (shake) {
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [shake]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Bot size={24} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setShake(true)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-[95%] sm:w-[22rem] md:w-[26rem] lg:w-[28rem] mr-4 mb-8 md:mr-10 md:mb-16 max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-lg font-semibold">Chat with Joel&apos;s personal AI agent</h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className={`text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ${shake ? 'animate-bounce' : ''}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-1 space-y-2 bg-gray-50 dark:bg-gray-800">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                      msg.role === 'user'
                        ? 'ml-auto max-w-[75%] bg-blue-600 text-white'
                        : 'mr-auto max-w-[90%] bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span>{msg.text}</span>
                    {msg.role === 'bot' && (
                      <div className="mt-1 flex gap-2">
                        <button
                          onClick={() => handlePlay(idx)}
                          aria-label="Play"
                          disabled={msg.loadingAudio}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          {msg.loadingAudio ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.text)}
                          aria-label="Copy text"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                id="chat-input-form" onSubmit={async (e) => {
                  e.preventDefault();
                  const question = input.trim();
                  if (!question) return;

                  // Add user message to chat
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
                    // Extract answer; ensure it is a string so React can render it safely
                    const answerRaw: unknown =
                      (data && (data.raw ?? data.answer ?? data.message)) ?? data;
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
                      // wait a tick for state update then play
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
                className="px-3 pt-1 pb-6 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about joel.."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 font-medium text-base disabled:opacity-50 cursor-text"
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 flex items-center justify-center"
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
