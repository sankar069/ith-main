import React, { useState } from 'react'
import { Handshake, Image as ImageIcon, Map, FileText } from 'lucide-react'
import { useAdminBreadcrumb } from '../../contexts/AdminContext'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import SponsorsTab from '../../components/admin/cms/SponsorsTab'
import MediaLinksTab from '../../components/admin/cms/MediaLinksTab'
import RoadmapTab from '../../components/admin/cms/RoadmapTab'
import LegalTab from '../../components/admin/cms/LegalTab'

const TABS = [
  { id: 'sponsors', label: 'Partners & Sponsors', icon: Handshake },
  { id: 'media', label: 'Media & Links Hub', icon: ImageIcon },
  { id: 'roadmap', label: 'Roadmap Editor', icon: Map },
  { id: 'legal', label: 'Legal & Policy', icon: FileText },
]

export default function ContentCMS() {
  useAdminBreadcrumb([{ label: 'Content & CMS' }])
  const [activeTab, setActiveTab] = useState('sponsors')

  return (
    <div>
      <AdminPageHeader
        title="Content & CMS"
        description="Manage the sponsors, media, roadmap, and legal content shown on the public site."
      />

      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 dark:border-[#404854] mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-[#c84c30] text-[#c84c30]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-cozy-dark dark:hover:text-cozy-light'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'sponsors' && <SponsorsTab />}
      {activeTab === 'media' && <MediaLinksTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
      {activeTab === 'legal' && <LegalTab />}
    </div>
  )
}
