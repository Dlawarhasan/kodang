import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = 'then' in params ? await params : params
    const userId = resolvedParams.id
    const supabase = createServerClient()
    const body = await request.json()

    const { username, password, can_create, can_edit, can_delete } = body

    const updateData: any = {
      can_create: can_create || false,
      can_edit: can_edit || false,
      can_delete: can_delete || false,
      updated_at: new Date().toISOString(),
    }

    if (username) {
      updateData.username = username
    }

    if (password) {
      try {
        const bcrypt = await import('bcryptjs')
        updateData.password = await bcrypt.default.hash(password, 10)
      } catch (e) {
        // If bcrypt is not available, store plain text (not recommended for production)
        console.warn('bcrypt not available, storing plain text password')
        updateData.password = password
      }
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
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

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = 'then' in params ? await params : params
    const userId = resolvedParams.id
    const supabase = createServerClient()

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

