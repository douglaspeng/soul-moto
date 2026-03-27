import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {client} from '@/sanity/lib/client'

const VALID_TYPES = ['hoodie', 'tshirt']
const VALID_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
const VALID_COLORS = ['White', 'Black']

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()
    const {name, clothType, size, color} = body

    if (!name || !clothType || !size || !color) {
      return NextResponse.json(
        {error: 'Name, cloth type, size, and color are required.'},
        {status: 400},
      )
    }

    if (!VALID_TYPES.includes(clothType)) {
      return NextResponse.json({error: 'Invalid cloth type.'}, {status: 400})
    }
    if (!VALID_SIZES.includes(size)) {
      return NextResponse.json({error: 'Invalid size.'}, {status: 400})
    }
    if (!VALID_COLORS.includes(color)) {
      return NextResponse.json({error: 'Invalid color.'}, {status: 400})
    }

    const userId = (session.user as any).id || session.user.email

    if (!userId) {
      return NextResponse.json({error: 'User ID not found.'}, {status: 400})
    }

    // Resolve or create user document
    let userRef: string
    const existingUser = await client.fetch(
      `*[_type == "user" && (email == $email || _id == $userId)][0]`,
      {email: session.user.email, userId},
    )

    if (existingUser) {
      userRef = existingUser._id
    } else {
      const newUser = await client.create({
        _type: 'user',
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
      userRef = newUser._id
    }

    const order = await client.create({
      _type: 'gearOrder',
      name: name.trim(),
      clothType,
      size,
      color,
      user: {
        _type: 'reference',
        _ref: userRef,
      },
      received: false,
      orderedAt: new Date().toISOString(),
    })

    return NextResponse.json({success: true, order}, {status: 201})
  } catch (error) {
    console.error('Error creating gear order:', error)
    return NextResponse.json({error: 'Failed to create gear order.'}, {status: 500})
  }
}
