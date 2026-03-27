import {notFound} from 'next/navigation'
import GearOrderClient from './GearOrderClient'

interface GearOrderPageProps {
  params: Promise<{cloth_type: string}>
}

const VALID_TYPES = ['hoodie', 'tshirt']

export async function generateMetadata({params}: GearOrderPageProps) {
  const {cloth_type} = await params
  const label = cloth_type === 'hoodie' ? 'Hoodie' : 'T-Shirt'
  return {
    title: `Order ${label} | Soul Moto Gear`,
  }
}

export default async function GearOrderPage({params}: GearOrderPageProps) {
  const {cloth_type} = await params

  if (!VALID_TYPES.includes(cloth_type)) {
    notFound()
  }

  return <GearOrderClient clothType={cloth_type} />
}
