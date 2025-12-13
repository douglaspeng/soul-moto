'use client'

import { useState } from 'react'

interface ShareButtonProps {
  eventUrl: string
}

export default function ShareButton({ eventUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      
      // Reset the "Copied" text after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = eventUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 cursor-pointer share-button"
    >
      {copied ? '已复制!' : '分享活动'}
    </button>
  )
}
