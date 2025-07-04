import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import PayslipViewer from '../components/PayslipViewer';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiDownload, FiEye, FiCalendar, FiDollarSign } = FiIcons;

const Payslips = () => {
  const { t } = useTranslation();
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const payslips = [
    {
      id: 1,
      month: 'January 2024',
      date: '2024-01-31',
      grossSalary: 5000,
      netSalary: 4200,
      status: 'processed'
    },
    {
      id: 2,
      month: 'December 2023',
      date: '2023-12-31',
      grossSalary: 5000,
      netSalary: 4200,
      status: 'processed'
    },
    {
      id: 3,
      month: 'November 2023',
      date: '2023-11-30',
      grossSalary: 5000,
      netSalary: 4200,
      status: 'processed'
    },
    {
      id: 4,
      month: 'October 2023',
      date: '2023-10-31',
      grossSalary: 5000,
      netSalary: 4200,
      status: 'processed'
    }
  ];

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip(payslip);
  };

  const handleDownloadPayslip = (payslip) => {
    // Simulate PDF download
    console.log('Downloading payslip for:', payslip.month);
    // In real app, this would generate and download a PDF
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('payslips')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and download your salary statements
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Salary</p>
              <p className="text-2xl font-bold text-green-600">$5,000</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payslips List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Payslip History
        </h2>

        <div className="space-y-4">
          {payslips.map((payslip, index) => (
            <motion.div
              key={payslip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {payslip.month}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                      {payslip.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                      Net: ${payslip.netSalary.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewPayslip(payslip)}
                  className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  title="View Payslip"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadPayslip(payslip)}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payslip Viewer Modal */}
      {selectedPayslip && (
        <PayslipViewer
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};

export default Payslips;