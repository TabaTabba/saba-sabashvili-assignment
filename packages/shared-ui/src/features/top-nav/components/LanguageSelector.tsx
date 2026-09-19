import { LANGUAGES, useUserStore } from '@duxcasino/shared-stores'
import type { Language } from '@duxcasino/shared-stores'
import { useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'

import FlagDe from '../../../assets/flag-de.svg'
import FlagFr from '../../../assets/flag-fr.svg'
import FlagGb from '../../../assets/flag-gb.svg'
import FlagIt from '../../../assets/flag-it.svg'
import { pressable } from '../../../lib/pressable'
import { nav } from '../../../theme/tokens'
import { HAIRLINE, LANGUAGE_LABELS, PANEL } from '../constants'

const FLAGS: Record<Language, typeof FlagGb> = {
  en: FlagGb,
  de: FlagDe,
  fr: FlagFr,
  it: FlagIt,
}

interface LanguageSelectorProps {
  size: number
  flagWidth: number
  flagHeight: number
}

export function LanguageSelector({ size, flagWidth, flagHeight }: LanguageSelectorProps) {
  const language = useUserStore(state => state.language)
  const setLanguage = useUserStore(state => state.setLanguage)
  const [isOpen, setIsOpen] = useState(false)

  const Flag = FLAGS[language]

  function select(next: Language) {
    setLanguage(next)
    setIsOpen(false)
  }

  return (
    <YStack
      onMouseLeave={() => setIsOpen(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <YStack
        width={size}
        height={size}
        borderRadius={size}
        borderWidth={nav.borderWidth}
        borderColor="$surfaceRaised"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        hoverStyle={{ borderColor: '$colorMuted' }}
        {...pressable(() => setIsOpen(open => !open))}
        aria-label={`Language: ${LANGUAGE_LABELS[language]}`}
        aria-expanded={isOpen}
      >
        <Flag width={flagWidth} height={flagHeight} />
      </YStack>

      {isOpen ? (
        // Transparent padding rather than a top offset — see CategoryDropdown: an offset leaves a
        // strip that belongs to neither, and crossing it closes the panel via onMouseLeave.
        <YStack
          position="absolute"
          top="100%"
          right={0}
          paddingTop={PANEL.gap}
          zIndex={PANEL.zIndex}
        >
          <YStack
            minWidth={PANEL.minWidth}
            padding="$3"
            gap="$3"
            backgroundColor="$surface"
            borderRadius="$3"
            borderWidth={HAIRLINE}
            borderColor="$borderColor"
          >
            {LANGUAGES.map(option => (
              <LanguageOption
                key={option}
                language={option}
                isActive={option === language}
                onPress={() => select(option)}
              />
            ))}
          </YStack>
        </YStack>
      ) : null}
    </YStack>
  )
}

interface LanguageOptionProps {
  language: Language
  isActive: boolean
  onPress: () => void
}

export function LanguageOption({ language, isActive, onPress }: LanguageOptionProps) {
  const Flag = FLAGS[language]

  return (
    <XStack
      alignItems="center"
      gap="$3"
      hoverStyle={{ opacity: 1 }}
      opacity={isActive ? 1 : 0.7}
      {...pressable(onPress)}
    >
      <Flag width={nav.laptop.flagWidth} height={nav.laptop.flagHeight} />
      <Text fontSize="$3" color={isActive ? '$accent' : '$color'}>
        {LANGUAGE_LABELS[language]}
      </Text>
    </XStack>
  )
}
