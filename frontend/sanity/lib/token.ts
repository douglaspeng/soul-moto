import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

// For development, allow undefined token for public datasets
// if (!token) {
//   throw new Error('Missing SANITY_API_READ_TOKEN')
// }
