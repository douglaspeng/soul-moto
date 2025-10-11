import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Navigation from './Navigation'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg header-section">
      <div className="container py-6 px-2 sm:px-6 header-container">
        <div className="flex items-center justify-between gap-5 header-content">
          {/* <Link className="flex items-center gap-2" href="/">
            <span className="text-lg sm:text-2xl pl-2 font-semibold">
              {settings?.title || 'Your moto space'}
            </span>
          </Link> */}

          <Navigation />
        </div>
      </div>
    </header>
  )
}
