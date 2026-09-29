import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, Volume2, Sparkles, Home, RotateCcw } from 'lucide-react'
import type { AnyActivityData } from './types'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { db } from '@/core/storage/db'

import { ExploreTemplate } from './templates/ExploreTemplate'
import { ListenPickTemplate } from './templates/ListenPickTemplate'
import { MatchTemplate } from './templates/MatchTemplate'
import { TapCountTemplate } from './templates/TapCountTemplate'
import { SortTemplate } from './templates/SortTemplate'

interface ActivityContainerProps {
  activity: AnyActivityData
  onBack: () => void
}

export const ActivityContainer: React.FC<ActivityContainerProps> = ({
  activity,
  onBack,
}) => {
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [speechText, setSpeechText] = useState(activity.promptText)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(() => Date.now())

  // Bắt đầu bài học: Pikachu đọc câu hướng dẫn
  useEffect(() => {
    setIsCompleted(false)
    setSpeechText(activity.promptText)
    setPikaState('talk')

    if (activity.promptAudio) {
      audioService.playVoice(activity.promptAudio, () => {
        setPikaState('idle')
      })
    }
  }, [activity])

  // Khi hoàn thành hoạt động
  const handleActivityComplete = async () => {
    setIsCompleted(true)
    setPikaState('cheer')
    setSpeechText('Hoan hô! Bạn thật là giỏi!')

    // Phát âm thanh chúc mừng
    audioService.playVoice('cheer_finish')

    // Bắn pháo hoa confetti rực rỡ
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FED000', '#FF3B30', '#7ED6C1', '#4FB3D9', '#B69CF2'],
    })

    // Lưu kết quả phiên học vào Dexie
    try {
      const defaultProf = await db.profiles.toCollection().first()
      const profileId = defaultProf ? defaultProf.id : 'profile_default'
      await db.activityRuns.add({
        profileId,
        activityId: activity.id,
        startedAt: startTime,
        durationMs: Date.now() - startTime,
        attempts: 1,
        hints: 0,
        hesitations: 0,
        completed: true,
      })
    } catch (e) {
      console.warn('Lỗi lưu kết quả vào Dexie:', e)
    }
  }

  // Phát lại âm thanh hướng dẫn khi bé bấm loa
  const handleReplayPrompt = () => {
    setSpeechText(activity.promptText)
    setPikaState('talk')
    if (activity.promptAudio) {
      audioService.playVoice(activity.promptAudio, () => {
        setPikaState('idle')
      })
    }
  }

  // Phản hồi từ các template khi bé thao tác
  const handleFeedback = (text: string, state: PikachuState) => {
    setSpeechText(text)
    setPikaState(state)
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 md:p-6 bg-[#FFF8EC] text-[#5A3E36] overflow-hidden select-none">
      {/* 1. Thanh Tiêu Đề Trên Cùng */}
      <header className="flex justify-between items-center w-full z-10">
        <button
          onClick={onBack}
          className="btn-kid w-12 h-12 bg-white rounded-2xl border-2 border-[#5A3E36]/20 shadow-sm active:scale-95 flex items-center justify-center"
          title="Trở về danh sách"
        >
          <ArrowLeft className="w-6 h-6 text-[#5A3E36]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D62]">
            {activity.module === 'colors_shapes' ? '🌈 Màu sắc & Hình dạng' : '🔢 Con số'}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#5A3E36]">
            {activity.title}
          </h2>
        </div>

        {/* Nút loa phát lại lời hướng dẫn */}
        <button
          onClick={handleReplayPrompt}
          className="btn-kid w-12 h-12 bg-[#FFD25E] rounded-2xl border-2 border-[#5A3E36] shadow-sm active:scale-95 flex items-center justify-center"
          title="Nghe lại hướng dẫn"
        >
          <Volume2 className="w-6 h-6 text-[#5A3E36]" />
        </button>
      </header>

      {/* 2. Pikachu nhỏ nhắn hướng dẫn bé */}
      <div className="flex items-center justify-center gap-3 my-2 z-10">
        <div className="flex-shrink-0">
          <Pikachu
            state={pikaState}
            size={120}
            onClick={handleReplayPrompt}
          />
        </div>
        {/* Bóng thoại Pikachu */}
        <div className="relative bg-white border-3 border-[#5A3E36] rounded-2xl px-5 py-3 shadow-md max-w-sm">
          <p className="text-base md:text-lg font-bold text-[#5A3E36] leading-snug">
            {speechText}
          </p>
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-white border-b-3 border-l-3 border-[#5A3E36] rotate-45" />
        </div>
      </div>

      {/* 3. Khu Vực Bài Học (Tùy theo Template) */}
      <main className="flex-1 flex flex-col justify-center items-center w-full z-10 py-1">
        {activity.template === 'explore' && (
          <ExploreTemplate
            activity={activity}
            onComplete={handleActivityComplete}
            onFeedback={handleFeedback}
          />
        )}

        {activity.template === 'listen_pick' && (
          <ListenPickTemplate
            activity={activity}
            onComplete={handleActivityComplete}
            onFeedback={handleFeedback}
          />
        )}

        {activity.template === 'match' && (
          <MatchTemplate
            activity={activity}
            onComplete={handleActivityComplete}
            onFeedback={handleFeedback}
          />
        )}

        {activity.template === 'tap_count' && (
          <TapCountTemplate
            activity={activity}
            onComplete={handleActivityComplete}
            onFeedback={handleFeedback}
          />
        )}

        {activity.template === 'sort' && (
          <SortTemplate
            activity={activity}
            onComplete={handleActivityComplete}
            onFeedback={handleFeedback}
          />
        )}
      </main>

      {/* 4. Màn Chúc Mừng Hoàn Thành Hoạt Động (Celebration Modal) */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-[#FFF8EC]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <Pikachu state="cheer" size={240} className="mb-4 drop-shadow-2xl" />

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-[#FFD25E]" />
            <h2 className="text-3xl md:text-4xl font-black text-[#5A3E36]">
              Hoan Hô! Giỏi Quá!
            </h2>
            <Sparkles className="w-8 h-8 text-[#FFD25E]" />
          </div>

          <p className="text-lg text-[#8C6D62] mb-6">
            Bé đã hoàn thành xuất sắc bài học và nhận được 1 ⭐ sao vàng!
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsCompleted(false)
                handleReplayPrompt()
              }}
              className="btn-kid bg-white border-3 border-[#5A3E36] px-6 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-md active:scale-95"
            >
              <RotateCcw className="w-6 h-6 text-[#5A3E36]" />
              <span>Chơi lại</span>
            </button>

            <button
              onClick={onBack}
              className="btn-kid bg-[#7ED6C1] border-3 border-[#5A3E36] text-[#5A3E36] px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Home className="w-6 h-6" />
              <span>Về Trang Chủ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default ActivityContainer
