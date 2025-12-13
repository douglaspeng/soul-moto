import {useState, useEffect} from 'react'
import {useClient, useFormValue} from 'sanity'
import {Box, Card, Flex, Stack, Text, Button} from '@sanity/ui'
import {TrashIcon} from '@sanity/icons'
import type {StringInputProps} from 'sanity'

export function EventSignupsField(props: StringInputProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  // Access the root document to get the document ID
  const rootDocument = useFormValue([]) as any
  const documentId = rootDocument?._id
  
  const [signups, setSignups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Debug logging - always log to see if component renders
  useEffect(() => {
    console.log('=== EventSignupsField RENDERED ===')
    console.log('documentId:', documentId)
    console.log('rootDocument:', rootDocument)
    console.log('props:', props)
  })

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return
    }

    async function fetchSignups() {
      try {
        const result = await client.fetch(
          `*[_type == "eventSignup" && event._ref == $eventId] | order(signedUpAt desc) {
            _id,
            name,
            note,
            userImage,
            signedUpAt
          }`,
          {eventId: documentId}
        )
        setSignups(result || [])
      } catch (error) {
        console.error('Error fetching signups:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSignups()
    
    // Set up a refresh interval to check for new signups
    const interval = setInterval(fetchSignups, 5000) // Refresh every 5 seconds
    
    return () => clearInterval(interval)
  }, [documentId, client])

  const handleDelete = async (signupId: string) => {
    if (!confirm('Are you sure you want to delete this signup?')) {
      return
    }

    try {
      await client.delete(signupId)
      // Refresh the list
      const result = await client.fetch(
        `*[_type == "eventSignup" && event._ref == $eventId] | order(signedUpAt desc) {
          _id,
          name,
          note,
          userImage,
          signedUpAt
        }`,
        {eventId: documentId}
      )
      setSignups(result || [])
    } catch (error) {
      console.error('Error deleting signup:', error)
      alert('Failed to delete signup')
    }
  }

  // Render the signups display
  if (loading) {
    return (
      <Box padding={4} style={{border: '1px solid #ccc', borderRadius: '4px'}}>
        <Text size={1} weight="semibold">Event Signups</Text>
        <Text size={0} muted style={{marginTop: 8}}>Loading signups...</Text>
      </Box>
    )
  }

  if (!documentId) {
    return (
      <Box padding={4} style={{border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5'}}>
        <Text size={1} weight="semibold">Event Signups</Text>
        <Text size={0} muted style={{marginTop: 8}}>
          Save the event first to view signups
        </Text>
      </Box>
    )
  }

  if (signups.length === 0) {
    return (
      <Box padding={4} style={{border: '1px solid #ccc', borderRadius: '4px'}}>
        <Text size={1} weight="semibold">Event Signups</Text>
        <Text size={0} muted style={{marginTop: 8}}>
          No signups yet for this event
        </Text>
      </Box>
    )
  }

  return (
    <Box padding={4} style={{border: '1px solid #ccc', borderRadius: '4px'}}>
      <Stack space={3}>
        <Text weight="semibold" size={1}>
          Event Signups ({signups.length})
        </Text>
        <Stack space={2}>
          {signups.map((signup) => (
            <Card key={signup._id} padding={3} radius={2} shadow={1}>
              <Flex align="center" gap={3}>
                {signup.userImage ? (
                  <Box style={{width: 40, height: 40, borderRadius: '50%', overflow: 'hidden'}}>
                    <img
                      src={signup.userImage}
                      alt={signup.name}
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  </Box>
                ) : (
                  <Box
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size={1} weight="semibold">
                      {signup.name.charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                )}
                <Box flex={1}>
                  <Text weight="semibold" size={1}>
                    {signup.name}
                  </Text>
                  {signup.note && (
                    <Text size={0} muted style={{marginTop: 4}}>
                      {signup.note}
                    </Text>
                  )}
                </Box>
                <Button
                  icon={TrashIcon}
                  mode="ghost"
                  tone="critical"
                  onClick={() => handleDelete(signup._id)}
                  title="Delete signup"
                />
              </Flex>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}

