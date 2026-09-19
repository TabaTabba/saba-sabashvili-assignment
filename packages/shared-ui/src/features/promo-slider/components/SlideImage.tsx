interface SlideImageProps {
  uri: string
  alt: string
  onError: () => void
}

// Metro picks SlideImage.native.tsx over this one; there is deliberately no .web twin. Tamagui's
// Image has no `loading` prop, so this drops to a plain img for the browser's lazy loading.
export function SlideImage({ uri, alt, onError }: SlideImageProps) {
  return (
    <img
      src={uri}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={onError}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
