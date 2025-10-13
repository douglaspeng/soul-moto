'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

interface GalleryItem {
  _id: string
  name?: string
  description?: string
  image: any
  imageUrl?: string
  relatedEvent?: {
    _id: string
    eventName: string
  }
}

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedImage: GalleryItem | null
}

export default function GalleryModal({isOpen, onClose, selectedImage}: GalleryModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(false)

  useEffect(() => {
    if (selectedImage) {
      setIsImageLoading(true)
    }
  }, [selectedImage])

  const getImageClass = (image: any) => {
    if (!image || !image.asset) return 'square'
    
    const {width, height} = image.asset.metadata?.dimensions || {}
    if (!width || !height) return 'square'
    
    const aspectRatio = width / height
    if (aspectRatio > 1.2) return 'landscape'
    if (aspectRatio < 0.8) return 'portrait'
    return 'square'
  }

  if (!isOpen || !selectedImage) return null

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300 ease-out"
      style={{
        backgroundColor: '#ffffff52'
      }}
      onClick={onClose}
      onTouchEnd={onClose}
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
        
        {/* Image */}
        {selectedImage.image && urlForImage(selectedImage.image) ? (
          <div className={`relative ${
            getImageClass(selectedImage.image) === 'portrait' 
              ? 'max-h-[90vh] sm:min-h-[80vh] w-auto' 
              : getImageClass(selectedImage.image) === 'landscape'
              ? 'max-w-[90vw] sm:min-w-[80vw] h-auto'
              : 'max-w-[90vw] max-h-[90vh]'
          }`}>
            {/* Close Button - positioned relative to image */}
            <button
              onClick={onClose}
              onTouchEnd={onClose}
              className="absolute z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              style={{ right: '-30px', top: '-30px' }}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                  ? 'max-h-[90vh] sm:min-h-[80vh] w-auto' 
                  : getImageClass(selectedImage.image) === 'landscape'
                  ? 'max-w-[90vw] sm:min-w-[80vw] h-auto'
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
