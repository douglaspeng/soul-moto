'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

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
  seller?: {
    name: string
    image?: string
  }
  contactInfo?: {
    phone?: string
    email?: string
    location?: string
  }
  _createdAt: string
}

interface TradeZoneClientProps {
  tradeItems: TradeZoneItem[]
}

export default function TradeZoneClient({ tradeItems }: TradeZoneClientProps) {
  const { data: session, status } = useSession()

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
      <section className="pt-10 px-4 sm:px-6 lg:px-8 trade-zone-hero-section">
        <div className="max-w-6xl mx-auto text-center trade-zone-hero-container">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 trade-zone-hero-title">
            Trade Zone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto trade-zone-hero-description">
            在我们的社区内买卖摩托车、装备、零件和配件。
            从可信赖的骑士那里找到超值好物。
          </p>
          
          {/* Start Selling Button */}
          {session ? (
            <div className="mt-8">
              <Link
                href="/trade-zone/sell"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start Selling
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google to Sell
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trade Items Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 trade-zone-items-section">
        <div className="max-w-7xl mx-auto trade-zone-items-container">
          {tradeItems && tradeItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 trade-zone-grid">
              {tradeItems.map((item) => (
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
                    
                    {/* Seller Info with Profile Picture */}
                    <div className="flex items-center justify-between text-sm text-gray-500 trade-zone-item-footer">
                      <div className="flex items-center gap-2">
                        {item.seller?.image ? (
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={item.seller.image}
                              alt={item.seller.name}
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                        <span className="trade-zone-item-seller">By {item.seller?.name || item.sellingBy}</span>
                      </div>
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
