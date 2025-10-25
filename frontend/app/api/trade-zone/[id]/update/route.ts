import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { client } from '@/sanity/lib/client'

export async function PUT(
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
    const existingImages = JSON.parse(formData.get('existingImages') as string || '[]')

    // Validate required fields
    if (!title || !price || !description || !category || !condition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upload new images to Sanity
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

    // Combine existing and new images
    const allImages = [...existingImages, ...uploadedImages]

    // Update the trade zone item
    const updatedItem = await client
      .patch(id)
      .set({
        title,
        sellingBy: nickname || sellingBy, // Use nickname if provided, otherwise use real name
        price,
        description,
        category,
        condition,
        images: allImages,
        contactInfo,
      })
      .commit()

    return NextResponse.json({ 
      success: true, 
      id: updatedItem._id 
    })

  } catch (error) {
    console.error('Error updating trade zone item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' }, 
      { status: 500 }
    )
  }
}
