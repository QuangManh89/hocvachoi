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

  const renderShapeSvg = (shapeType: string, color: string, isShadow = false) => {
    const fillColor = isShadow ? '#5A3E36' : color
    const opacity = isShadow ? '0.25' : '1'

    if (shapeType === 'circle') {
      return <circle cx="36" cy="36" r="28" fill={fillColor} opacity={opacity} />
    }
    if (shapeType === 'square') {
      return <rect x="10" y="10" width="52" height="52" rx="10" fill={fillColor} opacity={opacity} />
    }
    return <polygon points="36,8 64,62 8,62" fill={fillColor} opacity={opacity} />
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto p-2">
      <div className="w-full flex justify-between items-center gap-6">
        {/* Cột trái: Các hình khối màu sắc */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="text-center font-bold text-sm text-[#8C6D62]">Hình màu</div>
          {activity.pairs.map((pair) => {
            const isMatched = matchedIds.has(pair.id)
            const isSelected = selectedShapeId === pair.id

            return (
              <motion.button
                key={pair.id}
                onClick={() => handleSelectShape(pair)}
                whileTap={{ scale: 0.94 }}
                animate={isSelected ? { scale: 1.08, borderColor: '#FED000' } : {}}
                className={`btn-kid h-24 bg-white rounded-3xl border-4 flex items-center justify-center p-3 shadow-md relative transition-all ${
                  isMatched
                    ? 'opacity-40 border-green-400 bg-green-50'
                    : isSelected
                    ? 'border-[#FED000] shadow-lg ring-4 ring-[#FED000]/40'
                    : 'border-[#5A3E36]/20'
                }`}
              >
                <svg viewBox="0 0 72 72" className="w-16 h-16">
                  {renderShapeSvg(pair.shapeType, pair.color)}
                </svg>
                {isMatched && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Mũi tên ở giữa */}
        <div className="text-2xl text-[#8C6D62] font-black">➔</div>

        {/* Cột phải: Các bóng hình */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="text-center font-bold text-sm text-[#8C6D62]">Bóng hình</div>
          {shadowPairs.map((pair) => {
            const isMatched = matchedIds.has(pair.id)

            return (
              <motion.button
                key={pair.id}
                onClick={() => handleSelectShadow(pair)}
                whileTap={{ scale: 0.94 }}
                className={`btn-kid h-24 bg-[#FFF8EC] rounded-3xl border-4 flex items-center justify-center p-3 shadow-sm border-dashed relative transition-all ${
                  isMatched
                    ? 'opacity-40 border-green-400 bg-green-50'
                    : 'border-[#5A3E36]/40 hover:border-[#5A3E36]'
                }`}
              >
                <svg viewBox="0 0 72 72" className="w-16 h-16">
                  {renderShapeSvg(pair.shapeType, pair.color, true)}
                </svg>
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
