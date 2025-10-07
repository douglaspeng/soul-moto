import {sanityFetch} from '@/sanity/lib/live'
import {personsQuery} from '@/sanity/lib/queries'
import AboutUsClient from './AboutUsClient'

export default async function AboutUs() {
  const {data: persons} = await sanityFetch({
    query: personsQuery,
  })
  return (
    <AboutUsClient persons={persons} />
  )
}
