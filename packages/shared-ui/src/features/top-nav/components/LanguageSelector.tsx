import { LANGUAGES, useUserStore } from '@duxcasino/shared-stores'
import type { Language } from '@duxcasino/shared-stores'
import { useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'

import FlagDe from '../../../assets/flag-de.svg'
import FlagFr from '../../../assets/flag-fr.svg'
import FlagGb from '../../../assets/flag-gb.svg'
import FlagIt from '../../../assets/flag-it.svg'
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
    <YStack onMouseLeave={() => setIsOpen(false)}>
      <YStack
        width={size}
        height={size}
        borderRadius={size}
        borderWidth={nav.borderWidth}
        borderColor="$surfaceRaised"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        cursor="pointer"
        hoverStyle={{ borderColor: '$colorMuted' }}
        onPress={() => setIsOpen(open => !open)}
        role="button"
        aria-label={`Language: ${LANGUAGE_LABELS[language]}`}
      >
        <Flag width={flagWidth} height={flagHeight} />
      </YStack>

      {isOpen ? (
        <YStack
          position="absolute"
          top={size + PANEL.gap}
          right={0}
          minWidth={PANEL.minWidth}
          zIndex={PANEL.zIndex}
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
      cursor="pointer"
      hoverStyle={{ opacity: 1 }}
      opacity={isActive ? 1 : 0.7}
      onPress={onPress}
      role="button"
    >
      <Flag width={nav.laptop.flagWidth} height={nav.laptop.flagHeight} />
      <Text fontSize="$3" color={isActive ? '$accent' : '$color'}>
        {LANGUAGE_LABELS[language]}
      </Text>
    </XStack>
  )
}
