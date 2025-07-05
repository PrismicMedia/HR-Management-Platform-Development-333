import React from 'react'
import SafeIcon from '../common/SafeIcon'
import { FiAward } from 'react-icons/fi'

const GamificationBadge = ({ points }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
      <SafeIcon icon={FiAward} className="w-4 h-4 text-yellow-500" />
      <span className="font-medium text-gray-800 dark:text-gray-200">{points}</span>
    </div>
  )
}

export default GamificationBadge
