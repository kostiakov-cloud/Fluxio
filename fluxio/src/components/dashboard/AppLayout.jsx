import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, Activity, TrendingUp, FileText, Settings,
  Search, Bell, ChevronDown, Menu, X, Home,
  DollarSign, AlertCircle, Shield, CheckCircle2, LogOut, User as UserIcon
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home,            label: 'Home',        path: '/',              end: true },
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/app/dashboard' },
  { icon: CreditCard,      label: 'Accounts',    path: '/app/accounts' },
  { icon: Activity,        label: 'Cash Flow',   path: '/app/cash-flow' },
  { icon: TrendingUp,      label: 'Investments', path: '/app/investments' },
  { icon: FileText,        label: 'Reports',     path: '/app/reports' },
  { icon: Settings,        label: 'Settings',    path: '/app/settings' },
]

const NOTIFICATIONS = [
  { id: 1, Icon: DollarSign,   color: '#22C55E', title: 'Invoice paid',        body: 'Nexus Corp paid $28,500',          time: '2m ago',  unread: true  },
  { id: 2, Icon: AlertCircle,  color: '#F59E0B', title: 'FX alert triggered',  body: 'EUR/USD moved 0.8% in 1h',         time: '18m ago', unread: true  },
  { id: 3, Icon: CheckCircle2, color: '#6B7280', title: 'Payroll processed',   body: 'Apr cycle completed successfully',  time: '1h ago',  unread: false },
  { id: 4, Icon: Shield,       color: '#6B7280', title: 'New login detected',  body: 'Chrome on MacOS · New York',        time: '3h ago',  unread: false },
]

