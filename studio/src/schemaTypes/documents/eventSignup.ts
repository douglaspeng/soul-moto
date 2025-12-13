import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Event Signup schema. Stores user signups for events.
 */
export const eventSignup = defineType({
  name: 'eventSignup',
  title: 'Event Signup',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'event'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
      description: 'The user who signed up (from next-auth)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name provided by the user for this event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      description: 'Optional note from the user',
      rows: 3,
    }),
    defineField({
      name: 'userImage',
      title: 'User Image URL',
      type: 'url',
      description: 'Google profile picture URL',
    }),
    defineField({
      name: 'signedUpAt',
      title: 'Signed Up At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      eventName: 'event.eventName',
      signedUpAt: 'signedUpAt',
    },
    prepare({name, eventName, signedUpAt}) {
      return {
        title: name || 'Anonymous',
        subtitle: eventName ? `Event: ${eventName}` : 'No event',
        media: UserIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Signup Date (Newest)',
      name: 'signedUpAtDesc',
      by: [{field: 'signedUpAt', direction: 'desc'}],
    },
    {
      title: 'Signup Date (Oldest)',
      name: 'signedUpAtAsc',
      by: [{field: 'signedUpAt', direction: 'asc'}],
    },
  ],
})

