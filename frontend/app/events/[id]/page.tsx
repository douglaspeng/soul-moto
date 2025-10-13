import {sanityFetch} from '@/sanity/lib/live'
import {eventQuery, galleryImagesForEventQuery} from '@/sanity/lib/queries'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import ShareButton from './ShareButton'
import EventGalleryClient from './EventGalleryClient'

interface Event {
  _id: string
  eventName: string
  description: string
  detail: string
  date: string
  time: string
  category: string
  eventImage?: any
  imageUrl?: string
}

interface GalleryImage {
  _id: string
  name?: string
  description?: string
  image: any
  imageUrl?: string
  relatedEvent?: any
}

interface EventDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetail({params}: EventDetailProps) {
  const {id} = await params
  
  // Fetch event data and related gallery images in parallel
  const [eventResult, galleryResult] = await Promise.all([
    sanityFetch({
      query: eventQuery,
      params: {id},
    }),
    sanityFetch({
      query: galleryImagesForEventQuery,
      params: {eventId: id},
    })
  ])

  const event = eventResult.data
  const galleryImages = galleryResult.data as GalleryImage[]

  if (!event) {
    notFound()
  }

  const eventData = event as Event

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social':
        return 'bg-blue-100 text-blue-800'
      case 'sport':
        return 'bg-red-100 text-red-800'
      case 'chill-ride':
        return 'bg-green-100 text-green-800'
      case 'fast-pace-ride':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'social':
        return 'Social'
      case 'sport':
        return 'Sport'
      case 'chill-ride':
        return 'Chill Ride'
      case 'fast-pace-ride':
        return 'Fast Pace Ride'
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-white event-detail-page">
      {/* Back Button */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 event-detail-back-section">
        <div className="max-w-6xl mx-auto event-detail-back-container">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 event-detail-back-link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>
      </section>

      {/* Event Header */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 event-detail-header-section">
        <div className="max-w-6xl mx-auto event-detail-header-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 event-detail-header-layout">
            {/* Event Image - Left Side */}
            <div className="lg:col-span-1 event-detail-image-container">
              {eventData.eventImage && urlForImage(eventData.eventImage) ? (
                <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden event-detail-image-wrapper">
                  <Image
                    src={urlForImage(eventData.eventImage)?.url() || eventData.imageUrl || ''}
                    alt={eventData.eventImage.alt || eventData.eventName}
                    fill
                    className="object-cover event-detail-image"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center event-detail-image-placeholder">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Event Info - Right Side */}
            <div className="lg:col-span-2 event-detail-info">
              <div className="mb-6 event-detail-header-info">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 event-detail-category ${getCategoryColor(eventData.category)}`}>
                  {getCategoryDisplayName(eventData.category)}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 event-detail-title">
                  {eventData.eventName}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed event-detail-description">
                  {eventData.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 event-detail-meta">
                <div className="flex items-center gap-3 event-detail-meta-item">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center event-detail-meta-icon">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="event-detail-meta-content">
                    <p className="text-sm text-gray-500 event-detail-meta-label">Date</p>
                    <p className="font-semibold text-gray-900 event-detail-meta-value">{formatDate(eventData.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 event-detail-meta-item">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center event-detail-meta-icon">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="event-detail-meta-content">
                    <p className="text-sm text-gray-500 event-detail-meta-label">Time</p>
                    <p className="font-semibold text-gray-900 event-detail-meta-value">{eventData.time}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 event-detail-actions">
                {/* <button className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
                  Join Event
                </button> */}
                <ShareButton eventUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/events/${id}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 event-detail-content-section">
        <div className="max-w-4xl mx-auto event-detail-content-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center event-detail-content-title">
            活动信息
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm event-detail-content-card">
            <div className="prose prose-lg max-w-none event-detail-content-text">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {eventData.detail}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 event-gallery-section">
          <div className="max-w-6xl mx-auto event-gallery-container">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center event-gallery-title">
              活动照片
            </h2>
            <EventGalleryClient galleryImages={galleryImages} />
          </div>
        </section>
      )}

      {/* Related Events or Call to Action, we don't need this for now */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 event-detail-cta-section">
        <div className="max-w-4xl mx-auto text-center event-detail-cta-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 event-detail-cta-title">
            Questions About This Event?
          </h2>
          <p className="text-lg text-gray-600 mb-8 event-detail-cta-description">
            Need more information or have questions? Don&apos;t hesitate to reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center event-detail-cta-actions">
            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 event-detail-cta-button">
              Contact Organizer
            </button>
            <Link
              href="/events"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 event-detail-cta-link"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  )
}
