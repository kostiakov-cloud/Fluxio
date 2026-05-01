import { useState } from 'react'
import {
  User, Building2, Bell, Puzzle, Key, CreditCard, Shield,
  Camera, Trash2, Save, X, Copy, Check, Plus, Eye, EyeOff,
  Download, LogOut, Smartphone, Monitor, Globe, ExternalLink
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'profile',       icon: User,      label: 'Profile' },
  { id: 'workspace',     icon: Building2, label: 'Workspace' },
  { id: 'notifications', icon: Bell,      label: 'Notifications' },
  { id: 'integrations',  icon: Puzzle,    label: 'Integrations' },
  { id: 'api',           icon: Key,       label: 'API & Keys' },
  { id: 'billing',       icon: CreditCard,label: 'Billing' },
  { id: 'security',      icon: Shield,    label: 'Security' },
]

const CURRENCIES   = ['USD – US Dollar', 'EUR – Euro', 'GBP – British Pound', 'MDL – Moldovan Leu']
const DATE_FORMATS = ['MMM D, YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const TIMEZONES    = ['UTC-8 Pacific Time', 'UTC-5 Eastern Time', 'UTC+0 London', 'UTC+2 Eastern Europe', 'UTC+8 Asia/Shanghai']
const PERIODS      = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year']

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm font-outfit text-[#1F1F1F] outline-none bg-white hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder, readOnly }) {
  return (
    <div>
      <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-11 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm font-outfit text-[#1F1F1F] outline-none placeholder:text-[#1F1F1F]/30 transition-colors ${readOnly ? 'bg-[#F3F3F3] cursor-default' : 'hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D]'}`}
      />
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full flex-shrink-0 outline-none transition-colors duration-200 ${checked ? 'bg-[#1F1F1F]' : 'bg-[#D1D5DB]'}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200 ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`}
      />
    </button>
  )
}

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-[16px] p-6 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
      {(title || description) && (
        <div className="mb-5">
          {title && <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">{title}</h2>}
          {description && <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1F1F1F]/[0.06] last:border-0">
      <div>
        <p className="font-outfit text-sm text-[#1F1F1F]/80">{label}</p>
        {desc && <p className="font-outfit text-xs text-[#1F1F1F]/35 mt-0.5">{desc}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({ fullName: 'Oleh Kostiakov', jobTitle: 'Chief Financial Officer', email: 'oleh@ledgerly.finance', phone: '' })
  const [prefs, setPrefs] = useState({ currency: 'USD – US Dollar', dateFormat: 'MMM D, YYYY', timezone: 'UTC+2 Eastern Europe', defaultPeriod: 'Last 30 days' })
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2400) }

  return (
    <>
      <SectionCard title="Public Profile">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#1F1F1F]/[0.07]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#CEFB4D] flex items-center justify-center flex-shrink-0">
              <span className="font-outfit font-black text-2xl text-[#1F1F1F]">OK</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[#1F1F1F]/10 rounded-full flex items-center justify-center text-[#1F1F1F]/50 hover:text-[#1F1F1F] hover:bg-[#CEFB4D] transition-all shadow-sm outline-none">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">{form.fullName}</p>
            <p className="font-outfit text-xs text-[#1F1F1F]/40 mb-3">{form.email}</p>
            <div className="flex gap-2">
              <button className="h-8 px-3 rounded-[6px] border border-[#1F1F1F]/10 font-outfit text-xs text-[#1F1F1F]/60 hover:border-[#CEFB4D] hover:text-[#1F1F1F] transition-all flex items-center gap-1.5 outline-none">
                <Camera size={11} />Upload photo
              </button>
              <button className="h-8 px-3 rounded-[6px] border border-[#1F1F1F]/10 font-outfit text-xs text-[#1F1F1F]/40 hover:border-red-200 hover:text-red-500 transition-all flex items-center gap-1.5 outline-none">
                <Trash2 size={11} />Remove
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name"  value={form.fullName}  onChange={v => setForm({ ...form, fullName: v })} placeholder="Your full name" />
          <InputField label="Job Title"  value={form.jobTitle}  onChange={v => setForm({ ...form, jobTitle: v })} placeholder="e.g. CFO" />
          <InputField label="Email"      value={form.email}     onChange={v => setForm({ ...form, email: v })}    type="email" placeholder="you@company.com" />
          <InputField label="Phone"      value={form.phone}     onChange={v => setForm({ ...form, phone: v })}    type="tel"   placeholder="+1 (000) 000-0000" />
        </div>
      </SectionCard>

      <SectionCard title="Preferences">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Currency"       value={prefs.currency}      options={CURRENCIES}   onChange={v => setPrefs({ ...prefs, currency: v })} />
          <SelectField label="Date Format"    value={prefs.dateFormat}    options={DATE_FORMATS} onChange={v => setPrefs({ ...prefs, dateFormat: v })} />
          <SelectField label="Timezone"       value={prefs.timezone}      options={TIMEZONES}    onChange={v => setPrefs({ ...prefs, timezone: v })} />
          <SelectField label="Default Period" value={prefs.defaultPeriod} options={PERIODS}      onChange={v => setPrefs({ ...prefs, defaultPeriod: v })} />
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-3">
        <button className="h-10 px-5 rounded-[8px] border border-[#1F1F1F]/10 font-outfit text-sm text-[#1F1F1F]/50 hover:border-[#1F1F1F]/20 hover:text-[#1F1F1F] transition-all outline-none flex items-center gap-2">
          <X size={13} />Cancel
        </button>
        <button onClick={handleSave} className="btn-magnetic group h-10 px-6 rounded-[8px] bg-[#1F1F1F] text-white font-semibold text-sm flex items-center gap-2 outline-none border-0">
          <span className="btn-slide bg-[#CEFB4D]" />
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#1F1F1F]">
            <Save size={13} />{saved ? 'Saved!' : 'Save Profile'}
          </span>
        </button>
      </div>
    </>
  )
}

// ── Workspace tab ─────────────────────────────────────────────────────────────
function WorkspaceTab() {
  const [ws, setWs] = useState({ name: 'Ledgerly Finance', slug: 'ledgerly', timezone: 'UTC+2 Eastern Europe' })
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2400) }

  const members = [
    { name: 'Oleh Kostiakov',  role: 'Owner',   email: 'oleh@ledgerly.finance',    avatar: 'OK', color: '#CEFB4D' },
    { name: 'Sara Ionescu',    role: 'Admin',   email: 'sara@ledgerly.finance',    avatar: 'SI', color: '#A5F3FC' },
    { name: 'David Park',      role: 'Member',  email: 'david@ledgerly.finance',   avatar: 'DP', color: '#FCA5A5' },
    { name: 'Mihai Grosu',     role: 'Member',  email: 'mihai@ledgerly.finance',   avatar: 'MG', color: '#C4B5FD' },
  ]

  return (
    <>
      <SectionCard title="Workspace Info" description="Customize your workspace name, URL, and timezone.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Workspace Name" value={ws.name} onChange={v => setWs({ ...ws, name: v })} placeholder="e.g. Acme Corp" />
          <div>
            <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">Custom URL</label>
            <div className="flex h-11 border border-[#1F1F1F]/10 rounded-[8px] overflow-hidden hover:border-[#CEFB4D]/60 focus-within:border-[#CEFB4D] transition-colors">
              <span className="flex items-center px-3 bg-[#F3F3F3] text-xs font-outfit text-[#1F1F1F]/40 border-r border-[#1F1F1F]/10 whitespace-nowrap">app.fluxio.io/</span>
              <input type="text" value={ws.slug} onChange={e => setWs({ ...ws, slug: e.target.value })}
                className="flex-1 px-3 text-sm font-outfit text-[#1F1F1F] outline-none bg-white" />
            </div>
          </div>
          <SelectField label="Default Timezone" value={ws.timezone} options={TIMEZONES} onChange={v => setWs({ ...ws, timezone: v })} />
          <div>
            <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">Workspace Logo</label>
            <button className="h-11 w-full border border-dashed border-[#1F1F1F]/15 rounded-[8px] flex items-center justify-center gap-2 font-outfit text-xs text-[#1F1F1F]/40 hover:border-[#CEFB4D] hover:text-[#1F1F1F] transition-all">
              <Camera size={13} />Upload logo
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Team Members" description="Manage who has access to this workspace.">
        <div className="space-y-1 mb-4">
          {members.map(m => (
            <div key={m.email} className="flex items-center gap-3 py-2.5 px-3 rounded-[10px] hover:bg-[#F3F3F3]/60 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold font-outfit text-[#1F1F1F]" style={{ background: m.color }}>
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-outfit text-sm font-medium text-[#1F1F1F]">{m.name}</p>
                <p className="font-outfit text-xs text-[#1F1F1F]/40">{m.email}</p>
              </div>
              <span className={`font-outfit text-xs px-2 py-0.5 rounded-full ${m.role === 'Owner' ? 'bg-[#CEFB4D]/30 text-[#1F1F1F]' : 'bg-[#F3F3F3] text-[#1F1F1F]/50'}`}>{m.role}</span>
              {m.role !== 'Owner' && (
                <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/20 hover:text-red-500 hover:bg-red-50 transition-all outline-none">
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="h-9 px-4 rounded-[8px] border border-dashed border-[#1F1F1F]/15 font-outfit text-xs text-[#1F1F1F]/50 hover:border-[#1F1F1F]/30 hover:text-[#1F1F1F] transition-all flex items-center gap-2 outline-none">
          <Plus size={13} />Invite member
        </button>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <button onClick={handleSave} className="btn-magnetic group h-10 px-6 rounded-[8px] bg-[#1F1F1F] text-white font-semibold text-sm flex items-center gap-2 outline-none border-0">
          <span className="btn-slide bg-[#CEFB4D]" />
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#1F1F1F]">
            <Save size={13} />{saved ? 'Saved!' : 'Save Changes'}
          </span>
        </button>
      </div>

      <SectionCard title="Danger Zone" description="Irreversible actions — proceed with caution.">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-outfit text-sm font-semibold text-[#1F1F1F]">Delete Workspace</p>
            <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5">Permanently delete this workspace and all its data.</p>
          </div>
          <button className="h-9 px-4 rounded-[8px] border border-red-200 font-outfit text-xs font-semibold text-red-500 hover:bg-red-50 transition-all outline-none flex items-center gap-1.5">
            <Trash2 size={12} />Delete workspace
          </button>
        </div>
      </SectionCard>
    </>
  )
}

// ── Notifications tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const notifCategories = ['Invoice paid', 'Payroll processed', 'FX alerts', 'System updates', 'Marketing & news']
  const [email, setEmail]   = useState({ 'Invoice paid': true,  'Payroll processed': true,  'FX alerts': true,  'System updates': true,  'Marketing & news': false })
  const [push,  setPush]    = useState({ 'Invoice paid': true,  'Payroll processed': false, 'FX alerts': true,  'System updates': false, 'Marketing & news': false })
  const [inapp, setInapp]   = useState({ 'Invoice paid': true,  'Payroll processed': true,  'FX alerts': true,  'System updates': true,  'Marketing & news': true  })
  const [digest, setDigest] = useState('Weekly')
  const [alertThreshold, setAlertThreshold] = useState('500000')

  return (
    <>
      <SectionCard title="Email Notifications" description="Choose which events trigger email alerts.">
        {notifCategories.map(cat => (
          <ToggleRow key={cat} label={cat} checked={email[cat]} onChange={v => setEmail({ ...email, [cat]: v })} />
        ))}
      </SectionCard>

      <SectionCard title="Push Notifications" description="Mobile and desktop browser push alerts.">
        {notifCategories.map(cat => (
          <ToggleRow key={cat} label={cat} checked={push[cat]} onChange={v => setPush({ ...push, [cat]: v })} />
        ))}
      </SectionCard>

      <SectionCard title="In-App Notifications" description="Notifications shown inside the dashboard.">
        {notifCategories.map(cat => (
          <ToggleRow key={cat} label={cat} checked={inapp[cat]} onChange={v => setInapp({ ...inapp, [cat]: v })} />
        ))}
      </SectionCard>

      <SectionCard title="Alert Rules" description="Trigger alerts based on custom thresholds.">
        <div className="space-y-4">
          <div>
            <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">Balance drop alert (USD)</label>
            <div className="flex h-11 border border-[#1F1F1F]/10 rounded-[8px] overflow-hidden hover:border-[#CEFB4D]/60 focus-within:border-[#CEFB4D] transition-colors">
              <span className="flex items-center px-3 bg-[#F3F3F3] text-xs font-outfit text-[#1F1F1F]/40 border-r border-[#1F1F1F]/10">$</span>
              <input type="number" value={alertThreshold} onChange={e => setAlertThreshold(e.target.value)}
                className="flex-1 px-3 text-sm font-outfit text-[#1F1F1F] outline-none bg-white" />
            </div>
            <p className="font-outfit text-xs text-[#1F1F1F]/35 mt-1.5">Alert when any account drops below this amount.</p>
          </div>
          <ToggleRow label="FX volatility spike (±1%)" desc="Alert when a currency pair moves more than 1% in 1 hour" checked={true} onChange={() => {}} />
          <ToggleRow label="Unusual transaction size" desc="Alert when a single transaction exceeds $50,000" checked={false} onChange={() => {}} />
        </div>
      </SectionCard>

      <SectionCard title="Digest" description="Summary emails delivered on a schedule.">
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly', 'Never'].map(opt => (
            <button key={opt} onClick={() => setDigest(opt)}
              className={`h-9 px-4 rounded-[8px] font-outfit text-xs font-medium transition-all outline-none ${digest === opt ? 'bg-[#1F1F1F] text-white' : 'bg-[#F3F3F3] text-[#1F1F1F]/50 hover:text-[#1F1F1F]'}`}>
              {opt}
            </button>
          ))}
        </div>
      </SectionCard>
    </>
  )
}

// ── Integrations tab ──────────────────────────────────────────────────────────
function IntegrationsTab() {
  const [connected, setConnected] = useState(new Set(['Slack', 'Plaid']))

  const toggle = (name) => setConnected(prev => {
    const next = new Set(prev)
    next.has(name) ? next.delete(name) : next.add(name)
    return next
  })

  const services = [
    { name: 'Slack',         desc: 'Team alerts & notifications',      color: '#4A154B', bg: '#4A154B18', abbr: 'SL' },
    { name: 'GitHub',        desc: 'Link commits to financial events',  color: '#24292E', bg: '#24292E18', abbr: 'GH' },
    { name: 'Discord',       desc: 'Community & webhook alerts',        color: '#5865F2', bg: '#5865F218', abbr: 'DC' },
    { name: 'Google Drive',  desc: 'Auto-save reports to Drive',        color: '#4285F4', bg: '#4285F418', abbr: 'GD' },
  ]
  const banking = [
    { name: 'Plaid',         desc: 'Bank account data sync',            color: '#00B28B', bg: '#00B28B18', abbr: 'PL' },
    { name: 'Stripe',        desc: 'Revenue & payment processing',      color: '#635BFF', bg: '#635BFF18', abbr: 'ST' },
    { name: 'Brex',          desc: 'Corporate cards & spend',           color: '#F16522', bg: '#F1652218', abbr: 'BX' },
    { name: 'Fidelity',      desc: 'Investment account sync',           color: '#157A3C', bg: '#157A3C18', abbr: 'FI' },
  ]

  const IntegrationCard = ({ name, desc, color, bg, abbr }) => (
    <div className="flex items-center gap-4 p-4 rounded-[12px] border border-[#1F1F1F]/[0.07] hover:border-[#1F1F1F]/[0.14] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] transition-all duration-200">
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 font-outfit font-bold text-xs" style={{ background: bg, color }}>
        {abbr}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-outfit text-sm font-semibold text-[#1F1F1F]">{name}</p>
        <p className="font-outfit text-xs text-[#1F1F1F]/40 truncate">{desc}</p>
      </div>
      <button
        onClick={() => toggle(name)}
        className={`h-8 px-3 rounded-[8px] font-outfit text-xs font-semibold flex-shrink-0 transition-all outline-none ${
          connected.has(name)
            ? 'bg-[#F3F3F3] text-[#1F1F1F]/50 hover:bg-red-50 hover:text-red-500'
            : 'bg-[#1F1F1F] text-white hover:bg-[#CEFB4D] hover:text-[#1F1F1F]'
        }`}
      >
        {connected.has(name) ? 'Connected' : 'Install'}
      </button>
    </div>
  )

  return (
    <>
      <SectionCard title="Services" description="Connect productivity and developer tools.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map(s => <IntegrationCard key={s.name} {...s} />)}
        </div>
      </SectionCard>
      <SectionCard title="Banking & Finance" description="Sync financial data from your institutions.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {banking.map(s => <IntegrationCard key={s.name} {...s} />)}
        </div>
      </SectionCard>
    </>
  )
}

// ── API & Keys tab ────────────────────────────────────────────────────────────
function ApiTab() {
  const [copied, setCopied] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const keys = [
    { id: 1, name: 'Production API',    key: 'flx_live_••••••••••••••••••3f9x', created: 'Jan 15, 2026', scope: 'Read + Write' },
    { id: 2, name: 'Analytics Webhook', key: 'flx_live_••••••••••••••••••b2c1', created: 'Mar 02, 2026', scope: 'Read only'   },
    { id: 3, name: 'CI / Testing',      key: 'flx_test_••••••••••••••••••a7d4', created: 'Apr 10, 2026', scope: 'Sandbox'     },
  ]

  const copy = (id) => {
    navigator.clipboard.writeText('(key value)')
    setCopied(id)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <>
      <SectionCard title="API Keys" description="Manage authentication tokens for the Fluxio API.">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Name', 'Key', 'Scope', 'Created', ''].map(h => (
                  <th key={h} className="text-left pb-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id} className="border-b border-[#1F1F1F]/[0.05] last:border-0">
                  <td className="py-3.5 pr-4 font-outfit text-sm font-semibold text-[#1F1F1F]">{k.name}</td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-[#1F1F1F]/50 whitespace-nowrap">{k.key}</td>
                  <td className="py-3.5 pr-4"><span className="font-outfit text-xs px-2 py-0.5 rounded-full bg-[#F3F3F3] text-[#1F1F1F]/60">{k.scope}</span></td>
                  <td className="py-3.5 pr-4 font-outfit text-xs text-[#1F1F1F]/40 whitespace-nowrap">{k.created}</td>
                  <td className="py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => copy(k.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/30 hover:text-[#1F1F1F] hover:bg-[#F3F3F3] transition-all outline-none">
                        {copied === k.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/30 hover:text-red-500 hover:bg-red-50 transition-all outline-none">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-5 border-t border-[#1F1F1F]/[0.07]">
          {!showCreate ? (
            <button onClick={() => setShowCreate(true)} className="h-9 px-4 rounded-[8px] bg-[#1F1F1F] text-white font-outfit text-xs font-semibold flex items-center gap-2 hover:bg-[#CEFB4D] hover:text-[#1F1F1F] transition-all outline-none">
              <Plus size={13} />Create New Key
            </button>
          ) : (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <InputField label="Key Name" value={newKeyName} onChange={setNewKeyName} placeholder="e.g. Mobile App" />
              </div>
              <button onClick={() => setShowCreate(false)} className="h-11 px-4 rounded-[8px] bg-[#1F1F1F] text-white font-outfit text-xs font-semibold hover:bg-[#CEFB4D] hover:text-[#1F1F1F] transition-all outline-none">
                Generate
              </button>
              <button onClick={() => setShowCreate(false)} className="h-11 w-11 flex items-center justify-center rounded-[8px] border border-[#1F1F1F]/10 text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-all outline-none">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="API Documentation">
        <a
          href="#"
          className="flex items-center gap-3 p-4 rounded-[10px] border border-[#1F1F1F]/[0.07] hover:border-[#CEFB4D] hover:bg-[#CEFB4D]/[0.04] transition-all group"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[#F3F3F3] flex items-center justify-center flex-shrink-0">
            <Globe size={15} className="text-[#1F1F1F]/50" />
          </div>
          <div className="flex-1">
            <p className="font-outfit text-sm font-semibold text-[#1F1F1F]">Fluxio API Reference</p>
            <p className="font-outfit text-xs text-[#1F1F1F]/40">REST + WebSocket endpoints, authentication guides, SDKs</p>
          </div>
          <ExternalLink size={14} className="text-[#1F1F1F]/30 group-hover:text-[#1F1F1F] transition-colors" />
        </a>
      </SectionCard>
    </>
  )
}

// ── Billing tab ───────────────────────────────────────────────────────────────
function BillingTab() {
  const invoices = [
    { date: 'Apr 01, 2026', amount: '$999.00', status: 'Paid' },
    { date: 'Mar 01, 2026', amount: '$999.00', status: 'Paid' },
    { date: 'Feb 01, 2026', amount: '$999.00', status: 'Paid' },
    { date: 'Jan 01, 2026', amount: '$999.00', status: 'Paid' },
  ]

  return (
    <>
      <SectionCard title="Current Plan">
        <div className="rounded-[12px] bg-[#CEFB4D] p-5 flex items-center justify-between">
          <div>
            <p className="font-outfit font-black text-xl text-[#1F1F1F]">Performance</p>
            <p className="font-outfit text-sm text-[#1F1F1F]/60 mt-0.5">$999 / month · Up to $10M/mo volume · All corridors</p>
          </div>
          <button className="btn-magnetic group h-9 px-4 rounded-[8px] bg-[#1F1F1F] text-white font-semibold text-xs flex items-center gap-1.5 outline-none border-0">
            <span className="btn-slide bg-white" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1F1F1F]">Manage Plan</span>
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Monthly volume',  val: '$2.84M',     sub: 'of $10M limit'  },
            { label: 'Next renewal',    val: 'May 1, 2026', sub: '1 day away'    },
            { label: 'Active corridors',val: '47',          sub: 'of unlimited'  },
          ].map(m => (
            <div key={m.label} className="bg-[#F3F3F3] rounded-[10px] p-3">
              <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">{m.val}</p>
              <p className="font-outfit text-[10px] text-[#1F1F1F]/40 mt-0.5">{m.label}</p>
              <p className="font-outfit text-[10px] text-[#1F1F1F]/25">{m.sub}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Payment Method">
        <div className="flex items-center justify-between p-4 rounded-[12px] border border-[#1F1F1F]/[0.07] hover:border-[#1F1F1F]/[0.14] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-[4px] bg-[#1A1F71] flex items-center justify-center">
              <span className="font-outfit font-black text-[8px] text-white tracking-wider">VISA</span>
            </div>
            <div>
              <p className="font-outfit text-sm font-semibold text-[#1F1F1F]">•••• •••• •••• 4242</p>
              <p className="font-outfit text-xs text-[#1F1F1F]/40">Expires 12/28 · Oleh Kostiakov</p>
            </div>
          </div>
          <button className="h-8 px-3 rounded-[8px] border border-[#1F1F1F]/10 font-outfit text-xs text-[#1F1F1F]/50 hover:border-[#1F1F1F]/20 hover:text-[#1F1F1F] transition-all outline-none">
            Update
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Invoices">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-[#1F1F1F]/[0.05] last:border-0 hover:bg-[#F3F3F3]/40 transition-colors">
                  <td className="py-3.5 pr-4 font-outfit text-sm text-[#1F1F1F]/70">{inv.date}</td>
                  <td className="py-3.5 pr-4 font-outfit text-sm font-semibold text-[#1F1F1F]">{inv.amount}</td>
                  <td className="py-3.5 pr-4"><span className="font-outfit text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">{inv.status}</span></td>
                  <td className="py-3.5">
                    <button className="flex items-center gap-1 font-outfit text-xs text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-colors outline-none">
                      <Download size={11} />PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  )
}

// ── Security tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false)
  const [pwVis, setPwVis] = useState({ cur: false, new: false, conf: false })
  const [pw, setPw] = useState({ cur: '', new: '', conf: '' })

  const sessions = [
    { device: 'Chrome on MacOS',    location: 'New York, US',    time: 'Active now',     current: true  },
    { device: 'Safari on iPhone',   location: 'Kyiv, UA',        time: '2 hours ago',    current: false },
    { device: 'Firefox on Windows', location: 'London, GB',      time: '3 days ago',     current: false },
  ]

  const audit = [
    { action: 'Password changed',     ip: '172.18.0.1', time: 'Apr 29, 2026 14:32' },
    { action: 'New API key created',  ip: '172.18.0.1', time: 'Apr 10, 2026 09:11' },
    { action: 'Team member invited',  ip: '172.18.0.1', time: 'Apr 05, 2026 16:48' },
    { action: 'Login from new device',ip: '10.0.0.42',  time: 'Mar 22, 2026 08:03' },
    { action: 'Billing plan upgraded',ip: '172.18.0.1', time: 'Mar 01, 2026 11:59' },
  ]

  return (
    <>
      <SectionCard title="Password" description="Update your account password.">
        <div className="space-y-4 max-w-sm">
          {[
            { label: 'Current Password', key: 'cur' },
            { label: 'New Password',     key: 'new' },
            { label: 'Confirm Password', key: 'conf' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/40 uppercase tracking-widest block mb-2">{label}</label>
              <div className="relative">
                <input
                  type={pwVis[key] ? 'text' : 'password'}
                  value={pw[key]}
                  onChange={e => setPw({ ...pw, [key]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-11 border border-[#1F1F1F]/10 rounded-[8px] px-4 pr-10 text-sm font-outfit text-[#1F1F1F] outline-none placeholder:text-[#1F1F1F]/30 hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
                />
                <button
                  onClick={() => setPwVis({ ...pwVis, [key]: !pwVis[key] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/30 hover:text-[#1F1F1F] transition-colors outline-none"
                >
                  {pwVis[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button className="h-10 px-5 rounded-[8px] bg-[#1F1F1F] text-white font-outfit text-sm font-semibold hover:bg-[#CEFB4D] hover:text-[#1F1F1F] transition-all outline-none">
            Update Password
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <ToggleRow
          label="Enable 2FA"
          desc="Use an authenticator app (TOTP) to confirm logins"
          checked={twoFA}
          onChange={setTwoFA}
        />
        {twoFA && (
          <div className="mt-4 p-4 rounded-[10px] bg-[#F3F3F3] text-center">
            <p className="font-outfit text-xs text-[#1F1F1F]/50 mb-3">Scan this QR code with your authenticator app</p>
            <div className="w-24 h-24 bg-white rounded-[8px] border border-[#1F1F1F]/10 flex items-center justify-center mx-auto mb-3">
              <span className="font-mono text-[8px] text-[#1F1F1F]/30">QR CODE</span>
            </div>
            <p className="font-mono text-xs text-[#1F1F1F]/50">JBSWY3DPEHPK3PXP</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Active Sessions" description="Devices and browsers currently signed in to your account.">
        <div className="space-y-1">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-3 rounded-[10px] hover:bg-[#F3F3F3]/60 transition-colors">
              <span className="w-9 h-9 rounded-[10px] bg-[#F3F3F3] flex items-center justify-center flex-shrink-0 text-[#1F1F1F]/40">
                {s.device.includes('iPhone') ? <Smartphone size={15} /> : <Monitor size={15} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-outfit text-sm font-medium text-[#1F1F1F]">{s.device}</p>
                <p className="font-outfit text-xs text-[#1F1F1F]/40">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="font-outfit text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Current</span>
              ) : (
                <button className="h-7 px-2.5 rounded-[6px] border border-[#1F1F1F]/10 font-outfit text-xs text-[#1F1F1F]/40 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all outline-none flex items-center gap-1">
                  <LogOut size={10} />Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#1F1F1F]/[0.07]">
          <button className="h-9 px-4 rounded-[8px] border border-red-200 font-outfit text-xs font-semibold text-red-500 hover:bg-red-50 transition-all outline-none flex items-center gap-2">
            <LogOut size={13} />Sign out from all other devices
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Audit Log" description="Recent security-relevant actions on your account.">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Action', 'IP Address', 'Time'].map(h => (
                  <th key={h} className="text-left pb-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audit.map((a, i) => (
                <tr key={i} className="border-b border-[#1F1F1F]/[0.05] last:border-0 hover:bg-[#F3F3F3]/40 transition-colors">
                  <td className="py-3 pr-4 font-outfit text-sm text-[#1F1F1F]">{a.action}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-[#1F1F1F]/40">{a.ip}</td>
                  <td className="py-3 pr-4 font-outfit text-xs text-[#1F1F1F]/40 whitespace-nowrap">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const TABS = {
    profile:       <ProfileTab />,
    workspace:     <WorkspaceTab />,
    notifications: <NotificationsTab />,
    integrations:  <IntegrationsTab />,
    api:           <ApiTab />,
    billing:       <BillingTab />,
    security:      <SecurityTab />,
  }

  const activeItem = NAV_ITEMS.find(n => n.id === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">Settings</h1>
        <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Manage your account, preferences, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left nav */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[16px] p-3 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest px-2 mb-2">System</p>
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 h-9 px-2 rounded-[8px] text-sm font-outfit font-medium transition-all text-left outline-none mb-0.5 ${activeTab === id ? 'bg-[#CEFB4D] text-[#1F1F1F]' : 'text-[#1F1F1F]/50 hover:text-[#1F1F1F] hover:bg-[#F3F3F3]'}`}
              >
                <Icon size={14} className="flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            {activeItem && <activeItem.icon size={16} className="text-[#1F1F1F]/40" />}
            <div>
              <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">{activeItem?.label}</h2>
            </div>
          </div>
          {TABS[activeTab]}
        </div>
      </div>
    </div>
  )
}
