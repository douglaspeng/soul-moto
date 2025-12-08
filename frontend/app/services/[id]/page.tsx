import {sanityFetch} from '@/sanity/lib/live'
import {serviceQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import {getShortEventId} from '@/app/utils/shortId'

interface Service {
  _id: string
  title: string
  description: string
  detailedDescription?: string
  price?: string
  category?: string
  serviceImage?: any
  imageUrl?: string
  isActive: boolean
}

interface ServiceDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function ServiceDetail({params}: ServiceDetailProps) {
  const {id} = await params
  
  // Check if id is a short ID (8 characters or less) or full ID
  // If it's a short ID, we need to find the matching service
  let serviceId = id
  if (id.length <= 8) {
    // Short ID - fetch all services and find the matching one
    const allServicesResult = await sanityFetch({
      query: `*[_type == "service"] { _id }`,
    })
    const matchingService = allServicesResult.data?.find((service: any) => 
      getShortEventId(service._id) === id.toLowerCase()
    )
    if (matchingService) {
      serviceId = matchingService._id
    } else {
      notFound()
    }
  }
  
  // Fetch service data
  const serviceResult = await sanityFetch({
    query: serviceQuery,
    params: {id: serviceId},
  })

  const service = serviceResult.data as Service | null

  if (!service || !service.isActive) {
    notFound()
  }

  const getCategoryDisplayName = (category?: string) => {
    if (!category) return 'Other'
    const categoryTitles: Record<string, string> = {
      'maintenance': 'Maintenance',
      'repair': 'Repair',
      'customization': 'Customization',
      'consultation': 'Consultation',
      'training': 'Training',
      'other': 'Other',
    }
    return categoryTitles[category] || category
  }

  return (
    <div className="min-h-screen bg-white service-detail-page">
      {/* Back Button */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 service-detail-back-section">
        <div className="max-w-6xl mx-auto service-detail-back-container">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 service-detail-back-link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>
      </section>

      {/* Service Header */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 service-detail-header-section">
        <div className="max-w-6xl mx-auto service-detail-header-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 service-detail-header-layout">
            {/* Service Image - Left Side */}
            {service.serviceImage && service.imageUrl && (
              <div className="lg:col-span-1 service-detail-image-container">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg service-detail-image-wrapper">
                  <Image
                    src={service.imageUrl}
                    alt={service.serviceImage.alt || service.title}
                    fill
                    className="object-cover service-detail-image"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>
            )}

            {/* Service Info - Right Side */}
            <div className={`${service.serviceImage ? 'lg:col-span-2' : 'lg:col-span-3'} service-detail-info-container`}>
              <div className="flex flex-col h-full justify-center service-detail-info-content">
                {/* Category and Price */}
                <div className="flex items-center gap-4 mb-4 service-detail-meta">
                  {service.category && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full service-detail-category">
                      {getCategoryDisplayName(service.category)}
                    </span>
                  )}
                  {service.price && (
                    <span className="text-2xl font-semibold text-black service-detail-price">
                      {service.price}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-6 service-detail-title">
                  {service.title}
                </h1>

                {/* Description */}
                <div className="mb-8 service-detail-description-section">
                  <p className="text-xl text-gray-600 leading-relaxed service-detail-description">
                    {service.description}
                  </p>
                </div>

                {/* Detailed Description */}
                {service.detailedDescription && (
                  <div className="mb-8 service-detail-detailed-description-section">
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line service-detail-detailed-description">
                      {service.detailedDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

