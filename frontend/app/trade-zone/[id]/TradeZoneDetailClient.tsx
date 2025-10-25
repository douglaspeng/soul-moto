'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
  const isOwner = session?.user?.email === item.contactInfo?.email

  return (
    <div className="min-h-screen bg-white trade-zone-detail-page">
      {/* Back Button */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 trade-zone-detail-back-section">
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
                  <div className="relative h-96 rounded-lg overflow-hidden trade-zone-detail-main-image">
                    <Image
                      src={urlForImage(item.images[0])?.url() || item.imageUrls?.[0] || ''}
                      alt={item.title}
                      fill
                      className="object-cover trade-zone-detail-main-image-content"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 trade-zone-detail-thumbnails">
                      {item.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative h-20 rounded-lg overflow-hidden trade-zone-detail-thumbnail">
                          <Image
                            src={urlForImage(image)?.url() || item.imageUrls?.[index + 1] || ''}
                            alt={`${item.title} - Image ${index + 2}`}
                            fill
                            className="object-cover trade-zone-detail-thumbnail-content"
                            sizes="(max-width: 1024px) 25vw, 12.5vw"
                          />
                        </div>
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
                    <p className="text-gray-700">{item.seller?.name || item.sellingBy}</p>
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
                      {item.contactInfo.email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {item.contactInfo.email}
                        </p>
                      )}
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
                    <p className="text-sm text-gray-500 text-center">
                      You own this item
                    </p>
                  </div>
                ) : (
                  <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 trade-zone-detail-contact-button">
                    Contact Seller
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
