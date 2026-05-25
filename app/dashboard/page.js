'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield, Mic, MicOff, Phone, MapPin, AlertTriangle,
  Clock, Activity, Users, Settings, Bell, Navigation,
  LogOut, ChevronRight
} from 'lucide-react'
import SOSModal from '../../components/SOSModal'
import KeywordListener from '../../components/KeywordListener'
import {
  predictRisk, getRiskColor, getRiskIcon, getRiskAdvice
} from '../../components/riskPredictor'
import LiveMap from '../../components/LiveMap'

const JAM_OPTIONS    = Array.from({ length: 24 }, (_, i) => i)
const JALAN_OPTIONS  = ['Ramai', 'Sedang', 'Sepi']
const CAHAYA_OPTIONS = ['Terang', 'Redup', 'Gelap']
const CUACA_OPTIONS  = ['Cerah', 'Berawan', 'Hujan']

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser]           = useState(null)
  const [listening, setListening] = useState(false)
  const [sosActive, setSosActive] = useState(false)
  const [location, setLocation]   = useState(null)
  const [jam, setJam]             = useState(new Date().getHours())
  const [jalan, setJalan]         = useState('Sedang')
  const [cahaya, setCahaya]       = useState('Redup')
  const [cuaca, setCuaca]         = useState('Cerah')
  const [showRiskPanel, setShowRiskPanel] = useState(false)
  const [tab, setTab]             = useState('home')
  const [now, setNow]             = useState(new Date())

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('safewalk_user')
    if (!saved) { router.push('/'); return }
    setUser(JSON.parse(saved))
    setJam(new Date().getHours())
  }, [router])

  useEffect(() => {
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watcher)
  }, [])

  const handleDetected = useCallback((transcript) => {
    setSosActive(true)
  }, [])

  const handleSOSClose = () => setSosActive(false)
  const logout = () => { localStorage.removeItem('safewalk_user'); router.push('/') }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  )

  const riskLevel  = predictRisk(jam, jalan, cahaya, cuaca)
  const riskColor  = getRiskColor(riskLevel)
  const riskAdvice = getRiskAdvice(riskLevel)
  const timeStr    = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr    = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">

      {/* HEADER */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-gray-400 text-xs">{dateStr}</p>
            <h1 className="text-white font-semibold text-lg">Halo, {user.name.split(' ')[0]} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${listening ? 'bg-green-600/20 border border-green-500/50' : 'bg-white/5'}`}>
              {listening
                ? <Mic size={16} className="text-green-400 blink" />
                : <MicOff size={16} className="text-gray-500" />}
            </div>
            <button onClick={logout} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
              <LogOut size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight mt-1">{timeStr}</div>
      </div>

      {/* RISK BANNER */}
      <div className="px-5 mb-4">
        <div className={`rounded-2xl p-4 border ${riskColor.bg} ${riskColor.border} flex items-center gap-3`}>
          <span className="text-2xl">{getRiskIcon(riskLevel)}</span>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">
              Risiko Saat Ini: <span className={riskColor.text}>
                {riskLevel === 'Tinggi' ? 'Aman' : riskLevel === 'Sedang' ? 'Sedang' : 'Bahaya'}
              </span>
            </p>
            <p className="text-gray-400 text-xs mt-0.5">{riskAdvice[0]}</p>
          </div>
          <button onClick={() => setShowRiskPanel(v => !v)} className="text-gray-400">
            <ChevronRight size={18} className={`transition-transform ${showRiskPanel ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showRiskPanel && (
          <div className="mt-2 bg-white/5 rounded-2xl border border-white/10 p-4 fade-in">
            <p className="text-white text-sm font-medium mb-3">🔧 Atur Kondisi Perjalanan</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Jam</label>
                <select value={jam} onChange={e => setJam(+e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 outline-none">
                  {JAM_OPTIONS.map(h => (
                    <option key={h} value={h} className="bg-[#0f1923]">{String(h).padStart(2,'0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Kondisi Jalan</label>
                <select value={jalan} onChange={e => setJalan(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 outline-none">
                  {JALAN_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0f1923]">{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Pencahayaan</label>
                <select value={cahaya} onChange={e => setCahaya(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 outline-none">
                  {CAHAYA_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0f1923]">{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Cuaca</label>
                <select value={cuaca} onChange={e => setCuaca(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 outline-none">
                  {CUACA_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0f1923]">{o}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {riskAdvice.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${riskColor.dot}`} />
                  <p className="text-gray-300 text-xs">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="px-5">
        <div className="flex bg-white/5 rounded-2xl p-1 mb-4">
          {[
            { id: 'home',     label: 'Beranda' },
            { id: 'map',      label: '🗺 Peta Live' },
            { id: 'contacts', label: 'Kontak' },
            { id: 'settings', label: 'Pengaturan' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all
                ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: BERANDA */}
      {tab === 'home' && (
        <div className="flex-1 px-5 flex flex-col gap-4 pb-8">
          <div className="flex flex-col items-center py-4">
            <p className="text-gray-400 text-xs mb-4 text-center">Tekan tombol SOS jika kamu dalam bahaya</p>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full bg-red-600/10 radar-ping" />
              <div className="absolute w-36 h-36 rounded-full bg-red-600/10 radar-ping" style={{animationDelay:'1s'}} />
              <button
                onClick={() => setSosActive(true)}
                className="relative w-32 h-32 rounded-full bg-red-600 flex flex-col items-center justify-center gap-1 sos-pulse shadow-2xl shadow-red-600/40 active:scale-95 transition-transform"
              >
                <AlertTriangle size={30} className="text-white" />
                <span className="text-white font-bold text-base tracking-widest">SOS</span>
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-4">atau ucapkan: <span className="text-blue-400 font-medium">"{user.keyword}"</span></p>
          </div>

          <button
            onClick={() => setListening(v => !v)}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 border font-medium text-sm transition-all
              ${listening
                ? 'bg-green-600/15 border-green-500/40 text-green-400'
                : 'bg-white/5 border-white/10 text-gray-300'}`}
          >
            {listening
              ? <><Mic size={18} className="blink" /> Mendengarkan kata kunci...</>
              : <><MicOff size={18} /> Aktifkan Pemantauan Suara</>}
          </button>

          {/* Mini map preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-medium">📍 Lokasi GPS Live</p>
              <button onClick={() => setTab('map')} className="text-blue-400 text-xs">Lihat Peta →</button>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-3 flex items-center gap-3">
              <Navigation size={18} className="text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                {location
                  ? <p className="text-gray-300 text-xs">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                  : <p className="text-gray-500 text-xs">Mengambil lokasi GPS...</p>}
              </div>
              {location && (
                <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                  target="_blank" rel="noreferrer"
                  className="text-blue-400 text-xs underline">Buka</a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-blue-400" />
                <p className="text-gray-400 text-xs">Kontak Darurat</p>
              </div>
              <p className="text-white text-2xl font-bold">{user.contacts?.filter(c => c.name && c.phone).length ?? 0}</p>
              <p className="text-gray-500 text-xs mt-0.5">terdaftar</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-green-400" />
                <p className="text-gray-400 text-xs">Status Sistem</p>
              </div>
              <p className="text-green-400 text-sm font-bold mt-1">● Aktif</p>
              <p className="text-gray-500 text-xs mt-0.5">SafeWalk berjalan</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PETA LIVE */}
      {tab === 'map' && (
        <div className="flex-1 px-5 pb-8 flex flex-col gap-4 fade-in">
          <div className="bg-blue-600/10 rounded-2xl p-3 border border-blue-500/20 flex items-center gap-3">
            <Navigation size={16} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-300 text-sm font-medium">Pemantauan Lokasi Aktif</p>
              <p className="text-gray-400 text-xs">Powered by OpenStreetMap · Update otomatis</p>
            </div>
          </div>

          <LiveMap location={location} />

          {location && (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
              <p className="text-white text-sm font-medium">Detail Koordinat</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Latitude</p>
                  <p className="text-white text-sm font-mono">{location.lat.toFixed(6)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Longitude</p>
                  <p className="text-white text-sm font-mono">{location.lng.toFixed(6)}</p>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                target="_blank" rel="noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm text-center font-medium"
              >
                Buka di Google Maps →
              </a>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
            <p className="text-white text-sm font-medium mb-2">🔗 Bagikan Lokasi</p>
            <p className="text-gray-400 text-xs mb-3">Kirim lokasi real-time ke kontak darurat via WhatsApp</p>
            {user.contacts?.filter(c => c.name && c.phone).map((c, i) => {
              const locText = location
                ? `https://maps.google.com/?q=${location.lat},${location.lng}`
                : 'Lokasi tidak tersedia'
              const msg = encodeURIComponent(`📍 Lokasi saya sekarang:\n${locText}\n\n— SafeWalk AI`)
              return (
                <a key={i}
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g,'')}?text=${msg}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 bg-green-600/10 border border-green-500/20 rounded-xl px-4 py-3 mb-2"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-white">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{c.name}</p>
                    <p className="text-gray-400 text-xs">Kirim via WhatsApp</p>
                  </div>
                  <span className="text-green-400 text-xs">→</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB: KONTAK */}
      {tab === 'contacts' && (
        <div className="flex-1 px-5 pb-8 flex flex-col gap-4 fade-in">
          <div className="bg-blue-600/10 rounded-2xl p-4 border border-blue-500/20">
            <p className="text-blue-300 text-sm">Kontak berikut akan dihubungi otomatis saat SOS aktif.</p>
          </div>
          {user.contacts?.filter(c => c.name && c.phone).map((c, i) => (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold
                ${c.type === 'keamanan' ? 'bg-blue-600' : 'bg-red-600'}`}>
                {c.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{c.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.phone}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs
                  ${c.type === 'keamanan' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                  {c.type === 'keamanan' ? 'Penjaga Keamanan' : 'Keluarga / Teman'}
                </span>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g,'')}`}
                className="w-9 h-9 rounded-full bg-green-600/20 flex items-center justify-center">
                <Phone size={15} className="text-green-400" />
              </a>
            </div>
          ))}
          <button
            onClick={() => { localStorage.removeItem('safewalk_user'); router.push('/register') }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 text-gray-400 text-sm"
          >
            Edit Kontak
          </button>
        </div>
      )}

      {/* TAB: PENGATURAN */}
      {tab === 'settings' && (
        <div className="flex-1 px-5 pb-8 flex flex-col gap-4 fade-in">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{user.phone}</p>
              <p className="text-blue-400 text-xs mt-1">Kata kunci: <strong>"{user.keyword}"</strong></p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic size={16} className="text-blue-400" />
                <div>
                  <p className="text-white text-sm">Pemantauan Suara</p>
                  <p className="text-gray-500 text-xs">Deteksi kata kunci otomatis</p>
                </div>
              </div>
              <button
                onClick={() => setListening(v => !v)}
                className={`w-11 h-6 rounded-full transition-all relative ${listening ? 'bg-green-500' : 'bg-white/20'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${listening ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400" />
                <div>
                  <p className="text-white text-sm">GPS Tracking</p>
                  <p className="text-gray-500 text-xs">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Belum terdeteksi'}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-blue-400" />
                <div>
                  <p className="text-white text-sm">Notifikasi Darurat</p>
                  <p className="text-gray-500 text-xs">Alert saat terdeteksi bahaya</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>

          <button
            onClick={() => { localStorage.removeItem('safewalk_user'); router.push('/register') }}
            className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-sm flex items-center justify-center gap-2"
          >
            <Settings size={16} /> Edit Profil & Kata Kunci
          </button>

          <button onClick={logout}
            className="w-full py-3.5 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2">
            <LogOut size={16} /> Keluar
          </button>

          <p className="text-center text-gray-600 text-xs mt-2">SafeWalk AI v2.0.0 · OpenStreetMap Integration</p>
        </div>
      )}

      <KeywordListener keyword={user.keyword} onDetected={handleDetected} active={listening} />
      <SOSModal trigger={sosActive} contacts={user.contacts?.filter(c => c.name && c.phone)} location={location} onClose={handleSOSClose} />
    </div>
  )
}
