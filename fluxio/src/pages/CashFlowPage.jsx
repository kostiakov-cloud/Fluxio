import { useState, useEffect, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Search, ArrowUpDown } from 'lucide-react'

const ACCENT = '#CEFB4D'
const DARK   = '#1F1F1F'

const cashFlowData = [
  { m: 'Nov', inflow: 260, outflow: 148 },
  { m: 'Dec', inflow: 310, outflow: 172 },
  { m: 'Jan', inflow: 220, outflow: 155 },
  { m: 'Feb', inflow: 340, outflow: 180 },
  { m: 'Mar', inflow: 298, outflow: 161 },
  { m: 'Apr', inflow: 284, outflow: 142 },
]

const transactions = [
  { id: 1,  date: 'Apr 29', name: 'USD → EUR Transfer',    category: 'FX',        amount: -84200, currency: 'USD' },
  { id: 2,  date: 'Apr 28', name: 'Client Invoice #2841',  category: 'Revenue',   amount: +48000, currency: 'USD' },
  { id: 3,  date: 'Apr 27', name: 'Payroll — Apr cycle',   category: 'Payroll',   amount: -42000, currency: 'USD' },
  { id: 4,  date: 'Apr 26', name: 'Invoice — Nexus Corp',  category: 'Revenue',   amount: +28500, currency: 'USD' },
  { id: 5,  date: 'Apr 25', name: 'FX Hedge premium',      category: 'Hedging',   amount:  -3800, currency: 'USD' },
  { id: 6,  date: 'Apr 24', name: 'AWS Infrastructure',    category: 'Tech',      amount:  -9200, currency: 'USD' },
  { id: 7,  date: 'Apr 23', name: 'Advisory retainer',     category: 'Ops',       amount: -12000, currency: 'USD' },
  { id: 8,  date: 'Apr 22', name: 'Subscription renewal',  category: 'Revenue',   amount: +18400, currency: 'USD' },
  { id: 9,  date: 'Apr 21', name: 'Office lease',          category: 'Facilities',amount:  -6800, currency: 'USD' },
  { id: 10, date: 'Apr 20', name: 'Wire — Riyadh partner', category: 'FX',        amount: -31500, currency: 'USD' },
]

const CATEGORIES = ['All', 'Revenue', 'FX', 'Payroll', 'Tech', 'Ops', 'Hedging', 'Facilities']

const runwayMonths = 8.4

