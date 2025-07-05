import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDatabase, FiCopy, FiCheck, FiExternalLink, FiArrowRight } = FiIcons;

const SetupWizard = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const steps = [
    {
      title: 'Create Supabase Project',
      description: 'Set up your Supabase account and create a new project',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Getting Started</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>Click "Start your project" and sign up</li>
              <li>Create a new project with any name</li>
              <li>Wait 2-3 minutes for initialization</li>
            </ol>
          </div>
          <button
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
            <span>Open Supabase</span>
          </button>
        </div>
      )
    },
    {
      title: 'Get Your Credentials',
      description: 'Copy your project URL and API key from Supabase dashboard',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">Find Your Credentials</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
              <li>In your Supabase dashboard, go to <strong>Settings → API</strong></li>
              <li>Copy the <strong>Project URL</strong></li>
              <li>Copy the <strong>anon public</strong> API key</li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Example credentials format:</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="text-green-600 dark:text-green-400">URL: https://abcdefgh.supabase.co</div>
              <div className="text-blue-600 dark:text-blue-400">Key: eyJhbGciOiJIUzI1NiIsInR5cCI6...</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Update Configuration',
      description: 'Replace the placeholder credentials in your code',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Update src/lib/supabase.js</h4>
            <p className="text-sm text-purple-800 dark:text-purple-300 mb-3">
              Replace these lines with your actual credentials:
            </p>
            <div className="bg-gray-900 p-3 rounded text-green-400 text-xs font-mono overflow-x-auto">
              {`const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'`}
            </div>
            <button
              onClick={() => copyToClipboard(`const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'`, 'config')}
              className="flex items-center space-x-2 mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
            >
              <SafeIcon icon={copied === 'config' ? FiCheck : FiCopy} className="w-3 h-3" />
              <span>{copied === 'config' ? 'Copied!' : 'Copy Template'}</span>
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Set Up Database',
      description: 'Create the necessary tables and sample data',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Run SQL Migration</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-green-800 dark:text-green-300">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to <strong>SQL Editor</strong></li>
              <li>Click <strong>New query</strong></li>
              <li>Copy and paste the migration SQL</li>
              <li>Click <strong>Run</strong></li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Migration SQL:</span>
              <button
                onClick={() => copyToClipboard('-- See migrations/001_create_tables.sql for full content', 'sql')}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                <SafeIcon icon={copied === 'sql' ? FiCheck : FiCopy} className="w-3 h-3" />
                <span>{copied === 'sql' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              The complete SQL migration is in the <code>migrations/001_create_tables.sql</code> file.
              Copy its contents and run in Supabase SQL Editor.
            </p>
          </div>
        </div>
      )
    }
  ];

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
                <SafeIcon icon={FiDatabase} className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Supabase Setup Wizard
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
              {/* Progress Bar */}
              <div className="flex items-center mb-6">
                {steps.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 w-16 mx-2 ${
                          index < currentStep
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {steps[currentStep].description}
                </p>
                {steps[currentStep].content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-3">
                  {currentStep === steps.length - 1 ? (
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Complete Setup
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Next</span>
                      <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetupWizard;