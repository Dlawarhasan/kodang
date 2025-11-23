import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Get all users
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // First, check if table exists by trying to query it
    console.log('Attempting to fetch users from database...')
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, can_create, can_edit, can_delete, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      
      // Check if it's a "table not found" error
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'خشتەی users لە دەیتابەیسدا نەدۆزرایەوە. تکایە SQL کۆدەکە لە Supabase SQL Editor جێبەجێ بکە.',
            errorCode: error.code,
            hint: 'Please run the SQL in create-users-table-fixed.sql in Supabase SQL Editor'
          },
          { status: 404 }
        )
      }
      
      throw error
    }

    console.log('Successfully fetched users:', users?.length || 0)
    return NextResponse.json({ success: true, users: users || [] })
  } catch (error: any) {
    console.error('Unexpected error in GET /api/users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'هەڵەیەک ڕوویدا',
        details: error.toString()
      },
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

    console.log('Attempting to create user:', { username, hasPermissions: { can_create, can_edit, can_delete } })
    
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
      console.error('Error creating user:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Check if it's a "table not found" error
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'خشتەی users لە دەیتابەیسدا نەدۆزرایەوە. تکایە SQL کۆدەکە لە Supabase SQL Editor جێبەجێ بکە.',
            errorCode: error.code,
            hint: 'Please run the SQL in create-users-table-fixed.sql in Supabase SQL Editor'
          },
          { status: 404 }
        )
      }
      
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Username already exists' },
          { status: 400 }
        )
      }
      
      throw error
    }
    
    console.log('User created successfully:', user)

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

