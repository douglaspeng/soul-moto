'use client'

import Image from 'next/image'
import {useState, useEffect} from 'react'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for images
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <div className="w-full px-[10px]">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg mx-auto w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {Array.from({length: 6}).map((_, index) => (
              <div key={index} className="relative aspect-[3/2] overflow-hidden rounded-[10px]">
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-16 gallery-section" style={{ boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.1)' }}>
      <div className="w-full px-[10px] gallery-container">
        <h3 className="text-3xl md:text-4xl font-bold text-black text-center mb-12 gallery-title">
          Our Community
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] gallery-grid">
          {/* Gallery Item 1 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2081.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                Thunder hill race track
              </span>
            </div>
          </div>
          
          {/* Gallery Item 2 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2082.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                mt hamilton
              </span>
            </div>
          </div>
          
          {/* Gallery Item 3 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2084.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                hwy 1
              </span>
            </div>
          </div>
          
          {/* Gallery Item 4 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2085.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                offroad trail
              </span>
            </div>
          </div>
          
          {/* Gallery Item 5 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2088.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                hwy 9
              </span>
            </div>
          </div>
          
          {/* Gallery Item 6 */}
          <div className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item">
            <Image
              src="/images/home-gallery/IMG_2089.JPG"
              alt="Soul Moto Crew Community Photo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 gallery-image"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center gallery-overlay">
              <span className="text-black font-bold text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 gallery-caption">
                RW rd
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
