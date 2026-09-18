const FOCUS_RING = 2

// Every pressable in the design dims rather than tints on press.
export const PRESS_OPACITY = 0.8

export function pressable(onPress: () => void) {
  return {
    role: 'button',
    tabIndex: 0,
    cursor: 'pointer',
    focusVisibleStyle: {
      outlineColor: '$accent',
      outlineStyle: 'solid',
      outlineWidth: FOCUS_RING,
    },
    onPress,
    onKeyDown: (event: { key: string; preventDefault: () => void }) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      onPress()
    },
  } as const
}
