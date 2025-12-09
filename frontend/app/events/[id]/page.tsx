import {sanityFetch} from '@/sanity/lib/live'
import {eventQuery, galleryImagesForEventQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {headers} from 'next/headers'
import ShareButton from './ShareButton'
import EventGalleryClient from './EventGalleryClient'
import EventImageClient from './EventImageClient'
import {getShortEventId} from '@/app/utils/shortId'

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

// Force dynamic rendering to ensure short ID lookup works correctly
// This prevents static generation/caching that could cause 404s for short URLs
export const dynamic = 'force-dynamic'

export default async function EventDetail({params}: EventDetailProps) {
  const {id} = await params
  
  // Get the current domain from headers
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${protocol}://${host}`
  
  // Check if id is a short ID (8 characters or less), UUID format, or full Sanity ID
  let eventId = id
  
  // UUID pattern: 8-4-4-4-12 format (e.g., c497b2fe-f21b-4ab7-ac81-4cf5febfea50)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const isShortId = id.length <= 8
  const isUuid = uuidPattern.test(id)
  
  // If it's a UUID, try using it directly as a Sanity ID first (Sanity IDs can be UUIDs)
  // Then try looking it up if direct query fails
  if (isUuid) {
    // First, try using the UUID directly as the Sanity document ID
    // Sanity document IDs can be UUIDs, so try: "event.{uuid}" or just "{uuid}"
    const possibleIds = [
      id, // Direct UUID
      `event.${id}`, // With event prefix
      `drafts.event.${id}`, // Draft version
    ]
    
    // Try all possible ID formats in parallel
    const testResults = await Promise.all(
      possibleIds.map(possibleId =>
        sanityFetch({
          query: eventQuery,
          params: {id: possibleId},
        }).then(result => ({id: possibleId, data: result.data}))
      )
    )
    
    // Find the first successful match
    const successfulMatch = testResults.find(result => result.data)
    if (successfulMatch) {
      eventId = successfulMatch.id
    } else {
      // If direct query didn't work, try looking up by matching UUID in all events
      const allEventsResult = await sanityFetch({
        query: `*[_type == "event"] { _id }`,
      })
      
      const searchIdLower = id.toLowerCase()
      const searchIdNoDashes = searchIdLower.replace(/-/g, '')
      
      const matchingEvent = allEventsResult.data?.find((event: any) => {
        const eventIdLower = event._id.toLowerCase()
        
        // Strategy 1: Check if the Sanity ID contains the UUID (with or without dashes)
        if (eventIdLower.includes(searchIdLower) || eventIdLower.includes(searchIdNoDashes)) {
          return true
        }
        
        // Strategy 2: Check if the short ID matches the first 8 chars of UUID
        const shortId = getShortEventId(event._id)
        if (shortId === searchIdLower.substring(0, 8)) {
          return true
        }
        
        // Strategy 3: Extract UUID from Sanity ID and compare
        const eventIdParts = eventIdLower.split('.')
        for (const part of eventIdParts) {
          if (part === searchIdLower || part === searchIdNoDashes) {
            return true
          }
          if (part.includes(searchIdLower) || part.includes(searchIdNoDashes)) {
            return true
          }
        }
        
        return false
      })
      
      if (matchingEvent) {
        eventId = matchingEvent._id
      } else {
        notFound()
      }
    }
  } else if (isShortId) {
    // Short ID - first try using it directly as a Sanity ID (with possible prefixes)
    const possibleIds = [
      id, // Direct short ID
      `event.${id}`, // With event prefix
      `drafts.event.${id}`, // Draft version
    ]
    
    // Try all possible ID formats in parallel
    const testResults = await Promise.all(
      possibleIds.map(possibleId =>
        sanityFetch({
          query: eventQuery,
          params: {id: possibleId},
        }).then(result => ({id: possibleId, data: result.data}))
      )
    )
    
    // Find the first successful match
    const successfulMatch = testResults.find(result => result.data)
    if (successfulMatch) {
      eventId = successfulMatch.id
    } else {
      // If direct query didn't work, fetch all events and find the matching one
      const allEventsResult = await sanityFetch({
        query: `*[_type == "event"] { _id }`,
      })
      
      const searchIdLower = id.toLowerCase()
      
      const matchingEvent = allEventsResult.data?.find((event: any) => {
        const eventShortId = getShortEventId(event._id)
        // Direct match
        if (eventShortId === searchIdLower) {
          return true
        }
        // Also check if the event ID itself starts with the short ID
        // (in case the short ID is part of a longer ID)
        const eventIdLower = event._id.toLowerCase()
        if (eventIdLower.startsWith(searchIdLower) || eventIdLower.includes(searchIdLower)) {
          return true
        }
        return false
      })
      
      if (matchingEvent) {
        eventId = matchingEvent._id
      } else {
        notFound()
      }
    }
  }
  // If it's not a short ID or UUID, assume it's a full Sanity ID and use it directly
  
  // Fetch event data and related gallery images in parallel
  const [eventResult, galleryResult] = await Promise.all([
    sanityFetch({
      query: eventQuery,
      params: {id: eventId},
    }),
    sanityFetch({
      query: galleryImagesForEventQuery,
      params: {eventId: eventId},
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
      case 'track':
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
      case 'track':
        return 'Track'
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-white event-detail-page">
      {/* Back Button */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 event-detail-back-section">
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
              <EventImageClient
                eventImage={eventData.eventImage}
                eventImageUrl={eventData.imageUrl}
                eventName={eventData.eventName}
                galleryImages={galleryImages}
              />
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
                <ShareButton eventUrl={`${baseUrl}/events/${getShortEventId(eventData._id)}`} />
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
