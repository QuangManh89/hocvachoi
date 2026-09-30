import React, { useState } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { X, RotateCcw } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'

interface PuzzleGameModalProps {
  isOpen: boolean
  childName: string
  onClose: () => void
}

type PuzzleMode = 'jigsaw' | 'shadow' | 'pattern'

// 4 Mảnh ghép Jigsaw 2x2
interface JigsawPiece {
  id: number
  label: string
  bgPosition: string // CSS backgroundPosition cho ảnh
  icon: string
  color: string
}

const JIGSAW_PIECES: JigsawPiece[] = [
  { id: 0, label: 'Tai & Mắt trái', bgPosition: '0% 0%', icon: '⚡', color: '#FED000' },
  { id: 1, label: 'Tai & Mắt phải', bgPosition: '100% 0%', icon: '✨', color: '#FFE055' },
  { id: 2, label: 'Má & Chân trái', bgPosition: '0% 100%', icon: '🔴', color: '#FED000' },
  { id: 3, label: 'Đuôi & Chân phải', bgPosition: '100% 100%', icon: '🌟', color: '#FFE055' },
]

// 3 Đồ vật cho trò ghép bóng
interface ShadowItem {
  id: string
  name: string
  icon: string
  color: string
}

const SHADOW_ITEMS: ShadowItem[] = [
  { id: 'pika', name: 'Pikachu', icon: '⚡', color: '#FED000' },
  { id: 'apple', name: 'Quả Táo', icon: '🍎', color: '#FF3B30' },
  { id: 'car', name: 'Xe Ô Tô', icon: '🚗', color: '#00BCD4' },
]

// Các câu đố quy luật
interface PatternPuzzle {
  id: number
  sequence: { icon: string; label: string }[]
  options: { id: string; icon: string; isCorrect: boolean }[]
  hint: string
}

const PATTERN_PUZZLES: PatternPuzzle[] = [
  {
    id: 1,
    sequence: [
      { icon: '🔴', label: 'Đỏ' },
      { icon: '🟡', label: 'Vàng' },
      { icon: '🔴', label: 'Đỏ' },
      { icon: '❓', label: 'Tiếp theo?' },
    ],
    options: [
      { id: 'opt_yellow', icon: '🟡', isCorrect: true },
      { id: 'opt_blue', icon: '🔵', isCorrect: false },
      { id: 'opt_green', icon: '🟢', isCorrect: false },
    ],
    hint: 'Màu Đỏ rồi đến màu gì nhỉ?',
  },
  {
    id: 2,
    sequence: [
      { icon: '🍎', label: 'Táo' },
      { icon: '⭐', label: 'Sao' },
      { icon: '🍎', label: 'Táo' },
      { icon: '❓', label: 'Tiếp theo?' },
    ],
    options: [
      { id: 'opt_car', icon: '🚗', isCorrect: false },
      { id: 'opt_star', icon: '⭐', isCorrect: true },
      { id: 'opt_flower', icon: '🌸', isCorrect: false },
    ],
    hint: 'Quả táo rồi đến ngôi sao, rồi đến quả táo, tiếp theo là gì?',
  },
  {
    id: 3,
    sequence: [
      { icon: '🔺', label: 'Tam giác' },
      { icon: '🟦', label: 'Vuông' },
      { icon: '🔺', label: 'Tam giác' },
      { icon: '❓', label: 'Tiếp theo?' },
    ],
    options: [
      { id: 'opt_circle', icon: '⭕', isCorrect: false },
      { id: 'opt_square', icon: '🟦', isCorrect: true },
      { id: 'opt_heart', icon: '❤️', isCorrect: false },
    ],
    hint: 'Hình tam giác rồi đến hình vuông, tiếp theo là hình gì?',
  },
]

