'use client'
import { useEffect, useState } from 'react'
import { PhoneCall, MapPin, X, AlertTriangle } from 'lucide-react'

export default function SOSModal({ trigger, contacts, location, onClose }) {
  const [countdown, setCountdown] = useState(5)
  const [called, setCalled]       = useState(false)

  useEffect(() => {
    if (!trigger) { setCountdown(5); setCalled(false); return }

    const emergency = contacts?.find(c => c.type === 'keluarga') || contacts?.[0]
    const security  = contacts?.find(c => c.type === 'keamanan')

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCalled(true)

          // Auto-call kontak utama via tel:
          if (emergency?.phone) {
            window.location.href = `tel:${emergency.phone.replace(/\s/g, '')}`
          }

          // Buka WhatsApp ke kontak keamanan
          setTimeout(() => {
            const locText = location
              ? `📍 Lokasi saya: https://maps.google.com/?q=${location.lat},${location.lng}`
              : '📍 Lokasi tidak tersedia'
            const msg = encodeURIComponent(
              `🚨 *DARURAT - SafeWalk AI*\n\nSaya membutuhkan bantuan segera!\n${locText}\n\nHubungi saya sekarang.`
            )
            if (security?.phone) {
              window.open(`https://wa.me/${security.phone.replace(/[^0-9]/g,'')}?text=${msg}`, '_blank')
            }
          }, 1500)

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [trigger, contacts, location])

  if (!trigger) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 slide-up">
      <div className="w-full max-w-md bg-[#0f1923] border-t-2 border-red-500 rounded-t-3xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-base">Sinyal Darurat Aktif</p>
              <p className="text-red-400 text-xs">
                {called ? 'Menghubungi kontak darurat...' : `Menelepon dalam ${countdown} detik`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Countdown ring */}
        {!called && (
          <div className="flex justify-center mb-5">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-red-600/20 listening-ring" />
              <div className="absolute inset-0 rounded-full bg-red-600/10 listening-ring" style={{animationDelay:'0.5s'}} />
              <div className="relative w-20 h-20 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{countdown}</span>
              </div>
            </div>
          </div>
        )}

        {/* Lokasi */}
        {location && (
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <MapPin size={16} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-medium">Lokasi GPS terdeteksi</p>
              <p className="text-gray-400 text-xs">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
            </div>
          </div>
        )}

        {/* Kontak */}
        <p className="text-gray-400 text-xs mb-3">Kontak yang dihubungi:</p>
        <div className="flex flex-col gap-2 mb-5">
          {contacts?.map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                ${c.type === 'keamanan' ? 'bg-blue-600' : 'bg-red-600'}`}>
                {c.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{c.name}</p>
                <p className="text-gray-400 text-xs">{c.phone} · {c.type === 'keamanan' ? 'Penjaga Keamanan' : 'Kontak Darurat'}</p>
              </div>
              {called && (
                <div className="flex items-center gap-1">
                  <PhoneCall size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs">Menghubungi</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Batalkan */}
        {!called && (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl border border-white/20 text-white text-sm"
          >
            Batalkan — Saya Aman
          </button>
        )}
      </div>
    </div>
  )
}
