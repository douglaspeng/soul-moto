import {sanityFetch} from '@/sanity/lib/live'
import {tradeZoneQuery} from '@/sanity/lib/queries'
import TradeZoneClient from './TradeZoneClient'

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
  _createdAt: string
}

export default async function TradeZone() {
  const {data: tradeItems} = await sanityFetch({
    query: tradeZoneQuery,
  })

  return <TradeZoneClient tradeItems={tradeItems as TradeZoneItem[]} />
}
