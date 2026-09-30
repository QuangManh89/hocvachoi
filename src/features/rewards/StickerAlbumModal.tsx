import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles, Lock } from 'lucide-react'
import confetti from 'canvas-confetti'
import { STICKERS, type Sticker, getUnlockedStickerIds } from '@/content/stickers'
import { audioService } from '@/core/audio/AudioService'

interface StickerAlbumModalProps {
  isOpen: boolean
  profileId: string
  childName: string
  onClose: () => void
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  profileId,
  childName,
  onClose,
}) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [activeSticker, setActiveSticker] = useState<Sticker | null>(null)

  useEffect(() => {
    if (isOpen) {
      getUnlockedStickerIds(profileId).then((ids) => {
        setUnlockedIds(ids)
      })
    }
  }, [isOpen, profileId])

  if (!isOpen) return null

  const handleStickerTap = (sticker: Sticker, isUnlocked: boolean) => {
    if (!isUnlocked) {
      audioService.playVoice('cat_encourage')
      return
    }

    setActiveSticker(sticker)
    audioService.playVoice('cat_praise')

    // Phun pháo hoa nhẹ ăn mừng
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
    })

    setTimeout(() => {
      setActiveSticker(null)
    }, 2200)
  }

  const collectedCount = unlockedIds.length
  const totalCount = STICKERS.length

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-2xl bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* 1. Header cuốn sổ nhãn dán */}
        <header className="bg-white px-5 py-3.5 border-b-3 border-[#5A3E36]/15 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFD25E] border-2 border-[#5A3E36] flex items-center justify-center text-2xl shadow-sm">
              🎁
            </div>
            <div>
              <h2 className="text-lg font-black text-[#5A3E36] flex items-center gap-1.5 leading-tight">
                <span>Bộ Sưu Tập Nhãn Dán</span>
                <Sparkles className="w-4 h-4 text-[#FF8A65]" />
              </h2>
              <p className="text-xs font-bold text-[#8C6D62]">
                Sổ tay của {childName} • Đã sưu tập {collectedCount}/{totalCount} nhãn dán
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#FFF8EC] border-2 border-[#5A3E36]/20 active:scale-95 transition-transform"
            title="Đóng"
          >
            <X className="w-6 h-6 text-[#5A3E36]" />
          </button>
        </header>

        {/* 2. Thanh tiến độ thu thập */}
        <div className="bg-[#FFF1D6] px-5 py-2.5 border-b border-[#5A3E36]/10 flex items-center justify-between text-xs font-black text-[#6B514A]">
          <span>Tiến độ: {Math.round((collectedCount / totalCount) * 100)}%</span>
          <span className="text-[#E65100]">
            {collectedCount === totalCount ? '🎉 Chúc mừng bé đã sưu tập trọn bộ!' : '⚡ Hoàn thành phiên 15 câu để nhận thêm sticker nhé!'}
          </span>
        </div>

        {/* 3. Lưới nhãn dán 12 ô */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {STICKERS.map((sticker) => {
              const isUnlocked = unlockedIds.includes(sticker.id)

              return (
                <motion.button
                  key={sticker.id}
                  onClick={() => handleStickerTap(sticker, isUnlocked)}
                  whileHover={isUnlocked ? { scale: 1.04 } : {}}
                  whileTap={{ scale: 0.94 }}
                  className={`btn-kid min-h-[135px] rounded-3xl p-3 border-3 flex flex-col items-center justify-center text-center transition-all relative ${
                    isUnlocked
                      ? 'border-[#5A3E36] shadow-md'
                      : 'bg-[#F2ECE1]/80 border-dashed border-[#5A3E36]/25 opacity-75'
                  }`}
                  style={{ backgroundColor: isUnlocked ? sticker.bgColor : undefined }}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-4xl mb-1.5 drop-shadow-sm filter">
                        {sticker.icon}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#5A3E36] leading-tight mb-0.5">
                        {sticker.name}
                      </span>
                      <span className="text-[10px] font-bold text-[#8C6D62] leading-tight line-clamp-1">
                        {sticker.description}
                      </span>

                      {/* Huy hiệu đã mở */}
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full px-1.5 py-0.5 text-[9px] font-black text-green-700 border border-green-300 shadow-sm">
                        Đã có
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/70 border-2 border-dashed border-gray-400 flex items-center justify-center mb-1.5">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        Chưa mở khóa
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        ❓ Nhãn bí mật
                      </span>
                    </>
                  )}
                </motion.button>
              )
            })}
          </div>
        </main>

        {/* 4. Popup chúc mừng khi bé chạm vào nhãn dán đã mở */}
        <AnimatePresence>
          {activeSticker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 z-20 pointer-events-none"
            >
              <div
                className="bg-white border-4 border-[#5A3E36] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center max-w-xs animate-bounce"
                style={{ backgroundColor: activeSticker.bgColor }}
              >
                <span className="text-6xl mb-3">{activeSticker.icon}</span>
                <h3 className="text-xl font-black text-[#5A3E36] mb-1">{activeSticker.name}</h3>
                <p className="text-xs font-bold text-[#6D4C41]">{activeSticker.description}</p>
                <div className="mt-3 bg-white px-3 py-1 rounded-full text-xs font-black text-[#2E7D32] border border-[#2E7D32]/30 shadow-sm">
                  ✨ Nhãn dán của {childName}!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
export default StickerAlbumModal
