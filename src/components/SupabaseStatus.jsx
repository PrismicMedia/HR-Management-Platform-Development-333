import React, { useState, useEffect } from 'react'
import { supabase, testConnection } from '../lib/supabase'
import { initializeDatabase } from '../services/database'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheckCircle, FiXCircle, FiAlertCircle, FiDatabase, FiRefreshCw } = FiIcons

const SupabaseStatus = () => {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Checking Supabase connection...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      console.log('🔍 Starting connection check...')
      
      // Test basic connection
      const connectionTest = await testConnection()
      
      if (connectionTest.success) {
        // Test database initialization
        const dbInitialized = await initializeDatabase()
        
        if (dbInitialized) {
          setStatus('success')
          setMessage('✅ Supabase Connected')
          setDetails(`Ready in ${connectionTest.responseTime}ms`)
        } else {
          setStatus('warning')
          setMessage('⚠️ Connection Issues')
          setDetails('Database setup may be needed')
        }
      } else {
        setStatus('error')
        setMessage('❌ Connection Failed')
        setDetails(connectionTest.message)
      }

    } catch (error) {
      console.error('Connection check error:', error)
      setStatus('error')
      setMessage('❌ Connection Error')
      setDetails(error.message)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return FiCheckCircle
      case 'warning': return FiAlertCircle
      case 'error': return FiXCircle
      default: return FiDatabase
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900'
      case 'warning': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
      case 'error': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900'
      default: return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
    }
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor()} transition-all`}>
      <SafeIcon icon={getStatusIcon()} className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{message}</span>
        {details && (
          <span className="text-xs opacity-80">{details}</span>
        )}
      </div>
      <button
        onClick={checkSupabaseConnection}
        className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
        title="Refresh connection status"
      >
        <SafeIcon icon={FiRefreshCw} className="w-3 h-3" />
      </button>
    </div>
  )
}

export default SupabaseStatus