export const PuzzleGameModal: React.FC<PuzzleGameModalProps> = ({
  isOpen,
  childName,
  onClose,
}) => {
  const [mode, setMode] = useState<PuzzleMode>('jigsaw')
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [hintText, setHintText] = useState('Chạm mảnh ghép rồi chạm vào ô tương ứng!')

  // State chế độ Jigsaw 2x2
  const [boardSlots, setBoardSlots] = useState<(number | null)[]>([null, null, null, null])
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null)
  const [availablePieces, setAvailablePieces] = useState<number[]>([1, 3, 0, 2]) // Xáo trộn ban đầu
  const [isJigsawDone, setIsJigsawDone] = useState(false)

  // State chế độ Ghép bóng (Shadow match)
  const [selectedShadowFigure, setSelectedShadowFigure] = useState<string | null>(null)
  const [matchedShadows, setMatchedShadows] = useState<string[]>([])

  // State chế độ Quy luật (Pattern)
  const [patternIdx, setPatternIdx] = useState(0)
  const [patternSolved, setPatternSolved] = useState(false)

  if (!isOpen) return null

  // --- LOGIC 1: JIGSAW 2x2 ---
  const handleSelectTrayPiece = (pieceId: number) => {
    setSelectedPieceId(pieceId)
    audioService.playSpark(600)
    setPikaState('think')
    setHintText('Bé chọn ô trên khung để đặt mảnh ghép nhé!')
  }

  const handlePlaceInSlot = (slotIdx: number) => {
    if (selectedPieceId === null) return

    if (selectedPieceId === slotIdx) {
      // Ghép ĐÚNG!
      audioService.playSnap()
      const newSlots = [...boardSlots]
      newSlots[slotIdx] = selectedPieceId
      setBoardSlots(newSlots)

      const remaining = availablePieces.filter((id) => id !== selectedPieceId)
      setAvailablePieces(remaining)
      setSelectedPieceId(null)

      if (remaining.length === 0) {
        // Hoàn thành cả bức tranh 4 mảnh
        setIsJigsawDone(true)
        setPikaState('cheer')
        setHintText(`Hoan hô ${childName}! Bé ghép xong tranh Pikachu rồi!`)
        audioService.playChime()
        audioService.playVoice('cheer_finish')
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      } else {
        setPikaState('cheer')
        setHintText('Đúng rồi! Tiếp tục mảnh tiếp theo nào!')
        setTimeout(() => setPikaState('idle'), 1000)
      }
    } else {
      // Chưa đúng ô -> Gentle encouragement
      setPikaState('encourage')
      setHintText('Chưa đúng ô này rồi, bé thử ô khác xem nhé!')
      audioService.playVoice('cat_encourage')
    }
  }

  const handleResetJigsaw = () => {
    setBoardSlots([null, null, null, null])
    setAvailablePieces([2, 0, 3, 1].sort(() => Math.random() - 0.5))
    setSelectedPieceId(null)
    setIsJigsawDone(false)
    setPikaState('wave')
    setHintText('Chạm mảnh ghép rồi chạm vào ô tương ứng!')
  }

  // --- LOGIC 2: SHADOW MATCHING ---
  const handleSelectColorItem = (id: string) => {
    setSelectedShadowFigure(id)
    audioService.playSpark(580)
    setHintText('Chạm vào bóng đen tương ứng ở hàng trên nhé!')
  }

  const handleMatchWithShadow = (targetId: string) => {
    if (!selectedShadowFigure) return

    if (selectedShadowFigure === targetId) {
      // Đúng bóng
      audioService.playSnap()
      const nextMatched = [...matchedShadows, targetId]
      setMatchedShadows(nextMatched)
      setSelectedShadowFigure(null)

      if (nextMatched.length === SHADOW_ITEMS.length) {
        setPikaState('cheer')
        setHintText('Tuyệt vời! Bé đã tìm đúng bóng của tất cả các bạn!')
        audioService.playChime()
        confetti({ particleCount: 60, spread: 60 })
      } else {
        setPikaState('cheer')
        setHintText('Giỏi lắm! Đúng bóng rồi!')
      }
    } else {
      setPikaState('encourage')
      setHintText('Chưa đúng bóng này rồi, bé thử lại nhé!')
      audioService.playVoice('cat_encourage')
    }
  }

  const handleResetShadow = () => {
    setMatchedShadows([])
    setSelectedShadowFigure(null)
    setPikaState('wave')
    setHintText('Chạm hình màu bên dưới rồi ghép vào bóng đen ở trên!')
  }

  // --- LOGIC 3: PATTERN PUZZLE ---
  const currentPattern = PATTERN_PUZZLES[patternIdx]

  const handleSelectPatternOption = (isCorrect: boolean) => {
    if (patternSolved) return
    if (isCorrect) {
      audioService.playSnap()
      setPatternSolved(true)
      setPikaState('cheer')
      setHintText('Chính xác! Bé tìm ra quy luật rồi!')
      audioService.playChime()

      setTimeout(() => {
        if (patternIdx + 1 < PATTERN_PUZZLES.length) {
          setPatternIdx(patternIdx + 1)
          setPatternSolved(false)
          setHintText(PATTERN_PUZZLES[patternIdx + 1].hint)
        } else {
          setHintText(`Bé ${childName} thông minh tuyệt đỉnh! Hoàn thành quy luật!`)
          audioService.playVoice('cheer_finish')
          confetti({ particleCount: 70, spread: 70 })
        }
      }, 1500)
    } else {
      setPikaState('encourage')
      setHintText('Thử lại nhé, bé quan sát kỹ thứ tự lặp lại nè!')
      audioService.playVoice('cat_encourage')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl relative text-[#5A3E36] flex flex-col max-h-[94vh]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pr-10">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-[#FED000] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-2xl shadow-sm">
              🧩
            </div>
            <div>
              <h2 className="text-xl font-black">Trò Chơi Tư Duy</h2>
              <p className="text-xs text-[#8C6D62]">Ghép hình & Rèn luyện quan sát</p>
            </div>
          </div>

          {/* 3 Tabs chọn trò chơi */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => {
                setMode('jigsaw')
                setHintText('Chạm mảnh ghép rồi chạm vào ô tương ứng!')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 ${
                mode === 'jigsaw'
                  ? 'bg-[#FED000] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                  : 'bg-white border-[#5A3E36]/20 text-[#8C6D62]'
              }`}
            >
              🖼️ Ghép 4 Mảnh
            </button>
            <button
              onClick={() => {
                setMode('shadow')
                setHintText('Chạm hình màu bên dưới rồi ghép vào bóng đen ở trên!')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 ${
                mode === 'shadow'
                  ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                  : 'bg-white border-[#5A3E36]/20 text-[#8C6D62]'
              }`}
            >
              👥 Ghép Bóng
            </button>
            <button
              onClick={() => {
                setMode('pattern')
                setHintText(PATTERN_PUZZLES[patternIdx].hint)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 ${
                mode === 'pattern'
                  ? 'bg-[#FF8A65] border-[#5A3E36] text-white shadow-sm'
                  : 'bg-white border-[#5A3E36]/20 text-[#8C6D62]'
              }`}
            >
              🔄 Điền Quy Luật
            </button>
          </div>
        </div>

        {/* KHÔNG GIAN CHƠI THEO TỪNG CHẾ ĐỘ */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto py-1">
          {/* ================= CHẾ ĐỘ 1: JIGSAW 2x2 ================= */}
          {mode === 'jigsaw' && (
            <div className="flex flex-col items-center">
              {/* KHUNG TRANH 2x2 */}
              <div className={`relative grid grid-cols-2 gap-2 bg-[#FFFDF9] p-3 rounded-3xl border-4 border-[#5A3E36] shadow-md w-64 h-64 sm:w-72 sm:h-72 transition-all ${isJigsawDone ? 'ring-4 ring-[#4CAF50] scale-105' : ''}`}>
                {isJigsawDone && (
                  <div className="absolute -top-3 -right-3 bg-[#4CAF50] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md z-20 animate-bounce">
                    Hoàn Thành! 🎉
                  </div>
                )}
                {[0, 1, 2, 3].map((slotIdx) => {

                  const pieceId = boardSlots[slotIdx]
                  const piece = pieceId !== null ? JIGSAW_PIECES[pieceId] : null
                  const isTargetHover = selectedPieceId !== null && pieceId === null

                  return (
                    <motion.div
                      key={slotIdx}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handlePlaceInSlot(slotIdx)}
                      className={`relative rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                        piece
                          ? 'border-[#5A3E36] shadow-inner bg-gradient-to-br from-[#FFF8EC] to-[#FED000]/30'
                          : isTargetHover
                          ? 'border-dashed border-[#FF7043] bg-amber-50 ring-2 ring-[#FF7043]/50 animate-pulse'
                          : 'border-dashed border-[#5A3E36]/30 bg-gray-50'
                      }`}
                    >
                      {piece ? (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-4xl drop-shadow">{piece.icon}</span>
                          <span className="text-[10px] font-black text-[#5A3E36] mt-1">
                            {piece.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-[#8C6D62]/50">Ô {slotIdx + 1}</span>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* KHAY MẢNH GHÉP DƯỚI KHUNG (TOUCH TARGET >= 80PX) */}
              <div className="w-full mt-4">
                <div className="text-xs font-black text-[#8C6D62] text-center mb-2">
                  Khay mảnh ghép ({availablePieces.length} mảnh còn lại):
                </div>

                <div className="flex items-center justify-center gap-3 min-h-[90px]">
                  {availablePieces.map((pieceId) => {
                    const piece = JIGSAW_PIECES[pieceId]
                    const isSelected = selectedPieceId === pieceId

                    return (
                      <motion.button
                        key={pieceId}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSelectTrayPiece(pieceId)}
                        className={`btn-kid w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 flex flex-col items-center justify-center shadow-md transition-all ${
                          isSelected
                            ? 'bg-[#FED000] border-[#FF3B30] ring-4 ring-[#FF3B30]/30 scale-110 -translate-y-2'
                            : 'bg-white border-[#5A3E36]'
                        }`}
                      >
                        <span className="text-3xl drop-shadow-sm">{piece.icon}</span>
                        <span className="text-[9px] font-black text-[#5A3E36] mt-1 text-center leading-tight">
                          {piece.label}
                        </span>
                      </motion.button>
                    )
                  })}

                  {availablePieces.length === 0 && (
                    <button
                      onClick={handleResetJigsaw}
                      className="btn-kid px-4 py-2.5 bg-[#FED000] border-2 border-[#5A3E36] rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ghép Lại Bức Mới</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= CHẾ ĐỘ 2: GHÉP BÓNG ================= */}
          {mode === 'shadow' && (
            <div className="flex flex-col items-center gap-6 py-2">
              {/* HÀNG TRÊN: BÓNG ĐEN SILHOUETTE */}
              <div className="w-full">
                <div className="text-xs font-black text-[#8C6D62] text-center mb-2">
                  1. Chạm vào bóng đen tương ứng:
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  {SHADOW_ITEMS.map((item) => {
                    const isMatched = matchedShadows.includes(item.id)

                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleMatchWithShadow(item.id)}
                        className={`btn-kid w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-3 flex flex-col items-center justify-center transition-all ${
                          isMatched
                            ? 'bg-[#E8F5E9] border-[#4CAF50] shadow-md'
                            : 'bg-[#5A3E36]/90 border-[#3E2723] shadow-inner'
                        }`}
                      >
                        {isMatched ? (
                          <>
                            <span className="text-4xl drop-shadow">{item.icon}</span>
                            <span className="text-xs font-black text-[#2E7D32] mt-1">
                              {item.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-4xl contrast-200 brightness-0 opacity-40">
                              {item.icon}
                            </span>
                            <span className="text-[10px] font-bold text-white/70 mt-1">Bóng</span>
                          </>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* HÀNG DƯỚI: HÌNH MÀU SỐNG ĐỘNG */}
              <div className="w-full">
                <div className="text-xs font-black text-[#8C6D62] text-center mb-2">
                  2. Chọn hình màu dưới đây:
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  {SHADOW_ITEMS.map((item) => {
                    const isMatched = matchedShadows.includes(item.id)
                    const isSelected = selectedShadowFigure === item.id

                    return (
                      <motion.button
                        key={item.id}
                        disabled={isMatched}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleSelectColorItem(item.id)}
                        className={`btn-kid w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-3 flex flex-col items-center justify-center transition-all ${
                          isMatched
                            ? 'opacity-30 border-gray-300 bg-gray-100 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#FED000] border-[#FF3B30] ring-4 ring-[#FF3B30]/30 scale-105 shadow-lg'
                            : 'bg-white border-[#5A3E36] shadow-md'
                        }`}
                      >
                        <span className="text-4xl drop-shadow-sm">{item.icon}</span>
                        <span className="text-xs font-black text-[#5A3E36] mt-1">{item.name}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {matchedShadows.length === SHADOW_ITEMS.length && (
                <button
                  onClick={handleResetShadow}
                  className="btn-kid px-4 py-2 bg-[#7ED6C1] border-2 border-[#5A3E36] rounded-2xl font-black text-xs flex items-center gap-1.5 shadow active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Ghép Bóng</span>
                </button>
              )}
            </div>
          )}

          {/* ================= CHẾ ĐỘ 3: QUY LUẬT ================= */}
          {mode === 'pattern' && (
            <div className="flex flex-col items-center gap-5 py-3">
              {/* DÃY HÌNH QUY LUẬT */}
              <div className="bg-white/90 border-3 border-[#5A3E36] rounded-3xl p-4 shadow-md w-full max-w-lg">
                <div className="text-xs font-black text-[#8C6D62] text-center mb-3">
                  Câu hỏi quy luật {patternIdx + 1}/{PATTERN_PUZZLES.length}:
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {currentPattern.sequence.map((elem, idx) => {
                    const isQuestion = elem.icon === '❓'

                    return (
                      <div
                        key={idx}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex flex-col items-center justify-center ${
                          isQuestion
                            ? patternSolved
                              ? 'bg-[#E8F5E9] border-[#4CAF50] scale-105'
                              : 'bg-amber-100 border-[#FF7043] animate-pulse'
                            : 'bg-[#FFF8EC] border-[#5A3E36]/30'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">
                          {isQuestion && patternSolved
                            ? currentPattern.options.find((o) => o.isCorrect)?.icon
                            : elem.icon}
                        </span>
                        <span className="text-[10px] font-extrabold text-[#5A3E36] mt-0.5">
                          {elem.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* LỰA CHỌN ĐÁP ÁN (TOUCH TARGET >= 80PX) */}
              <div className="w-full">
                <div className="text-xs font-black text-[#8C6D62] text-center mb-2">
                  Bé chọn hình đúng điền vào dấu hỏi chấm nhé:
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  {currentPattern.options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectPatternOption(opt.isCorrect)}
                      className="btn-kid w-22 h-22 sm:w-24 sm:h-24 rounded-3xl bg-white border-3 border-[#5A3E36] shadow-md flex items-center justify-center text-4xl active:bg-amber-50 transition-transform"
                    >
                      {opt.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pikachu khích lệ ở thanh chân trang */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#5A3E36]/15">
          <div className="flex items-center gap-2.5">
            <div className="cursor-pointer" onClick={() => setPikaState('cheer')}>
              <Pikachu state={pikaState} size={55} />
            </div>
            <div className="text-xs sm:text-sm font-black text-[#5A3E36] bg-white px-3 py-1.5 rounded-2xl border-2 border-[#5A3E36]/15 shadow-sm">
              {hintText}
            </div>
          </div>

          <div className="text-right text-[11px] font-bold text-[#8C6D62] hidden sm:block">
            Tư duy trực quan • Vừa học vừa chơi
          </div>
        </div>
      </div>
    </div>
  )
}
export default PuzzleGameModal
