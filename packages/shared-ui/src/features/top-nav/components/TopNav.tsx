import type { GameCategory } from '@duxcasino/shared-api'
import { useUserStore } from '@duxcasino/shared-stores'
import { useState } from 'react'
import { XStack, YStack, useMedia } from 'tamagui'

import Logo from '../../../assets/logo-duxcasino.svg'
import { nav } from '../../../theme/tokens'
import { NAV_LINKS } from '../constants'
import { AccountControls } from './AccountControls'
import { AuthButtons } from './AuthButtons'
import { BurgerButton } from './BurgerButton'
import { CategoryDropdown } from './CategoryDropdown'
import { LanguageSelector } from './LanguageSelector'
import { MobileMenu } from './MobileMenu'
import { NavItem } from './NavItem'

interface TopNavProps {
  activeCategory: GameCategory
  onSelectCategory: (category: GameCategory) => void
}

export function TopNav({ activeCategory, onSelectCategory }: TopNavProps) {
  const media = useMedia()
  const user = useUserStore(state => state.user)
  const hasHydrated = useUserStore(state => state.hasHydrated)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const size = media.xl ? nav.laptop : media.md ? nav.tablet : nav.phone
  const isCompact = !media.xl
  const authClusterWidth = size.authWidth * 2 + size.authGap

  return (
    <YStack
      backgroundColor="$background"
      onKeyDown={event => {
        if (event.key === 'Escape') setIsMenuOpen(false)
      }}
    >
      <XStack
        width="100%"
        maxWidth={size.frameWidth}
        alignSelf="center"
        height={size.height}
        paddingHorizontal={size.gutter}
        paddingBottom={size.rowPaddingBottom}
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap={size.burgerGap} width={size.leftBlockWidth}>
          {isCompact ? (
            <BurgerButton
              size={size.controlSize}
              isOpen={isMenuOpen}
              onPress={() => setIsMenuOpen(open => !open)}
            />
          ) : null}
          <Logo width={size.logoWidth} height={size.logoHeight} />
        </XStack>

        {isCompact ? null : (
          <XStack alignItems="center" gap={nav.laptop.itemGap}>
            <CategoryDropdown activeCategory={activeCategory} onSelectCategory={onSelectCategory} />
            {NAV_LINKS.map(label => (
              <NavItem key={label} label={label} />
            ))}
          </XStack>
        )}

        {!hasHydrated ? (
          <XStack width={authClusterWidth} height={size.authHeight} />
        ) : user ? (
          <AccountControls
            height={size.authHeight}
            controlSize={size.controlSize}
            gap={size.authGap}
          />
        ) : (
          <AuthButtons width={size.authWidth} height={size.authHeight} gap={size.authGap} />
        )}

        {media.md ? (
          <LanguageSelector
            size={size.controlSize}
            flagWidth={size.flagWidth}
            flagHeight={size.flagHeight}
          />
        ) : null}
      </XStack>

      {isCompact && isMenuOpen ? (
        <MobileMenu
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          onClose={() => setIsMenuOpen(false)}
          showLanguages={!media.md}
        />
      ) : null}
    </YStack>
  )
}
