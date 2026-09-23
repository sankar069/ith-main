import React from 'react'
import { Download, Filter } from 'lucide-react'

export default function BillingHistory() {
  const transactions = [
    { id: 1, date: 'Aug 15, 2024', description: 'HackIT 2024 Registration', amount: 500, status: 'Completed', invoice: 'INV-001' },
    { id: 2, date: 'Aug 10, 2024', description: 'Premium AI Suite - Monthly', amount: 299, status: 'Completed', invoice: 'INV-002' },
    { id: 3, date: 'Aug 5, 2024', description: 'Expert Session Pack', amount: 1999, status: 'Completed', invoice: 'INV-003' },
    { id: 4, date: 'Jul 28, 2024', description: 'Cloud Conference Ticket', amount: 2999, status: 'Completed', invoice: 'INV-004' },
    { id: 5, date: 'Jul 20, 2024', description: 'Mentorship 1:1 Session', amount: 599, status: 'Pending', invoice: 'INV-005' },
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-cozy-light to-gray-50 dark:from-cozy-dark dark:to-[#1a1f26]">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">Billing & Payment History</h1>
        <button className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a1f26] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Spent</p>
          <p className="text-4xl font-bold text-[#c84c30]">₹6,396</p>
        </div>
        <div className="bg-white dark:bg-[#1a1f26] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Transactions</p>
          <p className="text-4xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white dark:bg-[#1a1f26] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-4xl font-bold text-orange-600">₹599</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#1a1f26] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{tx.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#c84c30]">₹{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      tx.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#8ab4f8] hover:text-[#c84c30] transition flex items-center gap-1 font-semibold text-sm">
                      {tx.invoice} <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
