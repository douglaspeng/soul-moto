'use client'

import {useSession, signIn} from 'next-auth/react'
import {useState} from 'react'
import EventSignupForm from './EventSignupForm'

interface EventSignupButtonProps {
  eventId: string
}

export default function EventSignupButton({eventId}: EventSignupButtonProps) {
  const {data: session, status} = useSession()
  const [showForm, setShowForm] = useState(false)

  const handleClick = async () => {
    if (status === 'loading') {
      return // Still loading
    }

    if (!session) {
      // User not logged in, redirect to sign in
      await signIn('google', {
        callbackUrl: window.location.href,
      })
      return
    }

    // User is logged in, show the form
    setShowForm(!showForm)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
      >
        加入活动
      </button>
      {showForm && session && (
        <EventSignupForm
          eventId={eventId}
          user={session.user}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </>
  )
}

