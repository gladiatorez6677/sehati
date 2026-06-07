"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as typeof L.Icon.Default.prototype & { _getIconUrl?: () => string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface FasilitasKesehatan {
  id: string
  nama: string
  jenis: string
  alamat: string
  latitude: number
  longitude: number
  nomorTelepon?: string
  jamBuka?: string
  jamTutup?: string
  layanan?: string
}

interface LeafletMapProps {
  facilities: FasilitasKesehatan[]
  userLocation: [number, number] | null
  selectedFacility: string | null
  onFacilitySelect: (id: string) => void
}

// Component to recenter map
function RecenterMap({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function LeafletMap({
  facilities,
  userLocation,
  selectedFacility,
  onFacilitySelect
}: LeafletMapProps) {
  const defaultCenter: [number, number] = [-6.2088, 106.8456] // Jakarta
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter)
  const [mapZoom, setMapZoom] = useState<number>(13)

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
      setMapZoom(14) // Zoom in more when user location is available
    }
  }, [userLocation])

  const getMarkerIcon = (jenis: string) => {
    const colors = {
      RS: '#ef4444', // red
      Klinik: '#3b82f6', // blue
      Puskesmas: '#10b981', // green
      Apotek: '#f59e0b', // amber
    }

    const color = colors[jenis as keyof typeof colors] || '#6b7280'

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${jenis.charAt(0)}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
  }

  const userIcon = L.divIcon({
    html: `
      <div style="
        background-color: #8b5cf6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid #8b5cf6;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && <RecenterMap center={userLocation} zoom={mapZoom} />}
      
      {/* User Location Marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <strong>Lokasi Anda</strong>
          </Popup>
        </Marker>
      )}

      {/* Facility Markers */}
      {facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={[facility.latitude, facility.longitude]}
          icon={getMarkerIcon(facility.jenis)}
          eventHandlers={{
            click: () => onFacilitySelect(facility.id),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm">{facility.nama}</h3>
              <p className="text-xs text-gray-600 mb-2">{facility.jenis}</p>
              <p className="text-xs mb-1">{facility.alamat}</p>
              {facility.nomorTelepon && (
                <p className="text-xs mb-1">📞 {facility.nomorTelepon}</p>
              )}
              {facility.jamBuka && facility.jamTutup && (
                <p className="text-xs">🕐 {facility.jamBuka} - {facility.jamTutup}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}