import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Settings, Star, ChevronRight } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { phase1aActivities } from '@/content/activities/phase1aActivities'
import type { AnyActivityData } from '@/core/activity-engine/types'
import { db } from '@/core/storage/db'
import { audioService } from '@/core/audio/AudioService'

interface HomeScreenProps {
  onSelectActivity: (activity: AnyActivityData) => void
  onOpenParentGate: () => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectActivity,
  onOpenParentGate,
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
      {/* 1. Header Bar: Profile, Sao ⭐ & Nút Phụ Huynh */}
      <header className="flex justify-between items-center w-full z-10 pt-1 pb-2">
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full border-2 border-[#5A3E36]/10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FED000] flex items-center justify-center font-bold text-lg text-[#5A3E36] shadow-sm">
            ⚡
          </div>
          <div>
            <div className="font-extrabold text-base leading-none">Bé Yêu</div>
            <span className="text-xs text-[#8C6D62]">3 tuổi (Lớp mầm)</span>
          </div>
        </div>

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

      {/* 2. Khu Vực Giữa: Pikachu Đồng Hành */}
      <div className="flex flex-col items-center justify-center my-1 z-10">
        <div className="relative cursor-pointer" onClick={handlePikachuClick}>
          <Pikachu state={pikaState} size={190} />
          {/* Bong bóng lời chào */}
          <div className="absolute -top-3 -right-12 bg-white border-2 border-[#5A3E36] px-3 py-1.5 rounded-full text-xs font-bold text-[#5A3E36] shadow-md animate-bounce">
            Chào bạn nhỏ! ⚡
          </div>
        </div>
      </div>

      {/* 3. Tab Chọn Module Học */}
      <div className="flex justify-center gap-3 my-2 z-10">
        <button
          onClick={() => setSelectedModule('colors_shapes')}
          className={`btn-kid h-14 px-6 rounded-2xl font-black text-base flex items-center gap-2 border-3 transition-all ${
            selectedModule === 'colors_shapes'
              ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-md scale-105'
              : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
          }`}
        >
          <span>🌈</span>
          <span>Màu & Hình</span>
        </button>

        <button
          onClick={() => setSelectedModule('numbers')}
          className={`btn-kid h-14 px-6 rounded-2xl font-black text-base flex items-center gap-2 border-3 transition-all ${
            selectedModule === 'numbers'
              ? 'bg-[#FFD25E] border-[#5A3E36] text-[#5A3E36] shadow-md scale-105'
              : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
          }`}
        >
          <span>🔢</span>
          <span>Con Số</span>
        </button>
      </div>

      {/* 4. Danh Sách Bài Học Theo Module (Vùng chạm ≥ 80px) */}
      <main className="w-full max-w-xl mx-auto z-10 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentActivities.map((act) => {
            return (
              <motion.button
                key={act.id}
                onClick={() => onSelectActivity(act)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="btn-kid h-24 bg-white rounded-3xl p-4 border-3 border-[#5A3E36] shadow-md flex items-center justify-between transition-transform text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF8EC] border-2 border-[#5A3E36]/20 flex items-center justify-center text-3xl">
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
                    <h3 className="font-extrabold text-base text-[#5A3E36] leading-snug">
                      {act.title}
                    </h3>
                    <span className="text-xs font-bold text-[#8C6D62]">
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

                <div className="w-8 h-8 rounded-full bg-[#7ED6C1] flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-[#5A3E36]" />
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
