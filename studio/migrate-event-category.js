/**
 * Migration script to update event category from 'fast-pace-ride' to 'track'
 * 
 * Run this script using:
 * npx sanity exec migrate-event-category.js --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function migrateEventCategory() {
  console.log('Starting migration: fast-pace-ride -> track')
  
  // Fetch all events with category 'fast-pace-ride'
  const events = await client.fetch(
    `*[_type == "event" && category == "fast-pace-ride"]{
      _id,
      eventName,
      category
    }`
  )
  
  console.log(`Found ${events.length} events to migrate`)
  
  if (events.length === 0) {
    console.log('No events to migrate. Exiting.')
    return
  }
  
  // Update each event
  for (const event of events) {
    try {
      await client
        .patch(event._id)
        .set({ category: 'track' })
        .commit()
      
      console.log(`✓ Updated event: ${event.eventName} (${event._id})`)
    } catch (error) {
      console.error(`✗ Failed to update event ${event._id}:`, error)
    }
  }
  
  console.log(`\nMigration complete! Updated ${events.length} event(s).`)
}

migrateEventCategory().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})

