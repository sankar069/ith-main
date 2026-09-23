import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, Badge, Skeleton } from '../ui'
import { CreditCard, CheckCircle, Clock, Receipt, Gift } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'

const PAYMENT_BADGE = {
  not_required: { variant: 'secondary', label: 'Free' },
  pending: { variant: 'warning', label: 'Pending' },
  submitted: { variant: 'info', label: 'Submitted' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
}

function registrationAmount(r) {
  if (r.pass) return Number(r.pass.price || 0)
  if (r.event?.payment_required) return Number(r.event.payment_amount || 0)
  return 0
}

export default function BillingTab() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useDashboard()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await studentFetch('/api/student/events')
      setRegistrations(data.registrations || [])
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load billing history.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const paidRegistrations = registrations.filter((r) => registrationAmount(r) > 0)
  const freeCount = registrations.length - paidRegistrations.length

  const approvedTotal = paidRegistrations
    .filter((r) => r.payment_status === 'approved')
    .reduce((sum, r) => sum + registrationAmount(r), 0)
  const pendingTotal = paidRegistrations
    .filter((r) => ['pending', 'submitted'].includes(r.payment_status))
    .reduce((sum, r) => sum + registrationAmount(r), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light">Billing & Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your real event payment history at InnoTech-Hub</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid & Approved</p>
                <p className="text-3xl font-bold text-green-500 mt-1">₹{approvedTotal.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Approval</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">₹{pendingTotal.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Free Events Joined</p>
                <p className="text-3xl font-bold text-[#8ab4f8] mt-1">{freeCount}</p>
              </div>
              <Gift className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-bold text-cozy-dark dark:text-cozy-light mb-4">Payment History</h2>
        {loading ? (
          <Skeleton height="80px" count={3} />
        ) : paidRegistrations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center flex flex-col items-center gap-2">
              <Receipt className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">No paid registrations yet. Free events won't show a charge here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {paidRegistrations.map((r) => {
              const cfg = PAYMENT_BADGE[r.payment_status] || PAYMENT_BADGE.not_required
              return (
                <Card key={r.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <CreditCard className="w-6 h-6 text-[#c84c30]" />
                      </div>
                      <div>
                        <p className="font-semibold text-cozy-dark dark:text-cozy-light">{r.event?.name || 'Event'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {r.pass ? `${r.pass.name} pass` : 'Entry fee'} · {new Date(r.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-cozy-dark dark:text-cozy-light">₹{registrationAmount(r).toLocaleString()}</p>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
