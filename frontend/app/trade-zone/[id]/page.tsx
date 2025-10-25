import {sanityFetch} from '@/sanity/lib/live'
import {tradeZoneItemQuery} from '@/sanity/lib/queries'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import Link from 'next/link'
import {notFound} from 'next/navigation'

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
  _createdAt: string
}

interface TradeZoneDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function TradeZoneDetail({params}: TradeZoneDetailProps) {
  const {id} = await params
  const {data: item} = await sanityFetch({
    query: tradeZoneItemQuery,
    params: {id},
  })

  if (!item) {
    notFound()
  }

  const tradeItem = item as TradeZoneItem

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
              {tradeItem.images && tradeItem.images.length > 0 ? (
                <div className="space-y-4 trade-zone-detail-image-gallery">
                  {/* Main Image */}
                  <div className="relative h-96 rounded-lg overflow-hidden trade-zone-detail-main-image">
                    <Image
                      src={urlForImage(tradeItem.images[0])?.url() || tradeItem.imageUrls?.[0] || ''}
                      alt={tradeItem.title}
                      fill
                      className="object-cover trade-zone-detail-main-image-content"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {tradeItem.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 trade-zone-detail-thumbnails">
                      {tradeItem.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative h-20 rounded-lg overflow-hidden trade-zone-detail-thumbnail">
                          <Image
                            src={urlForImage(image)?.url() || tradeItem.imageUrls?.[index + 1] || ''}
                            alt={`${tradeItem.title} - Image ${index + 2}`}
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
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(tradeItem.category)}`}>
                    {getCategoryDisplayName(tradeItem.category)}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(tradeItem.condition)}`}>
                    {getConditionDisplayName(tradeItem.condition)}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 trade-zone-detail-title">
                  {tradeItem.title}
                </h1>
                
                <div className="text-4xl font-bold text-gray-900 mb-4 trade-zone-detail-price">
                  {formatPrice(tradeItem.price)}
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-6 trade-zone-detail-details">
                <div className="trade-zone-detail-seller-info">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Selling By</h3>
                  <p className="text-gray-700">{tradeItem.sellingBy}</p>
                </div>

                <div className="trade-zone-detail-post-time">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posted</h3>
                  <p className="text-gray-700">{formatDate(tradeItem._createdAt)}</p>
                </div>

                {tradeItem.contactInfo && (
                  <div className="trade-zone-detail-contact">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      {tradeItem.contactInfo.phone && (
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span> {tradeItem.contactInfo.phone}
                        </p>
                      )}
                      {tradeItem.contactInfo.email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {tradeItem.contactInfo.email}
                        </p>
                      )}
                      {tradeItem.contactInfo.location && (
                        <p className="text-gray-700">
                          <span className="font-medium">Location:</span> {tradeItem.contactInfo.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="trade-zone-detail-description">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {tradeItem.description}
                  </p>
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-8 trade-zone-detail-contact-actions">
                <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 trade-zone-detail-contact-button">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
