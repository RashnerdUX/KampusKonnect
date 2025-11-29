import React, { useState, useEffect, useRef } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

interface ImageUploadFieldProps {
  id: string
  name: string
  label: string
  currentImageUrl?: string
  aspectRatio?: 'square' | 'wide'
  className?: string
}

export const ImageUploadField = ({
  id,
  name,
  label,
  currentImageUrl,
  aspectRatio = 'square',
  className,
}: ImageUploadFieldProps) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null)
  const blobUrlRef = useRef<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Revoke the previous blob URL if we created one
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }

      const newBlobUrl = URL.createObjectURL(file)
      blobUrlRef.current = newBlobUrl
      setPreview(newBlobUrl)
    }
  }

  // Clean up blob URL on unmount or when preview changes externally
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  const aspectClass = aspectRatio === 'wide' ? 'aspect-[3/1]' : 'aspect-square'

  return (
    <div className={className}>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <label
        htmlFor={id}
        className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 transition hover:border-primary ${aspectClass}`}
      >
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-foreground/60">
            <FaCloudUploadAlt className="h-8 w-8" />
            <span className="text-sm font-medium">Click to upload</span>
          </div>
        )}
        <input
          id={id}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleChange}
          hidden
        />
      </label>
    </div>
  )
}

export default ImageUploadField
