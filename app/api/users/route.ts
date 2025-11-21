import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Get all users
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, can_create, can_edit, can_delete, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, users })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { username, password, can_create, can_edit, can_delete } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Hash password (or store plain text for now)
    let hashedPassword = password
    try {
      const bcrypt = await import('bcryptjs')
      hashedPassword = await bcrypt.default.hash(password, 10)
    } catch (e) {
      // If bcrypt is not available, store plain text (not recommended for production)
      console.warn('bcrypt not available, storing plain text password')
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        password: hashedPassword,
        can_create: can_create || false,
        can_edit: can_edit || false,
        can_delete: can_delete || false,
      }])
      .select('id, username, can_create, can_edit, can_delete')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Username already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

