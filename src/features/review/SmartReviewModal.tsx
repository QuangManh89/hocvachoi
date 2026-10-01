import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { X, Volume2, Star, RotateCcw, CheckCircle2 } from 'lucide-react'
import { Companion, type CompanionType } from '@/components/Companion'
import { type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { db } from '@/core/storage/db'
import {
  generateSmartReviewSession,
  type SessionQuestion,
  type SessionChoice,
} from '@/core/activity-engine/sessionGenerator'
import { ShapeGraphic, isShapeItem } from '@/components/ShapeGraphic'


interface SmartReviewModalProps {
  isOpen: boolean
  profileId: string
  childName: string
  companion?: CompanionType
  onClose: () => void
}

export const SmartReviewModal: React.FC<SmartReviewModalProps> = ({
  isOpen,
  profileId,
  childName,
  companion = 'pikachu',
  onClose,
}) => {
  const [questions, setQuestions] = useState<SessionQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [speechText, setSpeechText] = useState('Ôn tập cùng tớ nào!')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [isQuestionSolved, setIsQuestionSolved] = useState(false)
  const choiceActionTokenRef = useRef(0)
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [earnedStars, setEarnedStars] = useState(0)

  const loadQuestions = async () => {
    setIsLoading(true)
    setIsFinished(false)
    setIsQuestionSolved(false)
    choiceActionTokenRef.current++
    setCurrentIndex(0)
    setEarnedStars(0)
    setSelectedChoiceId(null)
    setHasWrongAttempt(false)

    const list = await generateSmartReviewSession(profileId, 5)
    setQuestions(list)
    setIsLoading(false)

    if (list.length > 0) {
      playQuestion(list[0])
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadQuestions()
    }
  }, [isOpen, profileId])

  const playQuestion = (q: SessionQuestion) => {
    setIsQuestionSolved(false)
    choiceActionTokenRef.current++
    setSpeechText(q.promptText)
    setPikaState('talk')
    setSelectedChoiceId(null)
    setHasWrongAttempt(false)

    if (q.promptAudio) {
      audioService.playVoice(q.promptAudio, () => {
        setPikaState('idle')
      })
    }
  }

  const currentQ = questions[currentIndex]

  const handleReplayPrompt = () => {
    if (!currentQ) return
    setSpeechText(currentQ.promptText)
    setPikaState('talk')
    if (currentQ.promptAudio) {
      audioService.playVoice(currentQ.promptAudio, () => {
        setPikaState('idle')
      })
    }
  }

  const handleChoiceSelect = (choice: SessionChoice) => {
    // Nếu câu hỏi đã giải quyết xong và đang chờ chuyển câu thì bỏ qua chạm tiếp
    if (isQuestionSolved) return

    // Khi chạm đúng, khóa ngay để tránh thao tác kép trong lúc chúc mừng
    if (choice.isCorrect) {
      setIsQuestionSolved(true)
    }

    setSelectedChoiceId(choice.id)
    const actionToken = ++choiceActionTokenRef.current

    // 1. Pikachu nói và hiển thị ngay tên số / chữ cái bé vừa bấm để bé nghe và ghi nhớ!
    setPikaState('talk')
    setSpeechText(`${choice.label}!`)

    let isHandled = false
    const proceedFeedback = () => {
      if (isHandled || choiceActionTokenRef.current !== actionToken) return
      isHandled = true
      handlePostChoiceFeedback(choice, actionToken)
    }

    // 2. Phát âm thanh đọc to số / chữ cái bé vừa bấm
    audioService.playChoice(choice.audioId, choice.label, () => {
      proceedFeedback()
    })

    // Timeout dự phòng an toàn (1.3s)
    setTimeout(proceedFeedback, 1300)
  }

  const handlePostChoiceFeedback = async (choice: SessionChoice, actionToken: number) => {
    if (choice.isCorrect) {
      // Đúng rồi!
      setPikaState('cheer')
      setSpeechText('Giỏi lắm! Bạn nhớ bài rồi!')
      audioService.playVoice('cat_praise')
      setEarnedStars((s) => s + 1)

      // Cập nhật độ thành thạo vào IndexedDB
      try {
        const masteryKey = `${profileId}_${currentQ.id}`
        const existing = await db.itemMastery.get(masteryKey)
        await db.itemMastery.put({
          profileIdItemId: masteryKey,
          profileId,
          itemId: currentQ.id,
          level: existing ? Math.min(4, existing.level + 1) : 2,
          streak: existing ? existing.streak + 1 : 1,
          lastSeenAt: Date.now(),
        })
      } catch (err) {
        console.warn('Lỗi lưu ôn tập:', err)
      }

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          const nextIdx = currentIndex + 1
          setCurrentIndex(nextIdx)
          playQuestion(questions[nextIdx])
        } else {
          // Hoàn thành cả 5 câu
          setIsFinished(true)
          setPikaState('cheer')
          setSpeechText(`Hoan hô! ${childName} đã ôn tập xuất sắc!`)
          audioService.playVoice('cheer_finish')
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }, 1300)
    } else {
      // Chưa đúng -> Errorless
      setHasWrongAttempt(true)
      setTimeout(() => {
        if (choiceActionTokenRef.current !== actionToken) return
        setPikaState('encourage')
        setSpeechText('Thử lại nhé, ở đây nè!')
        audioService.playVoice('cat_encourage')
      }, 150)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-xl p-4 sm:p-6 shadow-2xl relative text-[#5A3E36] flex flex-col max-h-[92vh]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Tiêu đề & Thanh tiến trình 5 câu */}
        <div className="flex items-center justify-between gap-3 mb-4 pr-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#7ED6C1] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-xl shadow-sm">
              🔄
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Ôn Tập Nhẹ</h2>
              <p className="text-xs text-[#8C6D62]">5 câu củng cố kiến thức cho bé</p>
            </div>
          </div>

          {/* 5 Ngôi sao tiến trình */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-2 border-[#5A3E36]/15 shadow-sm">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isDone = idx < currentIndex || isFinished
              const isCurrent = idx === currentIndex && !isFinished
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone
                      ? 'bg-[#FED000] text-[#5A3E36] border-2 border-[#5A3E36]'
                      : isCurrent
                      ? 'bg-[#FFF8EC] text-[#5A3E36] border-2 border-[#5A3E36] scale-110 animate-pulse'
                      : 'bg-gray-100 text-gray-400 border border-gray-300'
                  }`}
                >
                  {isDone ? '⭐' : idx + 1}
                </div>
              )
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="animate-spin text-3xl mb-3">⚡</div>
            <p className="font-bold text-sm text-[#8C6D62]">Đang chuẩn bị câu hỏi ôn tập...</p>
          </div>
        ) : isFinished ? (
          /* MÀN HÌNH HOÀN THÀNH ÔN TẬP */
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              <Companion character={companion} state="cheer" size={140} />
            </motion.div>

            <h3 className="text-2xl font-black text-[#5A3E36] mb-1">
              Bé {childName} Tuyệt Vời Quá! 🎉
            </h3>
            <p className="text-sm font-bold text-[#8C6D62] mb-4">
              Bé đã nhớ rất tốt các bài học hôm nay!
            </p>

            <div className="flex items-center gap-2 bg-[#FED000]/30 border-2 border-[#FED000] px-4 py-2 rounded-2xl mb-6">
              <Star className="w-6 h-6 fill-[#FED000] text-[#5A3E36]" />
              <span className="font-black text-base text-[#5A3E36]">
                +{earnedStars} Ngôi Sao Trí Nhớ!
              </span>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs">
              <button
                onClick={loadQuestions}
                className="flex-1 btn-kid min-h-[56px] bg-white border-2 border-[#5A3E36] text-[#5A3E36] font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Ôn Lại</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-kid min-h-[56px] bg-[#FED000] border-2 border-[#5A3E36] text-[#5A3E36] font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Xong Rối</span>
              </button>
            </div>
          </div>
        ) : currentQ ? (
          /* NỘI DUNG CÂU HỎI */
          <div className="flex-1 flex flex-col justify-between">
            {/* Pikachu & Lời hướng dẫn */}
            <div className="flex items-center gap-3 bg-white/90 border-2 border-[#5A3E36]/15 rounded-3xl p-3 mb-4 shadow-sm">
              <div className="cursor-pointer shrink-0" onClick={handleReplayPrompt}>
                <Companion character={companion} state={pikaState} size={85} />
              </div>
              <div className="flex-1">
                <div className="text-sm sm:text-base font-extrabold text-[#5A3E36] mb-1 leading-snug">
                  {speechText}
                </div>
                <button
                  onClick={handleReplayPrompt}
                  className="flex items-center gap-1.5 text-xs font-black text-[#FF7043] bg-[#FFF8EC] px-2.5 py-1 rounded-full border border-[#FF7043]/30 active:scale-95 transition-transform"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe Lại Lời Nói</span>
                </button>
              </div>
            </div>

            {/* DANH SÁCH LỰA CHỌN (KIOSK TOUCH TARGET >= 80PX) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
              {currentQ.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id
                const isHintTarget = hasWrongAttempt && choice.isCorrect

                return (
                  <motion.button
                    key={choice.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleChoiceSelect(choice)}
                    className={`btn-kid min-h-[88px] sm:min-h-[110px] rounded-3xl border-3 p-3 flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                      isHintTarget
                        ? 'border-[#4CAF50] bg-green-50 ring-4 ring-[#4CAF50] animate-bounce'
                        : isSelected && choice.isCorrect
                        ? 'border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]'
                        : isSelected && !choice.isCorrect
                        ? 'border-gray-300 bg-gray-100 opacity-60'
                        : 'border-[#5A3E36] bg-white shadow-md active:bg-[#FFF8EC]'
                    }`}
                  >
                    {/* Icon hoặc Chấm màu */}
                    {isShapeItem(choice) ? (
                      <div className="mb-1 flex items-center justify-center">
                        <ShapeGraphic type={choice.id || choice.label} size={42} />
                      </div>
                    ) : choice.icon ? (
                      <span className="text-3xl sm:text-4xl drop-shadow-sm">{choice.icon}</span>
                    ) : choice.color ? (
                      <div
                        className="w-10 h-10 rounded-full border-2 border-[#5A3E36]/30 shadow-inner"
                        style={{ backgroundColor: choice.color }}
                      />
                    ) : null}


                    {/* Nhãn chữ to, dễ đọc */}
                    <span className="font-black text-base sm:text-lg text-[#5A3E36] leading-tight">
                      {choice.label}
                    </span>

                    {/* Ngón tay gợi ý nếu sai */}
                    {isHintTarget && (
                      <span className="absolute -top-3 text-2xl animate-bounce">👇</span>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Chú thích nhẹ nhàng */}
            <div className="text-center text-xs text-[#8C6D62] mt-3 font-semibold">
              Bé chạm vào hình hoặc chữ đúng theo lời Pikachu hướng dẫn nhé!
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default SmartReviewModal
