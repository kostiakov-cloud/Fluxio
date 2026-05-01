import { useState } from 'react'
import { DollarSign, AlertCircle, Shield, CheckCircle2, TrendingUp, RefreshCw, Mail, Users, Zap, Info } from 'lucide-react'

const ALL_NOTIFICATIONS = [
  { id:  1, Icon: DollarSign,   color: '#22C55E', title: 'Invoice paid',            body: 'Nexus Corp paid invoice #2841 — $28,500',           time: '2m ago',   date: 'Today',     unread: true,  category: 'Revenue'  },
  { id:  2, Icon: AlertCircle,  color: '#F59E0B', title: 'FX alert triggered',      body: 'EUR/USD moved 0.82% in the last 60 minutes',         time: '18m ago',  date: 'Today',     unread: true,  category: 'FX'       },
  { id:  3, Icon: CheckCircle2, color: '#6B7280', title: 'Payroll processed',       body: 'April payroll cycle completed — $42,000 disbursed',   time: '1h ago',   date: 'Today',     unread: false, category: 'Payroll'  },
  { id:  4, Icon: Shield,       color: '#6B7280', title: 'New login detected',      body: 'Chrome on MacOS · IP 172.18.0.1 · New York, US',     time: '3h ago',   date: 'Today',     unread: false, category: 'Security' },
  { id:  5, Icon: TrendingUp,   color: '#3B82F6', title: 'Portfolio up +3.8%',      body: 'AAPL and BTC positions contributed most this week',   time: '5h ago',   date: 'Today',     unread: false, category: 'Investments' },
  { id:  6, Icon: DollarSign,   color: '#22C55E', title: 'Subscription renewed',    body: 'Recurring payment from client #0088 — $18,400',       time: 'Yesterday',date: 'Yesterday', unread: false, category: 'Revenue'  },
  { id:  7, Icon: RefreshCw,    color: '#6366F1', title: 'FX hedge executed',       body: 'EUR/USD forward contract locked at 1.0842',           time: 'Yesterday',date: 'Yesterday', unread: false, category: 'FX'       },
  { id:  8, Icon: Mail,         color: '#6B7280', title: 'Monthly digest ready',    body: 'Your April financial summary is now available',       time: '2 days ago',date: 'Apr 28',   unread: false, category: 'System'   },
  { id:  9, Icon: Users,        color: '#6B7280', title: 'Team member added',       body: 'Sara Ionescu joined as Finance Analyst',              time: '3 days ago',date: 'Apr 27',   unread: false, category: 'System'   },
  { id: 10, Icon: AlertCircle,  color: '#EF4444', title: 'Balance threshold alert', body: 'EUR Operations account dropped below €500K',          time: '4 days ago',date: 'Apr 26',   unread: false, category: 'FX'       },
  { id: 11, Icon: Zap,          color: '#F59E0B', title: 'API rate limit warning',  body: "You've used 82% of your monthly API quota",          time: '5 days ago',date: 'Apr 25',   unread: false, category: 'System'   },
  { id: 12, Icon: Info,         color: '#6B7280', title: 'System maintenance',      body: 'Scheduled downtime Apr 30, 02:00–04:00 UTC',         time: '1 week ago',date: 'Apr 23',   unread: false, category: 'System'   },
]

const CATEGORIES = ['All', 'Revenue', 'FX', 'Payroll', 'Security', 'Investments', 'System']

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [readIds, setReadIds] = useState(new Set())

  const markAllRead = () => setReadIds(new Set(ALL_NOTIFICATIONS.map(n => n.id)))

  const filtered = activeTab === 'All'
    ? ALL_NOTIFICATIONS
    : ALL_NOTIFICATIONS.filter(n => n.category === activeTab)

  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = []
    acc[n.date].push(n)
    return acc
  }, {})

  const unreadCount = ALL_NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-semibold bg-[#CEFB4D] text-[#1F1F1F] px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">All your activity, alerts, and system events.</p>
        </div>
        <button
          onClick={markAllRead}
          className="h-9 px-4 rounded-[8px] border border-[#1F1F1F]/10 font-outfit text-xs font-medium text-[#1F1F1F]/50 hover:border-[#1F1F1F]/20 hover:text-[#1F1F1F] transition-all outline-none"
        >
          Mark all read
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 h-8 rounded-[8px] text-xs font-outfit font-medium whitespace-nowrap transition-all outline-none flex-shrink-0 ${
              activeTab === cat ? 'bg-[#1F1F1F] text-white' : 'bg-white text-[#1F1F1F]/50 border border-[#1F1F1F]/[0.08] hover:text-[#1F1F1F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">{date}</p>
            <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] overflow-hidden divide-y divide-[#1F1F1F]/[0.05]">
              {items.map(({ id, Icon, color, title, body, time, unread, category }) => {
                const isUnread = unread && !readIds.has(id)
                return (
                  <div
                    key={id}
                    onClick={() => setReadIds(prev => new Set([...prev, id]))}
                    className={`flex gap-4 px-5 py-4 hover:bg-[#F3F3F3]/50 transition-colors cursor-pointer ${isUnread ? 'bg-[#CEFB4D]/[0.04]' : ''}`}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}18`, color }}
                    >
                      <Icon size={15} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-outfit text-sm font-semibold text-[#1F1F1F] ${isUnread ? '' : 'opacity-70'}`}>{title}</p>
                        <span className="font-outfit text-[10px] text-[#1F1F1F]/30 bg-[#F3F3F3] px-1.5 py-0.5 rounded-full">{category}</span>
                        {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#CEFB4D] flex-shrink-0" />}
                      </div>
                      <p className="font-outfit text-xs text-[#1F1F1F]/45 leading-relaxed">{body}</p>
                    </div>
                    <span className="font-outfit text-[10px] text-[#1F1F1F]/30 whitespace-nowrap flex-shrink-0 mt-0.5">{time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-[12px] bg-[#F3F3F3] flex items-center justify-center mb-3">
              <CheckCircle2 size={20} className="text-[#1F1F1F]/20" />
            </div>
            <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">No notifications</p>
            <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-1">Nothing in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