function Logo({ white = false }) {
  return (
    <span className={`font-outfit font-medium tracking-tight text-xl ${white ? 'text-white' : 'text-[#1F1F1F]'}`}>
      flux<span className="text-[#1F1F1F] bg-[#CEFB4D] px-1.5 rounded-[4px] ml-[3px]">io</span>
    </span>
  )
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#CEFB4D] flex items-center justify-center flex-shrink-0">
      <span className="font-outfit font-semibold text-xs text-[#1F1F1F]">OK</span>
    </div>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchVal,   setSearchVal]   = useState('')
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)

  const [mobileSheet, setMobileSheet] = useState(null) // 'notif' | 'user' | null

  const closeAll = () => { setNotifOpen(false); setUserOpen(false); setMobileSheet(null) }

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex">

      {/* ── Desktop Sidebar ────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-[#1F1F1F]/[0.07] flex-shrink-0 fixed left-0 top-0 bottom-0 z-40">
        <div className="h-16 flex items-center px-5 border-b border-[#1F1F1F]/[0.07] flex-shrink-0">
          <button onClick={() => navigate('/')} className="outline-none">
            <Logo />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest px-2 mb-2">Main</p>
          {NAV_ITEMS.map(({ icon: Icon, label, path, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 h-10 px-3 rounded-[10px] text-sm font-medium font-outfit transition-all mb-0.5 ${
                  isActive
                    ? 'bg-[#CEFB4D] text-[#1F1F1F]'
                    : 'text-[#1F1F1F]/55 hover:text-[#1F1F1F] hover:bg-[#1F1F1F]/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-[6px] flex-shrink-0 ${isActive ? 'bg-[#1F1F1F]/10' : 'group-hover:bg-[#1F1F1F]/[0.06]'}`}>
                    <Icon size={15} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 pb-5 pt-3 border-t border-[#1F1F1F]/[0.07] flex-shrink-0">
          <p className="font-outfit text-[10px] text-[#1F1F1F]/25 leading-relaxed">
            © 2026 Fluxio Technologies Ltd.<br />All rights reserved.
          </p>
        </div>
      </aside>

      {/* ── Mobile Sidebar overlay ─────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className="lg:hidden fixed left-0 top-0 bottom-0 z-[99] w-64 bg-white flex flex-col shadow-2xl"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1F1F1F]/[0.07] flex-shrink-0">
          <button onClick={() => { setSidebarOpen(false); navigate('/') }} className="outline-none">
            <Logo />
          </button>
          <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/40 hover:bg-[#1F1F1F]/[0.05] outline-none">
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, path, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 h-10 px-3 rounded-[10px] text-sm font-medium font-outfit transition-all mb-0.5 ${
                  isActive ? 'bg-[#CEFB4D] text-[#1F1F1F]' : 'text-[#1F1F1F]/55 hover:text-[#1F1F1F] hover:bg-[#1F1F1F]/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-[6px] flex-shrink-0 ${isActive ? 'bg-[#1F1F1F]/10' : ''}`}>
                    <Icon size={15} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 pb-5 pt-3 border-t border-[#1F1F1F]/[0.07] flex-shrink-0">
          <p className="font-outfit text-[10px] text-[#1F1F1F]/25 leading-relaxed">
            © 2026 Fluxio Technologies Ltd.<br />All rights reserved.
          </p>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#1F1F1F]/[0.07] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[8px] text-[#1F1F1F]/50 hover:bg-[#1F1F1F]/[0.05] outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full h-9 bg-[#F3F3F3] border border-[#1F1F1F]/[0.08] rounded-[8px] pl-9 pr-4 text-sm outline-none font-outfit placeholder:text-[#1F1F1F]/35 hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/30 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 ml-auto">

            {/* Bell + notification dropdown */}
            <div className="relative"
              onMouseEnter={() => { setNotifOpen(true); setUserOpen(false) }}
              onMouseLeave={() => setNotifOpen(false)}
            >
              <button
                className="relative w-9 h-9 flex items-center justify-center rounded-[8px] text-[#1F1F1F]/50 hover:bg-[#1F1F1F]/[0.05] outline-none transition-colors"
                onClick={() => { if (window.innerWidth < 1024) setMobileSheet('notif') }}
              >
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#CEFB4D] rounded-full" />
              </button>

              {notifOpen && (
                <div className="hidden lg:block absolute top-full right-0 pt-2 w-80 z-50">
                <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.08] shadow-[0_16px_40px_rgba(16,24,40,0.14)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F1F1F]/[0.07]">
                    <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">Notifications</p>
                    <span className="font-outfit text-[10px] font-semibold text-[#1F1F1F] bg-[#CEFB4D] px-2 py-0.5 rounded-full">2 unread</span>
                  </div>
                  <div className="divide-y divide-[#1F1F1F]/[0.05]">
                    {NOTIFICATIONS.map(({ id, Icon: NIcon, color, title, body, time, unread }) => (
                      <Link key={id} to="/app/notifications" onClick={closeAll} className={`flex gap-3 px-4 py-3 hover:bg-[#F3F3F3]/60 transition-colors ${unread ? 'bg-[#CEFB4D]/[0.04]' : ''}`}>
                        <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, color }}>
                          <NIcon size={13} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-outfit text-xs font-semibold text-[#1F1F1F] truncate">{title}</p>
                          <p className="font-outfit text-[10px] text-[#1F1F1F]/40 mt-0.5 truncate">{body}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="font-outfit text-[10px] text-[#1F1F1F]/30 whitespace-nowrap">{time}</span>
                          {unread && <span className="w-1.5 h-1.5 rounded-full bg-[#CEFB4D]" />}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#1F1F1F]/[0.07]">
                    <Link
                      to="/app/notifications"
                      onClick={closeAll}
                      className="w-full h-9 rounded-[8px] bg-[#F3F3F3] font-outfit text-xs font-semibold text-[#1F1F1F]/60 hover:bg-[#1F1F1F] hover:text-white transition-all flex items-center justify-center"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
                </div>
              )}
            </div>

            {/* User avatar + dropdown */}
            <div className="relative"
              onMouseEnter={() => { setUserOpen(true); setNotifOpen(false) }}
              onMouseLeave={() => setUserOpen(false)}
            >
              <div
                className="flex items-center gap-2 cursor-default hover:bg-[#1F1F1F]/[0.04] rounded-[8px] px-2 py-1.5 transition-colors"
                onClick={() => { if (window.innerWidth < 1024) setMobileSheet('user') }}
              >
                <UserAvatar />
                <span className="hidden sm:block font-outfit text-sm font-medium text-[#1F1F1F]">Oleh K.</span>
                <ChevronDown size={13} className={`text-[#1F1F1F]/30 transition-transform duration-200 ${userOpen ? 'rotate-180' : ''}`} />
              </div>

              {userOpen && (
                <div className="hidden lg:block absolute top-full right-0 pt-2 w-52 z-50">
                <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.08] shadow-[0_16px_40px_rgba(16,24,40,0.14)] p-1.5">
                  <div className="px-3 py-2.5 mb-1">
                    <p className="font-outfit font-semibold text-xs text-[#1F1F1F]">Oleh Kostiakov</p>
                    <p className="font-outfit text-[10px] text-[#1F1F1F]/40 mt-0.5">CFO · Ledgerly</p>
                  </div>
                  <div className="border-t border-[#1F1F1F]/[0.07] pt-1">
                    {[
                      { Icon: UserIcon, label: 'Profile',  action: () => { closeAll(); navigate('/app/settings?tab=profile') } },
                      { Icon: Settings, label: 'Settings', action: () => { closeAll(); navigate('/app/settings') } },
                    ].map(({ Icon: ItemIcon, label, action }) => (
                      <button key={label} onClick={action}
                        className="w-full flex items-center gap-2.5 h-9 px-3 rounded-[8px] font-outfit text-sm text-[#1F1F1F]/60 hover:bg-[#F3F3F3] hover:text-[#1F1F1F] transition-all text-left outline-none">
                        <ItemIcon size={14} />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#1F1F1F]/[0.07] mt-1 pt-1">
                    <button
                      onClick={() => { closeAll(); navigate('/') }}
                      className="w-full flex items-center gap-2.5 h-9 px-3 rounded-[8px] font-outfit text-sm text-red-500 hover:bg-red-50 transition-all text-left outline-none"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile right sidesheets ─────────────────────────── */}
      {/* Shared backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileSheet(null)}
      />

      {/* Notifications sidesheet */}
      <div
        className="lg:hidden fixed right-0 top-0 bottom-0 z-[99] w-80 bg-white flex flex-col shadow-2xl"
        style={{ transform: mobileSheet === 'notif' ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1F1F1F]/[0.07] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">Notifications</p>
            <span className="font-outfit text-[10px] font-semibold text-[#1F1F1F] bg-[#CEFB4D] px-2 py-0.5 rounded-full">2 unread</span>
          </div>
          <button onClick={() => setMobileSheet(null)} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/40 hover:bg-[#1F1F1F]/[0.05] outline-none">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#1F1F1F]/[0.05]">
          {NOTIFICATIONS.map(({ id, Icon: NIcon, color, title, body, time, unread }) => (
            <Link
              key={id}
              to="/app/notifications"
              onClick={() => setMobileSheet(null)}
              className={`flex gap-3 px-5 py-4 hover:bg-[#F3F3F3]/60 transition-colors ${unread ? 'bg-[#CEFB4D]/[0.04]' : ''}`}
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, color }}>
                <NIcon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-outfit text-sm font-semibold text-[#1F1F1F] truncate">{title}</p>
                <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5 truncate">{body}</p>
                <p className="font-outfit text-[10px] text-[#1F1F1F]/30 mt-1">{time}</p>
              </div>
              {unread && <span className="w-1.5 h-1.5 rounded-full bg-[#CEFB4D] flex-shrink-0 mt-1.5" />}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-[#1F1F1F]/[0.07] flex-shrink-0">
          <Link
            to="/app/notifications"
            onClick={() => setMobileSheet(null)}
            className="w-full h-10 rounded-[8px] bg-[#F3F3F3] font-outfit text-xs font-semibold text-[#1F1F1F]/60 hover:bg-[#1F1F1F] hover:text-white transition-all flex items-center justify-center"
          >
            View All Notifications
          </Link>
        </div>
      </div>

      {/* User sidesheet */}
      <div
        className="lg:hidden fixed right-0 top-0 bottom-0 z-[99] w-72 bg-white flex flex-col shadow-2xl"
        style={{ transform: mobileSheet === 'user' ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1F1F1F]/[0.07] flex-shrink-0">
          <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">Account</p>
          <button onClick={() => setMobileSheet(null)} className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/40 hover:bg-[#1F1F1F]/[0.05] outline-none">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 border-b border-[#1F1F1F]/[0.07] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#CEFB4D] flex items-center justify-center flex-shrink-0">
              <span className="font-outfit font-semibold text-sm text-[#1F1F1F]">OK</span>
            </div>
            <div>
              <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">Oleh Kostiakov</p>
              <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5">CFO · Ledgerly</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-3">
          {[
            { Icon: UserIcon, label: 'Profile',  action: () => { setMobileSheet(null); navigate('/app/settings?tab=profile') } },
            { Icon: Settings, label: 'Settings', action: () => { setMobileSheet(null); navigate('/app/settings') } },
          ].map(({ Icon: ItemIcon, label, action }) => (
            <button key={label} onClick={action}
              className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] font-outfit text-sm text-[#1F1F1F]/60 hover:bg-[#F3F3F3] hover:text-[#1F1F1F] transition-all text-left outline-none">
              <span className="w-8 h-8 flex items-center justify-center rounded-full">
                <ItemIcon size={15} />
              </span>
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 pt-3 border-t border-[#1F1F1F]/[0.07] flex-shrink-0">
          <button
            onClick={() => { setMobileSheet(null); navigate('/') }}
            className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] font-outfit text-sm text-red-500 hover:bg-red-50 transition-all text-left outline-none"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full">
              <LogOut size={15} />
            </span>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
