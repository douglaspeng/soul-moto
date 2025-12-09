/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import {getImageDimensions} from '@sanity/asset-utils'
import {urlForImage} from '@/sanity/lib/utils'

import ResolvedLink from '@/app/components/ResolvedLink'

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    // Block types - headings, paragraphs, blockquotes
    block: {
      h1: ({children, value}) => (
        <h1 className="text-4xl font-bold mt-8 mb-4 group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({children, value}) => (
        <h2 className="text-3xl font-bold mt-6 mb-3 group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h2>
      ),
      h3: ({children}) => <h3 className="text-2xl font-bold mt-5 mb-2">{children}</h3>,
      h4: ({children}) => <h4 className="text-xl font-bold mt-4 mb-2">{children}</h4>,
      h5: ({children}) => <h5 className="text-lg font-bold mt-3 mb-2">{children}</h5>,
      h6: ({children}) => <h6 className="text-base font-bold mt-2 mb-1">{children}</h6>,
      blockquote: ({children}) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
          {children}
        </blockquote>
      ),
      normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
    },
    // Marks - links, font sizes, text decorations
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
      fontSize: ({children, value}) => {
        const sizeClasses: Record<string, string> = {
          small: 'text-sm',
          normal: 'text-base',
          large: 'text-lg',
          xlarge: 'text-xl',
        }
        const size = value?.size || 'normal'
        return <span className={sizeClasses[size]}>{children}</span>
      },
      strong: ({children}) => <strong className="font-bold">{children}</strong>,
      em: ({children}) => <em className="italic">{children}</em>,
      underline: ({children}) => <span className="underline">{children}</span>,
      'strike-through': ({children}) => <span className="line-through">{children}</span>,
    },
    // Custom types - images
    types: {
      image: ({value}) => {
        if (!value?.asset?._ref) {
          return null
        }

        const imageUrl = urlForImage(value)?.url()
        if (!imageUrl) {
          return null
        }

        const {width, height} = getImageDimensions(value.asset._ref)
        const alignment = value.alignment || 'center'
        const alignmentClasses: Record<string, string> = {
          left: 'mr-auto',
          center: 'mx-auto',
          right: 'ml-auto',
        }

        return (
          <figure className={`my-8 ${alignmentClasses[alignment]}`}>
            <div className="relative w-full max-w-4xl">
              <Image
                src={imageUrl}
                alt={value.alt || 'Blog image'}
                width={width}
                height={height}
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
            {value.caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
    },
  }

  return (
    <div className={['prose prose-a:text-brand max-w-none', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  )
}
