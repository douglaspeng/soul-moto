import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {gallery} from './documents/gallery'
import {event} from './documents/event'
import {service} from './documents/service'
import {tradeZone} from './documents/tradeZone'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  post,
  person,
  gallery,
  event,
  service,
  tradeZone,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
]
