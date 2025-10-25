import {sanityFetch} from '@/sanity/lib/live'
import {tradeZoneItemQuery} from '@/sanity/lib/queries'
import {notFound} from 'next/navigation'
import TradeZoneDetailClient from './TradeZoneDetailClient'

interface TradeZoneItem {
  _id: string
  title: string
  sellingBy: string
  price: number
  description: string
  category: string
  condition: string
  images: any[]
  imageUrls: string[]
  contactInfo?: {
    phone?: string
    email?: string
    location?: string
  }
  seller?: {
    name?: string
    image?: any
  } | null
  _createdAt: string
}

interface TradeZoneDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function TradeZoneDetail({params}: TradeZoneDetailProps) {
  const {id} = await params
  const {data: item} = await sanityFetch({
    query: tradeZoneItemQuery,
    params: {id},
  })

  if (!item) {
    notFound()
  }

  const tradeItem = item as TradeZoneItem

  return <TradeZoneDetailClient item={tradeItem} />
}
