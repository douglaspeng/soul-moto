import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Gallery schema. Define and edit the fields for the 'gallery' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  icon: ImageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present
            return rule.custom((alt, context) => {
              if ((context.document?.image as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Optional name for the gallery item',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description for the gallery item',
      rows: 3,
    }),
  ],
  // List preview configuration
  preview: {
    select: {
      name: 'name',
      description: 'description',
      image: 'image',
    },
    prepare(selection) {
      return {
        title: selection.name || 'Untitled Gallery Item',
        subtitle: selection.description || 'No description',
        media: selection.image,
      }
    },
  },
})
