import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { SortActivityData, SortItem, SortBucket } from '../types'
import { audioService } from '@/core/audio/AudioService'

interface SortTemplateProps {
  activity: SortActivityData
  onComplete: () => void
  onFeedback: (text: string, state: 'talk' | 'cheer' | 'encourage' | 'think') => void
}

export const SortTemplate: React.FC<SortTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [sortedItemIds, setSortedItemIds] = useState<Set<string>>(new Set())

  const handleSelectItem = (item: SortItem) => {
    if (sortedItemIds.has(item.id)) return
    setSelectedItemId(item.id)
    onFeedback(`Bé bỏ ${item.label} vào giỏ nhé!`, 'talk')
  }

  const handleSelectBucket = (bucket: SortBucket) => {
    if (!selectedItemId) {
      onFeedback('Bé chọn đồ vật ở trên trước nhé!', 'think')
      return
    }

    const currentItem = activity.items.find((i) => i.id === selectedItemId)
    if (!currentItem) return

    if (currentItem.bucketId === bucket.id) {
      // Phân loại đúng giỏ!
      const nextSorted = new Set(sortedItemIds)
      nextSorted.add(currentItem.id)
      setSortedItemIds(nextSorted)
      setSelectedItemId(null)

      audioService.playVoice('cat_praise')
      onFeedback('Chính xác! Giỏi quá!', 'cheer')

      if (nextSorted.size === activity.items.length) {
        setTimeout(() => {
          onComplete()
        }, 1200)
      }
    } else {
      // Chọn chưa đúng giỏ
      audioService.playVoice('cat_encourage')
      onFeedback('Chưa đúng màu rồi, thử lại nhé!', 'encourage')
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between items-center w-full max-w-xl mx-auto p-2">
      {/* Khu vực đồ vật cần phân loại ở trên */}
      <div className="w-full bg-white/70 rounded-3xl p-4 border-3 border-[#5A3E36]/15 shadow-sm mb-4">
        <div className="text-center font-bold text-sm text-[#8C6D62] mb-3">
          1. Chạm chọn đồ vật:
        </div>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {activity.items.map((item) => {
            const isSorted = sortedItemIds.has(item.id)
            const isSelected = selectedItemId === item.id

            if (isSorted) return null

            return (
              <motion.button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                animate={isSelected ? { scale: 1.15, y: -6 } : {}}
                className={`btn-kid w-24 h-24 rounded-2xl flex flex-col items-center justify-center p-2 border-4 transition-all shadow-md ${
                  isSelected
                    ? 'border-[#FED000] ring-4 ring-[#FED000]/50 bg-white'
                    : 'border-[#5A3E36] bg-white'
                }`}
              >
                <span className="text-4xl mb-1">{item.icon}</span>
                <span className="text-xs font-bold text-[#5A3E36]">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Khu vực giỏ đựng ở dưới */}
      <div className="w-full">
        <div className="text-center font-bold text-sm text-[#8C6D62] mb-3">
          2. Bỏ vào đúng nhóm tương ứng:
        </div>
        <div className={`grid ${activity.buckets.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-3 w-full`}>
          {activity.buckets.map((bucket) => {
            return (
              <motion.button
                key={bucket.id}
                onClick={() => handleSelectBucket(bucket)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                className="btn-kid h-32 rounded-3xl flex flex-col items-center justify-center p-3 border-4 border-[#5A3E36] shadow-md transition-transform"
                style={{ backgroundColor: bucket.color }}
              >
                <span className="text-4xl mb-1">{bucket.icon || '🧺'}</span>
                <span className="text-base font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-center">
                  {bucket.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default SortTemplate
