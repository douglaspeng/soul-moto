import {useMemo} from 'react'
import {useSchema} from 'sanity'
import {DocumentListBuilder} from 'sanity/structure'
import {BatchUploadGallery} from './BatchUploadGallery'
import {Box, Stack} from '@sanity/ui'

export function GalleriesListWithUpload() {
  const schema = useSchema()
  const galleryType = schema.get('gallery')
  
  if (!galleryType) {
    return null
  }

  return (
    <Stack space={3}>
      <Box padding={3}>
        <BatchUploadGallery />
      </Box>
      {/* The document list will be rendered by Sanity */}
    </Stack>
  )
}

