import {sanityFetch} from '@/sanity/lib/live'
import {galleryQuery} from '@/sanity/lib/queries'
import GalleryClient from './GalleryClient'

export default async function Gallery() {
  const {data: galleryItems} = await sanityFetch({
    query: galleryQuery,
  })

  return <GalleryClient initialItems={galleryItems || []} />
}
