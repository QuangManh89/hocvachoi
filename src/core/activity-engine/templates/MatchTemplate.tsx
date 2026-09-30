import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { MatchActivityData, MatchPair } from '../types'
import { audioService } from '@/core/audio/AudioService'
import { Check } from 'lucide-react'

interface MatchTemplateProps {
  activity: MatchActivityData
  onComplete: () => void
  onFeedback: (text: string, state: 'talk' | 'cheer' | 'encourage' | 'think') => void
}

export const MatchTemplate: React.FC<MatchTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set())

  // Trộn thứ tự các bóng để trẻ tìm kiếm
  const [shadowPairs] = useState(() => [...activity.pairs].reverse())

  const handleSelectShape = (pair: MatchPair) => {
    if (matchedIds.has(pair.id)) return
    setSelectedShapeId(pair.id)
    audioService.playVoice(pair.audioId)
    onFeedback(pair.label, 'talk')
  }

  const handleSelectShadow = (shadowPair: MatchPair) => {
    if (matchedIds.has(shadowPair.id)) return

    if (!selectedShapeId) {
      onFeedback('Bé chạm vào hình màu trước nhé!', 'think')
      return
    }

    if (selectedShapeId === shadowPair.id) {
      // Ghép đúng cặp!
      const nextMatched = new Set(matchedIds)
      nextMatched.add(shadowPair.id)
      setMatchedIds(nextMatched)
      setSelectedShapeId(null)
      audioService.playVoice('cat_praise')
      onFeedback('Đúng rồi! Bạn giỏi quá!', 'cheer')

      if (nextMatched.size === activity.pairs.length) {
        setTimeout(() => {
          onComplete()
        }, 1200)
      }
    } else {
      // Ghép chưa đúng
      audioService.playVoice('cat_encourage')
      onFeedback('Thử lại nhé bé!', 'encourage')
    }
  }

  const renderShapeSvg = (shapeType?: string, color?: string, isShadow = false) => {
    const fillColor = isShadow ? '#5A3E36' : color || '#FF5252'
    const opacity = isShadow ? '0.22' : '1'

    if (shapeType === 'circle') {
      return <circle cx="36" cy="36" r="28" fill={fillColor} opacity={opacity} />
    }
    if (shapeType === 'square') {
      return <rect x="10" y="10" width="52" height="52" rx="12" fill={fillColor} opacity={opacity} />
    }
    if (shapeType === 'triangle') {
      return <polygon points="36,8 64,62 8,62" fill={fillColor} opacity={opacity} />
    }
    if (shapeType === 'star') {
      return (
        <polygon
          points="36,6 45,25 66,25 49,38 55,58 36,46 17,58 23,38 6,25 27,25"
          fill={fillColor}
          opacity={opacity}
        />
      )
    }
    if (shapeType === 'rectangle') {
      return <rect x="6" y="18" width="60" height="36" rx="8" fill={fillColor} opacity={opacity} />
    }
    if (shapeType === 'heart') {
      return (
        <path
          d="M36 62 C36 62 10 44 10 24 A13 13 0 0 1 36 17 A13 13 0 0 1 62 24 C62 44 36 62 36 62 Z"
          fill={fillColor}
          opacity={opacity}
        />
      )
    }
    return <circle cx="36" cy="36" r="28" fill={fillColor} opacity={opacity} />
  }

  const renderLeftContent = (pair: MatchPair) => {
    if (pair.leftType === 'letter' || (!pair.leftType && pair.leftValue)) {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#5A3E36]">{pair.leftValue || pair.label}</span>
        </div>
      )
    }
    if (pair.leftType === 'number') {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#FF5252]">{pair.leftValue}</span>
        </div>
      )
    }
    if (pair.leftType === 'icon') {
      return <span className="text-4xl">{pair.leftValue}</span>
    }

    // Mặc định hoặc shape:
    return (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        {renderShapeSvg(pair.shapeType || pair.leftValue, pair.color || pair.leftColor)}
      </svg>
    )
  }

  const renderRightContent = (pair: MatchPair) => {
    if (pair.rightType === 'word') {
      return (
        <div className="flex flex-col items-center justify-center text-center px-1">
          {pair.rightValue?.includes(' ') ? null : null}
          <span className="text-base sm:text-lg font-black text-[#5A3E36] leading-tight">
            {pair.rightValue || pair.label}
          </span>
        </div>
      )
    }
    if (pair.rightType === 'count') {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[100px]">
          <span className="text-2xl leading-none">{pair.rightValue}</span>
        </div>
      )
    }
    if (pair.rightType === 'icon') {
      return <span className="text-4xl">{pair.rightValue}</span>
    }

    // Mặc định hoặc shadow shape:
    return (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        {renderShapeSvg(pair.shapeType || pair.leftValue, pair.color || pair.leftColor, true)}
      </svg>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2 overflow-y-auto">
      <div className="w-full flex justify-between items-center gap-4 sm:gap-6">
        {/* Cột trái: Đồ vật / Chữ cái / Số / Hình */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="text-center font-black text-xs sm:text-sm text-[#8C6D62] uppercase tracking-wider">
            1. Chạm chọn
          </div>
          {activity.pairs.map((pair) => {
            const isMatched = matchedIds.has(pair.id)
            const isSelected = selectedShapeId === pair.id

            return (
              <motion.button
                key={pair.id}
                onClick={() => handleSelectShape(pair)}
                whileTap={{ scale: 0.94 }}
                animate={isSelected ? { scale: 1.06, borderColor: '#FED000' } : {}}
                className={`btn-kid min-h-[84px] bg-white rounded-3xl border-4 flex items-center justify-center p-3 shadow-md relative transition-all ${
                  isMatched
                    ? 'opacity-40 border-green-400 bg-green-50'
                    : isSelected
                    ? 'border-[#FED000] shadow-lg ring-4 ring-[#FED000]/40'
                    : 'border-[#5A3E36]/20'
                }`}
              >
                {renderLeftContent(pair)}
                {isMatched && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Biểu tượng liên kết ở giữa */}
        <div className="text-2xl text-[#8C6D62] font-black">➔</div>

        {/* Cột phải: Bóng / Hình từ minh họa / Số lượng */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="text-center font-black text-xs sm:text-sm text-[#8C6D62] uppercase tracking-wider">
            2. Ghép vào
          </div>
          {shadowPairs.map((pair) => {
            const isMatched = matchedIds.has(pair.id)

            return (
              <motion.button
                key={pair.id}
                onClick={() => handleSelectShadow(pair)}
                whileTap={{ scale: 0.94 }}
                className={`btn-kid min-h-[84px] bg-[#FFF8EC] rounded-3xl border-4 flex items-center justify-center p-3 shadow-sm border-dashed relative transition-all ${
                  isMatched
                    ? 'opacity-40 border-green-400 bg-green-50'
                    : 'border-[#5A3E36]/30 hover:border-[#5A3E36]'
                }`}
              >
                {renderRightContent(pair)}
                {isMatched && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default MatchTemplate
