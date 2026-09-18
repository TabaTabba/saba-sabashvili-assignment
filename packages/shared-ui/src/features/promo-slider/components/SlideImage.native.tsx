import { Image } from 'expo-image'

const FADE_IN_MS = 200

interface SlideImageProps {
  uri: string
  alt: string
  onError: () => void
}

export function SlideImage({ uri, alt, onError }: SlideImageProps) {
  return (
    <Image
      source={{ uri }}
      alt={alt}
      contentFit="cover"
      transition={FADE_IN_MS}
      onError={onError}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
