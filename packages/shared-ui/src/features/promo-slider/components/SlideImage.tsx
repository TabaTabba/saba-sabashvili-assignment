interface SlideImageProps {
  uri: string
  alt: string
  onError: () => void
}

// Web implementation; Metro picks SlideImage.native.tsx over this one. Tamagui's Image has no
// `loading` prop, so the artwork drops to a plain img here to get the browser's lazy loading.
// There is no .web.tsx twin — this file is both the web build and what tsc resolves.
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
