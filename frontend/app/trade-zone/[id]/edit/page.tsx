import {sanityFetch} from '@/sanity/lib/live'
import {tradeZoneItemQuery} from '@/sanity/lib/queries'
import {notFound} from 'next/navigation'
import TradeZoneEditClient from '@/app/trade-zone/[id]/edit/TradeZoneEditClient'

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
  }
  _createdAt: string
}

interface TradeZoneEditProps {
  params: Promise<{
    id: string
  }>
}

export default async function TradeZoneEdit({params}: TradeZoneEditProps) {
  const {id} = await params
  const {data: item} = await sanityFetch({
    query: tradeZoneItemQuery,
    params: {id},
  })

  if (!item) {
    notFound()
  }

  const tradeItem = item as any

  return <TradeZoneEditClient item={tradeItem} />
}
