import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {client} from '@/sanity/lib/client'

// Update signup
export async function PATCH(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()
    const {name, note} = body

    if (!name) {
      return NextResponse.json(
        {error: 'Name is required'},
        {status: 400}
      )
    }

    // Get user ID from session
    const userId = (session.user as any).id || session.user.email
    const userEmail = session.user.email

    // Verify the signup belongs to the current user
    const signup = await client.fetch(
      `*[_type == "eventSignup" && _id == $id][0] {
        _id,
        "userId": user._ref,
        "userEmail": user->email
      }`,
      {id}
    )

    if (!signup) {
      return NextResponse.json(
        {error: 'Signup not found'},
        {status: 404}
      )
    }

    // Check if the signup belongs to the current user
    if (signup.userEmail !== userEmail && signup.userId !== userId) {
      return NextResponse.json(
        {error: 'You can only edit your own signup'},
        {status: 403}
      )
    }

    // Update the signup
    await client.patch(id).set({
      name: name.trim(),
      note: note || '',
    }).commit()

    return NextResponse.json({success: true}, {status: 200})
  } catch (error) {
    console.error('Error updating event signup:', error)
    return NextResponse.json(
      {error: 'Failed to update event signup'},
      {status: 500}
    )
  }
}

// Delete signup
export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // Get user ID from session
    const userId = (session.user as any).id || session.user.email
    const userEmail = session.user.email

    // Verify the signup belongs to the current user
    const signup = await client.fetch(
      `*[_type == "eventSignup" && _id == $id][0] {
        _id,
        "userId": user._ref,
        "userEmail": user->email
      }`,
      {id}
    )

    if (!signup) {
      return NextResponse.json(
        {error: 'Signup not found'},
        {status: 404}
      )
    }

    // Check if the signup belongs to the current user
    if (signup.userEmail !== userEmail && signup.userId !== userId) {
      return NextResponse.json(
        {error: 'You can only delete your own signup'},
        {status: 403}
      )
    }

    // Delete the signup
    await client.delete(id)

    return NextResponse.json({success: true}, {status: 200})
  } catch (error) {
    console.error('Error deleting event signup:', error)
    return NextResponse.json(
      {error: 'Failed to delete event signup'},
      {status: 500}
    )
  }
}

