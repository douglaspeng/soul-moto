import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

export async function DELETE(
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

    // Get the trade zone item to verify ownership
    const item = await client.fetch(
      `*[_type == "tradeZone" && _id == $id][0]{
        _id,
        contactInfo,
        seller->{
          email
        }
      }`,
      { id }
    )

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Verify ownership - check both contactInfo email and seller email
    const isOwnerByEmail = item.contactInfo?.email === session.user.email
    const isOwnerBySeller = item.seller?.email === session.user.email
    
    if (!isOwnerByEmail && !isOwnerBySeller) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own listings' }, { status: 403 })
    }

    // Delete the trade zone item
    await client.delete(id)

    return NextResponse.json({ 
      success: true,
      message: 'Item deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting trade zone item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' }, 
      { status: 500 }
    )
  }
}

