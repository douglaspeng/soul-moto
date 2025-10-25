'use client'

import { useEffect } from 'react'

interface SuccessNotificationProps {
  isVisible: boolean
  onClose: () => void
  message: string
  redirectUrl?: string
}

export default function SuccessNotification({ 
  isVisible, 
  onClose, 
  message, 
  redirectUrl 
}: SuccessNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
        if (redirectUrl) {
          window.location.href = redirectUrl
        }
      }, 3000) // Auto-close after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, redirectUrl])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Message */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Close Button */}
          <button
            onClick={() => {
              onClose()
              if (redirectUrl) {
                window.location.href = redirectUrl
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
