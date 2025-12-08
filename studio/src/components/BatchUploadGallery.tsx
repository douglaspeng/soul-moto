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
import {Dialog} from '@sanity/ui'

// Helper to create a unique key for a file
const getFileKey = (file: File, index: number) => `${file.name}-${file.size}-${index}`

export function BatchUploadGallery() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map())
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [events, setEvents] = useState<Array<{_id: string; eventName: string}>>([])
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const toast = useToast()

  // Fetch events when dialog opens
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

  useEffect(() => {
    if (isOpen) {
      loadEvents()
    }
  }, [isOpen, loadEvents])

  // Create preview URLs for all files when they're added
  useEffect(() => {
    setPreviewUrls((currentUrls) => {
      const newUrls = new Map(currentUrls)
      let hasNewUrls = false

      selectedFiles.forEach((file, index) => {
        const fileKey = getFileKey(file, index)
        if (!newUrls.has(fileKey)) {
          try {
            const url = URL.createObjectURL(file)
            newUrls.set(fileKey, url)
            hasNewUrls = true
          } catch (error) {
            console.error('Error creating preview URL for:', file.name, error)
          }
        }
      })

      return hasNewUrls ? newUrls : currentUrls
    })
  }, [selectedFiles])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [previewUrls])

  const handleClose = useCallback(() => {
    if (!uploading) {
      // Clean up all object URLs
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      setIsOpen(false)
      setSelectedFiles([])
      setPreviewUrls(new Map())
      setSelectedEvent(null)
      setUploadProgress(0)
      setEventsLoaded(false)
    }
  }, [uploading, previewUrls])

  const addFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      const validFiles = Array.from(files).filter(
        (file) => file.type.startsWith('image/')
      )
      
      if (validFiles.length === 0) {
        toast.push({
          status: 'error',
          title: 'Invalid files',
          description: 'Please select image files only',
        })
        return
      }

      setSelectedFiles((prev) => {
        const newFiles = [...prev, ...validFiles]
        // Create preview URLs for new files
        const newUrls = new Map(previewUrls)
        validFiles.forEach((file, idx) => {
          const fileIndex = prev.length + idx
          const fileKey = getFileKey(file, fileIndex)
          try {
            const url = URL.createObjectURL(file)
            newUrls.set(fileKey, url)
          } catch (error) {
            console.error('Error creating preview URL:', error)
          }
        })
        setPreviewUrls(newUrls)
        return newFiles
      })
    }
  }, [previewUrls, toast])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      addFiles(files)
      // Reset input so same file can be selected again
      if (event.target) {
        event.target.value = ''
      }
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files || [])
      addFiles(files)
    },
    [addFiles]
  )

  const handleRemoveFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const fileToRemove = prev[index]
        if (fileToRemove) {
          // Revoke the object URL for the removed file
          const fileKey = getFileKey(fileToRemove, index)
          const url = previewUrls.get(fileKey)
          if (url) {
            URL.revokeObjectURL(url)
            const newUrls = new Map(previewUrls)
            newUrls.delete(fileKey)
            setPreviewUrls(newUrls)
          }
        }
        return prev.filter((_, i) => i !== index)
      })
    },
    [previewUrls]
  )

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
      setIsOpen(false)
      setUploadProgress(0)
      setEventsLoaded(false)
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
  }, [selectedFiles, selectedEvent, client, toast])

  return (
    <>
      <Button
        icon={UploadIcon}
        text="Batch Upload Images"
        tone="primary"
        onClick={() => setIsOpen(true)}
        style={{width: '100%', marginTop: '1rem'}}
      />
      {isOpen && (
        <Dialog
          header="Batch Upload Gallery Images"
          id="batch-upload-dialog"
          onClose={handleClose}
          width={2}
          zOffset={1000}
        >
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
                  onChange={(e) => setSelectedEvent(e.target.value || null)}
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
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    width: '100%',
                    padding: '2rem',
                    borderRadius: '4px',
                    border: `2px dashed ${isDragging ? '#2276fc' : '#ccc'}`,
                    backgroundColor: isDragging ? '#f0f7ff' : 'transparent',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    style={{
                      display: 'none',
                    }}
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    style={{
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    <Text size={1} style={{marginBottom: '0.5rem'}}>
                      {isDragging
                        ? 'Drop images here'
                        : 'Drag and drop images here or click to select'}
                    </Text>
                    <Button
                      text="Choose Files"
                      mode="ghost"
                      disabled={uploading}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('file-input')?.click()
                      }}
                    />
                  </label>
                </Box>
              </Box>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <Box>
                  <Text size={1} weight="semibold" style={{marginBottom: '0.5rem'}}>
                    Selected Images ({selectedFiles.length})
                  </Text>
                  <Grid columns={[2, 3, 4]} gap={2} style={{marginTop: '1rem'}}>
                    {selectedFiles.map((file, index) => {
                      const fileKey = getFileKey(file, index)
                      const previewUrl = previewUrls.get(fileKey)
                      
                      return (
                        <Card key={`${file.name}-${index}`} padding={2} radius={2} shadow={1}>
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
                                position: 'relative',
                              }}
                            >
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={file.name}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                  }}
                                  onError={(e) => {
                                    console.error('Error loading preview for:', file.name)
                                    // Show placeholder on error
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <Text size={0} muted>
                                  Loading preview...
                                </Text>
                              )}
                            </Box>
                          <Text size={0} muted style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {file.name}
                          </Text>
                            <Button
                              text="Remove"
                              tone="critical"
                              mode="ghost"
                              onClick={() => handleRemoveFile(index)}
                              disabled={uploading}
                              style={{width: '100%'}}
                            />
                          </Stack>
                        </Card>
                      )
                    })}
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
                  onClick={handleClose}
                  disabled={uploading}
                />
                <Button
                  text={
                    uploading
                      ? 'Uploading...'
                      : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                  }
                  tone="primary"
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  )
}

