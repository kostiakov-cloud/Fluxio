import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, Plus, RefreshCw, MoreHorizontal, Landmark, Bitcoin, Wallet } from 'lucide-react'

const ACCENT = '#CEFB4D'
const DARK   = '#1F1F1F'

const accounts = [
  {
    id: 1, type: 'bank', provider: 'Citibank N.A.',
    label: 'Corporate Checking', masked: '•••• 4821',
    balance: '$1,240,000', currency: 'USD', change: '+2.4%', positive: true,
    color: '#2563EB',
  },
  {
    id: 2, type: 'bank', provider: 'Raiffeisen Bank',
    label: 'EUR Operations', masked: '•••• 0033',
    balance: '€480,200', currency: 'EUR', change: '+0.8%', positive: true,
    color: '#FBBF24',
  },
  {
    id: 3, type: 'bank', provider: 'HSBC Hong Kong',
    label: 'APAC Treasury', masked: '•••• 7714',
    balance: 'HK$2,190,000', currency: 'HKD', change: '-0.3%', positive: false,
    color: '#EF4444',
  },
  {
    id: 4, type: 'bank', provider: 'Deutsche Bank AG',
    label: 'EU Reserve Account', masked: '•••• 2291',
    balance: '€320,500', currency: 'EUR', change: '+1.1%', positive: true,
    color: '#0EA5E9',
  },
  {
    id: 5, type: 'crypto', provider: 'Fireblocks Custody',
    label: 'Digital Asset Reserve', masked: '0x4a…b9c2',
    balance: '$84,300', currency: 'Multi', change: '+14.2%', positive: true,
    color: '#8B5CF6',
  },
  {
    id: 6, type: 'crypto', provider: 'Coinbase Prime',
    label: 'Settlement Wallet', masked: '3FZb…K1xq',
    balance: '$32,100', currency: 'USDC', change: '+0.01%', positive: true,
    color: '#1D4ED8',
  },
  {
    id: 7, type: 'crypto', provider: 'Ledger Hardware',
    label: 'Cold Storage Vault', masked: 'bc1p…3f9x',
    balance: '$148,400', currency: 'BTC', change: '-2.1%', positive: false,
    color: '#6366F1',
  },
  {
    id: 8, type: 'crypto', provider: 'Kraken Pro',
    label: 'Active Trading', masked: '7RdQ…Pm4k',
    balance: '$21,600', currency: 'Multi', change: '+5.8%', positive: true,
    color: '#7C3AED',
  },
  {
    id: 9, type: 'cash', provider: 'Internal — HQ',
    label: 'Petty Cash Pool', masked: 'MDL / USD',
    balance: '$12,400', currency: 'Mixed', change: '0.0%', positive: true,
    color: '#10B981',
  },
  {
    id: 10, type: 'cash', provider: 'London Office',
    label: 'GBP Operations', masked: 'GBP / EUR',
    balance: '£8,200', currency: 'GBP', change: '+0.4%', positive: true,
    color: '#059669',
  },
  {
    id: 11, type: 'cash', provider: 'Singapore Branch',
    label: 'APAC Petty Cash', masked: 'SGD / HKD',
    balance: 'S$14,800', currency: 'SGD', change: '-0.1%', positive: false,
    color: '#34D399',
  },
  {
    id: 12, type: 'cash', provider: 'Dubai Reserve',
    label: 'MENA Cash Buffer', masked: 'AED / USD',
    balance: 'AED 28,000', currency: 'AED', change: '+0.2%', positive: true,
    color: '#6EE7B7',
  },
]

// ── animated value ─────────────────────────────────────────────────────────────
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
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
        {typing && <span className="cursor-blink font-light text-[#1F1F1F]/50 inline-block ml-0.5">|</span>}
      </p>
      <p className={`font-outfit text-xs ${accent ? 'text-[#1F1F1F]/60' : 'text-[#1F1F1F]/40'}`}>{label}</p>
    </div>
  )
}

const TYPE_ICON = { bank: Landmark, crypto: Bitcoin, cash: Wallet }

