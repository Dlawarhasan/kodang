import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    // Find user in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      // Fallback to environment variables for backward compatibility
      const adminUsername = process.env.ADMIN_USERNAME || 'admin'
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      if (username === adminUsername && password === adminPassword) {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
        return NextResponse.json({ 
          success: true, 
          token,
          permissions: { can_create: true, can_edit: true, can_delete: true },
          message: 'Login successful' 
        })
      }
      
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    // Check if password is hashed (starts with $2b$) or plain text
    let passwordMatch = false
    if (user.password.startsWith('$2b$')) {
      // Password is hashed, use bcrypt
      try {
        const bcrypt = await import('bcryptjs')
        passwordMatch = await bcrypt.default.compare(password, user.password)
      } catch (e) {
        // Fallback to simple comparison if bcrypt fails
        passwordMatch = password === user.password
      }
    } else {
      // Plain text password (for backward compatibility)
      passwordMatch = password === user.password
    }

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Generate token with user info
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64')
    
    return NextResponse.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        username: user.username,
        permissions: {
          can_create: user.can_create,
          can_edit: user.can_edit,
          can_delete: user.can_delete,
        }
      },
      message: 'Login successful' 
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed', error: error.message },
      { status: 500 }
    )
  }
}

