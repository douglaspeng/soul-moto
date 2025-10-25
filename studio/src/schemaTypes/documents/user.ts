import {defineField, defineType} from 'sanity'

/**
 * User schema for storing user authentication data.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'url',
      description: 'URL to the user\'s profile image',
    }),
    defineField({
      name: 'googleId',
      title: 'Google ID',
      type: 'string',
      description: 'Google OAuth ID for the user',
    }),
    defineField({
      name: 'isActive',
      title: 'Active User',
      type: 'boolean',
      description: 'Whether this user account is active',
      initialValue: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When the user account was created',
      readOnly: true,
    }),
  ],
  // List preview configuration
  preview: {
    select: {
      name: 'name',
      email: 'email',
      image: 'image',
      isActive: 'isActive',
    },
    prepare(selection) {
      const {name, email, image, isActive} = selection
      const status = isActive ? 'Active' : 'Inactive'
      
      return {
        title: name,
        subtitle: `${email} • ${status}`,
        media: image,
      }
    },
  },
})