function AccountCard({ account, index }) {
  const Icon = TYPE_ICON[account.type]
  return (
    <div
      className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(16,24,40,0.13)] hover:border-[#1F1F1F]/[0.15] transition-all duration-200 cursor-pointer"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 55}ms both` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ background: `${account.color}15`, color: account.color }}
          >
            <Icon size={18} />
          </span>
          <div>
            <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">{account.provider}</p>
            <p className="font-outfit text-xs text-[#1F1F1F]/40">{account.masked}</p>
          </div>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/30 hover:bg-[#1F1F1F]/[0.05] hover:text-[#1F1F1F] transition-colors outline-none">
          <MoreHorizontal size={14} />
        </button>
      </div>
      <p className="font-outfit text-xs text-[#1F1F1F]/35 mb-1">{account.label}</p>
      <p className="font-outfit font-black text-xl text-[#1F1F1F] tracking-tight">{account.balance}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1F1F1F]/[0.06]">
        <span className="font-outfit text-xs text-[#1F1F1F]/30">{account.currency}</span>
        <span className={`font-outfit text-xs font-semibold ${account.positive ? 'text-green-500' : 'text-red-500'}`}>
          {account.change}
        </span>
      </div>
    </div>
  )
}

export default function AccountsPage() {
  const [showModal, setShowModal] = useState(false)
  const banks  = accounts.filter(a => a.type === 'bank')
  const crypto = accounts.filter(a => a.type === 'crypto')
  const cash   = accounts.filter(a => a.type === 'cash')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">Accounts</h1>
          <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Manage all your connected financial sources.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 w-9 flex items-center justify-center rounded-[8px] border border-[#1F1F1F]/10 text-[#1F1F1F]/40 hover:text-[#1F1F1F] hover:border-[#1F1F1F]/20 transition-colors outline-none">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            title="Add Account"
            className="btn-magnetic group h-9 w-9 rounded-[8px] bg-[#1F1F1F] text-white flex items-center justify-center outline-none border-0"
          >
            <span className="btn-slide bg-[#CEFB4D]" />
            <span className="relative z-10 flex items-center justify-center transition-colors duration-300 group-hover:text-[#1F1F1F]">
              <Plus size={16} />
            </span>
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp}   label="Total Assets"       value="$2.14M" delta="+6.2%"  positive />
        <KpiCard icon={TrendingDown} label="Total Liabilities"  value="$280K"  delta="-1.4%"  positive={false} />
        <KpiCard icon={TrendingUp}   label="Net Position"       value="$1.86M" delta="+8.1%"  positive accent />
        <KpiCard icon={Landmark}     label="Connected Accounts" value="12" />
      </div>

      {/* Bank accounts */}
      <div>
        <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">// Bank Accounts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {banks.map((a, i) => <AccountCard key={a.id} account={a} index={i} />)}
        </div>
      </div>

      {/* Crypto wallets */}
      <div>
        <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">// Crypto Wallets</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {crypto.map((a, i) => <AccountCard key={a.id} account={a} index={i} />)}
        </div>
      </div>

      {/* Cash */}
      <div>
        <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">// Cash</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cash.map((a, i) => <AccountCard key={a.id} account={a} index={i} />)}
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-[20px] p-7 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-outfit font-semibold text-[#1F1F1F] text-lg mb-1">Link New Account</h2>
            <p className="font-outfit text-sm text-[#1F1F1F]/40 mb-6">Connect a bank, wallet, or cash account.</p>
            <div className="space-y-3">
              {['Bank Account', 'Crypto Wallet', 'Cash Position'].map(opt => (
                <button key={opt} className="w-full flex items-center gap-3 h-12 px-4 rounded-[10px] border border-[#1F1F1F]/10 text-[#1F1F1F]/70 font-outfit text-sm hover:border-[#CEFB4D] hover:text-[#1F1F1F] hover:bg-[#CEFB4D]/10 transition-all text-left">
                  {opt}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className="mt-5 w-full h-10 rounded-[8px] border border-[#1F1F1F]/10 font-outfit text-sm text-[#1F1F1F]/50 hover:border-[#1F1F1F]/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
