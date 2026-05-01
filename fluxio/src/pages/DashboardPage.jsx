import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, BarChart2, ArrowUpRight } from 'lucide-react'

const ACCENT = '#CEFB4D'
const DARK   = '#1F1F1F'

// ── data ──────────────────────────────────────────────────────────────────────
const netWorthData = {
  Week: [
    { m: 'Mon', v: 2310 }, { m: 'Tue', v: 2342 }, { m: 'Wed', v: 2295 },
    { m: 'Thu', v: 2358 }, { m: 'Fri', v: 2371 }, { m: 'Sat', v: 2364 }, { m: 'Sun', v: 2380 },
  ],
  Month: [
    { m: 'Apr 1', v: 2180 }, { m: 'Apr 8', v: 2220 }, { m: 'Apr 15', v: 2290 },
    { m: 'Apr 22', v: 2340 }, { m: 'Apr 29', v: 2380 },
  ],
  Year: [
    { m: 'Jan', v: 1420 }, { m: 'Feb', v: 1510 }, { m: 'Mar', v: 1490 },
    { m: 'Apr', v: 1640 }, { m: 'May', v: 1720 }, { m: 'Jun', v: 1680 },
    { m: 'Jul', v: 1810 }, { m: 'Aug', v: 1890 }, { m: 'Sep', v: 1960 },
    { m: 'Oct', v: 2100 }, { m: 'Nov', v: 2200 }, { m: 'Dec', v: 2380 },
  ],
}

const allocationData = [
  { name: 'Public Equities', value: 42, color: DARK },
  { name: 'Fixed Income',    value: 24, color: '#6B7280' },
  { name: 'Cash & Equiv.',   value: 16, color: ACCENT },
  { name: 'Real Estate',     value: 11, color: '#9CA3AF' },
  { name: 'Alternatives',    value:  7, color: '#D1D5DB' },
]

const transactions = [
  { id: 1, name: 'USD → EUR Transfer',    date: 'Apr 29', amount: '-$84,200', type: 'transfer', color: '#EF4444' },
  { id: 2, name: 'Dividend — AAPL',       date: 'Apr 28', amount: '+$1,240',  type: 'income',   color: '#22C55E' },
  { id: 3, name: 'Payroll disbursement',  date: 'Apr 27', amount: '-$42,000', type: 'expense',  color: '#EF4444' },
  { id: 4, name: 'Invoice — Nexus Corp',  date: 'Apr 26', amount: '+$28,500', type: 'income',   color: '#22C55E' },
  { id: 5, name: 'FX Hedge premium',      date: 'Apr 25', amount: '-$3,800',  type: 'expense',  color: '#EF4444' },
]

const budgetItems = [
  { label: 'Infrastructure', used: 72, color: DARK },
  { label: 'Marketing',      used: 55, color: ACCENT },
  { label: 'Payroll',        used: 88, color: '#6B7280' },
  { label: 'SaaS Tools',     used: 34, color: '#9CA3AF' },
  { label: 'Facilities',     used: 61, color: DARK },
]

