import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { ExploreActivityData } from '../types'
import { audioService } from '@/core/audio/AudioService'

interface ExploreTemplateProps {
  activity: ExploreActivityData
  onComplete: () => void
  onFeedback: (text: string, state: 'talk' | 'cheer') => void
}

export const ExploreTemplate: React.FC<ExploreTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set())

  const handleTapItem = (item: typeof activity.items[0]) => {
    // 1. Phát âm thanh
    audioService.playVoice(item.audioId)
    onFeedback(item.label, 'talk')

    // 2. Cập nhật tiến độ khám phá
    const nextSet = new Set(exploredIds)
    nextSet.add(item.id)
    setExploredIds(nextSet)

    // Nếu đã khám phá hết tất cả các mục
    if (nextSet.size === activity.items.length) {
      setTimeout(() => {
        onComplete()
      }, 1400)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2">
      {/* Hướng dẫn nhẹ */}
      <div className="text-center mb-6">
        <span className="bg-white/80 border-2 border-[#5A3E36]/10 px-4 py-1.5 rounded-full text-sm font-bold text-[#8C6D62]">
          Đã khám phá {exploredIds.size}/{activity.items.length} màu
        </span>
      </div>

      {/* Lưới các ô khám phá lớn (≥ 80px) */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {activity.items.map((item) => {
          const isExplored = exploredIds.has(item.id)
          return (
            <motion.button
              key={item.id}
              onClick={() => handleTapItem(item)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              className="relative btn-kid h-36 flex flex-col items-center justify-center p-4 rounded-3xl border-4 border-[#5A3E36] shadow-md transition-shadow active:shadow-inner"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-4xl mb-2 drop-shadow-sm">{item.icon}</span>
              <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {item.label}
              </span>

              {/* Ngôi sao nhỏ đánh dấu đã khám phá */}
              {isExplored && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                  <span className="text-sm">⭐</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default ExploreTemplate
