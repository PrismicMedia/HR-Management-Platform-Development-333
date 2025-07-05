import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { healthCheck, testConnection } from '../lib/supabase'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiTool, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertTriangle, FiCopy, FiExternalLink } = FiIcons

const ConnectionTroubleshooter = ({ isOpen, onClose }) => {
  const [diagnosing, setDiagnosing] = useState(false)
  const [results, setResults] = useState(null)
  const [step, setStep] = useState(0)

  const troubleshootingSteps = [
    {
      title: 'Network Connectivity',
      description: 'Testing basic network connection to Supabase',
      test: async () => {
        try {
          const response = await fetch('https://supabase.com', { method: 'HEAD', mode: 'no-cors' })
          return { success: true, message: 'Network connection OK' }
        } catch (error) {
          return { success: false, message: 'Network connectivity issue', error: error.message }
        }
      }
    },
    {
      title: 'Supabase Configuration',
      description: 'Validating Supabase URL and API key',
      test: async () => {
        const url = import.meta.env.VITE_SUPABASE_URL || 'https://wwnavngjdvrwqhsnhpbp.supabase.co'
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        
        if (url.includes('your-project-id') || key.includes('your-anon-key')) {
          return { success: false, message: 'Credentials not configured', solution: 'Update src/lib/supabase.js' }
        }
        
        return { success: true, message: 'Configuration looks good' }
      }
    },
    {
      title: 'Database Connection',
      description: 'Testing connection to Supabase database',
      test: async () => {
        return await testConnection()
      }
    },
    {
      title: 'Database Tables',
      description: 'Checking if required tables exist',
      test: async () => {
        const health = await healthCheck()
        const tables = health.tables
        const missingTables = Object.entries(tables)
          .filter(([table, info]) => !info.exists)
          .map(([table]) => table)
        
        if (missingTables.length > 0) {
          return { 
            success: false, 
            message: `Missing tables: ${missingTables.join(', ')}`,
            solution: 'Run database migration'
          }
        }
        
        return { success: true, message: 'All tables present' }
      }
    }
  ]

  const runDiagnostics = async () => {
    setDiagnosing(true)
    setResults([])
    
    for (let i = 0; i < troubleshootingSteps.length; i++) {
      setStep(i)
      const stepResult = await troubleshootingSteps[i].test()
      
      setResults(prev => [...(prev || []), {
        ...troubleshootingSteps[i],
        result: stepResult
      }])
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setDiagnosing(false)
    setStep(0)
  }

  const copyErrorLog = () => {
    if (!results) return
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      results: results.map(r => ({
        step: r.title,
        success: r.result.success,
        message: r.result.message,
        error: r.result.error
      }))
    }
    
    navigator.clipboard.writeText(JSON.stringify(errorLog, null, 2))
    toast.success('Error log copied to clipboard')
  }

  const getSolutionSteps = () => {
    if (!results) return []
    
    const solutions = []
    
    results.forEach(result => {
      if (!result.result.success && result.result.solution) {
        solutions.push({
          problem: result.title,
          solution: result.result.solution
        })
      }
    })
    
    // Common solutions
    if (solutions.length === 0 && results.some(r => !r.result.success)) {
      solutions.push(
        { problem: 'General Connection Issues', solution: 'Check your internet connection and try again' },
        { problem: 'Database Setup', solution: 'Run the database migration from migrations/001_create_tables.sql' },
        { problem: 'Configuration', solution: 'Verify your Supabase credentials in src/lib/supabase.js' }
      )
    }
    
    return solutions
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiTool} className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Connection Troubleshooter
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 text-center">
                <button
                  onClick={runDiagnostics}
                  disabled={diagnosing}
                  className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <SafeIcon 
                    icon={FiRefreshCw} 
                    className={`w-5 h-5 ${diagnosing ? 'animate-spin' : ''}`} 
                  />
                  <span>{diagnosing ? 'Running Diagnostics...' : 'Run Diagnostics'}</span>
                </button>
              </div>

              {/* Progress Indicator */}
              {diagnosing && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Step {step + 1} of {troubleshootingSteps.length}</span>
                    <span>{Math.round(((step + 1) / troubleshootingSteps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / troubleshootingSteps.length) * 100}%` }}
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {troubleshootingSteps[step]?.description}
                  </p>
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Diagnostic Results
                  </h3>
                  
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <SafeIcon
                        icon={result.result.success ? FiCheckCircle : result.result.error ? FiXCircle : FiAlertTriangle}
                        className={`w-5 h-5 mt-0.5 ${
                          result.result.success 
                            ? 'text-green-500' 
                            : result.result.error 
                            ? 'text-red-500' 
                            : 'text-yellow-500'
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.result.message}
                        </p>
                        {result.result.error && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Error: {result.result.error}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Solutions */}
                  {getSolutionSteps().length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recommended Solutions
                      </h4>
                      <div className="space-y-3">
                        {getSolutionSteps().map((solution, index) => (
                          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h5 className="font-medium text-blue-900 dark:text-blue-300">
                              {solution.problem}
                            </h5>
                            <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                              {solution.solution}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={copyErrorLog}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiCopy} className="w-4 h-4" />
                      <span>Copy Error Log</span>
                    </button>
                    
                    <a
                      href="https://supabase.com/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      <span>Supabase Docs</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConnectionTroubleshooter