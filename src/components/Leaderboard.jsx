import React, { useEffect } from 'react'
import { useGamificationStore } from '../store/gamificationStore'
import SafeIcon from '../common/SafeIcon'
import { FiUser } from 'react-icons/fi'

const Leaderboard = () => {
  const { leaderboard, fetchLeaderboard } = useGamificationStore()

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <div className="space-y-2">
      {leaderboard.map((entry, idx) => (
        <div key={entry.userId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-200">{entry.userId}</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.points}</span>
        </div>
      ))}
    </div>
  )
}

export default Leaderboard
