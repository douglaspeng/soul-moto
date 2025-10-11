'use client'

import {useEffect, useRef, useState} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import Shuffle from 'shufflejs'

interface GalleryItem {
  _id: string
  name?: string
  description?: string
  image: any
  imageUrl?: string
}

interface GalleryClientProps {
  initialItems: GalleryItem[]
}

export default function GalleryClient({initialItems}: GalleryClientProps) {
  const [galleryItems] = useState<GalleryItem[]>(initialItems)
  const [shuffleInstance, setShuffleInstance] = useState<Shuffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading time for images
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (galleryItems.length > 0 && gridRef.current && !isLoading) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (gridRef.current) {
          const shuffle = new Shuffle(gridRef.current, {
            itemSelector: '.gallery-item',
            sizer: '.gallery-sizer',
            buffer: 1,
            columnWidth: '.gallery-sizer' as any,
            gutterWidth: 8,
            useTransforms: true,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            speed: 500,
          })

          setShuffleInstance(shuffle)
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        if (shuffleInstance) {
          shuffleInstance.destroy()
        }
      }
    }
  }, [galleryItems, isLoading])


  const getImageDimensions = (image: any) => {
    if (!image?.asset?._ref) return {width: 1, height: 1}
    
    // Extract dimensions from Sanity asset reference
    const dimensions = image.asset._ref.split('-')[2]?.split('x')
    if (dimensions && dimensions.length === 2) {
      const width = parseInt(dimensions[0])
      const height = parseInt(dimensions[1])
      return {width, height}
    }
    
    return {width: 1, height: 1}
  }

  const getImageClass = (image: any) => {
    const {width, height} = getImageDimensions(image)
    const ratio = height / width
    
    if (ratio > 1.2) return 'portrait' // Tall images
    if (ratio < 0.8) return 'landscape' // Wide images
    return 'square' // Square-ish images
  }

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item)
    setIsImageLoading(true)
    // Prevent body scrolling on mobile
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedImage(null)
    setIsImageLoading(false)
    // Restore body scrolling
    document.body.style.overflow = 'unset'
  }

  return (
    <div className="min-h-screen bg-white gallery-client-page">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 gallery-client-hero-section">
        <div className="max-w-4xl mx-auto text-center gallery-client-hero-container">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 gallery-client-hero-title">
            机车瞬间
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto gallery-client-hero-description">
            浏览我们的摩托车精彩瞬间、活动和美好回忆。
          </p>
        </div>
      </section>

      {/* Filter Buttons we don't need it now*/}
      {/* <section className="py-8 px-4 sm:px-6 lg:px-8 gallery-client-filters-section">
        <div className="max-w-4xl mx-auto gallery-client-filters-container">
          <div className="flex flex-wrap justify-center gap-4 gallery-client-filters">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-all duration-200 gallery-client-filter-button ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('events')}
              className={`px-6 py-2 rounded-full transition-all duration-200 gallery-client-filter-button ${
                filter === 'events'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('rides')}
              className={`px-6 py-2 rounded-full transition-all duration-200 gallery-client-filter-button ${
                filter === 'rides'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rides
            </button>
            <button
              onClick={() => setFilter('community')}
              className={`px-6 py-2 rounded-full transition-all duration-200 gallery-client-filter-button ${
                filter === 'community'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Community
            </button>
          </div>
        </div>
      </section> */}

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 gallery-client-grid-section">
        <div className="max-w-7xl mx-auto gallery-client-grid-container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {/* Shimmer placeholders with random aspect ratios */}
              {Array.from({length: 12}).map((_, index) => {
                // Random aspect ratio for variety (square, portrait, landscape)
                const aspectRatios = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/2]', 'aspect-[2/3]']
                const randomAspect = aspectRatios[index % aspectRatios.length]
                
                return (
                  <div
                    key={`shimmer-${index}`}
                    className="group cursor-pointer gallery-client-shimmer-item"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 gallery-client-shimmer-card">
                      <div className={`relative ${randomAspect} gallery-client-shimmer-aspect`}>
                        <div 
                          className="w-full h-full bg-gray-200 animate-pulse gallery-client-shimmer-placeholder"
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : galleryItems && galleryItems.length > 0 ? (
            <div ref={gridRef} className="gallery-grid">
              {/* Sizer element for Shuffle.js */}
              <div className="gallery-sizer w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"></div>
              
              {galleryItems.map((item: GalleryItem) => (
                <div
                  key={item._id}
                  className={`gallery-item w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-2 group cursor-pointer gallery-client-item ${
                    getImageClass(item.image)
                  }`}
                  onClick={() => openModal(item)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mx-1 gallery-client-item-card">
                    <div className={`relative ${getImageClass(item.image) === 'portrait' ? 'aspect-[3/4]' : getImageClass(item.image) === 'landscape' ? 'aspect-[3/2]' : 'aspect-square'} gallery-client-item-aspect`}>
                      {item.image && urlForImage(item.image) ? (
                        <Image
                          src={urlForImage(item.image)?.url() || item.imageUrl || ''}
                          alt={item.image.alt || item.name || 'Gallery image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 gallery-client-item-image"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center gallery-client-item-placeholder">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300 flex items-end pointer-events-none gallery-client-item-overlay">
                        <div className="w-full p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 gallery-client-item-content">
                          {item.name && (
                            <h3 className="text-lg font-semibold mb-1 drop-shadow-lg gallery-client-item-title">{item.name}</h3>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-lg gallery-client-item-description">{item.description}</p>
                          )}
                        </div>
                      </div> 
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 gallery-client-empty-state">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center gallery-client-empty-icon">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 gallery-client-empty-title">No Gallery Items Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto gallery-client-empty-description">
                Your gallery is empty. Add some images in your Sanity Studio to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action, we don't need it now*/}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 gallery-client-cta-section">
        <div className="max-w-4xl mx-auto text-center gallery-client-cta-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 gallery-client-cta-title">
            Share Your Moments
          </h2>
          <p className="text-lg text-gray-600 mb-8 gallery-client-cta-description">
            Have amazing motorcycle photos or memories to share? Contact us to contribute to our gallery.
          </p>
          <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 gallery-client-cta-button">
            Contact Us
          </button>
        </div>
      </section> */}
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300 ease-out"
          style={{
            backgroundColor: '#ffffff52'
          }}
          onClick={closeModal}
          onTouchEnd={closeModal}
        >
          <div 
            className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-out ${
              getImageClass(selectedImage.image) === 'portrait' 
                ? 'max-w-[90vw] max-h-[90vh]' 
                : getImageClass(selectedImage.image) === 'landscape'
                ? 'max-w-[90vw] max-h-[90vh]'
                : 'max-w-[90vw] max-h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              onTouchEnd={closeModal}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            {selectedImage.image && urlForImage(selectedImage.image) ? (
              <div className={`relative ${
                getImageClass(selectedImage.image) === 'portrait' 
                  ? 'max-h-[90vh] w-auto' 
                  : getImageClass(selectedImage.image) === 'landscape'
                  ? 'max-w-[90vw] h-auto'
                  : 'max-w-[90vw] max-h-[90vh]'
              }`}>
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
                  src={urlForImage(selectedImage.image)?.url() || selectedImage.imageUrl || ''}
                  alt={selectedImage.image.alt || selectedImage.name || 'Gallery image'}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 90vw, 70vw"
                  className={`w-auto h-auto object-contain rounded-lg border-2 sm:border-4 border-white shadow-2xl ${
                    getImageClass(selectedImage.image) === 'portrait' 
                      ? 'max-h-[90vh] w-auto' 
                      : getImageClass(selectedImage.image) === 'landscape'
                      ? 'max-w-[90vw] h-auto'
                      : 'max-w-[90vw] max-h-[90vh]'
                  }`}
                  priority
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
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
