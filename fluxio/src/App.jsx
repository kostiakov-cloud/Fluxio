import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, ArrowUp, Zap, Search, Menu, X,
  Home, LayoutDashboard, CreditCard, Activity, TrendingUp, FileText, Settings
} from 'lucide-react'
import { ContainerScroll } from './components/ui/container-scroll-animation'
import AppLayout from './components/dashboard/AppLayout'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import CashFlowPage from './pages/CashFlowPage'
import InvestmentsPage from './pages/InvestmentsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'

gsap.registerPlugin(ScrollTrigger)

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const HERO_WORDS   = ['borders.', 'limits.', 'friction.', 'latency.']
const FOOTER_WORDS = ['borders.', 'limits.', 'frontiers.']

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// ─── SVG LOGOS ────────────────────────────────────────────────────────────────
function LinkedInLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function XTwitterLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.264 5.658 5.9-5.658zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
    </svg>
  )
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ dark = false, className = '' }) {
  return (
    <span className={`font-outfit font-medium tracking-tight text-2xl ${dark ? 'text-white' : 'text-[#1F1F1F]'} ${className}`}>
      flux<span className="text-[#1F1F1F] bg-[#CEFB4D] px-1.5 rounded-[4px] ml-[4px]">io</span>
    </span>
  )
}

// ─── SCROLL TO TOP (global sticky) ───────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 pulse-ring w-12 h-12 rounded-full bg-[#CEFB4D] text-[#1F1F1F] flex items-center justify-center hover:bg-white transition-all duration-300 outline-none border-0 shadow-[0_8px_24px_rgba(206,251,77,0.4)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  )
}

