import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import {
  X,
  Volume2,
  Play,
  Pause,
  HelpCircle,
  Star,
  RotateCcw,
} from 'lucide-react'
import {
  PHONICS_TONES,
  PHONICS_SOUNDS,
  PHONICS_RHYMES_K1,
  PHONICS_RHYMES_K2,
  ALL_PHONICS_ITEMS,
  type PhonicsItem,
} from '@/content/phonicsData'
import { audioService } from '@/core/audio/AudioService'
import { Companion, type CompanionType } from '@/components/Companion'
import type { PikachuState } from '@/components/Pikachu'

interface PhonicsChartModalProps {
  isOpen: boolean
  childName: string
  companion?: CompanionType
  onClose: () => void
}

type TabType = 'all' | 'tones' | 'sounds' | 'k1' | 'k2'
type StudyMode = 'touch' | 'autoplay' | 'quiz'

export const PhonicsChartModal: React.FC<PhonicsChartModalProps> = ({
  isOpen,
  childName,
  companion = 'pikachu',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [studyMode, setStudyMode] = useState<StudyMode>('touch')
  const [activeItem, setActiveItem] = useState<PhonicsItem | null>(null)
  const [companionState, setCompanionState] = useState<PikachuState>('wave')

  // Auto-play state
  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [autoIndex, setAutoIndex] = useState(0)
  const autoPlayTimerRef = useRef<any>(null)

  // Quiz state
  const [targetQuizItem, setTargetQuizItem] = useState<PhonicsItem | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)

  // Danh sách item hiển thị theo tab
  const getDisplayItems = () => {
    switch (activeTab) {
      case 'tones':
        return { tones: PHONICS_TONES, sounds: [], k1: [], k2: [] }
      case 'sounds':
        return { tones: [], sounds: PHONICS_SOUNDS, k1: [], k2: [] }
      case 'k1':
        return { tones: [], sounds: [], k1: PHONICS_RHYMES_K1, k2: [] }
      case 'k2':
        return { tones: [], sounds: [], k1: [], k2: PHONICS_RHYMES_K2 }
      case 'all':
      default:
        return {
          tones: PHONICS_TONES,
          sounds: PHONICS_SOUNDS,
          k1: PHONICS_RHYMES_K1,
          k2: PHONICS_RHYMES_K2,
        }
    }
  }

  // Khởi tạo hoặc reset khi mở modal
  useEffect(() => {
    if (isOpen) {
      setCompanionState('wave')
      setActiveItem(null)
      setIsPlayingAll(false)
      setStudyMode('touch')
      setQuizFeedback(null)
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      audioService.stopVoice()
    }
  }, [isOpen])

  // Dừng autoplay khi unmount hoặc đổi tab
  useEffect(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      setIsPlayingAll(false)
    }
  }, [activeTab, studyMode])

  // Xử lý khi bé chạm vào một âm/vần
  const handleItemClick = (item: PhonicsItem) => {
    if (studyMode === 'quiz') {
      handleQuizAnswer(item)
      return
    }

    setActiveItem(item)
    setCompanionState('talk')

    // Phát âm thanh giọng Nữ miền Nam
    audioService.playPhonics(item.id, item.read, () => {
      setCompanionState('idle')
    })
  }

  // 1. Chế độ Tự Động Đọc Liên Tục (Autoplay)
  const toggleAutoPlay = () => {
    if (isPlayingAll) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      setIsPlayingAll(false)
      audioService.stopVoice()
      setCompanionState('idle')
    } else {
      setIsPlayingAll(true)
      setStudyMode('autoplay')
      setCompanionState('talk')

      const items =
        activeTab === 'sounds'
          ? PHONICS_SOUNDS
          : activeTab === 'k1'
          ? PHONICS_RHYMES_K1
          : activeTab === 'k2'
          ? PHONICS_RHYMES_K2
          : ALL_PHONICS_ITEMS

      let curr = 0
      setAutoIndex(0)

      const playNext = () => {
        if (curr >= items.length) {
          setIsPlayingAll(false)
          setCompanionState('cheer')
          return
        }
        const it = items[curr]
        setActiveItem(it)
        setAutoIndex(curr)
        audioService.playPhonics(it.id, it.read, () => {
          curr++
          autoPlayTimerRef.current = setTimeout(playNext, 800)
        })
      }

      playNext()
    }
  }

  // 2. Chế độ Đố Vui Tìm Vần (Quiz Mode)
  const startQuiz = () => {
    setStudyMode('quiz')
    setIsPlayingAll(false)
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)

    // Lấy ngẫu nhiên 1 âm hoặc vần để đố bé
    const pool = ALL_PHONICS_ITEMS.filter((i) => i.type !== 'tone')
    const randomItem = pool[Math.floor(Math.random() * pool.length)]
    setTargetQuizItem(randomItem)
    setQuizFeedback(null)
    setActiveItem(null)
    setCompanionState('think')

    // Bạn đồng hành đọc câu đố bằng giọng Nữ miền Nam
    setTimeout(() => {
      audioService.speakText(`Đố bé tìm chữ ${randomItem.read} ở đâu nè?`)
    }, 200)
  }

  const handleQuizAnswer = (selected: PhonicsItem) => {
    if (!targetQuizItem) return

    if (selected.id === targetQuizItem.id) {
      // ĐÚNG!
      setQuizFeedback('correct')
      setQuizScore((prev) => prev + 1)
      setCompanionState('cheer')
      audioService.playPhonics(selected.id, selected.read)

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      })

      // Câu hỏi tiếp theo sau 1.8 giây
      setTimeout(() => {
        startQuiz()
      }, 1800)
    } else {
      // CHƯA ĐÚNG -> Động viên nhẹ nhàng
      setQuizFeedback('wrong')
      setCompanionState('encourage')
      audioService.playPhonics(selected.id, selected.read, () => {
        audioService.playVoice('cat_encourage')
      })
    }
  }

  const { tones, sounds, k1, k2 } = getDisplayItems()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#FFFDF7] border-4 border-[#5A3E36] rounded-3xl w-full max-w-6xl h-[95vh] max-h-[880px] shadow-2xl relative text-[#5A3E36] flex flex-col overflow-hidden">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white/90 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-30 shadow-md"
          title="Đóng bảng âm vần"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* HEADER: Tiêu đề BẢNG ÂM VẦN LỚP 1 & Các chế độ học */}
        <header className="p-3 sm:p-4 pb-2 bg-gradient-to-r from-[#FFF9C4] via-[#FFE0B2] to-[#F3E5F5] border-b-3 border-[#5A3E36] flex flex-col md:flex-row items-center justify-between gap-2.5 z-20">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl animate-bounce drop-shadow-sm">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#D84315] tracking-tight leading-none drop-shadow-sm">
                  BẢNG ÂM VẦN LỚP 1
                </h1>
                <span className="bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <span>🌸</span>
                  <span>Giọng Nữ Miền Nam</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6D4C41] font-bold mt-0.5">
                Chạm vào từng ô để nghe cô đọc • 180 âm vần chuẩn tiểu học
              </p>
            </div>
          </div>

          {/* Các nút chế độ học */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Chế độ Chạm Đọc */}
            <button
              onClick={() => {
                setStudyMode('touch')
                setIsPlayingAll(false)
                setTargetQuizItem(null)
              }}
              className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                studyMode === 'touch'
                  ? 'bg-[#FED000] text-[#5A3E36] border-[#5A3E36] shadow-sm'
                  : 'bg-white/90 text-[#8C6D62] border-[#5A3E36]/20'
              }`}
            >
              <span>👆</span>
              <span>Chạm Đọc</span>
            </button>

            {/* Chế độ Tự Động Đọc Liên Tục */}
            <button
              onClick={toggleAutoPlay}
              className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                isPlayingAll
                  ? 'bg-[#FF3B30] text-white border-[#5A3E36] shadow-sm animate-pulse'
                  : 'bg-white/90 text-[#8C6D62] border-[#5A3E36]/20'
              }`}
            >
              {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingAll ? 'Tạm Dừng' : 'Đọc Hết'}</span>
            </button>

            {/* Chế độ Đố Vui Tìm Vần */}
            <button
              onClick={startQuiz}
              className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                studyMode === 'quiz'
                  ? 'bg-[#AB47BC] text-white border-[#5A3E36] shadow-sm'
                  : 'bg-white/90 text-[#8C6D62] border-[#5A3E36]/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Đố Vui {quizScore > 0 && `(⭐${quizScore})`}</span>
            </button>
          </div>
        </header>

        {/* BỘ LỌC TAB NHANH */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-white/80 border-b-2 border-[#5A3E36]/15 overflow-x-auto text-xs font-black">
          {[
            { id: 'all', label: 'Tất Cả (180)', icon: '📚' },
            { id: 'tones', label: 'Dấu Thanh (5)', icon: '〰️' },
            { id: 'sounds', label: 'Âm (42)', icon: '🟡' },
            { id: 'k1', label: 'Vần Kì 1 (105)', icon: '🟠' },
            { id: 'k2', label: 'Vần Kì 2 (28)', icon: '🟣' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#5A3E36] text-white border-[#5A3E36] shadow-sm'
                  : 'bg-white text-[#8C6D62] border-[#5A3E36]/15 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* THÔNG BÁO / THANH HƯỚNG DẪN CỦA BẠN ĐỒNG HÀNH */}
        <div className="px-3 py-1.5 bg-[#FFF8EC] border-b-2 border-[#5A3E36]/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={() => audioService.playVoice(companion === 'kitty' ? 'kitty_greeting' : 'pikachu_greeting')}>
              <Companion character={companion} state={companionState} size={42} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#5A3E36]">
              {studyMode === 'quiz' ? (
                quizFeedback === 'correct' ? (
                  <span className="text-green-600 font-extrabold flex items-center gap-1.5">
                    <span>🎉</span>
                    <span>Bé giỏi quá! Chính xác là chữ {targetQuizItem?.text}!</span>
                  </span>
                ) : quizFeedback === 'wrong' ? (
                  <span className="text-orange-600 font-extrabold flex items-center gap-1.5">
                    <span>💪</span>
                    <span>Cố lên bé ơi! Hãy tìm lại chữ {targetQuizItem?.text} nhé!</span>
                  </span>
                ) : targetQuizItem ? (
                  <span className="text-[#AB47BC] font-black">
                    🎯 Đố {childName}: Bé hãy chạm vào chữ{' '}
                    <span className="underline text-lg uppercase bg-yellow-200 px-1.5 py-0.5 rounded">
                      {targetQuizItem.text}
                    </span>{' '}
                    nhé!
                  </span>
                ) : null
              ) : isPlayingAll ? (
                <span className="text-[#D84315] font-black">
                  🎧 Đang tự động đọc liên tục (Âm số {autoIndex + 1}): <strong className="text-base">{activeItem?.text}</strong>
                </span>
              ) : activeItem ? (
                <span>
                  Đang đọc: <strong className="text-base text-[#D84315]">{activeItem.text}</strong>
                  {activeItem.example && (
                    <span className="ml-2 bg-white px-2 py-0.5 rounded-full border border-[#5A3E36]/15 text-[#6D4C41]">
                      Ví dụ: {activeItem.example}
                    </span>
                  )}
                </span>
              ) : (
                <span>Chào {childName}! Chạm vào chữ bất kỳ để nghe cô đọc giọng Nam Bộ nhé! 🌸</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {studyMode === 'quiz' && quizScore > 0 && (
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300 text-xs font-black text-[#5A3E36]">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-600" />
                <span>{quizScore}</span>
                <button
                  onClick={() => {
                    setQuizScore(0)
                    startQuiz()
                  }}
                  className="ml-1 p-0.5 hover:bg-yellow-200 rounded-full"
                  title="Chơi lại"
                >
                  <RotateCcw className="w-3 h-3 text-[#5A3E36]" />
                </button>
              </div>
            )}

            {activeItem && !isPlayingAll && (
              <button
                onClick={() => audioService.playPhonics(activeItem.id, activeItem.read)}
                className="px-2.5 py-1 bg-white hover:bg-yellow-50 rounded-full border border-[#5A3E36]/20 text-xs font-bold flex items-center gap-1 active:scale-95 text-[#D84315]"
                title="Nghe lại"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe lại</span>
              </button>
            )}
          </div>
        </div>

        {/* KHU VỰC BẢNG NỘI DUNG CUỘN ĐƯỢC */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-[#FFFDF7]">
          {/* 1. DẤU THANH (Dấu huyền, Dấu sắc, Dấu nặng, Dấu hỏi, Dấu ngã) */}
          {tones.length > 0 && (
            <div className="bg-white/95 rounded-2xl border-3 border-[#5A3E36] p-2.5 sm:p-3 shadow-sm">
              <div className="text-xs font-black uppercase text-[#8C6D62] mb-1.5 flex items-center gap-1.5">
                <span>〰️</span>
                <span>DẤU THANH TIẾNG VIỆT ({tones.length} DẤU):</span>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {tones.map((t) => {
                  const isActive = activeItem?.id === t.id
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleItemClick(t)}
                      className={`btn-kid min-h-[56px] sm:min-h-[64px] rounded-2xl border-3 p-1.5 flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[#FED000] border-[#5A3E36] shadow-md ring-3 ring-[#FF7043]'
                          : 'bg-[#FFFDE7] hover:bg-[#FFF9C4] border-[#5A3E36]/30'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl font-black text-[#D84315] leading-none mb-0.5">
                        {t.symbol}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-[#5A3E36] text-center leading-tight">
                        {t.text}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. KHỐI ÂM (42 ÂM - Màu Vàng Nắng) */}
          {sounds.length > 0 && (
            <div className="bg-[#FFFDE7] rounded-3xl border-3 border-[#5A3E36] p-2.5 sm:p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs sm:text-sm font-black uppercase text-[#D84315] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FED000] border border-[#5A3E36]" />
                  <span>BẢNG ÂM ({sounds.length} ÂM ĐƠN & ÂM GHÉP):</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#8C6D62]">
                  Nguyên âm • Phụ âm • Nguyên âm đôi
                </span>
              </div>

              {/* Lưới 14 cột chuẩn xác theo bảng in */}
              <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
                {sounds.map((s) => {
                  const isActive = activeItem?.id === s.id
                  return (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleItemClick(s)}
                      className={`btn-kid min-h-[50px] sm:min-h-[56px] rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                        isActive
                          ? 'bg-[#FFD25E] border-[#5A3E36] shadow-md ring-3 ring-[#FF3B30] scale-105'
                          : 'bg-[#FFF9C4] hover:bg-[#FFF176] border-[#5A3E36]/30'
                      }`}
                      title={s.example ? `${s.text} - ví dụ: ${s.example}` : s.text}
                    >
                      <span className="text-base sm:text-lg font-black text-[#5A3E36] leading-none">
                        {s.text}
                      </span>
                      {s.example && (
                        <span className="text-[8px] sm:text-[9px] text-[#8C6D62] font-semibold mt-0.5 truncate max-w-full">
                          {s.example.split(' ')[0]}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. KHỐI VẦN KÌ 1 (105 VẦN - Màu Cam Pastel) */}
          {k1.length > 0 && (
            <div className="bg-[#FFF3E0] rounded-3xl border-3 border-[#5A3E36] p-2.5 sm:p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs sm:text-sm font-black uppercase text-[#E65100] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FFA726] border border-[#5A3E36]" />
                  <span>BẢNG VẦN HỌC KÌ 1 ({k1.length} VẦN):</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#8C6D62]">
                  Lớp 1 • Học Kì 1
                </span>
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
                {k1.map((r) => {
                  const isActive = activeItem?.id === r.id
                  return (
                    <motion.button
                      key={r.id}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleItemClick(r)}
                      className={`btn-kid min-h-[50px] sm:min-h-[56px] rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                        isActive
                          ? 'bg-[#FFB74D] border-[#5A3E36] shadow-md ring-3 ring-[#E65100] scale-105'
                          : 'bg-[#FFE0B2] hover:bg-[#FFCC80] border-[#5A3E36]/30'
                      }`}
                      title={r.example ? `${r.text} - ví dụ: ${r.example}` : r.text}
                    >
                      <span className="text-base sm:text-lg font-black text-[#5A3E36] leading-none">
                        {r.text}
                      </span>
                      {r.example && (
                        <span className="text-[8px] sm:text-[9px] text-[#8C6D62] font-semibold mt-0.5 truncate max-w-full">
                          {r.example.split(' ')[0]}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 4. KHỐI VẦN KÌ 2 (28 VẦN - Màu Tím Pastel) */}
          {k2.length > 0 && (
            <div className="bg-[#F3E5F5] rounded-3xl border-3 border-[#5A3E36] p-2.5 sm:p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs sm:text-sm font-black uppercase text-[#6A1B9A] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#BA68C8] border border-[#5A3E36]" />
                  <span>BẢNG VẦN HỌC KÌ 2 ({k2.length} VẦN):</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#8C6D62]">
                  Lớp 1 • Học Kì 2 (Vần có âm đệm o, u)
                </span>
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
                {k2.map((r) => {
                  const isActive = activeItem?.id === r.id
                  return (
                    <motion.button
                      key={r.id}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleItemClick(r)}
                      className={`btn-kid min-h-[50px] sm:min-h-[56px] rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                        isActive
                          ? 'bg-[#CE93D8] border-[#5A3E36] shadow-md ring-3 ring-[#6A1B9A] scale-105'
                          : 'bg-[#E1BEE7] hover:bg-[#CE93D8] border-[#5A3E36]/30'
                      }`}
                      title={r.example ? `${r.text} - ví dụ: ${r.example}` : r.text}
                    >
                      <span className="text-base sm:text-lg font-black text-[#5A3E36] leading-none">
                        {r.text}
                      </span>
                      {r.example && (
                        <span className="text-[8px] sm:text-[9px] text-[#8C6D62] font-semibold mt-0.5 truncate max-w-full">
                          {r.example.split(' ')[0]}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Hướng dẫn phụ huynh & trạng thái */}
        <footer className="p-2 sm:p-3 bg-white border-t-2 border-[#5A3E36]/15 flex items-center justify-between text-xs text-[#8C6D62]">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💡</span>
            <span className="font-bold hidden sm:inline">
              Mẹo cho ba mẹ: Dành 5-10 phút mỗi ngày cho bé chạm đọc bảng âm vần trước khi vào lớp 1 nhé!
            </span>
            <span className="font-bold sm:hidden">
              Chạm vào ô để nghe cô phát âm giọng Nam Bộ 🌸
            </span>
          </div>

          <div className="flex items-center gap-2 font-black text-[#5A3E36]">
            <span>Tổng số: 180 âm vần</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default PhonicsChartModal
