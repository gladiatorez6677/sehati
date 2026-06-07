"use client"

import dynamic from 'next/dynamic'

export const DynamicMap = dynamic(
  () => import('./leaflet-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)