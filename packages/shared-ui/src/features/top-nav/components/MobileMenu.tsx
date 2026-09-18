import { GAME_CATEGORIES } from '@duxcasino/shared-api'
import type { GameCategory } from '@duxcasino/shared-api'
import { LANGUAGES, useUserStore } from '@duxcasino/shared-stores'
import { Separator, Text, YStack } from 'tamagui'

import { CATEGORY_LABELS } from '../../../lib/categories'
import { HAIRLINE, NAV_LINKS } from '../constants'
import { LanguageOption } from './LanguageSelector'
import { NavItem } from './NavItem'

interface MobileMenuProps {
  activeCategory: GameCategory
  onSelectCategory: (category: GameCategory) => void
  onClose: () => void
  showLanguages: boolean
}

export function MobileMenu({
  activeCategory,
  onSelectCategory,
  onClose,
  showLanguages,
}: MobileMenuProps) {
  const language = useUserStore(state => state.language)
  const setLanguage = useUserStore(state => state.setLanguage)

  function select(category: GameCategory) {
    onSelectCategory(category)
    onClose()
  }

  return (
    <YStack
      paddingHorizontal="$4"
      paddingBottom="$5"
      gap="$4"
      backgroundColor="$surface"
      borderBottomWidth={HAIRLINE}
      borderColor="$borderColor"
    >
      <YStack gap="$4" paddingTop="$4">
        {NAV_LINKS.map(label => (
          <NavItem key={label} label={label} onPress={onClose} />
        ))}
      </YStack>

      <Separator borderColor="$borderColor" />

      <YStack gap="$4">
        <Text fontSize="$1" textTransform="uppercase" color="$colorMuted">
          Categories
        </Text>
        {GAME_CATEGORIES.map(category => (
          <NavItem
            key={category}
            label={CATEGORY_LABELS[category]}
            isActive={category === activeCategory}
            onPress={() => select(category)}
          />
        ))}
      </YStack>

      {showLanguages ? (
        <>
          <Separator borderColor="$borderColor" />
          <YStack gap="$4">
            {LANGUAGES.map(option => (
              <LanguageOption
                key={option}
                language={option}
                isActive={option === language}
                onPress={() => {
                  setLanguage(option)
                  onClose()
                }}
              />
            ))}
          </YStack>
        </>
      ) : null}
    </YStack>
  )
}
