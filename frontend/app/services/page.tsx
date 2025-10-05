import {servicesQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Image from 'next/image'

export default async function ServicesPage() {
  const {data: services} = await sanityFetch({
    query: servicesQuery,
  })

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional motorcycle services to keep your ride in perfect condition
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {service.serviceImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.imageUrl || ''}
                      alt={service.serviceImage.alt || service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                    {service.price && (
                      <span className="text-lg font-semibold text-black">
                        {service.price}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {service.detailedDescription && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {service.detailedDescription}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No services available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
