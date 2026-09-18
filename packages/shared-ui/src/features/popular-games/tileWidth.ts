// 0 until the container is measured — laying out from an unmeasured width renders a broken-looking
// grid for a frame, so the caller shows skeletons instead.
export function tileWidth(contentWidth: number, columns: number, columnGap: number) {
  if (contentWidth <= 0) return 0
  return (contentWidth - columnGap * (columns - 1)) / columns
}
