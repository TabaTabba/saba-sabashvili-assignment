import { GAME_CATEGORIES } from '@duxcasino/shared-api'
import type { GameCategory } from '@duxcasino/shared-api'
import { useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'

import CaretDown from '../../../assets/caret-down.svg'
import { fontWeight } from '../../../theme/fonts'
import { nav } from '../../../theme/tokens'
import { CATEGORY_LABELS, HAIRLINE, PANEL } from '../constants'

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
    <YStack onMouseLeave={() => setIsOpen(false)}>
      <XStack
        alignItems="center"
        gap={nav.laptop.caretGap}
        cursor="pointer"
        onPress={() => setIsOpen(open => !open)}
        role="button"
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
              cursor="pointer"
              hoverStyle={{ color: '$accent' }}
              onPress={() => select(category)}
              role="button"
            >
              {CATEGORY_LABELS[category]}
            </Text>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
