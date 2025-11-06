'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

interface GalleryItem {
  _id: string
  name?: string | null
  description?: string | null
  image: any
  imageUrl?: string | null
  relatedEvent?: any
}

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedImage: GalleryItem | null
  allImages?: GalleryItem[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

export default function GalleryModal({
  isOpen, 
  onClose, 
  selectedImage, 
  allImages = [], 
  currentIndex = 0,
  onIndexChange
}: GalleryModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(false)

  useEffect(() => {
    if (selectedImage) {
      setIsImageLoading(true)
    }
  }, [selectedImage])

  const handlePrevious = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (allImages.length > 1 && onIndexChange) {
      setIsImageLoading(true) // Show loading immediately
      const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1
      onIndexChange(newIndex)
    }
  }

  const handleNext = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (allImages.length > 1 && onIndexChange) {
      setIsImageLoading(true) // Show loading immediately
      const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0
      onIndexChange(newIndex)
    }
  }

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

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={handlePrevious}
                onTouchEnd={handlePrevious}
                className="absolute left-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={handleNext}
                onTouchEnd={handleNext}
                className="absolute right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <Image
              src={urlForImage(selectedImage.image)?.url() || selectedImage.imageUrl || ''}
              alt={selectedImage.image.alt || selectedImage.name || 'Gallery image'}
              width={0}
              height={0}
              sizes="(max-width: 768px) 90vw, 70vw"
              className={`w-auto h-auto object-contain rounded-lg border-2 sm:border-4 border-white shadow-2xl transition-opacity duration-200 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              } ${
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
            {isImageLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg border-4 border-white shadow-2xl flex items-center justify-center z-30 pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 text-sm font-medium">Loading image...</p>
                </div>
              </div>
            )}
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
  )
}
