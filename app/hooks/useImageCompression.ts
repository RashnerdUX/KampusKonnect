import { useState, useCallback } from 'react';
import { compressImage } from '~/utils/imageCompressor';

interface UseImageCompressionOptions {
  // Input for the image compression hook
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

interface UseImageCompressionResult {
  // Output for the image compression hook
  compressedFile: File | null;
  isCompressing: boolean;
  error: string | null;
  preview: string | null;
  compressFile: (file: File) => Promise<File | null>;
  reset: () => void;
}

/**
 * Hook to compress images before upload
 * Converts images to WebP format with specified dimensions and quality
 */
export function useImageCompression(
  options: UseImageCompressionOptions = {}
): UseImageCompressionResult {
  const { maxWidth = 800, maxHeight = 800, quality = 0.85 } = options;

  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const compressFile = useCallback(
    async (file: File): Promise<File | null> => {
      if (!file) return null;

      // Skip compression for non-image files
      if (!file.type.startsWith('image/')) {
        setError('File is not an image');
        return null;
      }

      setIsCompressing(true);
      setError(null);

      try {
        const compressedBlob = await compressImage(file, maxWidth, maxHeight, quality);

        // Convert Blob to File with .webp extension
        const fileName = file.name.replace(/\.[^.]+$/, '.webp');
        const compressedFileResult = new File([compressedBlob], fileName, {
          type: 'image/webp',
          lastModified: Date.now(),
        });

        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFileResult);
        setPreview(previewUrl);
        setCompressedFile(compressedFileResult);

        console.log(
          `Image compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → ${fileName} (${(compressedFileResult.size / 1024).toFixed(1)}KB)`
        );

        return compressedFileResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to compress image';
        setError(errorMessage);
        console.error('Image compression error:', err);
        return null;
      } finally {
        setIsCompressing(false);
      }
    },
    [maxWidth, maxHeight, quality]
  );

  const reset = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setCompressedFile(null);
    setPreview(null);
    setError(null);
    setIsCompressing(false);
  }, [preview]);

  return {
    compressedFile,
    isCompressing,
    error,
    preview,
    compressFile,
    reset,
  };
}

/**
 * Utility function to compress a file and return it directly
 * For use in form submission handlers
 */
export async function compressImageFile(
  file: File,
  options: UseImageCompressionOptions = {}
): Promise<File> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.85 } = options;

  if (!file.type.startsWith('image/')) {
    return file; // Return original if not an image
  }

  try {
    const compressedBlob = await compressImage(file, maxWidth, maxHeight, quality);
    const fileName = file.name.replace(/\.[^.]+$/, '.webp');
    
    return new File([compressedBlob], fileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (err) {
    console.error('Failed to compress image, using original:', err);
    return file; // Return original on error
  }
}
