// 0 until the container is measured; the caller shows skeletons until then.
export function tileWidth(contentWidth: number, columns: number, columnGap: number) {
  if (contentWidth <= 0) return 0
  return (contentWidth - columnGap * (columns - 1)) / columns
}
