import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Event schema. Define and edit the fields for the 'event' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const event = defineType({
  name: 'event',
  title: 'Event',
  icon: CalendarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description of the event',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Event Details',
      type: 'text',
      description: 'Detailed information about the event, requirements, etc.',
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Event Time',
      type: 'string',
      description: 'Event start time (e.g., "9:00 AM", "14:30")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Event Category',
      type: 'string',
      options: {
        list: [
          {title: 'Social', value: 'social'},
          {title: 'Sport', value: 'sport'},
          {title: 'Chill Ride', value: 'chill-ride'},
          {title: 'Fast Pace Ride', value: 'fast-pace-ride'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventImage',
      title: 'Event Image',
      type: 'image',
      description: 'Optional image for the event',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present
            return rule.custom((alt, context) => {
              if ((context.document?.eventImage as any)?.asset?._ref && !alt) {
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
  ],
  // List preview configuration
  preview: {
    select: {
      eventName: 'eventName',
      category: 'category',
      date: 'date',
      eventImage: 'eventImage',
    },
    prepare(selection) {
      const {eventName, category, date, eventImage} = selection
      const categoryTitles = {
        'social': 'Social',
        'sport': 'Sport',
        'chill-ride': 'Chill Ride',
        'fast-pace-ride': 'Fast Pace Ride',
      }
      
      return {
        title: eventName,
        subtitle: `${categoryTitles[category as keyof typeof categoryTitles] || category} • ${date ? new Date(date).toLocaleDateString() : 'No date'}`,
        media: eventImage,
      }
    },
  },
})
