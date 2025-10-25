import {defineField, defineType} from 'sanity'

/**
 * Trade Zone schema for selling gear and motorcycles.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const tradeZone = defineType({
  name: 'tradeZone',
  title: 'Trade Zone',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Item Title',
      type: 'string',
      description: 'Name of the item being sold',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'sellingBy',
      title: 'Selling By',
      type: 'string',
      description: 'Name of the person selling the item',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the item in USD',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of the item',
      rows: 4,
      validation: (rule) => rule.required().min(10).max(1000),
    }),
    defineField({
      name: 'images',
      title: 'Item Images',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: (rule) => {
                return rule.custom((alt, context) => {
                  if ((context.parent as any)?.asset?._ref && !alt) {
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
        },
      ],
      validation: (rule) => rule.required().min(1).max(5),
      description: 'Upload 1-5 images of the item. First image will be used as the main image.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Motorcycle', value: 'motorcycle'},
          {title: 'Gear', value: 'gear'},
          {title: 'Parts', value: 'parts'},
          {title: 'Accessories', value: 'accessories'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Like New', value: 'like-new'},
          {title: 'Good', value: 'good'},
          {title: 'Fair', value: 'fair'},
          {title: 'Poor', value: 'poor'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number (optional)',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Contact email (optional)',
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          description: 'City, State (optional)',
        }),
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Active Listing',
      type: 'boolean',
      description: 'Uncheck to hide this listing from the public',
      initialValue: true,
    }),
  ],
  // List preview configuration
  preview: {
    select: {
      title: 'title',
      sellingBy: 'sellingBy',
      price: 'price',
      category: 'category',
      condition: 'condition',
      image: 'images.0',
      isActive: 'isActive',
    },
    prepare(selection) {
      const {title, sellingBy, price, category, condition, image, isActive} = selection
      const status = isActive ? 'Active' : 'Inactive'
      const categoryTitles = {
        'motorcycle': 'Motorcycle',
        'gear': 'Gear',
        'parts': 'Parts',
        'accessories': 'Accessories',
      }
      
      return {
        title: title,
        subtitle: `${categoryTitles[category as keyof typeof categoryTitles] || category} • $${price} • ${condition} • ${status}`,
        media: image,
      }
    },
  },
})
