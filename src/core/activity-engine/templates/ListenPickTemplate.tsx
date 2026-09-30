import React, { useState } from 'react'
import { motion } from 'motion/react'
import type { ListenPickActivityData, ChoiceItem } from '../types'
import { audioService } from '@/core/audio/AudioService'
import { ShapeGraphic, isShapeItem } from '@/components/ShapeGraphic'


interface ListenPickTemplateProps {
  activity: ListenPickActivityData
  onComplete: () => void
  onFeedback: (text: string, state: 'talk' | 'cheer' | 'encourage') => void
}

export const ListenPickTemplate: React.FC<ListenPickTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelectChoice = (choice: ChoiceItem) => {
    setSelectedId(choice.id)

    // 1. Pikachu nói và hiển thị ngay tên số / chữ cái bé vừa bấm
    onFeedback(`${choice.label}!`, 'talk')

    let isHandled = false
    const proceedFeedback = () => {
      if (isHandled) return
      isHandled = true
      if (choice.isCorrect) {
        audioService.playVoice('cat_praise', () => {
          onComplete()
        })
        onFeedback('Giỏi quá! Đúng rồi!', 'cheer')
      } else {
        setHasWrongAttempt(true)
        setTimeout(() => {
          audioService.playVoice('cat_encourage')
          onFeedback('Thử lại nhé, ở đây nè!', 'encourage')
        }, 150)
      }
    }

    // 2. Đọc to số / chữ cái đó cho bé nghe
    audioService.playChoice(choice.audioId, choice.label, () => {
      proceedFeedback()
    })

    // Timeout an toàn (1.3s)
    setTimeout(proceedFeedback, 1300)
  }


  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2">
      {/* 3 Lựa chọn lớn cho bé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {activity.choices.map((choice) => {
          const isSelected = selectedId === choice.id
          const shouldHighlightCorrect = hasWrongAttempt && choice.isCorrect

          return (
            <motion.button
              key={choice.id}
              onClick={() => handleSelectChoice(choice)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              animate={
                shouldHighlightCorrect
                  ? { scale: [1, 1.08, 1], boxShadow: ['0 0 0px #FED000', '0 0 25px #FED000', '0 0 0px #FED000'] }
                  : {}
              }
              transition={shouldHighlightCorrect ? { repeat: Infinity, duration: 1.2 } : {}}
              className={`btn-kid h-36 flex flex-col items-center justify-center p-4 rounded-3xl border-4 border-[#5A3E36] shadow-md transition-all ${
                isSelected && choice.isCorrect ? 'ring-4 ring-[#7ED6C1]' : ''
              }`}
              style={{ backgroundColor: choice.color || '#FFFFFF' }}
            >
              {isShapeItem(choice) ? (
                <div className="mb-2 flex items-center justify-center">
                  <ShapeGraphic type={choice.id || choice.label} size={44} />
                </div>
              ) : (
                <span className="text-4xl mb-2 drop-shadow-sm">{choice.icon || '🎨'}</span>
              )}
              <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {choice.label}
              </span>
            </motion.button>

          )
        })}
      </div>
    </div>
  )
}
export default ListenPickTemplate
