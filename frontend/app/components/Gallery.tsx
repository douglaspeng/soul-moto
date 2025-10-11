'use client'

import Image from 'next/image'
import {useState, useEffect} from 'react'

interface GalleryImage {
  src: string
  alt: string
  caption: string
}

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)

  useEffect(() => {
    // Simulate loading time for images
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image)
    setIsImageLoading(true)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2081.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "Thunder hill race track"
            })}
          >
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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2082.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "mt hamilton"
            })}
          >
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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2084.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "hwy 1"
            })}
          >
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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2085.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "offroad trail"
            })}
          >
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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2088.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "hwy 9"
            })}
          >
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
          <div 
            className="relative aspect-[3/2] overflow-hidden group cursor-pointer rounded-[10px] gallery-item"
            onClick={() => openModal({
              src: "/images/home-gallery/IMG_2089.JPG",
              alt: "Soul Moto Crew Community Photo",
              caption: "RW rd"
            })}
          >
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
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
          style={{
            backgroundColor: '#ffffff52'
          }}
          onClick={closeModal}
        >
          <div 
            className="relative max-w-[70vw] max-h-[70vh] flex items-center justify-center transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Image */}
            <div className="relative max-w-full max-h-full">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg border-4 border-white shadow-2xl animate-pulse">
                  <div 
                    className="w-full h-full rounded-lg"
                    style={{
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                </div>
              )}
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={0}
                height={0}
                sizes="70vw"
                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg border-4 border-white shadow-2xl"
                priority
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>
            
          </div>
        </div>
      )}
      
      {/* Shimmer Animation Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}
