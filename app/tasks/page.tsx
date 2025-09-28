'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

interface ProductForm {
  name: string
  brand: string
  type: string
  warrantyMonths: number | ''
  startDate: string
}

interface ProductRow {
  id: string
  user_id: string
  name: string
  brand: string
  type: string
  warranty_months: number
  start_date: string
  created_at: string
}

export default function TasksPage() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [form, setForm] = useState<ProductForm>({
    name: '',
    brand: '',
    type: '',
    warrantyMonths: '',
    startDate: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ProductRow[]>([])

  const getAccessToken = useCallback(async (): Promise<string | undefined> => {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token
  }, [])

  const fetchItems = useCallback(async () => {
    setError(null)
    try {
      const token = await getAccessToken()
      if (!token) return
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load items')
      const json = await res.json()
      setItems(json.items ?? [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load'
      setError(msg)
    }
  }, [getAccessToken])

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!mounted) return
      setSignedIn(!!data.session)
      setReady(true)
      if (data.session) {
        fetchItems()
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSignedIn(!!session)
      if (session) {
        await fetchItems()
      } else {
        setItems([])
      }
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [fetchItems])

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const token = await getAccessToken()
      if (!token) throw new Error('Not authenticated')
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          type: form.type,
          warrantyMonths: form.warrantyMonths === '' ? 0 : form.warrantyMonths,
          startDate: form.startDate,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error ?? 'Failed to save')
      }
      setMessage('Saved!')
      setForm({ name: '', brand: '', type: '', warrantyMonths: '', startDate: '' })
      await fetchItems()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to submit'
      setError(msg)
    }
  }

  if (!ready) return null

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
      <h1 className="text-2xl font-semibold mb-2">Tasks</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">WarrantyIT take-home: product manager</p>

      {!signedIn ? (
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-medium mb-2">Please sign in</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use the Sign in button in the top right to authenticate via email password. Once signed in, you&apos;ll see the form here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-medium mb-4">Add a Product</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Product Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded bg-zinc-100 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="MacBook Pro 14"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Brand</label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  className="w-full rounded bg-zinc-100 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Apple"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Type</label>
                <input
                  required
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                  className="w-full rounded bg-zinc-100 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Laptop"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Warranty Period (months)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.warrantyMonths}
                  onChange={(e) => update('warrantyMonths', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded bg-zinc-100 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  className="w-full rounded bg-zinc-100 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Confirm
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
      )}

      {signedIn && (
        <div className="mt-8">
          <h3 className="text-md font-medium mb-2">Your Products</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No products yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-800">
              {items.map((it) => (
                <li key={it.id} className="p-4 grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 text-sm">
                  <span className="font-medium">{it.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{it.brand}</span>
                  <span className="text-gray-600 dark:text-gray-400">{it.type}</span>
                  <span className="text-gray-600 dark:text-gray-400">{it.warranty_months} mo</span>
                  <span className="text-gray-600 dark:text-gray-400">{new Date(it.start_date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <section className="mt-10">
        <h3 className="text-md font-medium mb-2">Future tasks</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>Implement backend API with Supabase (Postgres) and Row Level Security</li>
          <li>Create dynamic routes like /tasks/task1, /tasks/task2 for future assignments</li>
          <li>Add products list with retrieval endpoint</li>
        </ul>
      </section>
    </main>
  )
}
