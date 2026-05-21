'use client'

export function predictRisk(jam, kondisiJalan, pencahayaan, cuaca) {
  let score = 0
  if (kondisiJalan === 'Sepi')        score += 2
  else if (kondisiJalan === 'Sedang') score += 1
  if (pencahayaan === 'Gelap')        score += 2
  if (cuaca === 'Hujan')              score += 1
  if ([22, 23, 0, 1].includes(jam))  score += 2
  else if ([20, 21].includes(jam))   score += 1

  if (score >= 5) return 'Rendah'
  if (score >= 3) return 'Sedang'
  return 'Tinggi'
}

export function getRiskColor(level) {
  if (level === 'Rendah')  return { bg: 'bg-red-900/60',    text: 'text-red-400',    border: 'border-red-500',    dot: 'bg-red-500'    }
  if (level === 'Sedang')  return { bg: 'bg-yellow-900/40', text: 'text-yellow-400', border: 'border-yellow-500', dot: 'bg-yellow-400' }
  return                          { bg: 'bg-green-900/40',  text: 'text-green-400',  border: 'border-green-500',  dot: 'bg-green-500'  }
}

export function getRiskIcon(level) {
  if (level === 'Rendah') return '🔴'
  if (level === 'Sedang') return '🟡'
  return '🟢'
}

export function getRiskAdvice(level) {
  if (level === 'Rendah') return [
    'Hindari jalan gelap dan sepi',
    'Aktifkan pemantauan kata kunci',
    'Beritahu kontak darurat lokasimu',
    'Pertimbangkan menunggu di tempat ramai',
  ]
  if (level === 'Sedang') return [
    'Tetap waspada selama perjalanan',
    'Pilih rute yang ramai dan terang',
    'Bagikan lokasi ke kontak terpercaya',
  ]
  return [
    'Kondisi relatif aman, tetap hati-hati',
    'Pemantauan kata kunci tetap aktif',
  ]
}
