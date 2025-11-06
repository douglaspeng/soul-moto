'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import ImageModal from '@/app/components/ImageModal'

interface TradeZoneItem {
  _id: string
  title: string
  sellingBy: string
  price: number
  description: string
  category: string
  condition: string
  images: any[]
  imageUrls: string[]
  contactInfo?: {
    phone?: string
    email?: string
    location?: string
  }
  seller?: {
    name?: string
    image?: any
  } | null
  _createdAt: string
}

interface TradeZoneDetailClientProps {
  item: TradeZoneItem
}

export default function TradeZoneDetailClient({ item }: TradeZoneDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const contactDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setIsContactDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motorcycle':
        return 'bg-red-100 text-red-800'
      case 'gear':
        return 'bg-blue-100 text-blue-800'
      case 'parts':
        return 'bg-green-100 text-green-800'
      case 'accessories':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'motorcycle':
        return 'Motorcycle'
      case 'gear':
        return 'Gear'
      case 'parts':
        return 'Parts'
      case 'accessories':
        return 'Accessories'
      default:
        return category
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800'
      case 'like-new':
        return 'bg-blue-100 text-blue-800'
      case 'good':
        return 'bg-yellow-100 text-yellow-800'
      case 'fair':
        return 'bg-orange-100 text-orange-800'
      case 'poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionDisplayName = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'New'
      case 'like-new':
        return 'Like New'
      case 'good':
        return 'Good'
      case 'fair':
        return 'Fair'
      case 'poor':
        return 'Poor'
      default:
        return condition
    }
  }

  // Check if current user is the owner
  // Check both contactInfo.email and seller email (for items created before the fix)
  const isOwnerByEmail = session && session.user && session.user.email === item.contactInfo?.email
  const isOwnerBySeller = session && session.user && item.seller && 
    (item.seller as any).email === session.user.email
  
  const isOwner = isOwnerByEmail || isOwnerBySeller

  const handleEmailContact = () => {
    if (item.contactInfo?.email) {
      window.location.href = `mailto:${item.contactInfo.email}?subject=Inquiry about ${item.title}`
    }
    setIsContactDropdownOpen(false)
  }

  const handlePhoneContact = () => {
    if (item.contactInfo?.phone) {
      window.location.href = `sms:${item.contactInfo.phone}`
    }
    setIsContactDropdownOpen(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/trade-zone/${item._id}/delete`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete item')
      }

      // Redirect to trade zone list page after successful deletion
      router.push('/trade-zone')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert(`Error deleting item: ${error instanceof Error ? error.message : 'Please try again.'}`)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-white trade-zone-detail-page">
      {/* Back Button */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 trade-zone-detail-back-section">
        <div className="max-w-6xl mx-auto trade-zone-detail-back-container">
          <Link
            href="/trade-zone"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 trade-zone-detail-back-link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trade Zone
          </Link>
        </div>
      </section>

      {/* Item Details */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 trade-zone-detail-content-section">
        <div className="max-w-6xl mx-auto trade-zone-detail-content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 trade-zone-detail-layout">
            {/* Images - Left Side */}
            <div className="trade-zone-detail-images">
              {item.images && item.images.length > 0 ? (
                <div className="space-y-4 trade-zone-detail-image-gallery">
                  {/* Main Image */}
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="relative h-96 rounded-lg overflow-hidden trade-zone-detail-main-image cursor-pointer hover:opacity-95 transition-opacity duration-200"
                  >
                    <Image
                      src={urlForImage(item.images[selectedImageIndex])?.url() || item.imageUrls?.[selectedImageIndex] || ''}
                      alt={item.title}
                      fill
                      className="object-cover trade-zone-detail-main-image-content"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 trade-zone-detail-thumbnails">
                      {item.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 rounded-lg overflow-hidden trade-zone-detail-thumbnail transition-all duration-200 ${
                            selectedImageIndex === index
                              ? 'ring-2 ring-black ring-offset-2'
                              : 'hover:opacity-80'
                          }`}
                        >
                          <Image
                            src={urlForImage(image)?.url() || item.imageUrls?.[index] || ''}
                            alt={`${item.title} - Image ${index + 1}`}
                            fill
                            className="object-cover trade-zone-detail-thumbnail-content"
                            sizes="(max-width: 1024px) 25vw, 12.5vw"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center trade-zone-detail-placeholder">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Item Info - Right Side */}
            <div className="trade-zone-detail-info">
              <div className="mb-6 trade-zone-detail-header">
                <div className="flex items-center gap-3 mb-4 trade-zone-detail-badges">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                    {getCategoryDisplayName(item.category)}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                    {getConditionDisplayName(item.condition)}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 trade-zone-detail-title">
                  {item.title}
                </h1>
                
                <div className="text-4xl font-bold text-gray-900 mb-4 trade-zone-detail-price">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-6 trade-zone-detail-details">
                <div className="trade-zone-detail-seller-info">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Selling By</h3>
                  <div className="flex items-center gap-3">
                    {item.seller?.image && urlForImage(item.seller.image) && (
                      <Image
                        src={urlForImage(item.seller.image)?.url() || ''}
                        alt={item.seller.name || 'Seller avatar'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <p className="text-gray-700">{item.sellingBy || item.seller?.name}</p>
                  </div>
                </div>

                <div className="trade-zone-detail-post-time">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posted</h3>
                  <p className="text-gray-700">{formatDate(item._createdAt)}</p>
                </div>

                {item.contactInfo && (
                  <div className="trade-zone-detail-contact">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      {item.contactInfo.phone && (
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span> {item.contactInfo.phone}
                        </p>
                      )}
                      {/* {item.contactInfo.email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {item.contactInfo.email}
                        </p>
                      )} */}
                      {item.contactInfo.location && (
                        <p className="text-gray-700">
                          <span className="font-medium">Location:</span> {item.contactInfo.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="trade-zone-detail-description">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4 trade-zone-detail-contact-actions">
                {isOwner ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/trade-zone/${item._id}/edit`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Item
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isDeleting ? 'Deleting...' : 'Delete Listing'}
                    </button>
                    <p className="text-sm text-gray-500 text-center">
                      You own this item
                    </p>
                  </div>
                ) : (
                  <div className="relative" ref={contactDropdownRef}>
                    <button 
                      onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 trade-zone-detail-contact-button flex items-center justify-center gap-2"
                    >
                      Contact Seller
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Contact Dropdown */}
                    {isContactDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          {item.contactInfo?.email && (
                            <button
                              onClick={handleEmailContact}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email Seller
                            </button>
                          )}
                          {item.contactInfo?.phone && (
                            <button
                              onClick={handlePhoneContact}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Text Seller
                            </button>
                          )}
                          {!item.contactInfo?.email && !item.contactInfo?.phone && (
                            <div className="px-4 py-3 text-sm text-gray-500">
                              No contact information available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={item.images || []}
        imageUrls={item.imageUrls}
        selectedIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        title={item.title}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => !isDeleting && setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Listing</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{item.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
