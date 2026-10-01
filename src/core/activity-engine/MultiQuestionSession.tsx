import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { ArrowLeft, Volume2, Sparkles, Home, RotateCcw, Star } from 'lucide-react'
import { Companion, type CompanionType } from '@/components/Companion'
import { type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { db } from '@/core/storage/db'
import {
  generate15QuestionSession,
  type SessionQuestion,
  type SessionChoice,
} from './sessionGenerator'
import { awardRandomSticker, type Sticker } from '@/content/stickers'
import { ShapeGraphic, isShapeItem } from '@/components/ShapeGraphic'


interface MultiQuestionSessionProps {
  profileId: string
  childName: string
  companion?: CompanionType
  onBack: () => void
}

export const MultiQuestionSession: React.FC<MultiQuestionSessionProps> = ({
  profileId,
  childName,
  companion = 'pikachu',
  onBack,
}) => {
  const [questions, setQuestions] = useState<SessionQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [speechText, setSpeechText] = useState('Bắt đầu nào!')
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [isQuestionSolved, setIsQuestionSolved] = useState(false)
  const choiceActionTokenRef = useRef(0)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [awardedSticker, setAwardedSticker] = useState<Sticker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime] = useState(() => Date.now())

  // 1. Sinh 15 câu ngẫu nhiên chống trùng lặp
  const loadNewSession = async () => {
    setIsLoading(true)
    setIsSessionFinished(false)
    setIsQuestionSolved(false)
    choiceActionTokenRef.current++
    setAwardedSticker(null)
    setCurrentIndex(0)
    setHasWrongAttempt(false)
    setSelectedChoiceId(null)

    const list = await generate15QuestionSession(profileId)
    setQuestions(list)
    setIsLoading(false)

    if (list.length > 0) {
      playQuestion(list[0])
    }
  }

  useEffect(() => {
    loadNewSession()
  }, [profileId])

  // Phát câu hỏi hiện tại
  const playQuestion = (q: SessionQuestion) => {
    setIsQuestionSolved(false)
    choiceActionTokenRef.current++
    setSpeechText(q.promptText)
    setPikaState('talk')
    setHasWrongAttempt(false)
    setSelectedChoiceId(null)

    if (q.promptAudio) {
      audioService.playVoice(q.promptAudio, () => {
        setPikaState('idle')
      })
    }
  }

  const currentQ = questions[currentIndex]

  // Phát lại âm thanh câu hỏi
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

  // Khi bé chọn một đáp án
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

    // 2. Phát âm thanh đọc to số / chữ cái đó (ví dụ "Số 8", "Chữ A", ...)
    audioService.playChoice(choice.audioId, choice.label, () => {
      proceedFeedback()
    })

    // Timeout dự phòng an toàn (1.3s)
    setTimeout(proceedFeedback, 1300)
  }

  const handlePostChoiceFeedback = async (choice: SessionChoice, actionToken: number) => {
    if (choice.isCorrect) {
      // ĐÚNG RỒI!
      setPikaState('cheer')
      setSpeechText('Giỏi quá! Đúng rồi!')
      audioService.playVoice('cat_praise')

      // Cập nhật độ thành thạo và thời gian học vào Dexie để chống trùng lặp
      try {
        const masteryKey = `${profileId}_${currentQ.id}`
        const existing = await db.itemMastery.get(masteryKey)
        await db.itemMastery.put({
          profileIdItemId: masteryKey,
          profileId,
          itemId: currentQ.id,
          level: existing ? Math.min(4, existing.level + 1) : 1,
          streak: existing ? existing.streak + 1 : 1,
          lastSeenAt: Date.now(),
        })
      } catch (e) {
        console.warn('Lỗi ghi itemMastery:', e)
      }

      // Chuyển sang câu tiếp theo sau 1.3 giây
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          const nextIdx = currentIndex + 1
          setCurrentIndex(nextIdx)
          playQuestion(questions[nextIdx])
        } else {
          // Hoàn thành cả 15 câu!
          handleFinishSession()
        }
      }, 1300)
    } else {
      // CHƯA ĐÚNG -> Bé đã nghe xong số/chữ bé vừa bấm, giờ Pikachu động viên bé tìm lại
      setHasWrongAttempt(true)
      setTimeout(() => {
        if (choiceActionTokenRef.current !== actionToken) return
        setPikaState('encourage')
        setSpeechText('Thử lại nhé, ở đây nè!')
        audioService.playVoice('cat_encourage')
      }, 150)
    }
  }


  // Khi hoàn thành trọn vẹn 15 câu
  const handleFinishSession = async () => {
    setIsSessionFinished(true)
    setPikaState('cheer')
    setSpeechText(`Hoan hô ${childName}! Bé đã hoàn thành 15 câu!`)
    audioService.playVoice('cheer_finish')

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FED000', '#FF3B30', '#7ED6C1', '#4FB3D9', '#AB47BC'],
    })

    // Tặng 1 nhãn dán sticker cho bé
    try {
      const sticker = await awardRandomSticker(profileId)
      setAwardedSticker(sticker)
    } catch (e) {
      console.warn('Lỗi trao sticker:', e)
    }

    // Ghi nhận phiên học 15 câu vào Dexie
    try {
      await db.activityRuns.add({
        profileId,
        activityId: 'session_15_random',
        startedAt: startTime,
        durationMs: Date.now() - startTime,
        attempts: 15,
        hints: 0,
        hesitations: 0,
        completed: true,
      })
    } catch (e) {
      console.warn('Lỗi lưu phiên vào Dexie:', e)
    }
  }

  if (isLoading || !currentQ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8EC] text-[#5A3E36]">
        <Companion character={companion} state="think" size={160} />
        <p className="mt-4 text-lg font-bold">
          {companion === 'kitty' ? 'Kitty' : 'Pikachu'} đang chuẩn bị 15 câu hỏi cho bé...
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 md:p-6 bg-[#FFF8EC] text-[#5A3E36] overflow-hidden select-none">
      {/* 1. Header Bar: Nút thoát, Thanh tiến độ 15 câu, Nút loa */}
      <header className="flex justify-between items-center w-full z-10">
        <button
          onClick={onBack}
          className="btn-kid w-12 h-12 bg-white rounded-2xl border-2 border-[#5A3E36]/20 shadow-sm active:scale-95 flex items-center justify-center"
          title="Về trang chủ"
        >
          <ArrowLeft className="w-6 h-6 text-[#5A3E36]" />
        </button>

        {/* Thông tin câu hiện tại */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-black uppercase text-[#8C6D62]">
              Câu {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* 15 Chấm tròn tiến độ trực quan */}
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => {
              const isPast = idx < currentIndex
              const isCurrent = idx === currentIndex
              return (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all ${
                    isPast
                      ? 'w-4 bg-green-500'
                      : isCurrent
                      ? 'w-6 bg-[#FED000] ring-2 ring-[#5A3E36]'
                      : 'w-2.5 bg-[#5A3E36]/20'
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Nút loa phát lại lời Pikachu */}
        <button
          onClick={handleReplayPrompt}
          className="btn-kid w-12 h-12 bg-[#FED000] rounded-2xl border-2 border-[#5A3E36] shadow-sm active:scale-95 flex items-center justify-center"
          title="Nghe lại câu hỏi"
        >
          <Volume2 className="w-6 h-6 text-[#5A3E36]" />
        </button>
      </header>

      {/* 2. Bạn Đồng Hành & Lời Thoại */}
      <div className="flex items-center justify-center gap-3 my-2 z-10">
        <div className="flex-shrink-0 cursor-pointer" onClick={handleReplayPrompt}>
          <Companion character={companion} state={pikaState} size={130} />
        </div>
        <div className="relative bg-white border-3 border-[#5A3E36] rounded-2xl px-5 py-3 shadow-md max-w-sm">
          <p className="text-base md:text-lg font-bold text-[#5A3E36] leading-snug">
            {speechText}
          </p>
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-white border-b-3 border-l-3 border-[#5A3E36] rotate-45" />
        </div>
      </div>

      {/* 3. Lưới 3 Lựa Chọn Lớn Chuẩn Kiosk Trẻ Em (≥ 80px) */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto z-10 p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
          >
            {currentQ.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id
              const shouldHighlight = hasWrongAttempt && choice.isCorrect

              return (
                <motion.button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    shouldHighlight
                      ? {
                          scale: [1, 1.08, 1],
                          boxShadow: [
                            '0 0 0px #FED000',
                            '0 0 25px #FED000',
                            '0 0 0px #FED000',
                          ],
                        }
                      : {}
                  }
                  transition={shouldHighlight ? { repeat: Infinity, duration: 1.1 } : {}}
                  className={`btn-kid h-36 flex flex-col items-center justify-center p-4 rounded-3xl border-4 border-[#5A3E36] shadow-md transition-all ${
                    isSelected && choice.isCorrect
                      ? 'ring-4 ring-green-500 bg-green-100'
                      : ''
                  }`}
                  style={{ backgroundColor: choice.color || '#FFFFFF' }}
                >
                  {isShapeItem(choice) ? (
                    <div className="mb-2 flex items-center justify-center">
                      <ShapeGraphic type={choice.id || choice.label} size={44} />
                    </div>
                  ) : (
                    <span className="text-4xl mb-2 drop-shadow-sm">{choice.icon || '⭐'}</span>
                  )}
                  <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {choice.label}
                  </span>
                </motion.button>

              )
            })}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Màn Chúc Mừng Hoàn Thành Cả 15 Câu (Grand Celebration) */}
      {isSessionFinished && (
        <div className="fixed inset-0 z-50 bg-[#FFF8EC]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
          <Companion character={companion} state="cheer" size={200} className="mb-2 drop-shadow-2xl" />

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-7 h-7 text-[#FED000]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#5A3E36]">
              Xuất Sắc Quá {childName}!
            </h2>
            <Sparkles className="w-7 h-7 text-[#FED000]" />
          </div>

          <p className="text-base sm:text-lg text-[#8C6D62] mb-2 font-bold">
            Bé đã hoàn thành trọn vẹn cả 15 câu hỏi hôm nay!
          </p>

          <div className="flex items-center gap-2 mb-3 bg-[#FFD25E] px-5 py-2 rounded-full border-3 border-[#5A3E36] shadow font-black text-lg text-[#5A3E36]">
            <Star className="w-5 h-5 fill-[#5A3E36]" />
            <span>Thưởng 3 ⭐ Sao Vàng</span>
          </div>

          {/* Phần thưởng Nhãn Dán Mới (Sticker) */}
          {awardedSticker && (
            <div
              className="flex items-center gap-3 p-3.5 rounded-3xl border-3 border-[#5A3E36] shadow-md my-2 max-w-sm w-full animate-bounce"
              style={{ backgroundColor: awardedSticker.bgColor }}
            >
              <div className="text-4xl sm:text-5xl filter drop-shadow">
                {awardedSticker.icon}
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black text-[#E65100] uppercase tracking-wide">
                  🎉 TẶNG BÉ NHÃN DÁN MỚI!
                </div>
                <div className="text-base sm:text-lg font-black text-[#5A3E36]">
                  {awardedSticker.name}
                </div>
                <div className="text-xs font-bold text-[#6D4C41]">
                  {awardedSticker.description}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-3">
            <button
              onClick={loadNewSession}
              className="btn-kid bg-white border-3 border-[#5A3E36] px-5 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 shadow-md active:scale-95"
            >
              <RotateCcw className="w-5 h-5 text-[#5A3E36]" />
              <span>Phiên mới (15 câu)</span>
            </button>

            <button
              onClick={onBack}
              className="btn-kid bg-[#7ED6C1] border-3 border-[#5A3E36] text-[#5A3E36] px-6 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Home className="w-5 h-5" />
              <span>Về Trang Chủ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default MultiQuestionSession
