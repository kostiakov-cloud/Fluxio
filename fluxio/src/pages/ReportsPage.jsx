import { useState } from 'react'
import {
  BarChart2, FileText, Scale, TrendingUp, ArrowDownToLine,
  Sparkles, Download, Plus, Archive, Calendar, User
} from 'lucide-react'

const REPORT_TYPES = [
  { id: 'pl',      icon: BarChart2,        label: 'Profit & Loss',  desc: 'Revenue, COGS, gross margin breakdown' },
  { id: 'bs',      icon: Scale,            label: 'Balance Sheet',  desc: 'Assets, liabilities, and equity' },
  { id: 'cf',      icon: TrendingUp,       label: 'Cash Flow',      desc: 'Operating, investing, financing flows' },
  { id: 'fx',      icon: ArrowDownToLine,  label: 'FX Exposure',    desc: 'Currency risk and hedging status' },
  { id: 'tax',     icon: FileText,         label: 'Tax Summary',    desc: 'Taxable income and deductions' },
]

const DATE_PRESETS = ['Last 30 days', 'Last 90 days', 'This Year', 'Custom…']
const FORMATS = [
  { id: 'pdf',  label: 'PDF',  ext: '.pdf',  color: '#EF4444', desc: 'Formatted document' },
  { id: 'xlsx', label: 'XLSX', ext: '.xlsx', color: '#22C55E', desc: 'Spreadsheet' },
  { id: 'csv',  label: 'CSV',  ext: '.csv',  color: '#3B82F6', desc: 'Raw data export' },
]

const ARCHIVE_TABS = ['All', 'Profit & Loss', 'Balance Sheet', 'Cash Flow', 'FX Exposure']

const archiveData = [
  { id: 1, name: 'P&L – Q1 2026',       type: 'Profit & Loss', format: 'pdf',  size: '284 KB', date: 'Apr 01, 2026', user: 'Oleh Kostiakov' },
  { id: 2, name: 'Balance Sheet – Mar',  type: 'Balance Sheet', format: 'xlsx', size: '112 KB', date: 'Mar 31, 2026', user: 'Oleh Kostiakov' },
  { id: 3, name: 'Cash Flow – Feb',      type: 'Cash Flow',     format: 'pdf',  size: '198 KB', date: 'Mar 01, 2026', user: 'Oleh Kostiakov' },
  { id: 4, name: 'FX Exposure – Q4',     type: 'FX Exposure',   format: 'csv',  size: '58 KB',  date: 'Jan 15, 2026', user: 'Oleh Kostiakov' },
  { id: 5, name: 'P&L – Q4 2025',        type: 'Profit & Loss', format: 'pdf',  size: '310 KB', date: 'Jan 01, 2026', user: 'Oleh Kostiakov' },
  { id: 6, name: 'Tax Summary – 2025',   type: 'Tax Summary',   format: 'pdf',  size: '420 KB', date: 'Dec 31, 2025', user: 'Oleh Kostiakov' },
  { id: 7, name: 'Balance Sheet – Dec',  type: 'Balance Sheet', format: 'xlsx', size: '98 KB',  date: 'Dec 31, 2025', user: 'Oleh Kostiakov' },
  { id: 8, name: 'Cash Flow – Nov',      type: 'Cash Flow',     format: 'csv',  size: '42 KB',  date: 'Dec 01, 2025', user: 'Oleh Kostiakov' },
]

const FORMAT_COLORS = { pdf: '#EF4444', xlsx: '#22C55E', csv: '#3B82F6' }

