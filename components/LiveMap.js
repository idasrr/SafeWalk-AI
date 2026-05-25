'use client'
import { useEffect, useRef } from 'react'

export default function LiveMap({ location }) {
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!location) return

    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS dynamically
    const initMap = () => {
      const L = window.L
      if (!L) return

      if (!mapObjRef.current && mapRef.current) {
        // Init map
        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([location.lat, location.lng], 16)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map)

        // Custom red pulsing marker icon
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(220,38,38,0.2);animation:radar-ping 2s ease-out infinite;"></div>
              <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(220,38,38,0.15);animation:radar-ping 2s ease-out infinite;animation-delay:1s;"></div>
              <div style="width:16px;height:16px;border-radius:50%;background:#dc2626;border:3px solid white;box-shadow:0 0 8px rgba(220,38,38,0.8);position:relative;z-index:10;"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        const marker = L.marker([location.lat, location.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;font-size:12px;text-align:center;">
              <strong>📍 Lokasi Kamu</strong><br/>
              <span style="color:#666;">${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}</span>
            </div>
          `)

        mapObjRef.current = map
        markerRef.current = marker
      } else if (mapObjRef.current && markerRef.current) {
        // Update marker position
        markerRef.current.setLatLng([location.lat, location.lng])
        mapObjRef.current.setView([location.lat, location.lng], 16)
      }
    }

    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => {
      // Don't destroy map on re-render, only on unmount
    }
  }, [location])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove()
        mapObjRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  if (!location) {
    return (
      <div className="w-full h-48 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-xs">Mengambil lokasi GPS...</p>
        <p className="text-gray-600 text-xs">Pastikan izin lokasi sudah diaktifkan</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10" style={{ height: '220px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
