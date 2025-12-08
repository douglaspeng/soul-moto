import {CogIcon, UploadIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'
import {BatchUploadGallery} from '../components/BatchUploadGallery'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      ...S.documentTypeListItems()
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          const id = listItem.getId()
          
          // Keep galleries list as normal
          if (id === 'gallery') {
            return listItem.title(pluralize(listItem.getTitle() as string))
          }
          
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      // Batch Upload option for Galleries (appears as a separate menu item)
      S.listItem()
        .title('Batch Upload Images')
        .icon(UploadIcon)
        .child(S.component(BatchUploadGallery).title('Batch Upload Images')),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
