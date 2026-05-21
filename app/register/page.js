'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, Shield, Plus, Trash2, ChevronRight, ChevronLeft, Mic } from 'lucide-react'

const STEPS = ['Profil', 'Kontak Darurat', 'Kata Kunci']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState({
    name: '', phone: '',
    contacts: [
      { name: '', phone: '', type: 'keluarga' },
      { name: '', phone: '', type: 'keamanan' },
    ],
    keyword: '',
  })
  const [error, setError] = useState('')

  const updateContact = (i, field, val) => {
    const updated = [...form.contacts]
    updated[i] = { ...updated[i], [field]: val }
    setForm(f => ({ ...f, contacts: updated }))
  }

  const addContact = () => setForm(f => ({
    ...f, contacts: [...f.contacts, { name: '', phone: '', type: 'keluarga' }]
  }))

  const removeContact = (i) => setForm(f => ({
    ...f, contacts: f.contacts.filter((_, idx) => idx !== i)
  }))

  const validate = () => {
    if (step === 0) {
      if (!form.name.trim())  { setError('Nama tidak boleh kosong'); return false }
      if (!form.phone.trim()) { setError('Nomor HP tidak boleh kosong'); return false }
    }
    if (step === 1) {
      const hasContact = form.contacts.some(c => c.name && c.phone)
      if (!hasContact) { setError('Tambahkan minimal 1 kontak darurat'); return false }
    }
    if (step === 2) {
      if (!form.keyword.trim()) { setError('Kata kunci darurat tidak boleh kosong'); return false }
    }
    setError('')
    return true
  }

  const next = () => {
    if (!validate()) return
    if (step < STEPS.length - 1) { setStep(s => s + 1) }
    else {
      localStorage.setItem('safewalk_user', JSON.stringify(form))
      router.push('/dashboard')
    }
  }

  const back = () => { setError(''); setStep(s => s - 1) }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {step > 0 && (
          <button onClick={back} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={18} className="text-white" />
          </button>
        )}
        <div className="flex-1">
          <p className="text-gray-400 text-xs">Langkah {step + 1} dari {STEPS.length}</p>
          <h2 className="text-white font-semibold text-lg">{STEPS[step]}</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
            ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {/* STEP 0: Profil */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="bg-blue-600/10 rounded-2xl p-4 border border-blue-500/20">
            <p className="text-blue-300 text-sm leading-relaxed">
              Informasi ini digunakan untuk mengidentifikasi kamu saat sinyal darurat dikirim ke kontak.
            </p>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Nama lengkap</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-3">
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text" placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Nomor HP kamu</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-3">
              <Phone size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="tel" placeholder="+62 8xx xxxx xxxx"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Kontak Darurat */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="bg-yellow-600/10 rounded-2xl p-4 border border-yellow-500/20">
            <p className="text-yellow-300 text-sm leading-relaxed">
              Kontak ini akan <strong>dihubungi otomatis</strong> saat kata kunci darurat terdeteksi atau tombol SOS ditekan.
            </p>
          </div>

          {form.contacts.map((c, i) => (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <select
                  value={c.type}
                  onChange={e => updateContact(i, 'type', e.target.value)}
                  className="bg-blue-600/20 text-blue-300 text-xs rounded-lg px-3 py-1.5 border border-blue-500/30 outline-none"
                >
                  <option value="keluarga">Keluarga / Teman</option>
                  <option value="keamanan">Penjaga Keamanan</option>
                </select>
                {form.contacts.length > 1 && (
                  <button onClick={() => removeContact(i)} className="text-red-400">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                type="text" placeholder="Nama kontak"
                value={c.name}
                onChange={e => updateContact(i, 'name', e.target.value)}
                className="bg-white/5 rounded-xl border border-white/10 px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none w-full"
              />
              <input
                type="tel" placeholder="Nomor HP (+62...)"
                value={c.phone}
                onChange={e => updateContact(i, 'phone', e.target.value)}
                className="bg-white/5 rounded-xl border border-white/10 px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none w-full"
              />
            </div>
          ))}

          <button
            onClick={addContact}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 text-gray-400 text-sm"
          >
            <Plus size={16} /> Tambah kontak lain
          </button>
        </div>
      )}

      {/* STEP 2: Kata Kunci */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="bg-red-600/10 rounded-2xl p-4 border border-red-500/20">
            <p className="text-red-300 text-sm leading-relaxed">
              Ucapkan kata ini saat kamu merasa terancam. SafeWalk AI mendengarkan di latar belakang dan langsung mengaktifkan sinyal darurat.
            </p>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Kata kunci darurat kamu</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-3">
              <Mic size={16} className="text-red-400 flex-shrink-0" />
              <input
                type="text"
                placeholder='Contoh: "tolong", "bahaya", "safewalk"'
                value={form.keyword}
                onChange={e => setForm(f => ({ ...f, keyword: e.target.value }))}
                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
              />
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-2">Contoh kata kunci yang bisa dipakai:</p>
            <div className="flex flex-wrap gap-2">
              {['tolong', 'bahaya', 'bantu saya', 'safewalk sos', 'minta tolong'].map(kw => (
                <button
                  key={kw}
                  onClick={() => setForm(f => ({ ...f, keyword: kw }))}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all
                    ${form.keyword === kw
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-white/15 text-gray-400'}`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Tips keamanan kata kunci</p>
                <ul className="text-gray-400 text-xs mt-1 space-y-1 leading-relaxed list-disc list-inside">
                  <li>Pilih kata yang tidak sering kamu ucapkan sehari-hari</li>
                  <li>Pastikan kata mudah diucapkan saat panik</li>
                  <li>Kata kunci bersifat pribadi, tidak perlu panjang</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Next button */}
      <div className="mt-auto pt-6">
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {step < STEPS.length - 1 ? (
            <><span>Lanjutkan</span><ChevronRight size={18} /></>
          ) : (
            <><Shield size={18} /><span>Mulai Perlindungan</span></>
          )}
        </button>
      </div>
    </div>
  )
}
