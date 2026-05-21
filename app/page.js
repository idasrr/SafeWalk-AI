'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, Phone, Mic } from 'lucide-react'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('safewalk_user')
    if (user) router.push('/dashboard')
  }, [router])

  const features = [
    { icon: Mic,    title: 'Deteksi Kata Kunci',    desc: 'Ucapkan kata darurat yang kamu daftarkan, sistem langsung aktif' },
    { icon: Phone,  title: 'Hubungi Kontak Darurat', desc: 'Otomatis menelepon orang terdekat dan penjaga keamanan sekitar' },
    { icon: Eye,    title: 'Prediksi Risiko AI',     desc: 'Analisis kondisi perjalanan real-time berbasis machine learning' },
  ]

  return (
    <div className="min-h-screen flex flex-col px-6 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
          <Shield size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">SafeWalk AI</h1>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Teman perjalanan malam kamu.<br />Waspada otomatis, bantuan tanpa sentuh layar.
        </p>
      </div>

      {/* Fitur */}
      <div className="flex flex-col gap-4 mb-10">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="flex items-start gap-4 bg-white/5 rounded-2xl px-4 py-4 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{title}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={() => router.push('/register')}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
        >
          Mulai Sekarang
        </button>
        <p className="text-center text-gray-500 text-xs">
          Dengan melanjutkan kamu menyetujui penggunaan mikrofon dan lokasi GPS untuk fitur keamanan.
        </p>
      </div>
    </div>
  )
}
