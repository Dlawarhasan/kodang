import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations
export const createServerClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!serviceRoleKey,
        urlLength: supabaseUrl.length,
        keyLength: serviceRoleKey.length
      })
      throw new Error('Missing Supabase configuration. Please check your environment variables.')
    }
    
    console.log('Creating Supabase client with URL:', supabaseUrl.substring(0, 30) + '...')
    
    const client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('Supabase client created successfully')
    return client
  } catch (error: any) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
}

