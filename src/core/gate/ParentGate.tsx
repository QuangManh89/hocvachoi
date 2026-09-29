import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ShieldCheck, X } from 'lucide-react'

interface ParentGateProps {
  isOpen: boolean
  onSuccess: () => void
  onClose: () => void
}

export const ParentGate: React.FC<ParentGateProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [holdingLeft, setHoldingLeft] = useState(false)
  const [holdingRight, setHoldingRight] = useState(false)
  const [progress, setProgress] = useState(0) // 0 to 100%
  const timerRef = useRef<number | null>(null)

  const isBothHolding = holdingLeft && holdingRight

  useEffect(() => {
    if (!isOpen) {
      setHoldingLeft(false)
      setHoldingRight(false)
      setProgress(0)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    if (isBothHolding) {
      const stepMs = 50
      const totalMs = 3000 // Giữ 3 giây theo quy định Mục 9.1
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const next = prev + (stepMs / totalMs) * 100
          if (next >= 100) {
            clearInterval(timerRef.current!)
            onSuccess()
            return 100
          }
          return next
        })
      }, stepMs)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setProgress(0)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isBothHolding, isOpen, onSuccess])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-[#5A3E36]/90 backdrop-blur-md text-[#FFF8EC] select-none touch-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#FFD25E]" />
          <h2 className="text-2xl font-bold">Cổng Phụ Huynh</h2>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-transform"
        >
          <X className="w-7 h-7 text-[#FFF8EC]" />
        </button>
      </div>

      {/* Thông điệp hướng dẫn ở giữa */}
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center relative mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-[#FFD25E]"
            style={{
              clipPath: `polygon(50% 50%, -50% -50%, ${progress * 2}% -50%, ${progress * 2}% 150%, -50% 150%)`,
            }}
          />
          <span className="text-3xl font-extrabold text-[#FFD25E]">
            {Math.ceil(progress)}%
          </span>
        </div>
        <p className="text-xl font-medium mb-2">
          Nhấn và giữ đồng thời cả 2 nút tròn ở hai góc dưới trong 3 giây
        </p>
        <p className="text-sm text-[#FFF8EC]/70">
          (Cơ chế bảo vệ 2 điểm chạm giúp chống bé thao tác nhầm)
        </p>
      </div>

      {/* Hai nút 2 điểm chạm ở 2 góc dưới */}
      <div className="flex justify-between items-end pb-4">
        {/* Nút góc trái */}
        <button
          onPointerDown={() => setHoldingLeft(true)}
          onPointerUp={() => setHoldingLeft(false)}
          onPointerCancel={() => setHoldingLeft(false)}
          className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center font-bold text-lg transition-all ${
            holdingLeft
              ? 'bg-[#7ED6C1] text-[#5A3E36] border-[#FFF8EC] scale-95 shadow-lg'
              : 'bg-white/20 text-[#FFF8EC] border-white/40 active:scale-90'
          }`}
        >
          <span>GIỮ ĐÂY</span>
          <span className="text-xs">Điểm 1</span>
        </button>

        {/* Nút góc phải */}
        <button
          onPointerDown={() => setHoldingRight(true)}
          onPointerUp={() => setHoldingRight(false)}
          onPointerCancel={() => setHoldingRight(false)}
          className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center font-bold text-lg transition-all ${
            holdingRight
              ? 'bg-[#7ED6C1] text-[#5A3E36] border-[#FFF8EC] scale-95 shadow-lg'
              : 'bg-white/20 text-[#FFF8EC] border-white/40 active:scale-90'
          }`}
        >
          <span>GIỮ ĐÂY</span>
          <span className="text-xs">Điểm 2</span>
        </button>
      </div>
    </div>
  )
}
export default ParentGate
