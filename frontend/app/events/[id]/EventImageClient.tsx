'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import ImageModal from '@/app/components/ImageModal'

interface EventImageClientProps {
  eventImage: any
  eventImageUrl?: string
  eventName: string
  galleryImages: Array<{
    _id: string
    image: any
    imageUrl?: string
  }>
}

export default function EventImageClient({
  eventImage,
  eventImageUrl,
  eventName,
  galleryImages,
}: EventImageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Combine event image with gallery images (event image first)
  const allImages = eventImage ? [eventImage, ...galleryImages.map((item) => item.image)] : galleryImages.map((item) => item.image)
  const allImageUrls = eventImageUrl ? [eventImageUrl, ...galleryImages.map((item) => item.imageUrl || '')] : galleryImages.map((item) => item.imageUrl || '')

  const openModal = () => {
    setSelectedImageIndex(0) // Start with event image
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        onClick={openModal}
        className="relative h-80 lg:h-96 rounded-lg overflow-hidden event-detail-image-wrapper cursor-pointer hover:opacity-95 transition-opacity duration-200"
      >
        {eventImage && urlForImage(eventImage) ? (
          <Image
            src={urlForImage(eventImage)?.url() || eventImageUrl || ''}
            alt={eventImage.alt || eventName}
            fill
            className="object-cover event-detail-image"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center event-detail-image-placeholder">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allImages}
        imageUrls={allImageUrls}
        selectedIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        title={eventName}
      />
    </>
  )
}

