'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: any[]
  imageUrls?: string[]
  selectedIndex: number
  onIndexChange: (index: number) => void
  title?: string
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  imageUrls = [],
  selectedIndex,
  onIndexChange,
  title = 'Image',
}: ImageModalProps) {
  // Handle keyboard navigation and prevent body scroll
  useEffect(() => {
    if (!isOpen) return

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft' && images.length > 1) {
        event.preventDefault()
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
        onIndexChange(newIndex)
      } else if (event.key === 'ArrowRight' && images.length > 1) {
        event.preventDefault()
        const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
        onIndexChange(newIndex)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, images.length, selectedIndex, onClose, onIndexChange])

  if (!isOpen || !images || images.length === 0) return null

  const currentImage = images[selectedIndex]
  const currentImageUrl = urlForImage(currentImage)?.url() || imageUrls[selectedIndex] || ''

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
    onIndexChange(newIndex)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
    onIndexChange(newIndex)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
        aria-label="Close modal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImageUrl}
          alt={`${title} - Image ${selectedIndex + 1}`}
          width={0}
          height={0}
          sizes="90vw"
          className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
          priority
        />
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

