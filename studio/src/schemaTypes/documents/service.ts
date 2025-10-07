import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Service schema. Define and edit the fields for the 'service' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const service = defineType({
  name: 'service',
  title: 'Service',
  icon: CogIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Service Description',
      type: 'text',
      description: 'A brief description of the service',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detailedDescription',
      title: 'Detailed Description',
      type: 'text',
      description: 'More detailed information about the service',
      rows: 6,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Service price (e.g., "$50", "Free", "Contact for pricing")',
    }),
    defineField({
      name: 'category',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          {title: 'Maintenance', value: 'maintenance'},
          {title: 'Repair', value: 'repair'},
          {title: 'Customization', value: 'customization'},
          {title: 'Consultation', value: 'consultation'},
          {title: 'Training', value: 'training'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'serviceImage',
      title: 'Service Image',
      type: 'image',
      description: 'Image representing the service',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present
            return rule.custom((alt, context) => {
              if ((context.document?.serviceImage as any)?.asset?._ref && !alt) {
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
    }),
    defineField({
      name: 'isActive',
      title: 'Active Service',
      type: 'boolean',
      description: 'Whether this service is currently available',
      initialValue: true,
    }),
  ],
  // List preview configuration
  preview: {
    select: {
      title: 'title',
      category: 'category',
      price: 'price',
      serviceImage: 'serviceImage',
      isActive: 'isActive',
    },
    prepare(selection) {
      const {title, category, price, serviceImage, isActive} = selection
      const categoryTitles = {
        'maintenance': 'Maintenance',
        'repair': 'Repair',
        'customization': 'Customization',
        'consultation': 'Consultation',
        'training': 'Training',
        'other': 'Other',
      }
      
      return {
        title: title,
        subtitle: `${categoryTitles[category as keyof typeof categoryTitles] || category}${price ? ` • ${price}` : ''}${!isActive ? ' • Inactive' : ''}`,
        media: serviceImage,
      }
    },
  },
})
