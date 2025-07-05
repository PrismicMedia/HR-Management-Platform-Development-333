import { supabase } from '../lib/supabase'

// Database initialization with better error handling
export const initializeDatabase = async () => {
  try {
    console.log('🔍 Checking database initialization...')
    
    // Test connection first
    const connectionTest = await supabase
      .from('users_hr_dash')
      .select('id')
      .limit(1)
    
    if (connectionTest.error) {
      console.error('❌ Database connection failed:', connectionTest.error)
      return false
    }
    
    console.log('✅ Database connection verified')
    return true
    
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return false
  }
}

// Enhanced user service
export const userService = {
  async getAll() {
    try {
      const { data, error } = await supabase.from('users_hr_dash').select('*')
      if (error) throw error
      return data
    } catch (error) {
      console.error('User service error:', error)
      throw error
    }
  },

  async create(userData) {
    try {
      const { data, error } = await supabase
        .from('users_hr_dash')
        .insert([userData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  },

  async update(id, userData) {
    try {
      const { data, error } = await supabase
        .from('users_hr_dash')
        .update(userData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }
}

// Leave service
export const leaveService = {
  async getAll() {
    try {
      const { data, error } = await supabase.from('leave_requests_hr_dash').select('*')
      if (error) throw error
      return data
    } catch (error) {
      console.error('Leave service error:', error)
      throw error
    }
  },

  async create(leaveData) {
    try {
      const { data, error } = await supabase
        .from('leave_requests_hr_dash')
        .insert([leaveData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Create leave error:', error)
      throw error
    }
  }
}

// Skills service
export const skillsService = {
  async getAll() {
    try {
      const { data, error } = await supabase.from('skills_hr_dash').select('*')
      if (error) throw error
      return data
    } catch (error) {
      console.error('Skills service error:', error)
      throw error
    }
  },

  async create(skillData) {
    try {
      const { data, error } = await supabase
        .from('skills_hr_dash')
        .insert([skillData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Create skill error:', error)
      throw error
    }
  }
}