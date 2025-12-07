import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Comprehensive diagnostic endpoint for short URL system
 */
export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'not set'
    },
    database: {
      tableExists: false,
      canRead: false,
      canWrite: false,
      totalRecords: 0,
      sampleRecords: []
    },
    errors: []
  }

  try {
    // Test 1: Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      diagnostics.errors.push('NEXT_PUBLIC_SUPABASE_URL is missing')
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      diagnostics.errors.push('SUPABASE_SERVICE_ROLE_KEY is missing')
    }

    // Test 2: Try to create Supabase client
    let supabase
    try {
      supabase = createServerClient()
      diagnostics.database.clientCreated = true
    } catch (error: any) {
      diagnostics.errors.push(`Failed to create Supabase client: ${error.message}`)
      return NextResponse.json(diagnostics, { status: 500 })
    }

    // Test 3: Check if table exists (try to read)
    try {
      const { data, error } = await supabase
        .from('short_urls')
        .select('count')
        .limit(1)

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          diagnostics.database.tableExists = false
          diagnostics.errors.push('Table "short_urls" does not exist. Run the SQL script.')
        } else {
          diagnostics.database.tableExists = true
          diagnostics.database.canRead = false
          diagnostics.errors.push(`Cannot read table: ${error.message}`)
        }
      } else {
        diagnostics.database.tableExists = true
        diagnostics.database.canRead = true
      }
    } catch (error: any) {
      diagnostics.errors.push(`Error checking table: ${error.message}`)
    }

    // Test 4: Count records (if table exists)
    if (diagnostics.database.tableExists && diagnostics.database.canRead) {
      try {
        const { count, error } = await supabase
          .from('short_urls')
          .select('*', { count: 'exact', head: true })

        if (!error) {
          diagnostics.database.totalRecords = count || 0
        }
      } catch (error: any) {
        diagnostics.errors.push(`Error counting records: ${error.message}`)
      }
    }

    // Test 5: Get sample records
    if (diagnostics.database.tableExists && diagnostics.database.canRead) {
      try {
        const { data, error } = await supabase
          .from('short_urls')
          .select('code, slug, locale, created_at')
          .limit(5)
          .order('created_at', { ascending: false })

        if (!error && data) {
          diagnostics.database.sampleRecords = data
        }
      } catch (error: any) {
        diagnostics.errors.push(`Error getting samples: ${error.message}`)
      }
    }

    // Test 6: Try to write (test insert)
    if (diagnostics.database.tableExists && diagnostics.database.canRead) {
      try {
        const testCode = `test-${Date.now()}`
        const { data, error } = await supabase
          .from('short_urls')
          .insert({
            code: testCode,
            slug: 'test-slug',
            locale: 'fa'
          })
          .select()
          .single()

        if (error) {
          diagnostics.database.canWrite = false
          diagnostics.errors.push(`Cannot write to table: ${error.message}`)
        } else {
          diagnostics.database.canWrite = true
          // Clean up test record
          await supabase
            .from('short_urls')
            .delete()
            .eq('code', testCode)
        }
      } catch (error: any) {
        diagnostics.errors.push(`Error testing write: ${error.message}`)
      }
    }

    // Determine overall status
    const hasErrors = diagnostics.errors.length > 0
    const isWorking = diagnostics.database.tableExists && 
                     diagnostics.database.canRead && 
                     diagnostics.database.canWrite

    diagnostics.status = isWorking ? 'ok' : 'error'
    diagnostics.summary = isWorking 
      ? 'Short URL system is working correctly'
      : 'Short URL system has issues - see errors below'

    return NextResponse.json(diagnostics, { 
      status: hasErrors && !isWorking ? 500 : 200 
    })
  } catch (error: any) {
    diagnostics.errors.push(`Unexpected error: ${error.message}`)
    diagnostics.status = 'error'
    return NextResponse.json(diagnostics, { status: 500 })
  }
}

