"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { DynamicMap } from "@/components/maps/dynamic-map"
import {
  MapPin,
  Phone,
  Clock,
  Search,
  Navigation,
  Filter,
  Hospital,
  Stethoscope,
  Home,
  Pill,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  jarak?: number
}

export default function PetaFasilitasPage() {
  const [facilities, setFacilities] = useState<FasilitasKesehatan[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<FasilitasKesehatan[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [jenisFilter, setJenisFilter] = useState("semua")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    // Try to get user location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          fetchFacilities(latitude, longitude)
          toast({
            title: "Lokasi Ditemukan",
            description: "Menampilkan 10 fasilitas terdekat dari lokasi Anda",
          })
        },
        (error) => {
          // If location fails, fetch default facilities
          fetchFacilities()
        }
      )
    } else {
      // If geolocation not supported, fetch default facilities
      fetchFacilities()
    }
  }, [])

  useEffect(() => {
    filterFacilities()
  }, [facilities, searchQuery, jenisFilter, userLocation])

  const fetchFacilities = async (latitude?: number, longitude?: number) => {
    try {
      let url = "/api/fasilitas-kesehatan"
      
      // If user location is available, fetch nearby facilities from internet
      if (latitude && longitude) {
        url = `/api/fasilitas-kesehatan/nearby?lat=${latitude}&lon=${longitude}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setFacilities(data)
      }
    } catch (error) {
      console.error("Error fetching facilities:", error)
    }
  }

  const getUserLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setIsLoadingLocation(false)
          // Fetch new facilities based on current location
          fetchFacilities(latitude, longitude)
          toast({
            title: "Lokasi Ditemukan",
            description: "Menampilkan 10 fasilitas terdekat dari lokasi Anda",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
          toast({
            title: "Error",
            description: "Tidak dapat mendeteksi lokasi Anda",
            variant: "destructive",
          })
        }
      )
    } else {
      setIsLoadingLocation(false)
      toast({
        title: "Error",
        description: "Browser Anda tidak mendukung geolocation",
        variant: "destructive",
      })
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filterFacilities = () => {
    let filtered = [...facilities]

    // Filter by type
    if (jenisFilter !== "semua") {
      filtered = filtered.filter((f) => f.jenis === jenisFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (f.layanan && f.layanan.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map((f) => ({
        ...f,
        jarak: f.jarak || calculateDistance(userLocation[0], userLocation[1], f.latitude, f.longitude),
      }))
      // Sort by distance
      filtered.sort((a, b) => (a.jarak || 0) - (b.jarak || 0))
    }

    setFilteredFacilities(filtered)
  }

  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case "RS":
        return <Hospital className="h-4 w-4" />
      case "Klinik":
        return <Stethoscope className="h-4 w-4" />
      case "Puskesmas":
        return <Home className="h-4 w-4" />
      case "Apotek":
        return <Pill className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const openInGoogleMaps = (facility: FasilitasKesehatan) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`
    window.open(url, '_blank')
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          Peta Fasilitas Kesehatan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Temukan fasilitas kesehatan terdekat dari lokasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Search & List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search & Filters */}
          <Card>
            <CardHeader className="pb-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari fasilitas..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={jenisFilter} onValueChange={setJenisFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Fasilitas</SelectItem>
                    <SelectItem value="RS">Rumah Sakit</SelectItem>
                    <SelectItem value="Klinik">Klinik</SelectItem>
                    <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                    <SelectItem value="Apotek">Apotek</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={getUserLocation}
                  disabled={isLoadingLocation}
                  variant="outline"
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isLoadingLocation ? "Mencari lokasi..." : "Gunakan Lokasi Saya"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Facilities List */}
          <Card className="h-[600px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {userLocation 
                  ? `Fasilitas Terdekat dari Lokasi Anda (${filteredFacilities.length})` 
                  : `Fasilitas Terdekat (${filteredFacilities.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-y-auto pb-4">
              {filteredFacilities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Tidak ada fasilitas ditemukan
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredFacilities.map((facility) => (
                    <div
                      key={facility.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedFacility === facility.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setSelectedFacility(facility.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getJenisIcon(facility.jenis)}
                          <h3 className="font-semibold text-sm">{facility.nama}</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {facility.jenis}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{facility.alamat}</p>
                      <div className="space-y-1">
                        {facility.jarak !== undefined && (
                          <p className="text-xs text-primary font-medium">
                            📍 {facility.jarak.toFixed(1)} km
                          </p>
                        )}
                        {facility.jamBuka && facility.jamTutup && (
                          <p className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {facility.jamBuka} - {facility.jamTutup}
                          </p>
                        )}
                        {facility.nomorTelepon && (
                          <p className="text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {facility.nomorTelepon}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          openInGoogleMaps(facility)
                        }}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Petunjuk Arah
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Map */}
        <div className="lg:col-span-2">
          <Card className="h-[700px]">
            <CardContent className="p-0 h-full">
              <DynamicMap
                facilities={filteredFacilities}
                userLocation={userLocation}
                selectedFacility={selectedFacility}
                onFacilitySelect={setSelectedFacility}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}