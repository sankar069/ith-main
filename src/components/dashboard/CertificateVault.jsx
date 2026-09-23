import React, { useState } from 'react'
import { Download, Share2, X, Trophy } from 'lucide-react'

export default function CertificateVault() {
  const [selectedCert, setSelectedCert] = useState(null)

  const certificates = [
    { id: 1, title: 'Full-Stack Web Development', issuer: 'HackIT 2024', date: 'Aug 2024', skills: ['React', 'Node.js', 'MongoDB'] },
    { id: 2, title: 'Cloud Computing Fundamentals', issuer: 'AWS Academy', date: 'Jul 2024', skills: ['AWS', 'CloudFormation'] },
    { id: 3, title: 'AI/ML Bootcamp', issuer: 'InnoTech Academy', date: 'Jun 2024', skills: ['Python', 'TensorFlow', 'ML'] },
    { id: 4, title: 'Leadership Excellence', issuer: 'CodeRush', date: 'May 2024', skills: ['Leadership', 'Team Management'] },
    { id: 5, title: 'Open Source Contribution', issuer: 'GitHub', date: 'Apr 2024', skills: ['Git', 'Collaboration'] },
    { id: 6, title: 'Problem Solving Pro', issuer: 'LeetCode', date: 'Mar 2024', skills: ['Algorithms', 'Data Structures'] },
  ]

  return (
    <div className="p-6 space-y-6 bg-cozy-light dark:bg-cozy-dark">{/* Flat background */}
      
      <h1 className="text-3xl font-serif font-bold text-cozy-dark dark:text-white">Certificate Vault</h1>

      {/* Gallery View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => setSelectedCert(cert)}
            className="bg-white dark:bg-[#1a1f26] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group cursor-pointer border border-gray-200 dark:border-white/10"
          >
            <div className="h-40 bg-[#c84c30] flex items-center justify-center p-6 group-hover:scale-105 transition">{/* Flat color */}
              <div className="text-center">
                <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-white font-serif font-bold">{cert.title}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-900 dark:text-white">{cert.issuer}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{cert.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1f26] rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-cozy-dark dark:text-white">{selectedCert.title}</h2>
              <button onClick={() => setSelectedCert(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Issuer</p>
                <p className="text-gray-900 dark:text-white font-semibold">{selectedCert.issuer}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Issue Date</p>
                <p className="text-gray-900 dark:text-white font-semibold">{selectedCert.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Skills Verified</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCert.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-[#c84c30] text-white rounded-lg font-semibold hover:bg-[#b84027] transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button className="flex-1 px-4 py-2 border border-[#8ab4f8] text-[#8ab4f8] rounded-lg font-semibold hover:bg-[#8ab4f8]/10 transition flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