export default function ReportsPage() {
  const [reportType, setReportType] = useState('pl')
  const [datePreset, setDatePreset] = useState('Last 90 days')
  const [format,     setFormat]     = useState('pdf')
  const [archiveTab, setArchiveTab] = useState('All')
  const [comparative, setComparative] = useState(true)
  const [letterhead,  setLetterhead]  = useState(false)
  const [preview,     setPreview]     = useState(false)
  const [generating,  setGenerating]  = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setPreview(true) }, 1400)
  }

  const filtered = archiveTab === 'All' ? archiveData : archiveData.filter(r => r.type === archiveTab)
  const selectedType = REPORT_TYPES.find(t => t.id === reportType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit font-semibold text-xl text-[#1F1F1F] tracking-tight">
            Reports <span className="text-sm font-normal text-[#1F1F1F]/30 ml-1">8 archived</span>
          </h1>
          <p className="font-outfit text-sm text-[#1F1F1F]/40 mt-0.5">Generate, preview, and export financial reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-[8px] border border-[#1F1F1F]/10 font-outfit text-xs text-[#1F1F1F]/50 hover:border-[#1F1F1F]/20 hover:text-[#1F1F1F] transition-colors flex items-center gap-1.5 outline-none">
            <Archive size={13} />Browse Archive
          </button>
          <button className="btn-magnetic group h-9 px-4 rounded-[8px] bg-[#1F1F1F] text-white font-semibold text-xs flex items-center gap-1.5 outline-none border-0">
            <span className="btn-slide bg-[#CEFB4D]" />
            <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[#1F1F1F]">
              <Plus size={13} />New Report
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left sidebar: config ─────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">
          {/* Report type */}
          <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">Report Type</p>
            <div className="space-y-1">
              {REPORT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setReportType(t.id); setPreview(false) }}
                  className={`w-full flex items-start gap-3 p-3 rounded-[10px] transition-all text-left outline-none ${reportType === t.id ? 'bg-[#CEFB4D]' : 'hover:bg-[#F3F3F3]'}`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-[8px] flex-shrink-0 mt-0.5 ${reportType === t.id ? 'bg-[#1F1F1F]/10 text-[#1F1F1F]' : 'bg-[#F3F3F3] text-[#1F1F1F]/40'}`}>
                    <t.icon size={15} />
                  </span>
                  <div>
                    <p className={`font-outfit text-sm font-semibold ${reportType === t.id ? 'text-[#1F1F1F]' : 'text-[#1F1F1F]/70'}`}>{t.label}</p>
                    <p className={`font-outfit text-xs mt-0.5 ${reportType === t.id ? 'text-[#1F1F1F]/55' : 'text-[#1F1F1F]/35'}`}>{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Period */}
          <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">Date Range</p>
            <div className="grid grid-cols-2 gap-1.5">
              {DATE_PRESETS.map(d => (
                <button key={d} onClick={() => setDatePreset(d)}
                  className={`h-9 px-2 rounded-[8px] font-outfit text-xs font-medium transition-all outline-none ${datePreset === d ? 'bg-[#1F1F1F] text-white' : 'bg-[#F3F3F3] text-[#1F1F1F]/50 hover:text-[#1F1F1F]'}`}>
                  {d}
                </button>
              ))}
            </div>

            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mt-4 mb-3">Output Format</p>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-[10px] border transition-all outline-none ${format === f.id ? 'border-[#1F1F1F] bg-[#1F1F1F]/[0.03]' : 'border-[#1F1F1F]/10 hover:border-[#1F1F1F]/20'}`}>
                  <span className="font-outfit font-black text-sm" style={{ color: f.color }}>{f.label}</span>
                  <span className="font-outfit text-[10px] text-[#1F1F1F]/35">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-[16px] p-5 border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)]">
            <p className="font-mono text-[10px] text-[#1F1F1F]/25 uppercase tracking-widest mb-3">Options</p>
            {[
              { label: 'Include comparative period', state: comparative, set: setComparative },
              { label: 'Add Fluxio letterhead',       state: letterhead,  set: setLetterhead  },
            ].map(o => (
              <div key={o.label} className="flex items-center justify-between py-2.5 border-b border-[#1F1F1F]/[0.06] last:border-0">
                <span className="font-outfit text-sm text-[#1F1F1F]/60">{o.label}</span>
                <button
                  onClick={() => o.set(v => !v)}
                  className={`relative w-11 h-6 rounded-full flex-shrink-0 outline-none transition-colors duration-200 ${o.state ? 'bg-[#1F1F1F]' : 'bg-[#D1D5DB]'}`}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200 ${o.state ? 'translate-x-[20px]' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-magnetic group w-full h-12 rounded-[10px] bg-[#1F1F1F] text-white font-semibold text-sm flex items-center justify-center gap-2 outline-none border-0 disabled:opacity-60"
          >
            <span className="btn-slide bg-[#CEFB4D]" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#1F1F1F]">
              <Sparkles size={14} />
              {generating ? 'Generating…' : 'Generate & Preview'}
            </span>
          </button>
        </div>

        {/* ── Main content: preview ─────────────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]/[0.07]">
            <h2 className="font-outfit font-semibold text-sm text-[#1F1F1F]">Preview</h2>
            {preview && (
              <button className="flex items-center gap-1.5 text-xs font-outfit font-semibold text-[#1F1F1F] hover:text-[#1F1F1F]/60 transition-colors">
                <Download size={13} />Download
              </button>
            )}
          </div>

          {preview ? (
            <div className="flex-1 p-6">
              <div className="border border-[#1F1F1F]/[0.08] rounded-[12px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-outfit font-black text-lg text-[#1F1F1F]">{selectedType?.label}</p>
                    <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-0.5">{datePreset} · Generated {new Date().toLocaleDateString()}</p>
                  </div>
                  <span className="font-outfit font-black text-xl text-[#1F1F1F] opacity-10">flux<span className="bg-[#CEFB4D] px-1 rounded ml-0.5 opacity-100 text-[#1F1F1F]">io</span></span>
                </div>
                {[
                  { label: 'Total Revenue',    val: '$284,000', pct: '+12.1%', positive: true },
                  { label: 'Operating Costs',  val: '$142,000', pct: '+4.8%',  positive: false },
                  { label: 'Gross Profit',     val: '$142,000', pct: '+19.7%', positive: true },
                  { label: 'Net Income',       val: '$94,800',  pct: '+22.3%', positive: true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-[#1F1F1F]/[0.06] last:border-0">
                    <span className="font-outfit text-sm text-[#1F1F1F]/60">{row.label}</span>
                    <div className="flex items-center gap-4">
                      <span className={`font-outfit text-xs font-medium px-2 py-0.5 rounded-full ${row.positive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{row.pct}</span>
                      <span className="font-outfit font-semibold text-sm text-[#1F1F1F] w-24 text-right">{row.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-[16px] bg-[#F3F3F3] flex items-center justify-center">
                <FileText size={24} className="text-[#1F1F1F]/20" />
              </div>
              <div>
                <p className="font-outfit font-semibold text-sm text-[#1F1F1F]">No preview yet</p>
                <p className="font-outfit text-xs text-[#1F1F1F]/40 mt-1 max-w-xs">
                  Select a report type and period, then click "Generate & Preview" to see your report before downloading.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Archive */}
      <div className="bg-white rounded-[16px] border border-[#1F1F1F]/[0.07] shadow-[0_4px_16px_rgba(16,24,40,0.06)] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#1F1F1F]/[0.07]">
          <div className="flex gap-1 overflow-x-auto">
            {ARCHIVE_TABS.map(t => (
              <button key={t} onClick={() => setArchiveTab(t)}
                className={`px-3 h-8 rounded-[6px] text-xs font-outfit font-medium whitespace-nowrap transition-all outline-none ${archiveTab === t ? 'bg-[#1F1F1F] text-white' : 'text-[#1F1F1F]/40 hover:text-[#1F1F1F]'}`}>
                {t}
              </button>
            ))}
          </div>
          <button className="font-outfit text-xs text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-colors flex-shrink-0">Export list</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F1F1F]/[0.07]">
                {['Report', 'Type', 'Format', 'Size', 'Created', 'By'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-mono text-[10px] text-[#1F1F1F]/30 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-[#1F1F1F]/[0.04] last:border-0 hover:bg-[#F3F3F3]/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-outfit text-sm font-medium text-[#1F1F1F]">{r.name}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-outfit text-xs text-[#1F1F1F]/50">{r.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-outfit font-semibold text-xs uppercase px-2 py-0.5 rounded-full"
                      style={{ background: `${FORMAT_COLORS[r.format]}15`, color: FORMAT_COLORS[r.format] }}>
                      .{r.format}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-outfit text-xs text-[#1F1F1F]/40">{r.size}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-outfit text-[#1F1F1F]/40">
                      <Calendar size={11} />{r.date}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-outfit text-[#1F1F1F]/50">
                      <User size={11} />{r.user}
                    </div>
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