// ─── MOBILE HAMBURGER (standalone sticky) ────────────────────────────────────
function MobileHamburger({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-[8px] bg-white shadow-[0_4px_16px_rgba(16,24,40,0.12)] border border-[#1F1F1F]/8 flex items-center justify-center text-[#1F1F1F] hover:bg-[#CEFB4D] transition-colors duration-200 outline-none"
      aria-label="Open menu"
    >
      <Menu size={18} />
    </button>
  )
}

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
function MobileMenu({ isOpen, onClose }) {
  const [search, setSearch] = useState('')

  const sidebarItems = [
    { icon: Home,            label: 'Home',        path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard',   path: '/app/dashboard' },
    { icon: CreditCard,      label: 'Accounts',    path: '/app/accounts' },
    { icon: Activity,        label: 'Cash flow',   path: '/app/cash-flow' },
    { icon: TrendingUp,      label: 'Investments', path: '/app/investments' },
    { icon: FileText,        label: 'Reports',     path: '/app/reports' },
    { icon: Settings,        label: 'Settings',    path: '/app/settings' },
  ]

  const navigate = useNavigate()

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className="lg:hidden fixed left-0 top-0 bottom-0 z-[99] w-72 bg-white flex flex-col shadow-2xl"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#1F1F1F]/[0.08] flex-shrink-0">
          <Logo />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#1F1F1F]/50 hover:bg-[#1F1F1F]/8 hover:text-[#1F1F1F] transition-colors outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 bg-white border border-[#1F1F1F]/10 rounded-[8px] pl-9 pr-4 text-sm outline-none font-outfit placeholder:text-[#1F1F1F]/40 hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/30 pointer-events-none" />
          </div>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {/* Sidebar app items */}
          <div className="mb-3">
            <p className="font-mono text-[#1F1F1F]/25 text-[10px] px-2 mb-2 uppercase tracking-widest">App</p>
            {sidebarItems.map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => { onClose(); navigate(path) }}
                className="group w-full flex items-center h-10 px-2 rounded-[10px] text-[#1F1F1F]/55 hover:text-[#1F1F1F] hover:bg-[#CEFB4D]/20 transition-all gap-3 outline-none text-left"
              >
                <span className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-200 group-hover:bg-[#CEFB4D]">
                  <Icon size={16} />
                </span>
                <span className="font-outfit text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="border-t border-[#1F1F1F]/[0.08] pt-3 mt-1">
            <button
              onClick={() => { onClose(); navigate('/register') }}
              className="btn-magnetic group w-full h-11 rounded-[8px] bg-[#CEFB4D] font-semibold text-sm text-[#1F1F1F] flex items-center justify-center outline-none border-0"
            >
              <span className="btn-slide bg-[#1F1F1F]" />
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                <Zap size={13} />Start free trial
              </span>
            </button>
          </div>
        </nav>

        {/* LinkedIn footer */}
        <div className="px-3 pb-4 border-t border-[#1F1F1F]/[0.08] pt-3 flex-shrink-0">
          <a
            href="https://linkedin.com/in/oleg-ko/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 h-10 px-2 rounded-[10px] text-[#1F1F1F]/35 hover:text-[#1F1F1F] hover:bg-[#CEFB4D]/20 transition-all"
          >
            <LinkedInLogo size={14} />
            <span className="font-outfit text-xs">linkedin.com/in/oleg-ko/</span>
          </a>
        </div>
      </div>
    </>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()

  const navItems = [
    { icon: Home,            label: 'Home',        path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard',   path: '/app/dashboard' },
    { icon: CreditCard,      label: 'Accounts',    path: '/app/accounts' },
    { icon: Activity,        label: 'Cash flow',   path: '/app/cash-flow' },
    { icon: TrendingUp,      label: 'Investments', path: '/app/investments' },
    { icon: FileText,        label: 'Reports',     path: '/app/reports' },
    { icon: Settings,        label: 'Settings',    path: '/app/settings' },
  ]

  const textStyle = {
    opacity: expanded ? 1 : 0,
    maxWidth: expanded ? '160px' : '0px',
    marginLeft: expanded ? '14px' : '0px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transitionProperty: 'opacity, max-width, margin-left',
    transitionDuration: expanded ? '180ms, 300ms, 280ms' : '80ms, 250ms, 250ms',
    transitionTimingFunction: 'ease, cubic-bezier(0.25,0.46,0.45,0.94), cubic-bezier(0.25,0.46,0.45,0.94)',
    transitionDelay: expanded ? '90ms, 0ms, 0ms' : '0ms, 0ms, 0ms',
  }

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed left-2 top-2 z-50 bg-white border border-[#1F1F1F]/10 shadow-lg flex flex-col overflow-hidden rounded-[16px]"
      style={{
        width: expanded ? 220 : 64,
        height: 'calc(100vh - 16px)',
        transition: 'width 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div className="h-16 relative flex-shrink-0 border-b border-[#1F1F1F]/[0.08]">
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: expanded ? 0 : 1, pointerEvents: expanded ? 'none' : 'auto' }}>
          <span className="font-outfit font-medium text-[#1F1F1F] bg-[#CEFB4D] px-2 py-1 rounded-[4px] text-base">io</span>
        </div>
        <div className="absolute inset-0 flex items-center px-4 transition-opacity duration-200"
          style={{ opacity: expanded ? 1 : 0, transitionDelay: expanded ? '80ms' : '0ms', pointerEvents: expanded ? 'auto' : 'none' }}>
          <Logo />
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-0.5 justify-center overflow-hidden">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
          return (
            <Link
              key={label}
              to={path}
              className={`group flex items-center h-10 rounded-[10px] transition-colors cursor-pointer ${isActive ? 'text-[#1F1F1F]' : 'text-[#1F1F1F]/55 hover:text-[#1F1F1F]'}`}
              style={{ paddingLeft: 16, paddingRight: 8 }}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-200 ${isActive ? 'bg-[#CEFB4D]' : 'group-hover:bg-[#CEFB4D]'}`}>
                <Icon size={19} />
              </span>
              <span className="text-sm font-medium" style={textStyle}>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pb-3 pt-2 border-t border-[#1F1F1F]/[0.08] flex-shrink-0">
        <a
          href="https://linkedin.com/in/oleg-ko/"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center h-10 rounded-[10px] text-[#1F1F1F]/55 hover:text-[#1F1F1F] transition-colors"
          style={{ paddingLeft: 16, paddingRight: 8 }}
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-200 group-hover:bg-[#CEFB4D]">
            <LinkedInLogo size={18} />
          </span>
          <span className="text-xs" style={textStyle}>linkedin.com/in/oleg-ko/</span>
        </a>
      </div>
    </div>
  )
}

// ─── TYPING WORD ──────────────────────────────────────────────────────────────
function TypingWord({ words, delay = 900, dark = false }) {
  const [started, setStarted] = useState(false)
  const [chars,   setChars]   = useState([])
  const [wordIdx, setWordIdx] = useState(0)
  const [phase,   setPhase]   = useState('typing')

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const word = words[wordIdx]
    if (phase === 'typing') {
      if (chars.length < word.length) {
        const t = setTimeout(() => setChars(word.slice(0, chars.length + 1).split('')), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('deleting'), 2400)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'deleting') {
      if (chars.length > 0) {
        const t = setTimeout(() => setChars(p => p.slice(0, -1)), 38)
        return () => clearTimeout(t)
      } else {
        setWordIdx(i => (i + 1) % words.length)
        setPhase('typing')
      }
    }
  }, [started, chars, wordIdx, phase, words])

  return (
    <span>
      {chars.map((ch, i) => (
        <span key={`${wordIdx}-${i}`} className="char-popin inline-block">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
      <span className={`cursor-blink inline-block ml-0.5 font-light ${dark ? 'text-white/40' : 'text-[#1F1F1F]/50'}`}>|</span>
    </span>
  )
}

// ─── STAT PANEL ───────────────────────────────────────────────────────────────
function StatPanel({ val, label }) {
  const [chars,   setChars]   = useState(val.split(''))
  const [typing,  setTyping]  = useState(false)
  const [session, setSession] = useState(0)
  const ivRef = useRef(null)

  const handleEnter = () => {
    clearInterval(ivRef.current)
    setChars([])
    setTyping(true)
    setSession(s => s + 1)
    let i = 0
    ivRef.current = setInterval(() => {
      i++
      setChars(val.slice(0, i).split(''))
      if (i >= val.length) {
        clearInterval(ivRef.current)
        setTyping(false)
      }
    }, 55)
  }

  useEffect(() => () => clearInterval(ivRef.current), [])

  return (
    <div
      className="relative z-10 bg-white rounded-[16px] p-6 lg:p-9 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] hover:bg-[#CEFB4D] hover:scale-[1.05] hover:shadow-[0_24px_48px_-12px_rgba(206,251,77,0.35)] transition-all duration-300 cursor-default"
      onMouseEnter={handleEnter}
    >
      <p className="font-outfit font-black text-2xl lg:text-3xl text-[#1F1F1F] tracking-tight" style={{ minHeight: '2rem' }}>
        {chars.map((ch, i) => (
          <span key={`${session}-${i}`} className="char-popin inline-block">{ch}</span>
        ))}
        {typing && <span className="cursor-blink font-light text-[#1F1F1F]/50 inline-block ml-0.5">|</span>}
      </p>
      <p className="font-outfit text-xs lg:text-sm text-[#1F1F1F]/50 mt-1">{label}</p>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null)
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-item',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative h-dvh lg:min-h-screen flex items-center bg-[#F3F3F3] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-[0.04]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1F1F1F" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className="blob-hero absolute w-[700px] h-[700px] bg-[#CEFB4D] opacity-[0.10] blur-[100px] pointer-events-none"
        style={{ left: 'calc(50% - 350px)', top: 'calc(50% - 350px)' }}
      />

      {/* Mobile logo — sidebar is hidden on mobile */}
      <div className="lg:hidden absolute top-5 left-5 z-10">
        <Logo />
      </div>

      {/* Top-right controls — desktop only */}
      <div className="hidden lg:flex absolute top-6 right-6 lg:right-12 items-center gap-3 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="h-12 bg-white border border-[#1F1F1F]/10 rounded-[8px] pl-4 pr-10 text-sm outline-none placeholder:text-[#1F1F1F]/40 font-outfit shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D]"
            style={{
              width: searchFocused ? '22rem' : '11rem',
              transition: 'width 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 200ms ease',
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/30 pointer-events-none" />
        </div>
        <button
          onClick={() => navigate('/register')}
          className="btn-magnetic group h-12 pl-6 pr-[34px] rounded-[8px] bg-[#CEFB4D] text-[#1F1F1F] font-semibold text-sm flex items-center gap-2"
        >
          <span className="btn-slide bg-[#1F1F1F]" />
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
            <Zap size={14} />Start free trial
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-8 lg:pt-32 lg:pb-20 flex flex-col items-center text-center">
        <div className="hero-item opacity-0 inline-flex items-center gap-2 bg-white border border-[#1F1F1F]/10 rounded-[8px] px-4 py-1.5 text-xs font-medium text-[#1F1F1F]/60 mb-6 lg:mb-10 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CEFB4D] pulse-dot" />
          Now live — 47 currencies, 120+ corridors
        </div>

        <p className="hero-item opacity-0 font-outfit font-semibold text-base lg:text-lg text-[#1F1F1F]/50 mb-2 lg:mb-3">
          Liquidity beyond
        </p>

        <h1
          className="hero-item opacity-0 font-outfit font-semibold leading-none tracking-tighter text-[#1F1F1F] mb-4 lg:mb-6"
          style={{ fontSize: 'clamp(48px, 10vw, 144px)' }}
        >
          <TypingWord words={HERO_WORDS} />
        </h1>

        <p className="hero-item opacity-0 font-outfit text-base lg:text-lg text-[#1F1F1F]/60 leading-relaxed max-w-xl mx-auto mb-7 lg:mb-10">
          Fluxio streamlines cross-border liquidity with automated precision — so your capital moves as fast as your ambition.
        </p>

        <div className="hero-item opacity-0 flex flex-col sm:flex-row gap-3 lg:gap-4 items-center justify-center w-full sm:w-auto">
          {/* Dark → Accent on hover */}
          <button
            onClick={() => scrollTo('pricing')}
            className="btn-magnetic group bg-[#1F1F1F] text-white font-semibold h-12 rounded-[8px] flex items-center justify-center gap-2 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] w-full sm:w-[220px]"
          >
            <span className="btn-slide bg-[#CEFB4D]" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#1F1F1F]">
              <Zap size={14} />Start free trial
            </span>
          </button>
          {/* White → Accent on hover */}
          <button
            onClick={() => scrollTo('protocol')}
            className="btn-magnetic group bg-white text-[#1F1F1F] font-semibold h-12 rounded-[8px] flex items-center justify-center gap-2 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] w-full sm:w-[220px]"
          >
            <span className="btn-slide bg-[#CEFB4D]" />
            <span className="relative z-10 transition-colors duration-300">See how it works</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hero-item opacity-0 mt-8 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6 w-full">
          {[
            { val: '$2.4B+',  label: 'processed monthly' },
            { val: '99.98%',  label: 'uptime SLA' },
            { val: '<180ms',  label: 'avg. settlement' },
            { val: '120+',    label: 'currency corridors' },
          ].map((s) => <StatPanel key={s.label} val={s.val} label={s.label} />)}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function SequenceWeaver() {
  const [status, setStatus] = useState('Indexing')
  const statuses = ['Indexing', 'Alignment', 'Synthesis']

  useEffect(() => {
    let i = 0
    const t = setInterval(() => { i = (i + 1) % 3; setStatus(statuses[i]) }, 2000)
    return () => clearInterval(t)
  }, [])

  const bars = Array.from({ length: 32 }, (_, i) => i)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="px-8 pt-8 pb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="font-outfit font-semibold text-white/40 text-xs uppercase tracking-widest">Speed Infrastructure</p>
          <span className="font-outfit text-xs text-[#CEFB4D] font-mono">[{status}]</span>
        </div>
        <h3 className="font-outfit font-semibold text-white text-2xl mb-1">Instant Settlement</h3>
        <p className="font-outfit text-white/50 text-sm">Sub-200ms routing across all corridors.</p>
      </div>
      <div className="relative flex-1 flex items-end gap-px overflow-hidden">
        {bars.map((b) => (
          <div
            key={b}
            className="flex-1 transition-all duration-300 hover:-translate-y-1"
            style={{
              height: `${20 + Math.sin(b * 0.6) * 60 + 20}%`,
              background: 'rgba(255,255,255,0.10)',
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
        <div className="scan-line absolute top-0 bottom-0 w-0.5 bg-[#CEFB4D] shadow-[0_0_12px_#CEFB4D]" />
      </div>
    </div>
  )
}

function TelemetryTypewriter() {
  const messages = [
    '> AES-256 encryption active',
    '> SOC2 Type II certified',
    '> Threat vector neutralized',
    '> Anomaly scan: clear',
    '> Compliance check passed',
    '> Zero-knowledge proof verified',
  ]
  const [lines,       setLines]       = useState([])
  const [currentLine, setCurrentLine] = useState('')
  const [msgIdx,      setMsgIdx]      = useState(0)
  const [charIdx,     setCharIdx]     = useState(0)

  useEffect(() => {
    const msg = messages[msgIdx]
    if (charIdx < msg.length) {
      const t = setTimeout(() => { setCurrentLine(msg.slice(0, charIdx + 1)); setCharIdx(charIdx + 1) }, 40)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setLines(prev => [...prev.slice(-6), msg])
        setCurrentLine('')
        setCharIdx(0)
        setMsgIdx(i => (i + 1) % messages.length)
      }, 700)
      return () => clearTimeout(t)
    }
  }, [charIdx, msgIdx])

  return (
    <div className="h-full w-full p-8 flex flex-col">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#CEFB4D] pulse-dot" />
          <p className="font-outfit text-xs font-semibold text-[#CEFB4D] uppercase tracking-widest">Live Feed</p>
        </div>
        <h3 className="font-outfit font-semibold text-white text-2xl mb-1">Bank-Grade Security</h3>
        <p className="font-outfit text-white/50 text-sm">Real-time threat monitoring, zero compromises.</p>
      </div>
      <div className="flex-1 bg-black/30 rounded-[16px] p-5 font-mono text-sm flex flex-col justify-end overflow-hidden">
        {lines.map((l, i) => <div key={i} className="text-white/40 mb-1.5 leading-snug">{l}</div>)}
        <div className="text-[#CEFB4D] leading-snug">{currentLine}<span className="cursor-blink">█</span></div>
      </div>
    </div>
  )
}

// ─── REACTIVE NODE MAP ────────────────────────────────────────────────────────
function ReactiveNodeMap() {
  const svgRef = useRef(null)
  const [offsets, setOffsets] = useState({})
  const [ambient, setAmbient] = useState({})
  const [pulses,  setPulses]  = useState([])

  const BASE_NODES = [
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 80, y: 20, label: 'FX Engine'  },
    { id: 2, x: 85, y: 55, label: 'Risk Model' },
    { id: 3, x: 70, y: 82, label: 'Compliance' },
    { id: 4, x: 30, y: 80, label: 'Settlement' },
    { id: 5, x: 15, y: 45, label: 'Analytics'  },
    { id: 6, x: 28, y: 18, label: 'Routing'    },
  ]

  useEffect(() => {
    const t = setInterval(() => {
      const to = 1 + Math.floor(Math.random() * 6)
      setPulses(p => [...p.slice(-5), { id: Date.now(), to }])
    }, 1200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const start = Date.now()
    let raf
    const tick = () => {
      const t = (Date.now() - start) / 1000
      const a = {}
      BASE_NODES.slice(1).forEach((n, i) => {
        a[n.id] = {
          dx: Math.sin(t * 0.6 + i * 1.1) * 3,
          dy: Math.cos(t * 0.45 + i * 0.85) * 2.5,
        }
      })
      setAmbient(a)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width)  * 100
    const my = ((e.clientY - rect.top)  / rect.height) * 100
    const newOffsets = {}
    BASE_NODES.slice(1).forEach(n => {
      const dist = Math.hypot(mx - n.x, my - n.y)
      const maxDist = 20
      if (dist < maxDist) {
        const strength = (1 - dist / maxDist) * 5
        const angle = Math.atan2(my - n.y, mx - n.x)
        newOffsets[n.id] = { dx: Math.cos(angle) * strength, dy: Math.sin(angle) * strength }
      } else {
        newOffsets[n.id] = { dx: 0, dy: 0 }
      }
    })
    setOffsets(newOffsets)
  }, [])

  const nodes = BASE_NODES.map(n => {
    const mouse = offsets[n.id]  || { dx: 0, dy: 0 }
    const amb   = ambient[n.id] || { dx: 0, dy: 0 }
    return { ...n, cx: n.x + mouse.dx + amb.dx, cy: n.y + mouse.dy + amb.dy }
  })
  const hub = nodes[0]

  return (
    <div className="h-full w-full p-8 flex flex-col justify-between">
      <div>
        <p className="font-outfit font-semibold text-[#1F1F1F]/40 text-xs uppercase tracking-widest mb-2">Intelligence Layer</p>
        <h3 className="font-outfit font-semibold text-[#1F1F1F] text-2xl mb-1">AI-Powered Routing</h3>
        <p className="font-outfit text-[#1F1F1F]/50 text-sm">Learns every corridor. Optimises every hop.</p>
      </div>
      <div className="relative flex-1 mt-4" style={{ minHeight: 200 }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setOffsets({})}>
        <svg ref={svgRef} viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {nodes.slice(1).map(n => (
            <line key={`bg-${n.id}`} x1={hub.cx} y1={hub.cy} x2={n.cx} y2={n.cy}
              stroke="#1F1F1F" strokeWidth="0.3" strokeOpacity="0.1" />
          ))}
          {nodes.slice(1).map((n, i) => (
            <line key={`dash-${n.id}`} x1={n.cx} y1={n.cy} x2={hub.cx} y2={hub.cy}
              stroke="#CEFB4D" strokeWidth="0.5" strokeOpacity="0.55" strokeDasharray="2 6">
              <animate attributeName="stroke-dashoffset" from="40" to="0"
                dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" />
            </line>
          ))}
          {pulses.map(p => {
            const from = nodes.find(n => n.id === p.to)
            if (!from) return null
            return (
              <circle key={p.id} r="1.5" fill="#CEFB4D" opacity="0.9">
                <animateMotion dur="1s" fill="freeze"
                  path={`M ${from.cx} ${from.cy} L ${hub.cx} ${hub.cy}`} />
              </circle>
            )
          })}
          {nodes.slice(1).map(n => (
            <g key={n.id}>
              <circle cx={n.cx} cy={n.cy} r="4.5"
                fill="#F3F3F3" stroke="#1F1F1F" strokeWidth="0.8" strokeOpacity="0.25" />
              <text x={n.cx} y={n.cy + 10.5} textAnchor="middle" fontSize="5.5"
                fill="#1F1F1F" opacity="0.5" fontFamily="Outfit">{n.label}</text>
            </g>
          ))}
          <circle cx={hub.cx} cy={hub.cy} r="10" fill="#CEFB4D" opacity="0.2">
            <animate attributeName="r"       values="10;14;10" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.07;0.2" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={hub.cx} cy={hub.cy} r="7" fill="#CEFB4D">
            <animate attributeName="r" values="7;8.2;7" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={hub.cx} cy={hub.cy} r="3" fill="#1F1F1F" opacity="0.7" />
        </svg>
      </div>
    </div>
  )
}

function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="bg-[#1F1F1F] py-16 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="font-outfit text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">What we do</p>
        <h2 className="font-outfit font-semibold text-white text-4xl lg:text-7xl tracking-tighter mb-4" style={{ lineHeight: 1 }}>
          three pillars.<br />
          <span className="text-[#CEFB4D]">zero compromise.</span>
        </h2>
        <p className="font-outfit text-white/40 text-lg max-w-xl mb-12 lg:mb-16">
          Fluxio is built on Speed, Security, and Intelligence — each one hardened for institutional-grade cross-border finance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card opacity-0 rounded-[16px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)]"
            style={{ background: '#191919', border: '1px solid rgba(255,255,255,0.04)', minHeight: 400 }}>
            <SequenceWeaver />
          </div>
          <div className="feature-card opacity-0 rounded-[16px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)]"
            style={{ background: '#1F1F1F', border: '1px solid rgba(255,255,255,0.06)', minHeight: 400 }}>
            <TelemetryTypewriter />
          </div>
          <div className="feature-card opacity-0 rounded-[16px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)]"
            style={{ background: '#FFFFFF', border: '1px solid rgba(31,31,31,0.08)', minHeight: 400 }}>
            <ReactiveNodeMap />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PHILOSOPHY SCROLL ────────────────────────────────────────────────────────
function PhilosophyScroll() {
  return (
    <section className="bg-[#F3F3F3] pt-[120px] md:pt-8 lg:pt-4 pb-0 md:pb-4 lg:pb-8">
      <ContainerScroll
        titleComponent={
          <div className="pb-4 lg:pb-8">
            <p className="font-outfit text-base text-[#1F1F1F]/40 mb-4 lg:mb-6 leading-relaxed">
              Most fintech focuses on: moving money faster.
            </p>
            <h2
              className="font-outfit font-semibold text-[#1F1F1F] leading-tight"
              style={{ fontSize: 'clamp(28px, 5vw, 80px)', lineHeight: 1.05 }}
            >
              We focus on:{' '}
              <span className="text-[#1F1F1F] bg-[#CEFB4D] px-4 py-1 rounded-none inline-block mt-2">
                automated precision.
              </span>
            </h2>
          </div>
        }
      >
        <img
          src="/dashboard-preview.png"
          alt="Fluxio platform"
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  )
}

// ─── PROTOCOL ─────────────────────────────────────────────────────────────────
function RotatingGeometry({ color }) {
  return (
    <svg viewBox="0 0 200 200" className="w-[216px] h-[216px] lg:w-72 lg:h-72" fill="none">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="16s" repeatCount="indefinite" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="100" cy="100" r={20 + i * 16}
            stroke={color} strokeWidth="0.8" strokeOpacity={0.15 + i * 0.08}
            strokeDasharray={`${6 + i * 2} ${8 - i}`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="8" fill={color} opacity="0.6" />
      <circle cx="100" cy="100" r="3" fill={color} />
    </svg>
  )
}

function LaserGrid({ color }) {
  return (
    <div className="relative w-[216px] h-[216px] lg:w-72 lg:h-72 overflow-hidden rounded-[16px]"
      style={{ background: `${color}08` }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={12 + col * 25} cy={12 + row * 25} r="2" fill={color} opacity="0.2" />
          ))
        )}
      </svg>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 bottom-0 w-0.5 opacity-80"
          style={{ background: '#CEFB4D', boxShadow: '0 0 14px #CEFB4D', animation: 'scan-sweep 2.2s linear infinite' }} />
      </div>
    </div>
  )
}

function EKGWave({ color }) {
  return (
    <svg viewBox="0 0 300 100" className="w-[216px] lg:w-72" fill="none">
      <path
        d="M0,50 L18,50 L25,8 L34,92 L43,50 L58,50 L65,12 L74,88 L83,50 L98,50 L105,4 L115,96 L124,50 L140,50 L147,18 L156,82 L165,50 L180,50 L187,8 L196,92 L205,50 L222,50 L229,14 L238,86 L247,50 L262,50 L269,20 L278,80 L287,50 L300,50"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        className="ekg-path" opacity="0.85"
      />
    </svg>
  )
}

function ProtocolCard({ step, title, desc, bg, textColor, index }) {
  const [learnHovered, setLearnHovered] = useState(false)

  const slideColor     = index === 0 ? '#FFFFFF' : '#CEFB4D'
  const textColorClass = textColor === '#FFFFFF' ? 'text-white' : 'text-[#1F1F1F]'
  const hoverTextNeedsChange = index === 1

  const renderAnimation = () => {
    if (index === 0) return <RotatingGeometry color={textColor} />
    if (index === 1) return <LaserGrid color={textColor} />
    return <EKGWave color={textColor} />
  }

  return (
    <div
      className="protocol-card sticky rounded-[16px] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] flex flex-col md:flex-row"
      style={{ background: bg, top: `${80 + index * 20}px`, minHeight: '42vh' }}
    >
      <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
        <p className="font-mono text-xs mb-4 opacity-40" style={{ color: textColor }}>STEP 0{step}</p>
        <h3
          className="font-outfit font-semibold mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: textColor, lineHeight: 1.05 }}
        >
          {title}
        </h3>
        <p className="font-outfit text-base opacity-60 max-w-md leading-relaxed mb-6" style={{ color: textColor }}>
          {desc}
        </p>
        {/* border-color controlled via state so hover actually removes it */}
        <button
          onClick={() => scrollTo('features')}
          onMouseEnter={() => setLearnHovered(true)}
          onMouseLeave={() => setLearnHovered(false)}
          className={`btn-magnetic group self-start border h-12 px-6 rounded-[8px] text-sm font-semibold flex items-center ${textColorClass}`}
          style={{ borderColor: learnHovered ? 'transparent' : `${textColor}30`, transition: 'border-color 200ms ease' }}
        >
          <span className="btn-slide" style={{ background: slideColor }} />
          <span className={`relative z-10 transition-colors duration-300 ${hoverTextNeedsChange ? 'group-hover:text-[#1F1F1F]' : ''}`}>
            Learn more
          </span>
        </button>
      </div>
      <div className="w-full md:w-[45%] flex items-center justify-center p-8">
        {renderAnimation()}
      </div>
    </div>
  )
}

function Protocol() {
  const sectionRef = useRef(null)

  const cards = [
    { step: 1, title: 'Connect',  desc: 'Link your treasury accounts and payment corridors in minutes. Works with your existing banking stack.', bg: '#CEFB4D', textColor: '#1F1F1F' },
    { step: 2, title: 'Automate', desc: 'Let Fluxio route, convert, and settle with zero manual intervention. FX hedging included.',             bg: '#1F1F1F', textColor: '#FFFFFF' },
    { step: 3, title: 'Scale',    desc: 'Expand to new markets with compliance and liquidity baked in. No legal overhead, no ops headaches.',    bg: '#F3F3F3', textColor: '#1F1F1F' },
  ]

  return (
    <section id="protocol" ref={sectionRef} className="bg-[#F3F3F3] pt-8 pb-10 lg:pt-16 lg:pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="font-outfit text-xs font-semibold text-[#1F1F1F]/30 uppercase tracking-widest mb-4">How it works</p>
        <h2 className="font-outfit font-semibold text-[#1F1F1F] text-4xl lg:text-7xl tracking-tighter mb-10 lg:mb-20" style={{ lineHeight: 1 }}>
          three steps.<br />
          <span className="text-[#1F1F1F]/30">infinite scale.</span>
        </h2>
        <div className="flex flex-col gap-6">
          {cards.map((c, i) => <ProtocolCard key={i} {...c} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const navigate = useNavigate()
  const tiers = [
    {
      name: 'Essential', price: '$299',
      desc: 'For growing teams making their first cross-border moves.',
      features: ['Up to $500K/mo volume', '15 currency corridors', 'API access', 'Email support'],
      cta: 'Get started', highlight: false, action: 'login',
    },
    {
      name: 'Performance', price: '$999',
      desc: 'For scale-ups with real treasury complexity.',
      features: ['Up to $10M/mo volume', 'All corridors', 'AI routing engine', 'Dedicated success manager', 'FX hedging tools'],
      cta: 'Start free trial', highlight: true, action: 'register',
    },
    {
      name: 'Enterprise', price: 'Custom',
      desc: 'For institutions that need white-glove infra.',
      features: ['Unlimited volume', 'Custom SLAs', 'On-prem option', 'Legal & compliance support', 'Priority 24/7 support'],
      cta: 'Contact sales', highlight: false, action: null,
    },
  ]

  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-wrapper', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="bg-[#F3F3F3] pt-10 pb-24 lg:pt-20 lg:pb-48 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="font-outfit text-xs font-semibold text-[#1F1F1F]/30 uppercase tracking-widest mb-4">Pricing</p>
        <h2 className="font-outfit font-semibold text-[#1F1F1F] text-4xl lg:text-7xl tracking-tighter mb-12 lg:mb-16" style={{ lineHeight: 1 }}>
          simple pricing.<br />
          <span className="text-[#1F1F1F]/40">serious performance.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className="pricing-wrapper opacity-0 hover:-translate-y-6 transition-transform duration-300 ease-out">
              <div
                className={`rounded-[16px] p-8 flex flex-col justify-between h-full ${
                  t.highlight
                    ? 'bg-[#CEFB4D] pulse-pricing shadow-none'
                    : 'bg-white border border-[#1F1F1F]/10 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)]'
                }`}
              >
                <div>
                  <p className={`font-outfit font-semibold text-sm mb-2 ${t.highlight ? 'text-[#1F1F1F]/60' : 'text-[#1F1F1F]/40'}`}>{t.name}</p>
                  <p className="font-outfit font-black text-5xl tracking-tighter mb-2 text-[#1F1F1F]">{t.price}</p>
                  <p className={`font-outfit text-sm mb-8 leading-relaxed ${t.highlight ? 'text-[#1F1F1F]/60' : 'text-[#1F1F1F]/50'}`}>{t.desc}</p>
                  <ul className="space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className={`font-outfit text-sm flex items-center gap-2 ${t.highlight ? 'text-[#1F1F1F]' : 'text-[#1F1F1F]/70'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.highlight ? 'bg-[#1F1F1F]' : 'bg-[#CEFB4D]'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => t.action ? navigate(`/${t.action}`) : undefined}
                  className="btn-magnetic group mt-8 w-full h-12 rounded-[8px] font-semibold text-sm flex items-center justify-center bg-[#1F1F1F] text-white"
                >
                  <span className={`btn-slide ${t.highlight ? 'bg-white' : 'bg-[#CEFB4D]'}`} />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1F1F1F]">{t.cta}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => navigate('/')} className="inline-block mb-8 cursor-pointer">
            <Logo />
          </button>
          <h1 className="font-outfit font-semibold text-[#1F1F1F] text-3xl tracking-tighter mb-2">Welcome back</h1>
          <p className="font-outfit text-[#1F1F1F]/50 text-sm">Sign in to your Fluxio account</p>
        </div>
        <div className="bg-white rounded-[24px] p-8 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] border border-[#1F1F1F]/[0.06]">
          <div className="space-y-4">
            <div>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/50 uppercase tracking-widest block mb-2">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm outline-none placeholder:text-[#1F1F1F]/30 font-outfit hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
              />
            </div>
            <div>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/50 uppercase tracking-widest block mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full h-12 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm outline-none placeholder:text-[#1F1F1F]/30 font-outfit hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
              />
            </div>
            <div className="flex justify-end">
              <a href="#" className="font-outfit text-xs text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-colors">Forgot password?</a>
            </div>
            <button className="btn-magnetic group w-full h-12 rounded-[8px] bg-[#1F1F1F] text-white font-semibold text-sm flex items-center justify-center">
              <span className="btn-slide bg-[#CEFB4D]" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1F1F1F]">Sign in</span>
            </button>
          </div>
          <p className="font-outfit text-sm text-[#1F1F1F]/40 text-center mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#1F1F1F] font-semibold hover:text-[#1F1F1F]/60 transition-colors underline underline-offset-2"
            >
              Create one
            </button>
          </p>
        </div>
        <p className="font-outfit text-xs text-[#1F1F1F]/30 text-center mt-6">Protected by AES-256 encryption</p>
      </div>
    </div>
  )
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => navigate('/')} className="inline-block mb-8 cursor-pointer">
            <Logo />
          </button>
          <h1 className="font-outfit font-semibold text-[#1F1F1F] text-3xl tracking-tighter mb-2">Start your free trial</h1>
          <p className="font-outfit text-[#1F1F1F]/50 text-sm">14 days free. No credit card required.</p>
        </div>
        <div className="bg-white rounded-[24px] p-8 shadow-[0_24px_48px_-12px_rgba(16,24,40,0.12)] border border-[#1F1F1F]/[0.06]">
          <div className="space-y-4">
            <div>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/50 uppercase tracking-widest block mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm outline-none placeholder:text-[#1F1F1F]/30 font-outfit hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
              />
            </div>
            <div>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/50 uppercase tracking-widest block mb-2">Work Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm outline-none placeholder:text-[#1F1F1F]/30 font-outfit hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
              />
            </div>
            <div>
              <label className="font-outfit text-xs font-semibold text-[#1F1F1F]/50 uppercase tracking-widest block mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full h-12 border border-[#1F1F1F]/10 rounded-[8px] px-4 text-sm outline-none placeholder:text-[#1F1F1F]/30 font-outfit hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors"
              />
            </div>
            <button className="btn-magnetic group w-full h-12 rounded-[8px] bg-[#CEFB4D] text-[#1F1F1F] font-semibold text-sm flex items-center justify-center">
              <span className="btn-slide bg-[#1F1F1F]" />
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                <Zap size={14} />Create account
              </span>
            </button>
          </div>
          <p className="font-outfit text-sm text-[#1F1F1F]/40 text-center mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#1F1F1F] font-semibold hover:text-[#1F1F1F]/60 transition-colors underline underline-offset-2"
            >
              Sign in
            </button>
          </p>
        </div>
        <p className="font-outfit text-xs text-[#1F1F1F]/30 text-center mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const [formData, setFormData] = useState({ name: '', email: '' })

  const navLinks  = ['Platform Overview', 'API Documentation', 'Changelog', 'Blog']
  const infoLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Settings']

  return (
    <footer className="bg-[#1F1F1F] pt-12 pb-6 lg:pt-24 lg:pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-2 flex items-center">
            <h2
              className="font-outfit font-semibold text-white leading-none tracking-tighter"
              style={{ fontSize: 'clamp(40px, 7vw, 112px)' }}
            >
              Move money<br />
              <span className="text-[#CEFB4D]">without</span><br />
              <TypingWord words={FOOTER_WORDS} delay={0} dark />
            </h2>
          </div>
          <div className="lg:col-span-1 flex flex-col justify-center">
            <p className="font-outfit text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Stay ahead</p>
            <p className="font-outfit text-white/60 text-sm mb-6 leading-relaxed">
              Join 4,200+ treasury teams getting the Fluxio weekly brief.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-[8px] px-5 text-sm text-white placeholder:text-white/30 outline-none hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors font-outfit"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-[8px] px-5 text-sm text-white placeholder:text-white/30 outline-none hover:border-[#CEFB4D]/60 focus:border-[#CEFB4D] transition-colors font-outfit"
              />
              <button className="btn-magnetic group w-full h-12 bg-[#CEFB4D] text-[#1F1F1F] font-semibold rounded-[8px] text-sm flex items-center justify-center">
                <span className="btn-slide bg-white" />
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#1F1F1F]">
                  Join Us <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mb-12 lg:mb-16 border-t border-b border-white/10">
          <div className="py-8 lg:py-10 md:pr-10 md:border-r border-white/10">
            <p className="font-mono text-white/25 text-xs mb-6 lg:mb-7">// Navigation</p>
            <div className="flex flex-col">
              {navLinks.map(l => (
                <a key={l} href="#" className="link-lift font-outfit text-base text-white hover:text-[#CEFB4D] mb-3 transition-colors block">{l}</a>
              ))}
            </div>
          </div>
          <div className="py-8 lg:py-10 md:px-10 md:border-r border-white/10">
            <p className="font-mono text-white/25 text-xs mb-6 lg:mb-7">// Info</p>
            <div className="flex flex-col">
              {infoLinks.map(l => (
                <a key={l} href="#" className="link-lift font-outfit text-base text-white hover:text-[#CEFB4D] mb-3 transition-colors block">{l}</a>
              ))}
            </div>
          </div>
          <div className="py-8 lg:py-10 md:pl-10 flex flex-col">
            <p className="font-mono text-white/25 text-xs mb-6 lg:mb-7">// Drop me a line</p>
            <a
              href="mailto:hello@fluxio.io"
              className="group relative font-outfit font-semibold text-white hover:text-[#CEFB4D] transition-colors mb-auto inline-block self-start"
              style={{ fontSize: 'clamp(20px, 2.5vw, 34px)', lineHeight: 1.2 }}
            >
              hello@fluxio.io
              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#CEFB4D] group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            </a>
            <div className="flex gap-3 mt-8">
              {[
                { href: 'https://linkedin.com/in/oleg-ko/', icon: <LinkedInLogo size={14} /> },
                { href: '#', icon: <XTwitterLogo size={14} /> },
                { href: '#', icon: <FacebookLogo size={14} /> },
              ].map(({ href, icon }, i) => (
                <a key={i} href={href} target={href !== '#' ? '_blank' : undefined} rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-[#CEFB4D] hover:border-[#CEFB4D] hover:text-[#1F1F1F] transition-all duration-200">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <p className="font-outfit text-white/30 text-xs">© 2026 Fluxio Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── LANDING LAYOUT ───────────────────────────────────────────────────────────
function LandingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="hidden lg:block"><Sidebar /></div>
      <MobileHamburger onClick={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <ScrollToTop />
      <div className="lg:pl-16">
        <Hero />
        <Features />
        <PhilosophyScroll />
        <Protocol />
        <Pricing />
        <Footer />
      </div>
    </>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<LandingLayout />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/app"       element={<AppLayout />}>
        <Route index           element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="accounts"    element={<AccountsPage />} />
        <Route path="cash-flow"   element={<CashFlowPage />} />
        <Route path="investments" element={<InvestmentsPage />} />
        <Route path="reports"     element={<ReportsPage />} />
        <Route path="settings"       element={<SettingsPage />} />
        <Route path="notifications"  element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
