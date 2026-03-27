import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const gearOrder = defineType({
  name: 'gearOrder',
  title: 'Gear Order',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name provided by the buyer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clothType',
      title: 'Cloth Type',
      type: 'string',
      options: {
        list: [
          {title: 'Hoodie', value: 'hoodie'},
          {title: 'T-Shirt', value: 'tshirt'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: ['S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => ({title: s, value: s})),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'White'},
          {title: 'Black', value: 'Black'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
      description: 'The user who placed the order',
    }),
    defineField({
      name: 'paid',
      title: 'Paid',
      type: 'boolean',
      description: 'Check when the buyer has paid',
      initialValue: false,
    }),
    defineField({
      name: 'received',
      title: 'Received',
      type: 'boolean',
      description: 'Check when the buyer has received their order',
      initialValue: false,
    }),
    defineField({
      name: 'orderedAt',
      title: 'Ordered At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      clothType: 'clothType',
      size: 'size',
      color: 'color',
    },
    prepare({name, clothType, size, color}) {
      const typeLabel = clothType === 'hoodie' ? 'Hoodie' : 'T-Shirt'
      return {
        title: name || 'Anonymous',
        subtitle: `${typeLabel} · ${color} · ${size}`,
        media: TagIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Order Date (Newest)',
      name: 'orderedAtDesc',
      by: [{field: 'orderedAt', direction: 'desc'}],
    },
  ],
})
