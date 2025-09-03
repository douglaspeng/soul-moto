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
  const [filter, setFilter] = useState('all')
  const [shuffleInstance, setShuffleInstance] = useState<Shuffle | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (galleryItems.length > 0 && gridRef.current) {
      const shuffle = new Shuffle(gridRef.current, {
        itemSelector: '.gallery-item',
        sizer: '.gallery-sizer',
        buffer: 1,
        columnWidth: '.gallery-sizer' as any,
        gutterWidth: 32,
        useTransforms: true,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        speed: 500,
      })

      setShuffleInstance(shuffle)

      return () => {
        if (shuffle) {
          shuffle.destroy()
        }
      }
    }
  }, [galleryItems])

  useEffect(() => {
    if (shuffleInstance) {
      if (filter === 'all') {
        shuffleInstance.filter()
      } else {
        shuffleInstance.filter(filter)
      }
    }
  }, [filter, shuffleInstance])

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of motorcycle moments, events, and memories
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('events')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                filter === 'events'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('rides')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                filter === 'rides'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rides
            </button>
            <button
              onClick={() => setFilter('community')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                filter === 'community'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Community
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {galleryItems && galleryItems.length > 0 ? (
            <div ref={gridRef} className="gallery-grid">
              {/* Sizer element for Shuffle.js */}
              <div className="gallery-sizer w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"></div>
              
              {galleryItems.map((item: GalleryItem) => (
                <div
                  key={item._id}
                  className={`gallery-item w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-6 group cursor-pointer ${
                    getImageClass(item.image)
                  }`}
                  data-groups={['all', 'events', 'rides', 'community'].join(' ')}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mx-3">
                    <div className={`relative ${getImageClass(item.image) === 'portrait' ? 'aspect-[3/4]' : getImageClass(item.image) === 'landscape' ? 'aspect-[3/2]' : 'aspect-square'}`}>
                      {item.image && urlForImage(item.image) ? (
                        <Image
                          src={urlForImage(item.image)?.url() || item.imageUrl || ''}
                          alt={item.image.alt || item.name || 'Gallery image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                                            {/* Hover overlay */}
                      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end pointer-events-none">
                        <div className="w-full p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {item.name && (
                            <h3 className="text-lg font-semibold mb-1 drop-shadow-lg">{item.name}</h3>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-lg">{item.description}</p>
                          )}
                        </div>
                      </div> 
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gallery Items Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your gallery is empty. Add some images in your Sanity Studio to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share Your Moments
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have amazing motorcycle photos or memories to share? Contact us to contribute to our gallery.
          </p>
          <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}
