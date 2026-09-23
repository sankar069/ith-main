import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, Button, Badge, Skeleton } from '../ui'
import { Download, Eye, Award, Share2 } from 'lucide-react'
import { useDashboard } from '../../../contexts/DashboardContext'
import { studentFetch, StudentApiError } from '../../../lib/studentApi'

export default function CertificatesTab() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useDashboard()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await studentFetch('/api/student/certificates')
      setCertificates(data.certificates || [])
    } catch (err) {
      addNotification(err instanceof StudentApiError ? err.message : 'Failed to load certificates.', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredCerts = filterStatus === 'all'
    ? certificates
    : certificates.filter(c => c.status === filterStatus)

  const skillCloud = [...new Set(certificates.flatMap((c) => c.skills || []))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cozy-dark dark:text-cozy-light">Certification Vault</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your earned certifications and learning achievements</p>
      </div>

      {skillCloud.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Skill Cloud</p>
            <div className="flex flex-wrap gap-2">
              {skillCloud.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full bg-[#c84c30]/10 text-[#c84c30] text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-[#c84c30]">{certificates.filter(c => c.status === 'earned').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-[#8ab4f8]">{certificates.filter(c => c.status === 'in_progress').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-yellow-500">{certificates.filter(c => c.status === 'pending').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-500">{certificates.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'earned', 'in_progress', 'pending'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
              filterStatus === status
                ? 'bg-[#c84c30] text-white'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton height="160px" count={3} />
        </div>
      ) : filteredCerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center gap-2">
            <Award className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400">
              {certificates.length === 0
                ? 'No certificates yet. They\'ll appear here once an admin issues one for an event you attended.'
                : 'No certificates match this filter.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map(cert => (
            <Card key={cert.id} className="hover:shadow-lg transition-all relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                cert.status === 'earned' ? 'bg-green-500' : cert.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}></div>

              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-cozy-dark dark:text-cozy-light">{cert.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{cert.issuer || cert.event?.name || 'InnoTech-Hub'}</p>
                  </div>
                  <Badge
                    variant={cert.status === 'earned' ? 'success' : cert.status === 'in_progress' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {cert.status === 'earned' ? '✓ Earned' : cert.status === 'in_progress' ? '⏳ In Progress' : '⏱️ Pending'}
                  </Badge>
                </div>

                {cert.earned_date && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    Earned on {new Date(cert.earned_date).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={!cert.certificate_url}
                    onClick={() => cert.certificate_url && window.open(cert.certificate_url, '_blank', 'noreferrer')}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  {cert.status === 'earned' && cert.certificate_url && (
                    <a
                      href={cert.certificate_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-cozy-dark dark:text-cozy-light text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#252d36] transition-all"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                  {cert.status === 'earned' && (
                    <button
                      onClick={() => {
                        const shareUrl = cert.certificate_url || window.location.origin
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                          '_blank',
                          'noreferrer,width=600,height=600'
                        )
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A66C2]/30 text-[#0A66C2] text-xs font-semibold hover:bg-[#0A66C2]/10 transition-all"
                      title="Share on LinkedIn"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
