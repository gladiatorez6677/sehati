import { NextRequest, NextResponse } from "next/server"

// GET - Ambil fasilitas kesehatan terdekat berdasarkan lokasi
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    // Radius dalam meter (5km)
    const radius = 5000

    // Query Overpass API untuk mendapatkan fasilitas kesehatan terdekat
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        node["amenity"="clinic"](around:${radius},${lat},${lon});
        node["amenity"="doctors"](around:${radius},${lat},${lon});
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        node["healthcare"](around:${radius},${lat},${lon});
      );
      out body;
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Overpass API')
    }

    const data = await response.json()

    // Transform data ke format yang kita butuhkan
    const facilities = data.elements.map((element: any) => {
      // Determine facility type
      let jenis = "Klinik"
      if (element.tags.amenity === "hospital" || element.tags.healthcare === "hospital") {
        jenis = "RS"
      } else if (element.tags.amenity === "pharmacy") {
        jenis = "Apotek"
      } else if (element.tags.healthcare === "centre" || element.tags.healthcare === "clinic") {
        jenis = "Puskesmas"
      }

      // Get opening hours
      let jamBuka = "08:00"
      let jamTutup = "17:00"
      if (element.tags.opening_hours) {
        if (element.tags.opening_hours.includes("24/7")) {
          jamBuka = "00:00"
          jamTutup = "23:59"
        }
      }

      return {
        id: element.id.toString(),
        nama: element.tags.name || element.tags["name:id"] || `${jenis} ${element.id}`,
        jenis: jenis,
        alamat: element.tags["addr:full"] || element.tags["addr:street"] || "Alamat tidak tersedia",
        latitude: element.lat,
        longitude: element.lon,
        nomorTelepon: element.tags.phone || element.tags["contact:phone"] || null,
        jamBuka: jamBuka,
        jamTutup: jamTutup,
        layanan: element.tags.healthcare || element.tags.amenity || null,
        website: element.tags.website || element.tags["contact:website"] || null,
      }
    })

    // Filter out facilities without names
    const namedFacilities = facilities.filter((f: any) => !f.nama.includes(f.jenis))

    // Calculate distance for each facility
    const facilitiesWithDistance = namedFacilities.map((facility: any) => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lon),
        facility.latitude,
        facility.longitude
      )
      return { ...facility, jarak: distance }
    })

    // Sort by distance and take only 10 nearest
    facilitiesWithDistance.sort((a: any, b: any) => a.jarak - b.jarak)
    const nearestFacilities = facilitiesWithDistance.slice(0, 10)

    return NextResponse.json(nearestFacilities)
  } catch (error) {
    console.error("Error fetching nearby facilities:", error)
    
    // Fallback to Nominatim if Overpass fails
    try {
      const searchParams = req.nextUrl.searchParams
      const lat = searchParams.get('lat')
      const lon = searchParams.get('lon')
      
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=hospital+clinic+pharmacy&format=json&lat=${lat}&lon=${lon}&bounded=1&limit=10`
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'SehatKi Health App'
        }
      })
      
      if (!response.ok) {
        throw new Error('Nominatim request failed')
      }
      
      const data = await response.json()
      
      const facilities = data.map((place: any, index: number) => ({
        id: place.place_id || index.toString(),
        nama: place.display_name.split(',')[0],
        jenis: determineType(place.type, place.class),
        alamat: place.display_name,
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        jarak: calculateDistance(
          parseFloat(lat!),
          parseFloat(lon!),
          parseFloat(place.lat),
          parseFloat(place.lon)
        )
      }))
      
      return NextResponse.json(facilities)
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Failed to fetch nearby facilities" },
        { status: 500 }
      )
    }
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

function determineType(type: string, className: string): string {
  if (type === "hospital" || className === "amenity") return "RS"
  if (type === "pharmacy") return "Apotek"
  if (type === "clinic") return "Klinik"
  return "Puskesmas"
}