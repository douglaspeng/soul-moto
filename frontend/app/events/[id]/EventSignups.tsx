'use client'

import Image from 'next/image'
import {useSession} from 'next-auth/react'
import {useState} from 'react'
import EventSignupEditModal from './EventSignupEditModal'

interface Signup {
  _id: string
  name: string
  note?: string
  userImage?: string
  signedUpAt: string
  userId?: string
  userEmail?: string
}

interface EventSignupsProps {
  signups: Signup[]
}

export default function EventSignups({signups}: EventSignupsProps) {
  const {data: session} = useSession()
  const [editingSignup, setEditingSignup] = useState<Signup | null>(null)

  if (!signups || signups.length === 0) {
    return null
  }

  // Check if a signup belongs to the current user
  const isOwnSignup = (signup: Signup) => {
    if (!session?.user) return false
    const userEmail = session.user.email
    const userId = (session.user as any).id
    return signup.userEmail === userEmail || signup.userId === userId
  }

  const handleSignupClick = (signup: Signup) => {
    if (isOwnSignup(signup)) {
      setEditingSignup(signup)
    }
  }

  const handleCloseModal = () => {
    setEditingSignup(null)
  }

  const handleSuccess = () => {
    setEditingSignup(null)
    // Refresh the page to show updated data
    window.location.reload()
  }

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            活动参与者 ({signups.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {signups.map((signup) => {
              const isOwn = isOwnSignup(signup)
              return (
                <div
                  key={signup._id}
                  onClick={() => handleSignupClick(signup)}
                  className={`bg-white border rounded-lg p-4 transition-all ${
                    isOwn
                      ? 'border-blue-300 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {signup.userImage ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={signup.userImage}
                          alt={signup.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-lg font-semibold">
                          {signup.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{signup.name}</p>
                        {isOwn && (
                          <span className="text-xs text-blue-600 font-medium">(You)</span>
                        )}
                      </div>
                      {signup.note && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{signup.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {editingSignup && (
        <EventSignupEditModal
          signup={editingSignup}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}

