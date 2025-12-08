import {DocumentActionComponent} from 'sanity'
import {useState, useCallback, useEffect} from 'react'
import {UploadIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Stack,
  Text,
  useToast,
} from '@sanity/ui'
import {useClient} from 'sanity'

export const batchUploadGalleryAction: DocumentActionComponent = (props) => {
  const {onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [events, setEvents] = useState<Array<{_id: string; eventName: string}>>([])
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const toast = useToast()

  // Fetch events when dialog is first opened
  const loadEvents = useCallback(async () => {
    if (eventsLoaded) return
    
    try {
      const fetchedEvents = await client.fetch<Array<{_id: string; eventName: string}>>(
        `*[_type == "event"] | order(date desc) {
          _id,
          eventName
        }`
      )
      setEvents(fetchedEvents)
      setEventsLoaded(true)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.push({
        status: 'error',
        title: 'Error',
        description: 'Failed to load events',
      })
    }
  }, [client, toast, eventsLoaded])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    if (!uploading) {
      setIsOpen(false)
      setSelectedFiles([])
      setSelectedEvent(null)
      setUploadProgress(0)
      // Reset events loaded state so they're fetched again next time
      setEventsLoaded(false)
    }
  }, [uploading])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files])
      }
    },
    []
  )

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      toast.push({
        status: 'error',
        title: 'No files selected',
        description: 'Please select at least one image to upload',
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = selectedFiles.length
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        try {
          // Upload image asset
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
            contentType: file.type,
          })

          // Create gallery document
          const galleryDoc: any = {
            _type: 'gallery',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
              alt: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as alt text
            },
          }

          // Add event reference if selected
          if (selectedEvent) {
            galleryDoc.relatedEvent = {
              _type: 'reference',
              _ref: selectedEvent,
            }
          }

          await client.create(galleryDoc)
          successCount++
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          errorCount++
        }

        setUploadProgress(((i + 1) / totalFiles) * 100)
      }

      // Show results
      if (successCount > 0) {
        toast.push({
          status: 'success',
          title: 'Upload complete',
          description: `Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}${
            errorCount > 0 ? ` (${errorCount} failed)` : ''
          }`,
        })
      }

      if (errorCount > 0 && successCount === 0) {
        toast.push({
          status: 'error',
          title: 'Upload failed',
          description: `Failed to upload ${errorCount} image${errorCount > 1 ? 's' : ''}`,
        })
      }

      // Reset and close
      setSelectedFiles([])
      setSelectedEvent(null)
      setUploadProgress(0)
      setIsOpen(false)
      onComplete()
    } catch (error) {
      console.error('Error during batch upload:', error)
      toast.push({
        status: 'error',
        title: 'Upload error',
        description: 'An error occurred during upload',
      })
    } finally {
      setUploading(false)
    }
  }, [selectedFiles, selectedEvent, client, toast, onComplete])

  return {
    label: 'Batch Upload Images',
    icon: UploadIcon,
    shortcut: 'mod+shift+u',
    onHandle: handleOpen,
    dialog: isOpen
      ? {
          type: 'dialog',
          onClose: handleClose,
          content: (
            <BatchUploadDialog
              onClose={handleClose}
              onUpload={handleUpload}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              events={events}
              onLoadEvents={loadEvents}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />
          ),
        }
      : undefined,
  }
}

// Dialog component for batch upload
const BatchUploadDialog: React.FC<{
  onClose: () => void
  onUpload: () => void
  selectedFiles: File[]
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
  selectedEvent: string | null
  onEventSelect: (eventId: string | null) => void
  events: Array<{_id: string; eventName: string}>
  onLoadEvents: () => void
  uploading: boolean
  uploadProgress: number
}> = ({
  onClose,
  onUpload,
  selectedFiles,
  onFileSelect,
  onRemoveFile,
  selectedEvent,
  onEventSelect,
  events,
  onLoadEvents,
  uploading,
  uploadProgress,
}) => {
  // Load events when dialog opens
  useEffect(() => {
    onLoadEvents()
  }, [onLoadEvents])
  return (
    <Box padding={4} style={{minWidth: '600px', maxWidth: '800px'}}>
      <Stack space={4}>
        {/* Event Selection */}
        <Box>
          <Text size={1} weight="semibold" style={{marginBottom: '0.5rem'}}>
            Related Event (Optional)
          </Text>
          <Text size={1} muted style={{marginBottom: '1rem'}}>
            Select an event to associate all images with. Leave empty for general gallery images.
          </Text>
          <select
            value={selectedEvent || ''}
            onChange={(e) => onEventSelect(e.target.value || null)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
            disabled={uploading}
          >
            <option value="">-- No Event (General Gallery) --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.eventName}
              </option>
            ))}
          </select>
        </Box>

        {/* File Selection */}
        <Box>
          <Text size={1} weight="semibold" style={{marginBottom: '0.5rem'}}>
            Select Images
          </Text>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileSelect}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
              marginBottom: '1rem',
            }}
          />
        </Box>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <Box>
            <Text size={1} weight="semibold" style={{marginBottom: '0.5rem'}}>
              Selected Images ({selectedFiles.length})
            </Text>
            <Grid columns={[2, 3, 4]} gap={2} style={{marginTop: '1rem'}}>
              {selectedFiles.map((file, index) => (
                <Card key={index} padding={2} radius={2} shadow={1}>
                  <Stack space={2}>
                    <Box
                      style={{
                        width: '100%',
                        height: '100px',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                    <Text size={0} muted style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {file.name}
                    </Text>
                    <Button
                      text="Remove"
                      tone="critical"
                      mode="ghost"
                      onClick={() => onRemoveFile(index)}
                      disabled={uploading}
                      style={{width: '100%'}}
                    />
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Box>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Box>
            <Text size={1} weight="semibold" style={{marginBottom: '0.5rem'}}>
              Uploading... {Math.round(uploadProgress)}%
            </Text>
            <Box
              style={{
                width: '100%',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <Box
                style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: '#2276fc',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Flex gap={2} justify="flex-end" style={{marginTop: '1rem'}}>
          <Button
            text="Cancel"
            mode="ghost"
            onClick={onClose}
            disabled={uploading}
          />
          <Button
            text={
              uploading
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
            }
            tone="primary"
            onClick={onUpload}
            disabled={uploading || selectedFiles.length === 0}
          />
        </Flex>
      </Stack>
    </Box>
  )
}

