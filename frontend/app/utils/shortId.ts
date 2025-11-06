/**
 * Utility functions for generating short IDs from Sanity document IDs
 * Sanity IDs are typically long like "event.abc123def456" or "drafts.event.abc123def456"
 * We extract the unique part to create shorter shareable URLs
 */

/**
 * Generate a short code from event ID
 * Extracts the unique identifier part from Sanity ID
 * Example: "event.abc123def456" -> "abc123de"
 */
export function getShortEventId(eventId: string): string {
  // Remove "drafts." prefix if present
  const cleanId = eventId.replace(/^drafts\./, '')
  
  // Sanity IDs are typically like "event.abc123def456" or just "abc123def456"
  // Split by '.' and take the last part (the unique identifier)
  const parts = cleanId.split('.')
  const uniquePart = parts[parts.length - 1]
  
  // Return first 8 characters (or full if shorter)
  // This should be unique enough for most use cases
  return uniquePart.substring(0, 8).toLowerCase()
}
