import {DocumentActionComponent} from 'sanity'
import {TrashIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'
import {
  Button,
  Dialog,
  Box,
  Stack,
  Text,
  useToast,
} from '@sanity/ui'
import {useClient} from 'sanity'

export const deleteEventSignupAction: DocumentActionComponent = (props) => {
  const {id, type, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    if (!isDeleting) {
      setIsOpen(false)
    }
  }, [isDeleting])

  const handleDelete = useCallback(async () => {
    if (!id) return

    setIsDeleting(true)
    try {
      await client.delete(id)
      toast.push({
        status: 'success',
        title: 'Signup deleted',
        description: 'The event signup has been successfully deleted.',
      })
      setIsOpen(false)
      onComplete()
    } catch (error) {
      console.error('Error deleting signup:', error)
      toast.push({
        status: 'error',
        title: 'Delete failed',
        description: 'Failed to delete the event signup. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [id, client, toast, onComplete])

  // Only show for eventSignup documents
  if (type !== 'eventSignup') {
    return null
  }

  return {
    label: 'Delete Signup',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: handleOpen,
    dialog: isOpen && {
      type: 'dialog',
      onClose: handleClose,
      header: 'Delete Event Signup',
      content: (
        <Box padding={4}>
          <Stack space={4}>
            <Text>
              Are you sure you want to delete this event signup? This action cannot be undone.
            </Text>
            <Stack space={3}>
              <Button
                text="Delete"
                tone="critical"
                onClick={handleDelete}
                disabled={isDeleting}
                loading={isDeleting}
              />
              <Button
                text="Cancel"
                mode="ghost"
                onClick={handleClose}
                disabled={isDeleting}
              />
            </Stack>
          </Stack>
        </Box>
      ),
    },
  }
}

