import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const personsQuery = defineQuery(`
  *[_type == "person"] {
    _id,
    name,
    description,
    picture,
    "imageUrl": picture.asset->url
  }
`)

export const galleryQuery = defineQuery(`
  *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    name,
    description,
    image,
    "imageUrl": image.asset->url,
    relatedEvent
  }
`)

export const galleryImagesForEventQuery = defineQuery(`
  *[_type == "gallery" && relatedEvent._ref == $eventId] | order(_createdAt desc) {
    _id,
    name,
    description,
    image,
    "imageUrl": image.asset->url,
    relatedEvent
  }
`)

export const eventsQuery = defineQuery(`
  *[_type == "event"] | order(date desc, _createdAt desc) {
    _id,
    eventName,
    description,
    detail,
    date,
    time,
    category,
    eventImage,
    "imageUrl": eventImage.asset->url
  }
`)

export const eventQuery = defineQuery(`
  *[_type == "event" && _id == $id][0] {
    _id,
    eventName,
    description,
    detail,
    date,
    time,
    category,
    eventImage,
    "imageUrl": eventImage.asset->url
  }
`)

export const servicesQuery = defineQuery(`
  *[_type == "service" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    description,
    detailedDescription,
    price,
    category,
    serviceImage,
    "imageUrl": serviceImage.asset->url,
    isActive
  }
`)

export const serviceQuery = defineQuery(`
  *[_type == "service" && _id == $id][0] {
    _id,
    title,
    description,
    detailedDescription,
    price,
    category,
    serviceImage,
    "imageUrl": serviceImage.asset->url,
    isActive
  }
`)
