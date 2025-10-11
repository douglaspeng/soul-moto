import {servicesQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Image from 'next/image'

interface Service {
  _id: string
  title: string
  description: string
  detailedDescription?: any
  price?: string
  category?: string
  serviceImage?: any
  imageUrl?: string
  isActive: boolean
}

export default async function ServicesPage() {
  const {data: services} = await sanityFetch({
    query: servicesQuery,
  }) as {data: Service[]}

  return (
    <div className="min-h-screen pt-24 services-page">
      <div className="container mx-auto px-4 py-12 services-container">
        <div className="text-center mb-12 services-header">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-4 services-title">
            我们的服务
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto services-description">
            从维护到保养，我们提供贴心的摩托车服务，让你安心骑行、尽情享受每一次旅程。
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 services-grid">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 services-card"
              >
                {service.serviceImage && (
                  <div className="relative h-48 w-full services-card-image-container">
                    <Image
                      src={service.imageUrl || ''}
                      alt={service.serviceImage.alt || service.title}
                      fill
                      className="object-cover services-card-image"
                    />
                  </div>
                )}
                
                <div className="p-6 services-card-content">
                  <div className="flex items-center justify-between mb-3 services-card-header">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full services-card-category">
                      {service.category}
                    </span>
                    {service.price && (
                      <span className="text-lg font-semibold text-black services-card-price">
                        {service.price}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3 services-card-title">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 services-card-description">
                    {service.description}
                  </p>
                  
                  {service.detailedDescription && (
                    <p className="text-sm text-gray-500 line-clamp-2 services-card-detailed-description">
                      {service.detailedDescription}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 services-empty-state">
            <p className="text-gray-500 text-lg services-empty-message">
              No services available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
