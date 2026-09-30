import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { TapCountActivityData } from '../types'
import { audioService } from '@/core/audio/AudioService'

interface TapCountTemplateProps {
  activity: TapCountActivityData
  onComplete: () => void
  onFeedback: (text: string, state: 'talk' | 'cheer') => void
}

export const TapCountTemplate: React.FC<TapCountTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const [countedCount, setCountedCount] = useState(0)
  const [countedIndices, setCountedIndices] = useState<number[]>([])

  const total = activity.targetCount || 5
  const countAudios = [
    'count_1',
    'count_2',
    'count_3',
    'count_4',
    'count_5',
    'count_6',
    'count_7',
    'count_8',
    'count_9',
    'count_10',
  ]
  const countLabels = [
    'Một!',
    'Hai!',
    'Ba!',
    'Bốn!',
    'Năm!',
    'Sáu!',
    'Bảy!',
    'Tám!',
    'Chín!',
    'Mười!',
  ]

  const handleTapApple = (index: number) => {
    if (countedIndices.includes(index)) return

    const nextCount = countedCount + 1
    const nextIndices = [...countedIndices, index]
    setCountedCount(nextCount)
    setCountedIndices(nextIndices)

    const audioId = countAudios[nextCount - 1] || 'count_10'
    const label = countLabels[nextCount - 1] || `${nextCount}`

    audioService.playVoice(audioId)
    onFeedback(label, nextCount === total ? 'cheer' : 'talk')

    if (nextCount === total) {
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2">
      {/* Cột mốc đếm to rõ ở trên */}
      <div className="flex items-center justify-center gap-3 mb-6 bg-white px-6 py-3 rounded-full border-3 border-[#5A3E36] shadow-sm">
        <span className="text-xl font-bold text-[#8C6D62]">Bé đã đếm:</span>
        <span className="text-4xl font-black text-[#FF5252]">{countedCount}</span>
        <span className="text-2xl font-bold text-[#8C6D62]">/ {total}</span>
      </div>

      {/* Vườn táo đếm chạm */}
      <div className="bg-[#E8F5E9] border-4 border-[#81C784] rounded-3xl p-6 w-full flex flex-wrap items-center justify-center gap-4 shadow-inner min-h-[220px]">
        {Array.from({ length: total }).map((_, idx) => {
          const isCounted = countedIndices.includes(idx)
          const countRank = countedIndices.indexOf(idx) + 1

          return (
            <motion.button
              key={idx}
              onClick={() => handleTapApple(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              animate={isCounted ? { scale: [1, 1.15, 1], y: [0, -10, 0] } : {}}
              className={`relative btn-kid w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-3 transition-all ${
                isCounted
                  ? 'bg-white border-green-500 shadow-md'
                  : 'bg-white/80 border-[#5A3E36]/30 hover:border-[#5A3E36] shadow-sm'
              }`}
            >
              <span className="text-5xl">{activity.itemIcon || '🍎'}</span>

              {/* Huy hiệu số thứ tự khi bé đã đếm */}
              {isCounted && (
                <div className="absolute -top-3 -right-2 bg-[#FF5252] text-white font-black text-base w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {countRank}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default TapCountTemplate
