'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faMotorcycle, faMugHot, faStopwatch } from '@fortawesome/free-solid-svg-icons'

interface Event {
  _id: string
  eventName: string
  date: string
  category: string
  eventImage?: any
  imageUrl?: string
}

interface EventCalendarProps {
  events: Event[]
  startDate: Date
  endDate: Date
}

export default function EventCalendar({ events, startDate, endDate }: EventCalendarProps) {
  // Initialize to the start date (oldest event month)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const start = new Date(startDate)
    start.setDate(1)
    return start
  })
  
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {}
    events.forEach((event) => {
      const dateKey = new Date(event.date).toISOString().split('T')[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })
    return grouped
  }, [events])

  // Get all months between start and end date
  const months = useMemo(() => {
    const monthsList: Date[] = []
    const current = new Date(startDate)
    current.setDate(1) // Start of month
    
    while (current <= endDate) {
      monthsList.push(new Date(current))
      current.setMonth(current.getMonth() + 1)
    }
    return monthsList
  }, [startDate, endDate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social':
        return 'bg-blue-500'
      case 'sport':
        return 'bg-red-500'
      case 'chill-ride':
        return 'bg-green-500'
      case 'track':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social':
        // Multiple people icon
        return <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
      case 'sport':
        // Motorcycle icon
        return <FontAwesomeIcon icon={faMotorcycle} className="w-4 h-4" />
      case 'chill-ride':
        // Coffee icon
        return <FontAwesomeIcon icon={faMugHot} className="w-4 h-4" />
      case 'track':
        // Timer/Stopwatch icon
        return <FontAwesomeIcon icon={faStopwatch} className="w-4 h-4" />
      default:
        return <FontAwesomeIcon icon={faStopwatch} className="w-4 h-4" />
    }
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getEventCountForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    return eventsByDate[dateKey]?.length || 0
  }

  const isDateInRange = (date: Date) => {
    return date >= startDate && date <= endDate
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const canNavigatePrev = useMemo(() => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    const startMonth = new Date(startDate)
    startMonth.setDate(1)
    return prevMonth >= startMonth
  }, [currentMonth, startDate])

  const canNavigateNext = useMemo(() => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const endMonth = new Date(endDate)
    endMonth.setDate(1)
    return nextMonth <= endMonth
  }, [currentMonth, endDate])

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={!canNavigatePrev}
          className={`p-1 rounded-lg transition-colors ${
            canNavigatePrev
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-base font-semibold text-gray-900">
          {formatMonthYear(currentMonth)}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          disabled={!canNavigateNext}
          className={`p-1 rounded-lg transition-colors ${
            canNavigateNext
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {(() => {
          const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
          const days: React.ReactElement[] = []

          // Empty cells for days before month starts
          for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(
              <div key={`empty-${i}`} className="h-8" />
            )
          }

          // Days of the month
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const dateKey = date.toISOString().split('T')[0]
            const eventCount = getEventCountForDate(date)
            const dateEvents = eventsByDate[dateKey] || []
            const inRange = isDateInRange(date)
            const today = isToday(date)

            days.push(
              <div
                key={day}
                className="relative"
                onMouseEnter={(e) => {
                  if (eventCount > 0) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredDate(dateKey)
                    setHoverPosition({
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    })
                  }
                }}
                onMouseLeave={() => {
                  setHoveredDate(null)
                  setHoverPosition(null)
                }}
              >
                <Link
                  href={eventCount > 0 ? `/events/${dateEvents[0]._id}` : '#'}
                  className={`h-8 relative overflow-hidden block ${
                    inRange
                      ? today
                        ? 'ring-2 ring-blue-400'
                        : ''
                      : 'opacity-50'
                  }`}
                >
                  {eventCount > 0 ? (
                    <div className={`h-full flex flex-col items-center justify-center ${getCategoryColor(dateEvents[0].category)}`}>
                      {/* Category Icon */}
                      <div className="text-white">
                        {getCategoryIcon(dateEvents[0].category)}
                      </div>
                      {/* Day number */}
                      <div className="absolute top-0 left-0 bg-black/50 text-white text-[10px] font-medium px-0.5 leading-tight">
                        {day}
                      </div>
                      {/* Multiple events indicator */}
                      {eventCount > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-0.5 leading-tight">
                          +{eventCount - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`h-full flex items-center justify-center ${
                      inRange
                        ? today
                          ? 'bg-blue-50'
                          : ''
                        : 'bg-gray-50'
                    }`}>
                      <div
                        className={`text-xs font-medium ${
                          today ? 'text-blue-600 font-bold' : 'text-gray-900'
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            )
          }

          return days
        })()}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Social</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Sport</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Chill Ride</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Track</span>
          </div>
        </div>
      </div>

      {/* Hover Card */}
      {hoveredDate && hoverPosition && eventsByDate[hoveredDate] && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
          onMouseEnter={() => {
            // Keep card visible when hovering over it
          }}
          onMouseLeave={() => {
            setHoveredDate(null)
            setHoverPosition(null)
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-64 pointer-events-auto">
            {eventsByDate[hoveredDate].map((event, idx) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3 p-3">
                  <div className={`w-12 h-12 flex-shrink-0 rounded flex items-center justify-center ${getCategoryColor(event.category)}`}>
                    <div className="text-white">
                      {getCategoryIcon(event.category)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{event.eventName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {idx < eventsByDate[hoveredDate].length - 1 && (
                  <div className="border-t border-gray-200" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

