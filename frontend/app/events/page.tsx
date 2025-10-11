import {sanityFetch} from '@/sanity/lib/live'
import {eventsQuery} from '@/sanity/lib/queries'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import Link from 'next/link'

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

export default async function Events() {
  const {data: events} = await sanityFetch({
    query: eventsQuery,
  })

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
    <div className="min-h-screen bg-white events-page">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 events-hero-section">
        <div className="max-w-4xl mx-auto text-center events-hero-content">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 events-hero-title">
            活动与聚会
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto events-hero-description">
          和我们一起骑行、交流、狂欢。享受属于机车人的欢乐时光！
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 events-list-section">
        <div className="max-w-6xl mx-auto events-list-container">
          {events && events.length > 0 ? (
            <div className="space-y-8 events-list">
              {events.map((event: Event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 events-card"
                >
                  <div className="flex flex-col md:flex-row events-card-layout">
                    {/* Event Image - Left Side */}
                    <div className="md:w-1/3 relative events-card-image-container">
                      {event.eventImage && urlForImage(event.eventImage) ? (
                        <div className="h-64 md:h-full events-card-image-wrapper">
                          <Image
                            src={urlForImage(event.eventImage)?.url() || event.imageUrl || ''}
                            alt={event.eventImage.alt || event.eventName}
                            fill
                            className="object-cover events-card-image"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center events-card-image-placeholder">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Event Content - Right Side */}
                    <div className="md:w-2/3 p-6 md:p-8 events-card-content">
                      <div className="flex items-start justify-between mb-4 events-card-header">
                        <div className="flex-1 events-card-header-content">
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 cursor-pointer events-card-title">
                            {event.eventName}
                          </h2>
                          <div className="flex items-center gap-4 mb-4 events-card-meta">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium events-card-category ${getCategoryColor(event.category)}`}>
                              {getCategoryDisplayName(event.category)}
                            </span>
                            <div className="flex items-center gap-2 text-gray-600 events-card-date">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 events-card-time">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-lg mb-6 leading-relaxed events-card-description">
                        {event.description}
                      </p>

                      {/* <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 events-card-button">
                        Join Event
                      </button> */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 events-empty-state">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center events-empty-icon">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 events-empty-title">No Events Scheduled</h3>
              <p className="text-gray-600 max-w-md mx-auto events-empty-description">
                Check back soon for upcoming motorcycle events and rides. We&apos;re always planning something exciting!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 events-cta-section">
        <div className="max-w-4xl mx-auto text-center events-cta-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 events-cta-title">
            有活动点子？告诉我们！
          </h2>
          <p className="text-lg text-gray-600 mb-8 events-cta-description">
            也许是一场周末骑行，也许是一场摩托骑友的聚会。无论多大多小，我们都乐意和你一起把它办起来。
          </p>
          {/* <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 events-cta-button">
            Contact Us
          </button> */}
        </div>
      </section>
    </div>
  )
}
