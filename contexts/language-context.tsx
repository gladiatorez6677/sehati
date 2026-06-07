"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'id' | 'makassar' | 'bugis'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.home': 'Home',
    'nav.bloodPressure': 'Tekanan Darah',
    'nav.articles': 'Artikel',
    'nav.stress': 'Manajemen Stress',
    'nav.cholesterol': 'Kolesterol',
    'nav.map': 'Peta',
    'nav.relaxation': 'Relaksasi',
    'nav.games': 'Games',
    'nav.ai': 'AI',
    'nav.video': 'Video',

    // Common
    'welcome': 'Selamat Datang',
    'tagline': 'Pantau kesehatan Anda dengan mudah melalui SehatKi',
    'quickAccess': 'Aksi Cepat',
    'recentArticles': 'Artikel Terbaru',
    'viewAll': 'Lihat Semua',
    'search': 'Cari',
    'save': 'Simpan',
    'cancel': 'Batal',
    'delete': 'Hapus',
    'edit': 'Edit',
    'add': 'Tambah',
    
    // Health
    'bloodPressure': 'Tekanan Darah',
    'heartRate': 'Detak Jantung',
    'systolic': 'Sistolik',
    'diastolic': 'Diastolik',
    'normal': 'Normal',
    'high': 'Tinggi',
    'low': 'Rendah',
    
    // Facilities
    'nearestFacilities': 'Fasilitas Terdekat',
    'hospital': 'Rumah Sakit',
    'clinic': 'Klinik',
    'pharmacy': 'Apotek',
    'healthCenter': 'Puskesmas',
  },
  
  makassar: {
    // Navigation
    'nav.home': 'Balla',
    'nav.bloodPressure': 'Pappasanna Dara',
    'nav.articles': 'Tulisang',
    'nav.stress': 'Pakkasiwiyang Pikkirang',
    'nav.cholesterol': 'Kolesterolnu',
    'nav.map': 'Peta',
    'nav.relaxation': 'Rileks',
    'nav.games': 'Accera',
    'nav.ai': 'AI',
    'nav.video': 'Video',

    // Common
    'welcome': 'Salamakki Battumi',
    'tagline': 'Ammantauki kasalamakkangnu sikolaya ri SehatKi',
    'quickAccess': 'Aksi Lompoa',
    'recentArticles': 'Tulisang Beru',
    'viewAll': 'Ciniki Ngaseng',
    'search': 'Sappaki',
    'save': 'Tarroki',
    'cancel': 'Batala',
    'delete': 'Leppasangi',
    'edit': 'Sanraki',
    'add': 'Tambaki',
    
    // Health
    'bloodPressure': 'Pappasanna Dara',
    'heartRate': 'Tikanna Jantung',
    'systolic': 'Sistolik',
    'diastolic': 'Diastolik',
    'normal': 'Biasa',
    'high': 'Tinggi',
    'low': 'Rendah',
    
    // Facilities
    'nearestFacilities': 'Tampa Kasalamakkang Ammuko',
    'hospital': 'Ruma Salapang',
    'clinic': 'Klinik',
    'pharmacy': 'Apotik',
    'healthCenter': 'Puskesmas',
  },
  
  bugis: {
    // Navigation
    'nav.home': 'Bola',
    'nav.bloodPressure': 'Passangenna Dara',
    'nav.articles': 'Tuliseng',
    'nav.stress': 'Pakkatenningi Pikkireng',
    'nav.cholesterol': 'Kolesterolmu',
    'nav.map': 'Peta',
    'nav.relaxation': 'Rileks',
    'nav.games': 'Accera',
    'nav.ai': 'AI',
    'nav.video': 'Video',

    // Common
    'welcome': 'Selamat Engka',
    'tagline': 'Itai salamakkennu sibawa gampang ri SehatKi',
    'quickAccess': 'Aksi Malompoe',
    'recentArticles': 'Tuliseng Baru',
    'viewAll': 'Ita Maneng',
    'search': 'Sappai',
    'save': 'Taroe',
    'cancel': 'Batal',
    'delete': 'Peddei',
    'edit': 'Paddei',
    'add': 'Tambai',
    
    // Health
    'bloodPressure': 'Passangenna Dara',
    'heartRate': 'Detakna Ate',
    'systolic': 'Sistolik',
    'diastolic': 'Diastolik',
    'normal': 'Biasa',
    'high': 'Tanre',
    'low': 'Mawang',
    
    // Facilities
    'nearestFacilities': 'Tampa Salamakkeng Makawe',
    'hospital': 'Ruma Sakit',
    'clinic': 'Klinik',
    'pharmacy': 'Apotik',
    'healthCenter': 'Puskesmas',
  },
  
  jawa: {
    // Navigation
    'nav.home': 'Omah',
    'nav.bloodPressure': 'Tekanan Getih',
    'nav.articles': 'Artikel',
    'nav.stress': 'Ngatur Pikiran',
    'nav.cholesterol': 'Kolesterol',
    'nav.map': 'Peta',
    'nav.relaxation': 'Ayem',
    'nav.games': 'Dolanan',
    'nav.ai': 'AI',
    'nav.video': 'Video',

    // Common
    'welcome': 'Sugeng Rawuh',
    'tagline': 'Pantau kesehatan sampeyan kanthi gampang liwat SehatKi',
    'quickAccess': 'Aksi Cepet',
    'recentArticles': 'Artikel Anyar',
    'viewAll': 'Delok Kabeh',
    'search': 'Golek',
    'save': 'Simpen',
    'cancel': 'Batal',
    'delete': 'Busek',
    'edit': 'Sunting',
    'add': 'Tambah',
    
    // Health
    'bloodPressure': 'Tekanan Getih',
    'heartRate': 'Detak Jantung',
    'systolic': 'Sistolik',
    'diastolic': 'Diastolik',
    'normal': 'Normal',
    'high': 'Dhuwur',
    'low': 'Andhap',
    
    // Facilities
    'nearestFacilities': 'Fasilitas Cedhak',
    'hospital': 'Rumah Sakit',
    'clinic': 'Klinik',
    'pharmacy': 'Apotek',
    'healthCenter': 'Puskesmas',
  },
  
  sunda: {
    // Navigation
    'nav.home': 'Imah',
    'nav.bloodPressure': 'Tekanan Getih',
    'nav.articles': 'Artikel',
    'nav.stress': 'Ngatur Pikiran',
    'nav.cholesterol': 'Kolesterol',
    'nav.map': 'Peta',
    'nav.relaxation': 'Tenang',
    'nav.games': 'Kaulinan',
    'nav.ai': 'AI',
    'nav.video': 'Video',

    // Common
    'welcome': 'Wilujeng Sumping',
    'tagline': 'Pantau kasehatan Anjeun kalayan gampil ngaliwatan SehatKi',
    'quickAccess': 'Aksi Gancang',
    'recentArticles': 'Artikel Anyar',
    'viewAll': 'Tingali Sadaya',
    'search': 'Milari',
    'save': 'Simpen',
    'cancel': 'Batal',
    'delete': 'Hapus',
    'edit': 'Ropéa',
    'add': 'Tambah',
    
    // Health
    'bloodPressure': 'Tekanan Getih',
    'heartRate': 'Detak Jantung',
    'systolic': 'Sistolik',
    'diastolic': 'Diastolik',
    'normal': 'Normal',
    'high': 'Luhur',
    'low': 'Handap',
    
    // Facilities
    'nearestFacilities': 'Fasilitas Caket',
    'hospital': 'Rumah Sakit',
    'clinic': 'Klinik',
    'pharmacy': 'Apoték',
    'healthCenter': 'Puskésmas',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('app-language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations['id'][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}