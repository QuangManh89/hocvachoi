import React from 'react'
import { Pikachu, type PikachuState } from './Pikachu'
import { Kitty, type KittyState } from './Kitty'

export type CompanionType = 'pikachu' | 'kitty'
export type CompanionState = PikachuState // Cả Pikachu và Kitty cùng chia sẻ 8 trạng thái cảm xúc

interface CompanionProps {
  character?: CompanionType
  state?: CompanionState
  className?: string
  size?: number
  onClick?: () => void
}

export const Companion: React.FC<CompanionProps> = ({
  character = 'pikachu',
  state = 'idle',
  className = '',
  size = 240,
  onClick,
}) => {
  if (character === 'kitty') {
    return (
      <Kitty
        state={state as KittyState}
        className={className}
        size={size}
        onClick={onClick}
      />
    )
  }

  return (
    <Pikachu
      state={state}
      className={className}
      size={size}
      onClick={onClick}
    />
  )
}

export default Companion
