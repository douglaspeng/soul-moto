import {PortableText} from '@portabletext/react'

import AboutUs from '@/app/components/AboutUs'
import Gallery from '@/app/components/GallerySection'
import SideBySideIcons from '@/app/components/SideBySideIcons'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <>
      <div className="relative home-hero-section">
        <div className="relative home-hero-background" style={{ backgroundColor: 'rgb(167 167 167)' }}>
          <div className="bg-gradient-to-b from-white w-full h-full absolute top-0 home-hero-gradient"></div>
          <div className="container home-hero-container">
            <div className="relative min-h-[40vh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-16 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center home-hero-content">
              <div className="flex flex-col gap-4 items-center home-hero-title-section">
                <div className="text-md leading-6 prose uppercase py-1 px-3 bg-white font-mono italic home-hero-subtitle">
                  Bay Area Motorcycle Community
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black home-hero-title">
                  Soul Moto Crew
                </h1>
                <SideBySideIcons />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col items-center home-description-section">
          <div className="container relative mx-auto max-w-2xl pb-20 pt-10 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center home-description-container">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-gray-700 prose-a:text-gray-700 font-light text-center home-description-text">
              {settings?.description && <PortableText value={settings.description} />}
             
            </div>
          </div>
        </div> */}
      </div>
      <AboutUs />
      <Gallery />
    </>
  )
}
