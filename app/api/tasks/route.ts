import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) as string

function createServerSupabaseClient(accessToken: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  })
}

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServerSupabaseClient(token)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ items: data ?? [] })
  } catch (err: unknown) {
    console.error('[TASKS_GET_ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    interface ProductPayload {
      name: string
      brand: string
      type: string
      warrantyMonths: number
      startDate: string
    }
    const body = (await req.json()) as Partial<ProductPayload>
    const name = String(body?.name || '').trim()
    const brand = String(body?.brand || '').trim()
    const type = String(body?.type || '').trim()
    const warrantyMonthsRaw = body?.warrantyMonths
    const startDate = String(body?.startDate || '')

    // Basic validation
    const warrantyMonths = Number(warrantyMonthsRaw)
    if (!name || !brand || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!Number.isFinite(warrantyMonths) || warrantyMonths < 0) {
      return NextResponse.json({ error: 'Invalid warrantyMonths' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json({ error: 'Invalid startDate' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient(token)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name,
        brand,
        type,
        warranty_months: warrantyMonths,
        start_date: startDate,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ item: data })
  } catch (err: unknown) {
    console.error('[TASKS_POST_ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
