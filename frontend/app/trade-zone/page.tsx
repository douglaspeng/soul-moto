import {sanityFetch} from '@/sanity/lib/live'
import {tradeZoneQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

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

export default async function TradeZone() {
  const {data: tradeItems} = await sanityFetch({
    query: tradeZoneQuery,
  })

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
      month: 'short',
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
    <div className="min-h-screen bg-white trade-zone-page">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 trade-zone-hero-section">
        <div className="max-w-6xl mx-auto text-center trade-zone-hero-container">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 trade-zone-hero-title">
            Trade Zone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto trade-zone-hero-description">
            Buy and sell motorcycles, gear, parts, and accessories within our community. 
            Find great deals from trusted riders.
          </p>
        </div>
      </section>

      {/* Trade Items Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 trade-zone-items-section">
        <div className="max-w-7xl mx-auto trade-zone-items-container">
          {tradeItems && tradeItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 trade-zone-grid">
              {(tradeItems as TradeZoneItem[]).map((item) => (
                <Link
                  key={item._id}
                  href={`/trade-zone/${item._id}`}
                  className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 trade-zone-item"
                >
                  {/* Item Image */}
                  <div className="aspect-square relative overflow-hidden rounded-t-lg trade-zone-item-image-container">
                    {item.images && item.images.length > 0 && urlForImage(item.images[0]) ? (
                      <Image
                        src={urlForImage(item.images[0])?.url() || item.imageUrls?.[0] || ''}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 trade-zone-item-image"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center trade-zone-item-placeholder">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 trade-zone-item-category-badge">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {getCategoryDisplayName(item.category)}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4 trade-zone-item-details">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 trade-zone-item-title">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2 trade-zone-item-meta">
                      <span className="text-2xl font-bold text-gray-900 trade-zone-item-price">
                        {formatPrice(item.price)}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                        {getConditionDisplayName(item.condition)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 trade-zone-item-footer">
                      <span className="trade-zone-item-seller">By {item.sellingBy}</span>
                      <span className="trade-zone-item-date">{formatDate(item._createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 trade-zone-empty-state">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center trade-zone-empty-icon">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 trade-zone-empty-title">
                No Items Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto trade-zone-empty-description">
                No items are currently listed in the Trade Zone. Check back later for new listings.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
