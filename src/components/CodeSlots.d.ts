import type { ReactElement } from 'react'

export type CodeSlotsStatus = 'idle' | 'error' | 'success'

export interface CodeSlotsProps {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (code: string) => void
  onComplete?: (code: string) => void
  status?: CodeSlotsStatus
  mask?: boolean
  caret?: boolean
  disabled?: boolean
  autoFocus?: boolean
  accentColor?: string
  inkColor?: string
  slotColor?: string
  digitColor?: string
  dangerColor?: string
  slotSize?: number
  gap?: number
  radius?: number
  bounce?: number
  settle?: number
  rise?: number
  cascade?: number
  ariaLabel?: string
  className?: string
}

export default function CodeSlots(props: CodeSlotsProps): ReactElement
