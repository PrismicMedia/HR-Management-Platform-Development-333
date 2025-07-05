import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeQuery = async (queryFn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await queryFn()
      setLoading(false)
      return result
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  return { executeQuery, loading, error }
}

// User Management
export const useUsers = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getUsers = () => executeQuery(() => supabase.from('users_hr_dash').select('*'))
  const createUser = (userData) => executeQuery(() => supabase.from('users_hr_dash').insert([userData]))
  const updateUser = (id, userData) => executeQuery(() => supabase.from('users_hr_dash').update(userData).eq('id', id))
  const deleteUser = (id) => executeQuery(() => supabase.from('users_hr_dash').delete().eq('id', id))

  return { getUsers, createUser, updateUser, deleteUser, loading, error }
}

// Leave Management
export const useLeave = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getLeaveRequests = () => executeQuery(() => supabase.from('leave_requests_hr_dash').select('*'))
  const createLeaveRequest = (leaveData) => executeQuery(() => supabase.from('leave_requests_hr_dash').insert([leaveData]))
  const updateLeaveRequest = (id, leaveData) => executeQuery(() => supabase.from('leave_requests_hr_dash').update(leaveData).eq('id', id))

  return { getLeaveRequests, createLeaveRequest, updateLeaveRequest, loading, error }
}

// Skills Management
export const useSkills = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getSkills = () => executeQuery(() => supabase.from('skills_hr_dash').select('*'))
  const createSkill = (skillData) => executeQuery(() => supabase.from('skills_hr_dash').insert([skillData]))
  const updateSkill = (id, skillData) => executeQuery(() => supabase.from('skills_hr_dash').update(skillData).eq('id', id))
  const deleteSkill = (id) => executeQuery(() => supabase.from('skills_hr_dash').delete().eq('id', id))

  return { getSkills, createSkill, updateSkill, deleteSkill, loading, error }
}

// Tasks Management
export const useTasks = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getTasks = () => executeQuery(() => supabase.from('tasks_hr_dash').select('*'))
  const createTask = (taskData) => executeQuery(() => supabase.from('tasks_hr_dash').insert([taskData]))
  const updateTask = (id, taskData) => executeQuery(() => supabase.from('tasks_hr_dash').update(taskData).eq('id', id))
  const deleteTask = (id) => executeQuery(() => supabase.from('tasks_hr_dash').delete().eq('id', id))

  return { getTasks, createTask, updateTask, deleteTask, loading, error }
}

// KPI Management
export const useKpis = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getKpis = () => executeQuery(() => supabase.from('kpis_hr_dash').select('*'))
  const updateKpi = async (id, kpiData) => {
    const result = await executeQuery(() =>
      supabase.from('kpis_hr_dash').update(kpiData).eq('id', id)
    )
    if (!result.error && kpiData.current_value >= kpiData.target_value) {
      await supabase.from('gamification_points_hr_dash').insert([{ user_id: kpiData.user_id, action: 'kpi_completed', points: 5 }])
    }
    return result
  }

  return { getKpis, updateKpi, loading, error }
}

// Performance Reviews Management
export const usePerformanceReviews = () => {
  const { executeQuery, loading, error } = useSupabase()

  const getReviews = () => executeQuery(() => supabase.from('performance_reviews_hr_dash').select('*'))
  const createReview = (reviewData) => executeQuery(() => supabase.from('performance_reviews_hr_dash').insert([reviewData]))
  const updateReview = (id, reviewData) => executeQuery(() => supabase.from('performance_reviews_hr_dash').update(reviewData).eq('id', id))

  const getGoals = () => executeQuery(() => supabase.from('goals_hr_dash').select('*'))
  const createGoal = (goalData) => executeQuery(() => supabase.from('goals_hr_dash').insert([goalData]))
  const updateGoal = async (id, goalData) => {
    const result = await executeQuery(() =>
      supabase.from('goals_hr_dash').update(goalData).eq('id', id)
    )
    if (!result.error && (goalData.status === 'completed' || goalData.progress >= 100)) {
      await supabase.from('gamification_points_hr_dash').insert([{ user_id: goalData.employee_id, action: 'goal_completed', points: 10 }])
    }
    return result
  }
  const deleteGoal = (id) => executeQuery(() => supabase.from('goals_hr_dash').delete().eq('id', id))

  return { getReviews, createReview, updateReview, getGoals, createGoal, updateGoal, deleteGoal, loading, error }
}