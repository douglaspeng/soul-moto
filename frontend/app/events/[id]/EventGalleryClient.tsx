'use client'

import {useState} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import ImageModal from '@/app/components/ImageModal'

interface GalleryImage {
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

interface EventGalleryClientProps {
  galleryImages: GalleryImage[]
}

function EventGalleryClient({galleryImages}: EventGalleryClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (galleryImage: GalleryImage) => {
    const index = galleryImages.findIndex((img) => img._id === galleryImage._id)
    if (index !== -1) {
      setSelectedImageIndex(index)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 event-gallery-grid">
        {galleryImages.map((galleryImage) => (
          <div 
            key={galleryImage._id} 
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 event-gallery-item cursor-pointer"
            onClick={() => openModal(galleryImage)}
          >
            <div className="aspect-square relative event-gallery-image-container">
              <Image
                src={urlForImage(galleryImage.image)?.url() || galleryImage.imageUrl || ''}
                alt={galleryImage.name || galleryImage.description || 'Event gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 event-gallery-image"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
              />
            </div>
            {(galleryImage.name || galleryImage.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300 flex items-end event-gallery-overlay">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 event-gallery-caption">
                  {galleryImage.name && (
                    <h3 className="font-semibold text-sm mb-1 event-gallery-caption-title">
                      {galleryImage.name}
                    </h3>
                  )}
                  {galleryImage.description && (
                    <p className="text-xs text-gray-200 event-gallery-caption-description">
                      {galleryImage.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={galleryImages.map((item) => item.image)}
        imageUrls={galleryImages.map((item) => item.imageUrl || '')}
        selectedIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        title="Event Gallery"
      />
    </>
  )
}

export default EventGalleryClient
