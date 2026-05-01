import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react'

const ACCENT = '#CEFB4D'
const DARK   = '#1F1F1F'

const PERIOD_OPTS = ['1W', '1M', '3M', '1Y', 'All']

// ── Sparkline data generators ──────────────────────────────────────────────
const spark = (base, len = 7) =>
  Array.from({ length: len }, (_, i) => ({
    i,
    v: base + (Math.random() - 0.48) * base * 0.12 * (i + 1)
  }))

const assetClasses = [
  { name: 'Public Equities', value: 794200, pct: 42, change7d: +1.4, color: DARK,      spark: spark(780, 7) },
  { name: 'Fixed Income',    value: 454080, pct: 24, change7d: +0.3, color: '#6B7280', spark: spark(450, 7) },
  { name: 'Cash & Equiv.',   value: 302400, pct: 16, change7d: +0.0, color: ACCENT,    spark: spark(300, 7) },
  { name: 'Real Estate',     value: 208010, pct: 11, change7d: -0.8, color: '#9CA3AF', spark: spark(210, 7) },
  { name: 'Alternatives',    value: 132300, pct:  7, change7d: +3.1, color: '#374151', spark: spark(125, 7) },
]

const donutData = assetClasses.map(a => ({ name: a.name, value: a.pct, color: a.color }))

const roiData = [
  { m: 'Oct', roi: 4.1 }, { m: 'Nov', roi: 5.8 }, { m: 'Dec', roi: 3.2 },
  { m: 'Jan', roi: 7.4 }, { m: 'Feb', roi: 6.1 }, { m: 'Mar', roi: 8.9 }, { m: 'Apr', roi: 9.3 },
]

const pnlData = [
  { d: 'M', pnl: 1200 }, { d: 'T', pnl: -800 }, { d: 'W', pnl: 3400 },
  { d: 'T', pnl: 600  }, { d: 'F', pnl: 2100 }, { d: 'S', pnl: -400 }, { d: 'S', pnl: 1800 },
]

const watchlistBase = [
  { ticker: 'AAPL', name: 'Apple Inc.',      price: '$189.42', spark: spark(185, 7) },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: '$412.60', spark: spark(408, 7) },
  { ticker: 'BTC',  name: 'Bitcoin',         price: '$62,440', spark: spark(63000, 7) },
  { ticker: 'TSLA', name: 'Tesla Inc.',      price: '$172.10', spark: spark(166, 7) },
  { ticker: 'GLD',  name: 'SPDR Gold Shares',price: '$226.80', spark: spark(225, 7) },
]

// Per-period change data
const watchlistChanges = {
  '1W': {
    AAPL: { change: '+1.24%', positive: true  },
    MSFT: { change: '+0.87%', positive: true  },
    BTC:  { change: '-2.11%', positive: false },
    TSLA: { change: '+3.40%', positive: true  },
    GLD:  { change: '+0.52%', positive: true  },
  },
  '1M': {
    AAPL: { change: '+6.18%', positive: true  },
    MSFT: { change: '+3.42%', positive: true  },
    BTC:  { change: '+11.40%',positive: true  },
    TSLA: { change: '-4.82%', positive: false },
    GLD:  { change: '+2.14%', positive: true  },
  },
  '3M': {
    AAPL: { change: '+12.4%', positive: true  },
    MSFT: { change: '+8.73%', positive: true  },
    BTC:  { change: '+28.5%', positive: true  },
    TSLA: { change: '-11.2%', positive: false },
    GLD:  { change: '+6.84%', positive: true  },
  },
  '1Y': {
    AAPL: { change: '+18.6%', positive: true  },
    MSFT: { change: '+24.3%', positive: true  },
    BTC:  { change: '+84.2%', positive: true  },
    TSLA: { change: '-29.4%', positive: false },
    GLD:  { change: '+14.8%', positive: true  },
  },
  'All': {
    AAPL: { change: '+142.5%', positive: true },
    MSFT: { change: '+312.8%', positive: true },
    BTC:  { change: '+940.2%', positive: true },
    TSLA: { change: '+180.4%', positive: true },
    GLD:  { change: '+68.2%',  positive: true },
  },
}

