import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

/**
 * This endpoint fixes ownership for items where the email might not match
 * It updates contactInfo.email to match the session user's email
 * Only works if the item has a seller reference that matches the current user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the trade zone item
    const item = await client.fetch(
      `*[_type == "tradeZone" && _id == $id][0]{
        _id,
        contactInfo,
        seller->{
          _id,
          email
        }
      }`,
      { id }
    )

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Verify ownership by checking seller email
    if (!item.seller || item.seller.email !== session.user.email) {
      return NextResponse.json({ 
        error: 'Forbidden: You can only fix ownership for your own listings' 
      }, { status: 403 })
    }

    // Update the contactInfo.email to match session email
    await client
      .patch(id)
      .set({
        'contactInfo.email': session.user.email,
      })
      .commit()

    return NextResponse.json({ 
      success: true,
      message: 'Ownership fixed successfully'
    })

  } catch (error) {
    console.error('Error fixing ownership:', error)
    return NextResponse.json(
      { error: 'Failed to fix ownership' }, 
      { status: 500 }
    )
  }
}

