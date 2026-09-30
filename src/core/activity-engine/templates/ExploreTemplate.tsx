import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { ExploreActivityData } from '../types'
import { audioService } from '@/core/audio/AudioService'
import { ShapeGraphic, isShapeItem } from '@/components/ShapeGraphic'

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
  const [isCompleted, setIsCompleted] = useState(false)

  React.useEffect(() => {
    setExploredIds(new Set())
    setIsCompleted(false)
  }, [activity.id])

  const handleTapItem = (item: typeof activity.items[0]) => {
    // 1. Phát âm thanh
    audioService.playVoice(item.audioId)
    onFeedback(item.label, 'talk')

    // 2. Cập nhật tiến độ khám phá
    const nextSet = new Set(exploredIds)
    nextSet.add(item.id)
    setExploredIds(nextSet)

    // Nếu đã khám phá hết tất cả các mục
    if (nextSet.size === activity.items.length && !isCompleted) {
      setIsCompleted(true)
      setTimeout(() => {
        onComplete()
      }, 1400)
    }
  }

  const colsClass =
    activity.items.length <= 4
      ? 'grid-cols-2'
      : activity.items.length <= 6
      ? 'grid-cols-2 sm:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-2 overflow-y-auto">
      {/* Hướng dẫn nhẹ */}
      <div className="text-center mb-4">
        <span className="bg-white/90 border-2 border-[#5A3E36]/15 px-5 py-2 rounded-full text-sm font-extrabold text-[#5A3E36] shadow-sm">
          Đã khám phá: {exploredIds.size} / {activity.items.length}
        </span>
      </div>

      {/* Lưới các ô khám phá lớn (≥ 80px) */}
      <div className={`grid ${colsClass} gap-3 sm:gap-4 w-full p-1`}>
        {activity.items.map((item) => {
          const isExplored = exploredIds.has(item.id)
          const bgColor = item.color || '#FFFFFF'
          const isLight =
            bgColor === '#FFFFFF' ||
            bgColor === '#FED000' ||
            bgColor === '#FFF8EC' ||
            bgColor === '#FFF1D6' ||
            bgColor === '#FF80AB'

          return (
            <motion.button
              key={item.id}
              onClick={() => handleTapItem(item)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              animate={isExplored ? { scale: [1, 1.04, 1] } : {}}
              className="relative btn-kid min-h-[110px] sm:min-h-[128px] flex flex-col items-center justify-center p-3 rounded-3xl border-4 border-[#5A3E36] shadow-md transition-shadow active:shadow-inner"
              style={{ backgroundColor: bgColor }}
            >
              {item.displayChar ? (
                <span className="text-4xl sm:text-5xl font-black text-[#5A3E36] mb-1">
                  {item.displayChar}
                </span>
              ) : isShapeItem(item) ? (
                <div className="mb-2 flex items-center justify-center">
                  <ShapeGraphic type={item.shapeType || item.id || item.label} size={48} />
                </div>
              ) : item.icon ? (
                <span className="text-3xl sm:text-4xl mb-1 drop-shadow-sm">{item.icon}</span>
              ) : null}


              <span
                className={`text-base sm:text-lg font-black leading-tight text-center ${
                  isLight
                    ? 'text-[#5A3E36]'
                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
                }`}
              >
                {item.label}
              </span>

              {item.subLabel && (
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    isLight ? 'text-[#8C6D62]' : 'text-white/90'
                  }`}
                >
                  {item.subLabel}
                </span>
              )}

              {/* Ngôi sao nhỏ đánh dấu đã khám phá */}
              {isExplored && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-[#5A3E36]/20">
                  <span className="text-xs">⭐</span>
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
