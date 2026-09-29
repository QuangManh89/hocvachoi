import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Settings, Star, ChevronRight, Edit3, Play } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { phase1aActivities } from '@/content/activities/phase1aActivities'
import type { AnyActivityData } from '@/core/activity-engine/types'
import { db } from '@/core/storage/db'
import { audioService } from '@/core/audio/AudioService'

interface HomeScreenProps {
  childName: string
  ageBand: string
  onSelectActivity: (activity: AnyActivityData) => void
  onOpenParentGate: () => void
  onOpenProfile: () => void
  onStart12QuestionsSession: () => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  childName,
  ageBand,
  onSelectActivity,
  onOpenParentGate,
  onOpenProfile,
  onStart12QuestionsSession,
}) => {
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [totalStars, setTotalStars] = useState(0)
  const [selectedModule, setSelectedModule] = useState<'colors_shapes' | 'numbers'>('colors_shapes')

  useEffect(() => {
    // Đếm tổng số sao bé đã đạt được từ Dexie
    db.activityRuns
      .filter((r) => r.completed)
      .count()
      .then((count) => {
        setTotalStars(count)
      })

    const cleanup = audioService.onVoiceStateChange(
      () => setPikaState('talk'),
      () => setPikaState('idle')
    )
    return cleanup
  }, [])

  const handlePikachuClick = () => {
    audioService.playVoice('pikachu_greeting')
    setPikaState('wave')
  }

  // Lọc hoạt động theo module
  const currentActivities = phase1aActivities.filter((a) => a.module === selectedModule)

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 md:p-6 bg-[#FFF8EC] text-[#5A3E36] overflow-y-auto select-none">
      {/* 1. Header Bar: Profile bé, Sao ⭐ & Nút Phụ Huynh */}
      <header className="flex justify-between items-center w-full z-10 pt-1 pb-2">
        {/* Nút bấm vào hồ sơ để đổi tên bé */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-white/90 active:bg-white px-3.5 py-1.5 rounded-full border-2 border-[#5A3E36]/15 shadow-sm active:scale-95 transition-transform"
          title="Chạm để đổi tên bé"
        >
          <div className="w-9 h-9 rounded-full bg-[#FED000] flex items-center justify-center font-bold text-base text-[#5A3E36] shadow-sm">
            ⚡
          </div>
          <div className="text-left">
            <div className="font-extrabold text-sm leading-none flex items-center gap-1 text-[#5A3E36]">
              <span>{childName}</span>
              <Edit3 className="w-3 h-3 text-[#8C6D62]" />
            </div>
            <span className="text-[11px] text-[#8C6D62] font-medium">{ageBand} tuổi</span>
          </div>
        </button>

        {/* Khối huy hiệu đếm Sao ⭐ */}
        <div className="flex items-center gap-2 bg-[#FFD25E] text-[#5A3E36] px-4 py-2 rounded-full border-2 border-[#5A3E36] shadow-sm font-black text-lg">
          <Star className="w-6 h-6 text-[#5A3E36] fill-[#5A3E36]" />
          <span>{totalStars}</span>
        </div>

        {/* Nút Cổng Phụ Huynh */}
        <button
          onClick={onOpenParentGate}
          className="p-3 bg-white/80 active:bg-white text-[#5A3E36] rounded-2xl border-2 border-[#5A3E36]/15 shadow-sm active:scale-95 transition-transform flex items-center gap-2 font-bold"
          title="Khu vực phụ huynh"
        >
          <Settings className="w-6 h-6 text-[#5A3E36]" />
          <span className="hidden sm:inline text-sm">Phụ Huynh</span>
        </button>
      </header>

      {/* 2. Pikachu Đồng Hành */}
      <div className="flex flex-col items-center justify-center my-1 z-10">
        <div className="relative cursor-pointer" onClick={handlePikachuClick}>
          <Pikachu state={pikaState} size={175} />
          {/* Bong bóng lời chào */}
          <div className="absolute -top-2 -right-10 bg-white border-2 border-[#5A3E36] px-3 py-1.5 rounded-full text-xs font-bold text-[#5A3E36] shadow-md animate-bounce">
            Chào {childName}! ⚡
          </div>
        </div>
      </div>

      {/* 3. HERO BANNER: PHIÊN HỌC TỔNG HỢP 12 CÂU NGẪU NHIÊN CHỐNG LẶP */}
      <div className="w-full max-w-xl mx-auto my-2 z-10">
        <button
          onClick={onStart12QuestionsSession}
          className="w-full btn-kid min-h-[76px] bg-gradient-to-r from-[#FED000] via-[#FFE055] to-[#FED000] border-3 border-[#5A3E36] rounded-3xl p-3.5 shadow-lg flex items-center justify-between active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-[#5A3E36]/20">
              ⚡
            </div>
            <div className="text-left">
              <div className="font-black text-lg text-[#5A3E36] flex items-center gap-2 leading-tight">
                <span>Phiên Học Của {childName}</span>
                <span className="bg-[#FF3B30] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  12 CÂU
                </span>
              </div>
              <div className="text-xs font-bold text-[#6D4C41] mt-0.5">
                Tổng hợp ngẫu nhiên • Tự động chống lặp bài học
              </div>
            </div>
          </div>

          <div className="bg-[#5A3E36] text-white font-black text-sm px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow">
            <Play className="w-4 h-4 fill-current" />
            <span>Chơi ngay</span>
          </div>
        </button>
      </div>

      {/* 4. Tab Chọn Module Từng Bài Học Lẻ */}
      <div className="flex justify-between items-center w-full max-w-xl mx-auto mt-2 mb-1 px-1 z-10">
        <span className="text-xs font-black uppercase tracking-wider text-[#8C6D62]">
          Hoặc chọn từng bài học:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedModule('colors_shapes')}
            className={`px-3 py-1 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'colors_shapes'
                ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🌈 Màu & Hình
          </button>

          <button
            onClick={() => setSelectedModule('numbers')}
            className={`px-3 py-1 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'numbers'
                ? 'bg-[#FFD25E] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🔢 Con Số
          </button>
        </div>
      </div>

      {/* 5. Danh Sách Bài Học Từng Phần */}
      <main className="w-full max-w-xl mx-auto z-10 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentActivities.map((act) => {
            return (
              <motion.button
                key={act.id}
                onClick={() => onSelectActivity(act)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="btn-kid h-20 bg-white rounded-3xl p-3 border-3 border-[#5A3E36] shadow-sm flex items-center justify-between transition-transform text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8EC] border-2 border-[#5A3E36]/20 flex items-center justify-center text-2xl">
                    {act.template === 'explore'
                      ? '🎨'
                      : act.template === 'listen_pick'
                      ? '👂'
                      : act.template === 'match'
                      ? '🧩'
                      : act.template === 'tap_count'
                      ? '🍎'
                      : '🧺'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#5A3E36] leading-snug">
                      {act.title}
                    </h3>
                    <span className="text-[11px] font-bold text-[#8C6D62]">
                      {act.template === 'explore'
                        ? 'Khám phá'
                        : act.template === 'listen_pick'
                        ? 'Nghe & Chọn'
                        : act.template === 'match'
                        ? 'Ghép đôi'
                        : act.template === 'tap_count'
                        ? 'Đếm chạm'
                        : 'Phân loại'}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#7ED6C1] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-[#5A3E36]" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
export default HomeScreen
