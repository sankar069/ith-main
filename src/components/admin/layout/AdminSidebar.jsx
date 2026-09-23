import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, Clock } from 'lucide-react'
import { useAdmin } from '../../../contexts/AdminContext'
import { useAdminStore } from '../../../store/useAdminStore'
import { adminNavigation } from '../navigationConfig'

export default function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen, isMobile, toast } = useAdmin()
  const logout = useAdminStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Signed out of the admin console.')
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-[#1a1f26] border-r border-gray-200 dark:border-[#404854] z-40 transition-transform duration-300 flex flex-col ${
          isMobile ? (sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : 'translate-x-0 w-64'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 flex items-center gap-2 border-b border-gray-200 dark:border-[#404854]">
          <div className="w-8 h-8 rounded-lg bg-[#c84c30] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-serif font-bold text-cozy-dark dark:text-cozy-light leading-tight">Admin Console</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">InnoTech-Hub</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon
            const isSoon = item.status === 'soon'
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#c84c30] text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-5 h-5 shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold truncate">{item.label}</p>
                        {isSoon && (
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" /> Soon
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-[#404854] p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
