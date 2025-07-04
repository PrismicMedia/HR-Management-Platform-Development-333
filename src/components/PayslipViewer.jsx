import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiFileText } = FiIcons;

const PayslipViewer = ({ payslip, onClose }) => {
  const handleDownload = () => {
    console.log('Downloading payslip:', payslip.month);
    // Simulate PDF download
  };

  const payslipData = {
    employeeInfo: {
      name: 'John Doe',
      id: 'EMP001',
      department: 'Engineering',
      position: 'Senior Developer'
    },
    earnings: {
      basicSalary: 4000,
      allowances: 800,
      overtime: 200,
      bonus: 0
    },
    deductions: {
      tax: 600,
      insurance: 150,
      pension: 250,
      other: 0
    }
  };

  const totalEarnings = Object.values(payslipData.earnings).reduce((sum, val) => sum + val, 0);
  const totalDeductions = Object.values(payslipData.deductions).reduce((sum, val) => sum + val, 0);
  const netSalary = totalEarnings - totalDeductions;

  return (
    <AnimatePresence>
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payslip - {payslip.month}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Download PDF"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Payslip Content */}
          <div className="p-6">
            {/* Company Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agency HR</h1>
              <p className="text-gray-600 dark:text-gray-400">123 Business Street, City, State 12345</p>
              <p className="text-gray-600 dark:text-gray-400">Phone: (555) 123-4567</p>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Employee Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslipData.employeeInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Employee ID:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslipData.employeeInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Department:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslipData.employeeInfo.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslipData.employeeInfo.position}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pay Period</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Month:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslip.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pay Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{payslip.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings and Deductions */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Earnings */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Earnings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Basic Salary:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.earnings.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Allowances:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.earnings.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.earnings.overtime.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bonus:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.earnings.bonus.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-green-800 dark:text-green-300">Total Earnings:</span>
                      <span className="text-green-800 dark:text-green-300">${totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">Deductions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Income Tax:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.deductions.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Health Insurance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.deductions.insurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pension Fund:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.deductions.pension.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Other:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${payslipData.deductions.other.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-red-200 dark:border-red-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-red-800 dark:text-red-300">Total Deductions:</span>
                      <span className="text-red-800 dark:text-red-300">${totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-300 mb-2">Net Salary</h3>
              <p className="text-3xl font-bold text-primary-900 dark:text-primary-200">${netSalary.toLocaleString()}</p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>This is a computer-generated payslip. No signature required.</p>
              <p className="mt-1">For queries, contact HR at hr@agency.com</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PayslipViewer;