// ── animated value ─────────────────────────────────────────────────────────────
function HoverValue({ value }) {
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
    <span onMouseEnter={triggerType}>
      {chars.map((ch, i) => (
        <span key={`${session}-${i}`} className="char-popin inline-block">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
      {typing && <span className="cursor-blink font-light opacity-50 inline-block ml-0.5">|</span>}
    </span>
  )
}

function MiniSparkline({ data, color, height = 36 }) {
  const vals = data.map(d => d.v)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * 60
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={60} height={height} viewBox={`0 0 60 ${height}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AssetCard({ asset }) {
  return (
    <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: asset.color }} />
          <span className="font-outfit text-xs font-semibold text-[#1F1F1F]/60">{asset.name}</span>
        </div>
        <span className={`text-xs font-outfit font-semibold px-2 py-0.5 rounded-full ${asset.change7d >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {asset.change7d >= 0 ? '+' : ''}{asset.change7d}% 7d
        </span>
      </div>
      <p className="font-outfit font-black text-xl text-[#1F1F1F] tracking-tight">${(asset.value / 1000).toFixed(0)}K</p>
      <p className="font-outfit text-xs text-[#1F1F1F]/35 mb-3">{asset.pct}% of portfolio</p>
      <MiniSparkline data={asset.spark} color={asset.change7d >= 0 ? '#22C55E' : '#EF4444'} />
    </div>
  )
}

export default function InvestmentsPage() {
  const [period, setPeriod] = useState('1W')

  const total   = assetClasses.reduce((s, a) => s + a.value, 0)
  const gain    = 69300
  const gainPct = 3.8

  const periodChanges = watchlistChanges[period]
  const watchlist = watchlistBase.map(w => ({
    ...w,
    ...periodChanges[w.ticker],
  }))

  const periodLabel = period === 'All' ? 'All-time' : period

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">Investments</h1>
        <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Portfolio performance and asset breakdown.</p>
      </div>

      {/* Performance overview bar */}
      <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-0 divide-x divide-[#1F1F1F]/[0.07]">
          {[
            { label: 'Total Portfolio',    val: `$${(total/1000).toFixed(0)}K`, sub: 'Market value',     accent: true  },
            { label: 'Total Gain',         val: `+$${(gain/1000).toFixed(1)}K`, sub: `+${gainPct}%`,     color: '#22C55E' },
            { label: 'Unrealized P/L',     val: '+$51.2K',                      sub: 'Open positions',   color: '#22C55E' },
            { label: 'Realized P/L',       val: '+$18.1K',                      sub: 'Closed positions', color: '#22C55E' },
            { label: 'Dividends',          val: '+$4.8K',                       sub: (
                <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block pulse-dot" />Live prices
                </span>
              ) },
          ].map((m, i) => (
            <div key={i} className={`px-4 py-3 ${i === 0 ? 'pl-0' : ''} ${i === 4 ? 'pr-0' : ''}`}>
              <p className="font-outfit text-[10px] text-[#1F1F1F]/35 uppercase tracking-widest mb-1">{m.label}</p>
              <p className="font-outfit font-black text-lg tracking-tight" style={m.color ? { color: m.color } : {}}>
                <HoverValue value={m.val} />
              </p>
              <div className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset class cards */}
      <div>
        <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">// Asset Classes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {assetClasses.map(a => <AssetCard key={a.name} asset={a} />)}
        </div>
      </div>

      {/* Donut + ROI/PnL row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Donut */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-4">Asset Allocation</h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0}>
                  {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">
              {assetClasses.map(a => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span className="font-outfit text-xs text-[#1F1F1F]/55">{a.name}</span>
                  </div>
                  <span className="font-outfit text-xs font-semibold text-[#1F1F1F]">{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI chart */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-4">ROI — Monthly</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={roiData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={DARK} strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(31,31,31,0.1)', borderRadius: 10, fontFamily: 'Outfit', fontSize: 12 }} formatter={v => [`${v}%`, 'ROI']} />
              <Area type="monotone" dataKey="roi" stroke={ACCENT} strokeWidth={2} fill="url(#roiGrad)" dot={false} activeDot={{ r: 4, fill: DARK }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily P&L */}
        <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F] mb-4">Daily P&L</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pnlData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={DARK} strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Outfit', fill: DARK, opacity: 0.35 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(31,31,31,0.1)', borderRadius: 10, fontFamily: 'Outfit', fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, 'P&L']} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {pnlData.map((e, i) => (
                  <Cell key={i} fill={e.pnl >= 0 ? DARK : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]/[0.07]">
          <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">Watchlist</h2>
          <div className="flex gap-1 bg-[#F3F3F3] p-1 rounded-[8px]">
            {PERIOD_OPTS.map(o => (
              <button key={o} onClick={() => setPeriod(o)}
                className={`px-2.5 h-6 rounded-[5px] text-xs font-medium font-outfit transition-all ${period === o ? 'bg-white text-[#1F1F1F] shadow-sm' : 'text-[#1F1F1F]/40 hover:text-[#1F1F1F]'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Asset', 'Price', `${periodLabel} Change`, 'Trend'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watchlist.map(w => (
                <tr key={w.ticker} className="border-b border-[#1F1F1F]/[0.04] last:border-0 hover:bg-[#F3F3F3]/50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-[8px] bg-[#F3F3F3] flex items-center justify-center font-mono text-[10px] font-bold text-[#1F1F1F]">{w.ticker.slice(0, 2)}</span>
                      <div>
                        <p className="font-outfit text-sm font-semibold text-[#1F1F1F]">{w.ticker}</p>
                        <p className="font-outfit text-[10px] text-[#1F1F1F]/35">{w.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-outfit text-sm font-semibold text-[#1F1F1F]">{w.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-outfit text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${w.positive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{w.change}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <MiniSparkline data={w.spark} color={w.positive ? '#22C55E' : '#EF4444'} height={28} />
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