function KpiCard({ icon: Icon, label, value, delta, positive, accent }) {
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
      className={`rounded-[16px] p-5 border shadow-[0_4px_16px_rgba(16,24,40,0.06)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.10)] transition-all duration-200 cursor-default select-none ${accent ? 'bg-[#CEFB4D] border-transparent' : 'bg-white border-[#1F1F1F]/[0.07]'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${accent ? 'bg-[#1F1F1F]/10 text-[#1F1F1F]' : 'bg-[#F3F3F3] text-[#1F1F1F]/50'}`}>
          <Icon size={17} />
        </span>
        {delta && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium font-outfit px-2 py-0.5 rounded-full ${positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {delta}
          </span>
        )}
      </div>
      <p className="font-outfit font-black text-2xl text-[#1F1F1F] tracking-tight mb-0.5" style={{ minHeight: '2rem' }}>
        {chars.map((ch, i) => (
          <span key={`${session}-${i}`} className="char-popin inline-block">
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
        {typing && <span className="cursor-blink font-light text-[#1F1F1F]/50 inline-block ml-0.5">|</span>}
      </p>
      <p className={`font-outfit text-xs ${accent ? 'text-[#1F1F1F]/60' : 'text-[#1F1F1F]/40'}`}>{label}</p>
    </div>
  )
}

export default function CashFlowPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [sortDir,  setSortDir]  = useState('desc')
  const [runwayVisible, setRunwayVisible] = useState(false)
  const runwayRef = useRef(null)

  useEffect(() => {
    const el = runwayRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRunwayVisible(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const filtered = transactions
    .filter(t => category === 'All' || t.category === category)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'desc' ? Math.abs(b.amount) - Math.abs(a.amount) : Math.abs(a.amount) - Math.abs(b.amount))

  const netCashFlow = transactions.reduce((s, t) => s + t.amount, 0)
  const inflow  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const outflow = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const burn    = outflow / transactions.length * 30

  const fmt = (n) => {
    const abs = Math.abs(n)
    const str = abs >= 1000 ? `$${(abs / 1000).toFixed(0)}K` : `$${abs}`
    return n >= 0 ? `+${str}` : `-${str}`
  }

  const runwayDash = `${(runwayMonths / 24) * 100} 100`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">Cash Flow</h1>
        <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Income versus spending — full visibility.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp}   label="Net Cash Flow"  value={fmt(netCashFlow)} delta="+11.4%" positive accent />
        <KpiCard icon={TrendingUp}   label="Total Inflow"   value={fmt(inflow)}      delta="+12.1%" positive />
        <KpiCard icon={TrendingDown} label="Total Outflow"  value={fmt(-outflow)}    delta="+4.8%"  positive={false} />
        <KpiCard icon={TrendingDown} label="Monthly Burn"   value={`$${(burn/1000).toFixed(0)}K`} />
      </div>

      {/* Bar chart + runway row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-5">Inflow vs. Outflow</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cashFlowData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={DARK} strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(31,31,31,0.1)', borderRadius: 10, fontFamily: 'Outfit', fontSize: 12 }}
                formatter={v => [`$${v}K`]}
              />
              <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: 11 }} />
              <Bar dataKey="inflow"  name="Inflow"  fill={DARK}   radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Runway monitor */}
        <div ref={runwayRef} className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] flex flex-col">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-2">Runway Monitor</h2>
          <p className="font-outfit text-xs text-[#1F1F1F]/40 mb-5">At current burn rate</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F3F3" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" stroke={ACCENT} strokeWidth="3"
                  strokeDasharray={runwayVisible ? runwayDash : '0 100'}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-outfit font-black text-2xl text-[#1F1F1F] leading-none">{runwayMonths}</span>
                <span className="font-outfit text-[10px] text-[#1F1F1F]/40">months</span>
              </div>
            </div>
            <div className="w-full space-y-2.5">
              <div className="flex justify-between text-xs font-outfit">
                <span className="text-[#1F1F1F]/40">Monthly burn</span>
                <span className="font-semibold text-[#1F1F1F]">${(burn/1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between text-xs font-outfit">
                <span className="text-[#1F1F1F]/40">Cash reserve</span>
                <span className="font-semibold text-[#1F1F1F]">$1.24M</span>
              </div>
              <div className="flex justify-between text-xs font-outfit">
                <span className="text-[#1F1F1F]/40">vs. last month</span>
                <span className="font-semibold text-green-500">▲ +0.4mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-[#1F1F1F]/[0.07]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">Transactions</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text" placeholder="Search..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full h-8 bg-white border border-[#1F1F1F]/[0.10] rounded-[8px] pl-8 pr-3 text-xs outline-none font-outfit placeholder:text-[#1F1F1F]/35 focus:border-[#CEFB4D] shadow-[inset_0_1px_3px_rgba(16,24,40,0.05)] transition-colors"
              />
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1F1F1F]/30 pointer-events-none" />
            </div>
            {/* Category filter */}
            <div className="flex gap-1 overflow-x-auto">
              {CATEGORIES.slice(0, 5).map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2.5 h-8 rounded-[6px] text-xs font-outfit font-medium whitespace-nowrap transition-all ${category === c ? 'bg-[#1F1F1F] text-white' : 'bg-[#F3F3F3] text-[#1F1F1F]/50 hover:text-[#1F1F1F]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Date', 'Description', 'Category', 'Amount'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest">
                    {h === 'Amount' ? (
                      <button className="flex items-center gap-1 hover:text-[#1F1F1F] transition-colors outline-none"
                        onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                        {h}<ArrowUpDown size={10} />
                      </button>
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="group border-b border-[#1F1F1F]/[0.04] last:border-0 hover:bg-[#F3F3F3]/60 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-outfit text-xs text-[#1F1F1F]/40 whitespace-nowrap">{t.date}</td>
                  <td className="px-5 py-3.5 font-outfit text-sm text-[#1F1F1F] font-medium group-hover:text-[#1F1F1F]">{t.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-outfit text-xs px-2 py-0.5 rounded-full bg-[#F3F3F3] text-[#1F1F1F]/60">{t.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-outfit text-sm font-semibold ${t.amount > 0 ? 'text-green-500' : 'text-[#1F1F1F]'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
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
