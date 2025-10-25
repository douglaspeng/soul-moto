import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const title = formData.get('title') as string
    const sellingBy = formData.get('sellingBy') as string
    const nickname = formData.get('nickname') as string
    const price = Number(formData.get('price'))
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const condition = formData.get('condition') as string
    const contactInfo = JSON.parse(formData.get('contactInfo') as string)
    const images = formData.getAll('images') as File[]

    // Validate required fields
    if (!title || !price || !description || !category || !condition || images.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upload images to Sanity
    const uploadedImages = []
    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const asset = await client.assets.upload('image', buffer, {
        filename: image.name,
        contentType: image.type,
      })
      
      uploadedImages.push({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      })
    }

    // Create the trade zone item
    const tradeZoneItem = await client.create({
      _type: 'tradeZone',
      title,
      sellingBy: nickname || sellingBy, // Use nickname if provided, otherwise use real name
      price,
      description,
      category,
      condition,
      images: uploadedImages,
      contactInfo,
      isActive: true,
      seller: {
        _type: 'reference',
        _ref: session.user.id, // This will be the user's Sanity ID
      },
    })

    return NextResponse.json({ 
      success: true, 
      id: tradeZoneItem._id 
    })

  } catch (error) {
    console.error('Error creating trade zone item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' }, 
      { status: 500 }
    )
  }
}
