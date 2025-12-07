#!/usr/bin/env node

/**
 * Test script for Short URL system
 * Run with: node test-short-urls.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function testShortUrlSystem() {
  console.log('🔍 Testing Short URL System...\n')
  console.log(`Base URL: ${BASE_URL}\n`)

  // Test 1: Diagnostic endpoint
  console.log('1️⃣ Testing diagnostic endpoint...')
  try {
    const response = await fetch(`${BASE_URL}/api/shorten/diagnose`)
    const data = await response.json()
    
    console.log('Status:', data.status)
    console.log('Summary:', data.summary)
    console.log('\nEnvironment:')
    console.log('  - Has Supabase URL:', data.environment.hasSupabaseUrl)
    console.log('  - Has Service Role Key:', data.environment.hasServiceRoleKey)
    console.log('  - Has Anon Key:', data.environment.hasAnonKey)
    console.log('  - Site URL:', data.environment.siteUrl)
    
    console.log('\nDatabase:')
    console.log('  - Table exists:', data.database.tableExists)
    console.log('  - Can read:', data.database.canRead)
    console.log('  - Can write:', data.database.canWrite)
    console.log('  - Total records:', data.database.totalRecords)
    
    if (data.database.sampleRecords && data.database.sampleRecords.length > 0) {
      console.log('\nSample records:')
      data.database.sampleRecords.forEach((record, i) => {
        console.log(`  ${i + 1}. Code: ${record.code}, Slug: ${record.slug}, Locale: ${record.locale}`)
      })
    }
    
    if (data.errors && data.errors.length > 0) {
      console.log('\n❌ Errors:')
      data.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`)
      })
    }
    
    console.log('')
  } catch (error) {
    console.error('❌ Error testing diagnostic endpoint:', error.message)
  }

  // Test 2: Test endpoint
  console.log('2️⃣ Testing test endpoint...')
  try {
    const response = await fetch(`${BASE_URL}/api/shorten/test`)
    const data = await response.json()
    
    console.log('Status:', data.status)
    console.log('Message:', data.message)
    if (data.tableExists !== undefined) {
      console.log('Table exists:', data.tableExists)
    }
    if (data.totalShortUrls !== undefined) {
      console.log('Total short URLs:', data.totalShortUrls)
    }
    console.log('')
  } catch (error) {
    console.error('❌ Error testing test endpoint:', error.message)
  }

  // Test 3: Create a short URL
  console.log('3️⃣ Testing short URL creation...')
  try {
    const testSlug = `test-slug-${Date.now()}`
    const response = await fetch(`${BASE_URL}/api/shorten?slug=${encodeURIComponent(testSlug)}&locale=fa`)
    const data = await response.json()
    
    if (response.ok && data.shortUrl) {
      console.log('✅ Short URL created successfully!')
      console.log('  Short URL:', data.shortUrl)
      console.log('  Code:', data.code)
      
      // Test 4: Resolve the short URL
      console.log('\n4️⃣ Testing short URL resolution...')
      const code = data.code
      const resolveResponse = await fetch(`${BASE_URL}/api/shorten/resolve?code=${code}`)
      const resolveData = await resolveResponse.json()
      
      if (resolveResponse.ok && resolveData.slug) {
        console.log('✅ Short URL resolved successfully!')
        console.log('  Slug:', resolveData.slug)
        console.log('  Locale:', resolveData.locale)
        console.log('  Matches original:', resolveData.slug === testSlug && resolveData.locale === 'fa')
      } else {
        console.error('❌ Failed to resolve short URL:', resolveData)
      }
    } else {
      console.error('❌ Failed to create short URL:', data)
    }
    console.log('')
  } catch (error) {
    console.error('❌ Error testing short URL creation:', error.message)
  }

  console.log('✅ Testing complete!')
}

// Run tests
testShortUrlSystem().catch(console.error)

