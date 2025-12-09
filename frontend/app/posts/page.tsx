import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'
import {AllPostsQueryResult} from '@/sanity.types'
import Link from 'next/link'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import {getImageDimensions} from '@sanity/asset-utils'
import {format} from 'date-fns'
import OnBoarding from '@/app/components/Onboarding'

export default async function PostsPage() {
  const {data: posts} = await sanityFetch({query: allPostsQuery})

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-24">
          <OnBoarding />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="pt-10 pb-4 px-4 sm:px-6 lg:px-8 gallery-client-hero-section">
        <div className="max-w-4xl mx-auto text-center gallery-client-hero-container">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 gallery-client-hero-title">
            骑士日志
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto gallery-client-hero-description">
            从陌生到同行，从一次骑行开始。分享骑行日常、路线、改装与朋友故事，记录属于骑士的每一段旅程。
          </p>
        </div>
      </section>

      {/* Filter Buttons we don't need it now*/}

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: AllPostsQueryResult[number]) => {
            const coverImageUrl = post.coverImage?.asset?._ref 
              ? urlForImage(post.coverImage)?.url() 
              : null
            const imageDimensions = post.coverImage?.asset?._ref
              ? getImageDimensions(post.coverImage.asset._ref)
              : null

            return (
              <Link
                key={post._id}
                href={`/posts/${post.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <article className="flex flex-col h-full">
                  {/* Cover Image */}
                  {coverImageUrl && imageDimensions ? (
                    <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                      <Image
                        src={coverImageUrl}
                        alt={post.coverImage?.alt || post.title}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                      {post.author?.name ? (
                        <span className="text-sm text-gray-600">
                          {post.author.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Anonymous</span>
                      )}
                      {post.date && post.author?.name && (
                        <span className="text-xs text-gray-400">•</span>
                      )}
                      {post.date && (
                        <time className="text-xs text-gray-500" dateTime={post.date}>
                          {format(new Date(post.date), 'd MMM yyyy')}
                        </time>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

