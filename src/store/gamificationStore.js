import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useGamificationStore = create((set) => ({
  points: 0,
  badges: [],
  leaderboard: [],

  fetchPoints: async (userId) => {
    const { data, error } = await supabase
      .from('gamification_points_hr_dash')
      .select('points')
      .eq('user_id', userId)

    if (!error) {
      const total = data.reduce((sum, row) => sum + row.points, 0)
      set({ points: total })
    }
  },

  addPoints: async ({ userId, action, points }) => {
    const { error } = await supabase
      .from('gamification_points_hr_dash')
      .insert([{ user_id: userId, action, points }])

    if (!error) {
      set((state) => ({ points: state.points + points }))
    }
  },

  fetchLeaderboard: async () => {
    const { data, error } = await supabase
      .from('gamification_points_hr_dash')
      .select('user_id, points')

    if (!error) {
      const totals = {}
      data.forEach((row) => {
        totals[row.user_id] = (totals[row.user_id] || 0) + row.points
      })
      const sorted = Object.entries(totals)
        .map(([userId, points]) => ({ userId, points }))
        .sort((a, b) => b.points - a.points)
      set({ leaderboard: sorted })
    }
  }
}))
