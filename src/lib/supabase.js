import { createClient } from '@supabase/supabase-js'

// ✅ WORKING SUPABASE CONFIGURATION
const SUPABASE_URL = 'https://wwnavngjdvrwqhsnhpbp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bmF2bmdqZHZyd3Foc25ocGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzYwNjIsImV4cCI6MjA2MTE1MjA2Mn0.9o8GjWTbROx7rCI3NwElnORRaCQppjAdvdFuUbDyOUY'

console.log('✅ Supabase: Configuration loaded successfully')
console.log('📡 Project URL:', SUPABASE_URL)

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'apikey': SUPABASE_ANON_KEY
    }
  }
})

// Enhanced connection test with detailed diagnostics
export const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    const startTime = Date.now()
    const { data, error } = await supabase
      .from('users_hr_dash')
      .select('id')
      .limit(1)
    
    const responseTime = Date.now() - startTime
    
    if (error) {
      console.error('❌ Connection test failed:', error)
      return { 
        success: false, 
        message: error.message,
        responseTime
      }
    }
    
    console.log('✅ Connection test successful', { responseTime, data })
    return { 
      success: true, 
      message: 'Connected successfully',
      responseTime,
      data
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error)
    return { 
      success: false, 
      message: error.message
    }
  }
}

// Test database tables existence
export const testTables = async () => {
  const requiredTables = [
    'users_hr_dash',
    'leave_requests_hr_dash', 
    'skills_hr_dash',
    'tasks_hr_dash',
    'kpis_hr_dash'
  ]
  
  const results = {}
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      results[table] = error ? { exists: false, error: error.message } : { exists: true }
    } catch (err) {
      results[table] = { exists: false, error: err.message }
    }
  }
  
  return results
}

// Network connectivity test
export const testNetworkConnectivity = async () => {
  try {
    const response = await fetch(SUPABASE_URL, { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    return { success: true, status: 'Network reachable' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Comprehensive health check
export const healthCheck = async () => {
  console.log('🏥 Running comprehensive health check...')
  
  const results = {
    timestamp: new Date().toISOString(),
    connection: await testConnection(),
    tables: await testTables(),
    network: await testNetworkConnectivity(),
    config: {
      url: SUPABASE_URL,
      keyConfigured: !!SUPABASE_ANON_KEY,
      environment: import.meta.env.MODE || 'development'
    }
  }
  
  console.log('📊 Health check results:', results)
  return results
}

export default supabase