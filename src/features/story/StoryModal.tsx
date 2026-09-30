import React, { useState } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { X, ChevronLeft, ChevronRight, Sun } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'

interface StoryModalProps {
  isOpen: boolean
  childName: string
  onClose: () => void
}

interface StoryPage {
  id: number
  title: string
  narration: string
  voiceAudio?: string
  bgGradient: string
  sceneSvg: (props: {
    onSunClick: () => void
    onAppleClick: (idx: number) => void
    applesCollected: number[]
    catActive: boolean
    onCatClick: () => void
  }) => React.ReactNode
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  childName,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [interactiveNotice, setInteractiveNotice] = useState('Chạm vào các hình trong tranh để khám phá nhé!')
  const [applesCollected, setApplesCollected] = useState<number[]>([])
  const [catActive, setCatActive] = useState(false)

  if (!isOpen) return null

  const PAGES: StoryPage[] = [
    {
      id: 0,
      title: 'Buổi Sáng Tươi Đẹp',
      narration: `Ông mặt trời thức giấc, chiếu ánh nắng vàng ấm áp. Pikachu vươn vai chào ngày mới, sẵn sàng cho một chuyến đi chơi!`,
      bgGradient: 'from-[#FFF8EC] via-[#FFF3E0] to-[#FFE082]/40',
      sceneSvg: ({ onSunClick }) => (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-4">
          {/* Ông mặt trời ấm áp góc trên */}
          <motion.div
            whileTap={{ scale: 1.15, rotate: 20 }}
            onClick={onSunClick}
            className="absolute top-4 right-8 cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-[#FED000] rounded-full border-3 border-[#5A3E36] flex items-center justify-center shadow-lg animate-pulse">
              <Sun className="w-10 h-10 text-[#FF7043]" />
            </div>
            <span className="text-[10px] font-black text-[#5A3E36] mt-1 bg-white/80 px-2 py-0.5 rounded-full border">
              Chạm mặt trời ☀️
            </span>
          </motion.div>

          {/* Cửa sổ đón nắng */}
          <div className="absolute top-6 left-8 w-20 h-24 bg-[#E1F5FE] border-3 border-[#5A3E36] rounded-2xl p-1 flex flex-col justify-between shadow-sm">
            <div className="w-full h-1/2 border-b-2 border-[#5A3E36] flex justify-center items-center text-xs">
              🕊️
            </div>
            <div className="w-full h-1/2 flex justify-center items-center text-xs">
              🌸
            </div>
          </div>

          {/* Pikachu chào buổi sáng */}
          <div className="my-auto mt-16 flex flex-col items-center">
            <Pikachu state={pikaState} size={150} />
            <div className="bg-white border-2 border-[#5A3E36] px-3 py-1 rounded-2xl font-black text-xs text-[#5A3E36] shadow mt-2">
              Chào {childName}! Pika Pika! ⚡
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Hái Táo Trong Vườn',
      narration: `Pikachu ra khu vườn xanh mát. Trên cây có những quả táo đỏ mọng. Bé giúp Pikachu hái 3 quả táo vào giỏ nhé!`,
      bgGradient: 'from-[#E8F5E9] via-[#C8E6C9]/50 to-[#FFF8EC]',
      sceneSvg: ({ onAppleClick, applesCollected }) => (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-4">
          {/* Cây táo to lớn */}
          <div className="relative w-full max-w-sm h-48 bg-[#81C784]/40 border-3 border-[#4CAF50] rounded-full mt-2 flex items-center justify-center shadow-inner">
            {/* 3 Quả táo trên cây */}
            {[0, 1, 2].map((idx) => {
              const isPicked = applesCollected.includes(idx)
              const positions = [
                'top-6 left-12',
                'top-14 right-14',
                'bottom-6 left-28',
              ]

              return (
                <motion.button
                  key={idx}
                  disabled={isPicked}
                  whileTap={{ scale: 1.25 }}
                  onClick={() => onAppleClick(idx)}
                  className={`absolute ${positions[idx]} p-2 rounded-2xl transition-all ${
                    isPicked
                      ? 'opacity-20 scale-75 cursor-default'
                      : 'bg-white/80 border-2 border-[#5A3E36] shadow-md animate-bounce cursor-pointer'
                  }`}
                >
                  <span className="text-3xl">🍎</span>
                </motion.button>
              )
            })}
          </div>

          {/* Giỏ đựng táo và Pikachu */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="w-20 h-18 bg-[#D7CCC8] border-3 border-[#5D4037] rounded-b-3xl rounded-t-lg p-1.5 flex flex-col items-center justify-center shadow">
              <span className="text-xs font-black text-[#5D4037]">Giỏ Quả</span>
              <div className="flex gap-1 text-sm mt-0.5">
                {applesCollected.map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
            </div>

            <Pikachu state={pikaState} size={110} />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Bạn Mèo Dễ Thương',
      narration: `Bên bờ suối róc rách, Pikachu gặp bạn Mèo con đang tung tăng. Pikachu tươi cười tặng bạn Mèo một quả táo thơm!`,
      bgGradient: 'from-[#E0F7FA] via-[#B2EBF2]/40 to-[#FFF8EC]',
      sceneSvg: ({ onCatClick, catActive }) => (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-4">
          {/* Cầu gỗ và dòng suối */}
          <div className="w-full h-12 bg-[#80DEEA]/50 border-y-3 border-[#00ACC1] flex items-center justify-around text-lg shadow-inner">
            <span className="animate-pulse">🐟</span>
            <span>🌊</span>
            <span className="animate-pulse">🐟</span>
          </div>

          {/* Pikachu & Mèo Con */}
          <div className="flex items-center justify-center gap-8 my-auto">
            <div className="flex flex-col items-center">
              <Pikachu state={pikaState} size={120} />
              <span className="text-xs font-black text-[#5A3E36] mt-1">Pikachu</span>
            </div>

            <div className="text-2xl animate-bounce">🎁</div>

            {/* Chú Mèo Con tương tác */}
            <motion.div
              whileTap={{ scale: 1.15 }}
              onClick={onCatClick}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-24 h-24 rounded-3xl border-3 border-[#5A3E36] flex items-center justify-center text-5xl shadow-md transition-all ${
                  catActive ? 'bg-[#FED000] scale-105' : 'bg-white'
                }`}
              >
                🐱
              </div>
              <span className="text-xs font-black text-[#5A3E36] mt-1 bg-white px-2 py-0.5 rounded-full border shadow-sm">
                {catActive ? 'Meo meo! Cảm ơn bạn!' : 'Chạm vào Mèo 🐾'}
              </span>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Bữa Tiệc Picnic Vui Vẻ',
      narration: `Dưới bóng cây xanh mát, Pikachu và Mèo con cùng ngồi thưởng thức quả ngọt. Thật là một ngày tuyệt vời bên bạn bè!`,
      bgGradient: 'from-[#FFF3E0] via-[#FFE0B2]/40 to-[#E8F5E9]',
      sceneSvg: () => (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-6 mb-2">
            <Pikachu state="cheer" size={130} />
            <div className="text-5xl animate-bounce">🐱</div>
          </div>

          {/* Thảm picnic rực rỡ */}
          <div className="bg-[#FED000]/40 border-3 border-[#5A3E36] rounded-3xl p-3 px-6 flex items-center gap-4 shadow-md">
            <span className="text-3xl">🧺</span>
            <span className="text-3xl">🍎</span>
            <span className="text-3xl">🧃</span>
            <span className="text-3xl">✨</span>
          </div>

          <div className="mt-3 bg-white px-4 py-1.5 rounded-full border-2 border-[#5A3E36] shadow-sm font-black text-xs text-[#5A3E36]">
            🎉 Chúc bé {childName} luôn vui vẻ và chăm ngoan!
          </div>
        </div>
      ),
    },
  ]

  const activePage = PAGES[currentPage]

  const handleNextPage = () => {
    if (currentPage + 1 < PAGES.length) {
      setCurrentPage((p) => p + 1)
      audioService.playChime()
      setPikaState('talk')
      setInteractiveNotice('Chạm vào các hình trong trang mới để khám phá!')
    } else {
      // Hết truyện
      audioService.playVoice('cheer_finish')
      confetti({ particleCount: 80, spread: 70 })
      onClose()
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1)
      audioService.playChime()
      setPikaState('talk')
    }
  }

  // Tương tác chạm ông mặt trời
  const handleSunClick = () => {
    audioService.playSpark(784)
    setPikaState('cheer')
    setInteractiveNotice('Mặt trời tỏa nắng rực rỡ chào bé!')
    setTimeout(() => setPikaState('idle'), 1000)
  }

  // Tương tác hái táo
  const handleAppleClick = (idx: number) => {
    if (applesCollected.includes(idx)) return
    audioService.playSnap()
    const nextCollected = [...applesCollected, idx]
    setApplesCollected(nextCollected)
    setPikaState('cheer')
    setInteractiveNotice(`Bé đã hái được ${nextCollected.length}/3 quả táo!`)

    if (nextCollected.length === 3) {
      audioService.playChime()
      setInteractiveNotice('Giỏi quá! Đã hái đầy giỏ táo rồi!')
    }
  }

  // Tương tác bạn Mèo
  const handleCatClick = () => {
    setCatActive(true)
    audioService.playSpark(660)
    setPikaState('cheer')
    setInteractiveNotice('Mèo con nói: "Meo meo! Quả táo ngon quá, cảm ơn Pikachu và bé!"')
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl relative text-[#5A3E36] flex flex-col h-[94vh] max-h-[700px]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Thanh tiêu đề sách truyện */}
        <div className="flex items-center justify-between gap-3 mb-2 pr-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFD25E] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-xl shadow-sm">
              📚
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Chuyện Kể Cùng Pikachu</h2>
              <p className="text-xs text-[#8C6D62]">
                Trang {currentPage + 1}/{PAGES.length}: {activePage.title}
              </p>
            </div>
          </div>

          {/* Dấu chấm trang */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#5A3E36]/20">
            {PAGES.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentPage ? 'bg-[#FF7043] w-5' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KHUNG MINH HỌA TRANG TRUYỆN TƯƠNG TÁC */}
        <div
          className={`flex-1 rounded-3xl border-3 border-[#5A3E36] bg-gradient-to-b ${activePage.bgGradient} shadow-inner overflow-hidden relative flex flex-col justify-between`}
        >
          {activePage.sceneSvg({
            onSunClick: handleSunClick,
            onAppleClick: handleAppleClick,
            applesCollected,
            catActive,
            onCatClick: handleCatClick,
          })}

          {/* Nhãn gợi ý chạm */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 border border-[#5A3E36]/20 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#5A3E36] shadow-sm pointer-events-none">
            {interactiveNotice}
          </div>
        </div>

        {/* KHUNG LỜI DẪN TRUYỆN TRUYỀN CẢM */}
        <div className="bg-white/95 border-2 border-[#5A3E36]/20 rounded-2xl p-3 my-2 shadow-sm flex items-start gap-2.5">
          <div className="w-7 h-7 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/20 flex items-center justify-center shrink-0 text-sm">
            📖
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#5A3E36] leading-relaxed flex-1">
            {activePage.narration}
          </p>
        </div>

        {/* ĐIỀU HƯỚNG TRANG (TOUCH TARGETS >= 80PX HOẶC COMFORTABLE) */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`btn-kid min-h-[56px] px-5 rounded-2xl border-2 border-[#5A3E36] font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              currentPage === 0
                ? 'opacity-40 bg-gray-100 cursor-not-allowed'
                : 'bg-white active:bg-amber-50 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Trang Trước</span>
          </button>

          <button
            onClick={handleNextPage}
            className="btn-kid min-h-[56px] px-6 rounded-2xl border-2 border-[#5A3E36] bg-[#FED000] font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span>{currentPage + 1 < PAGES.length ? 'Trang Tiếp' : 'Đọc Xong Rồi'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default StoryModal