// ── animated value ─────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, delta, deltaPositive }) {
  const [chars, setChars] = useState(value.split(''))
  const [typing, setTyping] = useState(false)
  const [session, setSession] = useState(0)
  const ivRef = useRef(null)

  const triggerType = () => {
    clearInterval(ivRef.current)
    setChars([])
    setTyping(true)
    setSession(s => s + 1)
    let i = 0
    ivRef.current = setInterval(() => {
      i++
      setChars(value.slice(0, i).split(''))
      if (i >= value.length) { clearInterval(ivRef.current); setTyping(false) }
    }, 55)
  }

  useEffect(() => () => clearInterval(ivRef.current), [])

  return (
    <div
      onMouseEnter={triggerType}
      className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.10)] hover:border-[#1F1F1F]/[0.12] transition-all duration-200 cursor-default select-none"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="w-9 h-9 bg-[#F3F3F3] rounded-[10px] flex items-center justify-center text-[#1F1F1F]/50">
          <Icon size={17} />
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-medium font-outfit px-2 py-0.5 rounded-full ${deltaPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {deltaPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {delta}
        </span>
      </div>
      <p className="font-outfit font-black text-2xl text-[#1F1F1F] tracking-tight mb-0.5" style={{ minHeight: '2rem' }}>
        {chars.map((ch, i) => (
          <span key={`${session}-${i}`} className="char-popin inline-block">
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
        {typing && <span className="cursor-blink font-light text-[#1F1F1F]/50 inline-block ml-0.5">|</span>}
      </p>
      <p className="font-outfit text-xs text-[#1F1F1F]/40">{label}</p>
    </div>
  )
}

const PERIOD_OPTS = ['Week', 'Month', 'Year']

export default function DashboardPage() {
  const [period, setPeriod] = useState('Year')
  const [budgetVisible, setBudgetVisible] = useState(false)
  const budgetRef = useRef(null)

  useEffect(() => {
    const el = budgetRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setBudgetVisible(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">Overview</h1>
        <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Welcome back, Oleh — here's your financial snapshot.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign}   label="Total Balance"  value="$2.38M" delta="+8.4%"  deltaPositive />
        <KpiCard icon={TrendingUp}   label="Monthly Income" value="$284K"  delta="+12.1%" deltaPositive />
        <KpiCard icon={TrendingDown} label="Expenses"       value="$142K"  delta="+3.2%"  deltaPositive={false} />
        <KpiCard icon={BarChart2}    label="Savings Rate"   value="49.9%"  delta="+2.1%"  deltaPositive />
      </div>

      {/* Net Worth + Transactions row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">Net Worth Trend</h2>
              <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5">Total portfolio value over time</p>
            </div>
            <div className="flex gap-1 bg-[#F3F3F3] p-1 rounded-[8px]">
              {PERIOD_OPTS.map(o => (
                <button
                  key={o}
                  onClick={() => setPeriod(o)}
                  className={`px-3 h-7 rounded-[6px] text-xs font-medium font-outfit transition-all ${period === o ? 'bg-white text-[#1F1F1F] shadow-sm' : 'text-[#1F1F1F]/40 hover:text-[#1F1F1F]'}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={netWorthData[period]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={DARK} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={DARK} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#1F1F1F', opacity: 0.35 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#1F1F1F', opacity: 0.35 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(31,31,31,0.1)', borderRadius: 10, fontFamily: 'Outfit', fontSize: 12 }}
                formatter={v => [`$${v}K`, 'Net Worth']}
              />
              <Area type="monotone" dataKey="v" stroke={DARK} strokeWidth={2} fill="url(#wealthGrad)" dot={false} activeDot={{ r: 4, fill: ACCENT, stroke: DARK, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">Recent Transactions</h2>
            <button className="text-xs font-outfit text-[#1F1F1F]/40 hover:text-[#1F1F1F] flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="space-y-0">
            {transactions.map(t => (
              <div
                key={t.id}
                className="group flex items-center justify-between py-2.5 px-2 -mx-2 rounded-[8px] border-b border-[#1F1F1F]/[0.05] last:border-0 hover:bg-[#F3F3F3]/80 hover:border-transparent transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-8 h-8 rounded-[8px] flex-shrink-0 flex items-center justify-center text-xs group-hover:scale-110 transition-transform duration-150"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    {t.type === 'income' ? '+' : '−'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-outfit text-xs font-medium text-[#1F1F1F] truncate">{t.name}</p>
                    <p className="font-outfit text-[10px] text-[#1F1F1F]/35">{t.date}</p>
                  </div>
                </div>
                <span className="font-outfit text-xs font-semibold flex-shrink-0 ml-2 group-hover:scale-105 transition-transform duration-150" style={{ color: t.color }}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allocation + Budget row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-4">Asset Allocation</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
                  {allocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {allocationData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="font-outfit text-xs text-[#1F1F1F]/60">{d.name}</span>
                  </div>
                  <span className="font-outfit text-xs font-semibold text-[#1F1F1F]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-4">Budget vs. Actual</h2>
          <div ref={budgetRef} className="space-y-4">
            {budgetItems.map((b, i) => (
              <div key={b.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-outfit text-xs text-[#1F1F1F]/60">{b.label}</span>
                  <span className="font-outfit text-xs font-semibold text-[#1F1F1F]">{b.used}%</span>
                </div>
                <div className="h-1.5 bg-[#F3F3F3] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${budgetVisible ? b.used : 0}%`,
                      background: b.color,
                      transition: `width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 110}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
