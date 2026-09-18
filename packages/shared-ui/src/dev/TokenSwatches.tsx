import { ScrollView, Text, XStack, YStack } from 'tamagui'

import { layout, palette, radius } from '../theme/tokens'
import { StoreDemo } from './StoreDemo'

const FONT_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const
const RADIUS_STEPS = ['0', '1', '2', '3', 'true', '4', '5', 'pill'] as const
const SPACE_STEPS = ['1', '2', '3', '4', '5', '6', '8', '10', '12'] as const
const THEME_COLORS = [
  'background',
  'surface',
  'surfaceRaised',
  'color',
  'colorMuted',
  'borderColor',
  'accent',
  'danger',
] as const
const PALETTE_NAMES = [
  'white',
  'violet1',
  'violet2',
  'violet3',
  'violet4',
  'orange2',
  'red',
  'night',
] as const

const SWATCH_WIDTH = 132
const SWATCH_HEIGHT = 56
const HAIRLINE = 1

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <YStack gap="$3">
      <Text fontSize="$4" fontWeight="$7" color="$colorMuted">
        {title}
      </Text>
      {children}
    </YStack>
  )
}

type ColorToken = `$${(typeof PALETTE_NAMES)[number] | (typeof THEME_COLORS)[number]}`

interface SwatchProps {
  token: ColorToken
  label: string
  detail?: string
}

function Swatch({ token, label, detail }: SwatchProps) {
  return (
    <YStack gap="$1" width={SWATCH_WIDTH}>
      <YStack
        height={SWATCH_HEIGHT}
        backgroundColor={token}
        borderRadius="$3"
        borderWidth={HAIRLINE}
        borderColor="$borderColor"
      />
      <Text fontSize="$2" color="$color">
        {label}
      </Text>
      {detail ? (
        <Text fontSize="$1" color="$colorMuted">
          {detail}
        </Text>
      ) : null}
    </YStack>
  )
}

interface TokenSwatchesProps {
  topInset?: number
}

export function TokenSwatches({ topInset = 0 }: TokenSwatchesProps) {
  return (
    <ScrollView backgroundColor="$background">
      <YStack
        padding="$6"
        paddingTop={topInset + 24}
        gap="$9"
        maxWidth={layout.contentWidth}
        width="100%"
        alignSelf="center"
      >
        <Text fontSize="$7" lineHeight="$7" color="$color">
          DuxCasino design tokens
        </Text>

        <StoreDemo />

        <Section title="Palette — from Figma variables">
          <XStack flexWrap="wrap" gap="$4">
            {PALETTE_NAMES.map(name => (
              <Swatch key={name} token={`$${name}`} label={`$${name}`} detail={palette[name]} />
            ))}
          </XStack>
        </Section>

        <Section title="Theme — semantic names components use">
          <XStack flexWrap="wrap" gap="$4">
            {THEME_COLORS.map(name => (
              <Swatch key={name} token={`$${name}`} label={`$${name}`} />
            ))}
          </XStack>
        </Section>

        <Section title="Type scale — Rubik">
          <YStack gap="$3">
            {FONT_STEPS.map(step => (
              <XStack key={step} alignItems="baseline" gap="$4">
                <Text fontSize="$2" color="$colorMuted" width={SWATCH_WIDTH / 2}>
                  ${step}
                </Text>
                <Text fontSize={`$${step}`} lineHeight={`$${step}`} color="$color">
                  DuxCasino
                </Text>
              </XStack>
            ))}
          </YStack>
        </Section>

        <Section title="Space scale">
          <YStack gap="$2">
            {SPACE_STEPS.map(step => (
              <XStack key={step} alignItems="center" gap="$4">
                <Text fontSize="$2" color="$colorMuted" width={SWATCH_WIDTH}>
                  ${step}
                </Text>
                <YStack height="$0.5" width={`$${step}`} backgroundColor="$accent" />
              </XStack>
            ))}
          </YStack>
        </Section>

        <Section title="Layout constants — measured off the Figma frame">
          <YStack gap="$2">
            {(Object.keys(layout) as (keyof typeof layout)[]).map(name => (
              <XStack key={name} alignItems="center" gap="$4">
                <Text fontSize="$2" color="$colorMuted" width={SWATCH_WIDTH}>
                  {name}
                </Text>
                <Text fontSize="$2" color="$color">
                  {layout[name]}
                </Text>
              </XStack>
            ))}
          </YStack>
        </Section>

        <Section title="Radius scale">
          <XStack flexWrap="wrap" gap="$4">
            {RADIUS_STEPS.map(step => (
              <YStack key={step} gap="$1" alignItems="center">
                <YStack
                  width={SWATCH_WIDTH / 2}
                  height={SWATCH_HEIGHT}
                  backgroundColor="$surfaceRaised"
                  borderWidth={HAIRLINE}
                  borderColor="$borderColor"
                  borderRadius={radius[step]}
                />
                <Text fontSize="$2" color="$colorMuted">
                  ${step}
                </Text>
              </YStack>
            ))}
          </XStack>
        </Section>
      </YStack>
    </ScrollView>
  )
}
