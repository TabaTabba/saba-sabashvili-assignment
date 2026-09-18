import { GAME_CATEGORIES } from '@duxcasino/shared-api'
import type { GameCategory } from '@duxcasino/shared-api'
import { useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'

import CaretDown from '../../../assets/caret-down.svg'
import { fontWeight } from '../../../theme/fonts'
import { CATEGORY_LABELS } from '../../../lib/categories'
import { pressable } from '../../../lib/pressable'
import { nav } from '../../../theme/tokens'
import { HAIRLINE, PANEL } from '../constants'

const PANEL_TOP = 26

interface CategoryDropdownProps {
  activeCategory: GameCategory
  onSelectCategory: (category: GameCategory) => void
}

export function CategoryDropdown({ activeCategory, onSelectCategory }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  function select(category: GameCategory) {
    onSelectCategory(category)
    setIsOpen(false)
  }

  return (
    <YStack
      onMouseLeave={() => setIsOpen(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <XStack
        alignItems="center"
        gap={nav.laptop.caretGap}
        {...pressable(() => setIsOpen(open => !open))}
        aria-expanded={isOpen}
      >
        <Text
          fontSize="$2"
          fontWeight={fontWeight.bold}
          textTransform="uppercase"
          color={isOpen || activeCategory !== 'all' ? '$accent' : '$color'}
          hoverStyle={{ color: '$accent' }}
        >
          {CATEGORY_LABELS.all}
        </Text>
        {/* The asset points up, so the closed state is the flipped one. */}
        <YStack transition="quick" rotate={isOpen ? '0deg' : '180deg'}>
          <CaretDown width={nav.caretWidth} height={nav.caretHeight} />
        </YStack>
      </XStack>

      {isOpen ? (
        <YStack
          position="absolute"
          top={PANEL_TOP}
          left={0}
          minWidth={PANEL.minWidth}
          zIndex={PANEL.zIndex}
          padding="$3"
          gap="$3"
          backgroundColor="$surface"
          borderRadius="$3"
          borderWidth={HAIRLINE}
          borderColor="$borderColor"
        >
          {GAME_CATEGORIES.map(category => (
            <Text
              key={category}
              fontSize="$2"
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
              color={category === activeCategory ? '$accent' : '$color'}
              hoverStyle={{ color: '$accent' }}
              {...pressable(() => select(category))}
            >
              {CATEGORY_LABELS[category]}
            </Text>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
