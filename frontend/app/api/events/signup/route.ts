import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {client} from '@/sanity/lib/client'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()
    const {eventId, name, note, userImage} = body

    if (!eventId || !name) {
      return NextResponse.json(
        {error: 'Event ID and name are required'},
        {status: 400}
      )
    }

    // Get user ID from session (set by next-auth callback)
    const userId = (session.user as any).id || session.user.email

    if (!userId) {
      return NextResponse.json(
        {error: 'User ID not found'},
        {status: 400}
      )
    }

    // Get or create user reference
    let userRef
    const existingUser = await client.fetch(
      `*[_type == "user" && (email == $email || _id == $userId)][0]`,
      {
        email: session.user.email,
        userId: userId,
      }
    )

    if (existingUser) {
      userRef = existingUser._id
    } else {
      // Create new user document
      const newUser = await client.create({
        _type: 'user',
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
      userRef = newUser._id
    }

    // Check if user already signed up for this event
    const existingSignup = await client.fetch(
      `*[_type == "eventSignup" && event._ref == $eventId && user._ref == $userRef][0]`,
      {
        eventId,
        userRef,
      }
    )

    if (existingSignup) {
      return NextResponse.json(
        {error: 'You have already signed up for this event'},
        {status: 400}
      )
    }

    // Create signup document
    const signup = await client.create({
      _type: 'eventSignup',
      event: {
        _type: 'reference',
        _ref: eventId,
      },
      user: {
        _type: 'reference',
        _ref: userRef,
      },
      name,
      note: note || '',
      userImage: userImage || session.user.image || '',
      signedUpAt: new Date().toISOString(),
    })

    return NextResponse.json({success: true, signup}, {status: 201})
  } catch (error) {
    console.error('Error creating event signup:', error)
    return NextResponse.json(
      {error: 'Failed to create event signup'},
      {status: 500}
    )
  }
}

