import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Settings, Star, ChevronRight, Edit3, Play, Lock, Gift, Flame } from 'lucide-react'
import type { PikachuState } from '@/components/Pikachu'
import { Companion, type CompanionType } from '@/components/Companion'
import { allActivities } from '@/content/activities'
import type { AnyActivityData } from '@/core/activity-engine/types'
import { db } from '@/core/storage/db'
import { audioService } from '@/core/audio/AudioService'
import { StickerAlbumModal } from '@/features/rewards/StickerAlbumModal'
import { getStreakData } from '@/core/mastery/streakTracker'
import { XylophoneModal } from '@/features/music/XylophoneModal'
import { ColoringStudioModal } from '@/features/coloring/ColoringStudioModal'
import { SmartReviewModal } from '@/features/review/SmartReviewModal'
import { PuzzleGameModal } from '@/features/puzzle/PuzzleGameModal'
import { StoryModal } from '@/features/story/StoryModal'
import { PikachuHouseModal } from '@/features/house/PikachuHouseModal'



interface HomeScreenProps {
  profileId: string
  childName: string
  ageBand: string
  avatar?: string
  theme?: 'gold' | 'ocean' | 'candy' | 'forest'
  companion?: CompanionType
  onSelectActivity: (activity: AnyActivityData) => void
  onOpenParentGate: () => void
  onOpenProfile: () => void
  onStartMultiQuestionSession: () => void
  onCompanionChange?: (companion: CompanionType, theme: 'candy' | 'gold') => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profileId,
  childName,
  ageBand,
  avatar = '⚡',
  theme = 'gold',
  companion = 'pikachu',
  onSelectActivity,
  onOpenParentGate,
  onOpenProfile,
  onStartMultiQuestionSession,
  onCompanionChange,
}) => {
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [totalStars, setTotalStars] = useState(0)
  const [stickerCount, setStickerCount] = useState(0)
  const [streakDays, setStreakDays] = useState(1)
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<'colors_shapes' | 'numbers' | 'alphabet' | 'tones'>('colors_shapes')
  const [unlockedAlphabetGroups, setUnlockedAlphabetGroups] = useState<number[]>([1])
  const [lockedNotice, setLockedNotice] = useState<string | null>(null)
  const [isXylophoneOpen, setIsXylophoneOpen] = useState(false)
  const [isColoringOpen, setIsColoringOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [isHouseOpen, setIsHouseOpen] = useState(false)



  useEffect(() => {
    // 1. Đếm tổng số sao bé đã đạt được từ Dexie
    // 1. Đếm tổng số sao và nhãn dán bé đã đạt được từ Dexie
    db.activityRuns
      .filter((r) => r.completed)
      .count()
      .then((count) => {
        setTotalStars(count)
      })

    db.rewards
      .where('profileId')
      .equals(profileId)
      .count()
      .then((count) => {
        setStickerCount(count)
      })

    // 2. Lấy chuỗi ngày chăm học
    getStreakData(profileId).then((data) => {
      setStreakDays(data.currentStreak)
    })

    // 3. Lấy danh sách nhóm chữ cái đã mở
    db.settings.get('unlockedAlphabetGroups').then((s) => {
      if (s?.value) setUnlockedAlphabetGroups(s.value)
    })

    const cleanup = audioService.onVoiceStateChange(
      () => setPikaState('talk'),
      () => setPikaState('idle')
    )
    return cleanup
  }, [profileId])

  const [currentCompanion, setCurrentCompanion] = useState<CompanionType>(companion)

  useEffect(() => {
    if (companion) {
      setCurrentCompanion(companion)
    }
  }, [companion])

  const handleSwitchCompanion = async (comp: CompanionType) => {
    if (comp === currentCompanion) {
      if (comp === 'kitty') {
        audioService.playVoice('kitty_greeting')
      } else {
        audioService.playVoice('pikachu_greeting')
      }
      setPikaState('cheer')
      return
    }

    setCurrentCompanion(comp)
    const newTheme = comp === 'kitty' ? 'candy' : 'gold'
    const newAvatar = comp === 'kitty' ? '🎀' : '⚡'

    try {
      const p = await db.profiles.get(profileId)
      if (p) {
        await db.profiles.put({
          ...p,
          companion: comp,
          theme: newTheme,
          avatar: newAvatar,
        })
      }
    } catch (e) {
      console.error(e)
    }

    onCompanionChange?.(comp, newTheme)

    if (comp === 'kitty') {
      audioService.playVoice('kitty_greeting')
    } else {
      audioService.playVoice('pikachu_greeting')
    }
    setPikaState('cheer')
  }

  const handleCompanionClick = () => {
    if (currentCompanion === 'kitty') {
      audioService.playVoice('kitty_greeting')
    } else {
      audioService.playVoice('pikachu_greeting')
    }
    setPikaState('wave')
  }

  // Màu nền theo chủ đề
  const themeBg =
    theme === 'ocean'
      ? 'bg-[#E0F7FA]'
      : theme === 'candy'
      ? 'bg-[#FCE4EC]'
      : theme === 'forest'
      ? 'bg-[#E8F5E9]'
      : 'bg-[#FFF8EC]'

  // Lọc hoạt động theo module
  const currentActivities = allActivities.filter((a) => a.module === selectedModule)

  const handleActivityClick = (act: AnyActivityData) => {
    // Kiểm tra nếu là bài chữ cái thuộc nhóm bị khóa
    if (act.module === 'alphabet') {
      const match = act.id.match(/alphabet_g(\d)_/)
      if (match) {
        const groupNum = parseInt(match[1], 10)
        if (!unlockedAlphabetGroups.includes(groupNum)) {
          audioService.playVoice('cat_encourage')
          setLockedNotice(`Nhóm ${groupNum} đang khóa. Ba mẹ mở trong Khu Vực Phụ Huynh nhé!`)
          setTimeout(() => setLockedNotice(null), 3500)
          return
        }
      }
    }

    onSelectActivity(act)
  }

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-3 md:p-6 ${themeBg} text-[#5A3E36] overflow-y-auto select-none transition-colors duration-300`}>
      {/* 1. Header Bar: Profile bé, Sao ⭐, Sổ Nhãn Dán 🎁, Streak 🔥 & Nút Phụ Huynh */}
      <header className="flex justify-between items-center w-full z-10 pt-1 pb-2">
        {/* Nút bấm vào hồ sơ để đổi tên bé */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 bg-white/90 active:bg-white px-3 py-1.5 rounded-full border-2 border-[#5A3E36]/15 shadow-sm active:scale-95 transition-transform"
          title="Chạm để mở Góc Của Bé"
        >
          <div className="w-8 h-8 rounded-full bg-[#FED000] flex items-center justify-center font-bold text-base text-[#5A3E36] shadow-sm">
            {avatar}
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-extrabold text-xs leading-none flex items-center gap-1 text-[#5A3E36]">
              <span>{childName}</span>
              <Edit3 className="w-3 h-3 text-[#8C6D62]" />
            </div>
            <span className="text-[10px] text-[#8C6D62] font-medium">{ageBand} tuổi</span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Nút Chuỗi Ngày Chăm Học (Streak 🔥) */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1 bg-white text-[#FF7043] px-2.5 sm:px-3 py-1.5 rounded-full border-2 border-[#5A3E36] shadow-sm font-black text-xs sm:text-sm active:scale-95 transition-transform"
            title="Chuỗi ngày chăm học của bé"
          >
            <Flame className="w-4 h-4 fill-[#FF7043]" />
            <span>{streakDays}d</span>
          </button>

          {/* Nút Mở Sổ Nhãn Dán (Sticker Album) */}
          <button
            onClick={() => setIsStickerModalOpen(true)}
            className="flex items-center gap-1.5 bg-white text-[#5A3E36] px-2.5 sm:px-3.5 py-1.5 rounded-full border-2 border-[#5A3E36] shadow-sm font-black text-xs sm:text-sm active:scale-95 transition-transform"
            title="Xem Sổ Nhãn Dán của bé"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7043]" />
            <span>{stickerCount}/12</span>
          </button>

          {/* Khối huy hiệu đếm Sao ⭐ */}
          <div className="flex items-center gap-1 bg-[#FFD25E] text-[#5A3E36] px-2.5 sm:px-3.5 py-1.5 rounded-full border-2 border-[#5A3E36] shadow-sm font-black text-xs sm:text-sm">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A3E36] fill-[#5A3E36]" />
            <span>{totalStars}</span>
          </div>
        </div>

        {/* Nút Cổng Phụ Huynh */}
        <button
          onClick={onOpenParentGate}
          className="p-2.5 sm:px-3.5 sm:py-2 bg-white/80 active:bg-white text-[#5A3E36] rounded-2xl border-2 border-[#5A3E36]/15 shadow-sm active:scale-95 transition-transform flex items-center gap-1.5 font-bold"
          title="Khu vực phụ huynh"
        >
          <Settings className="w-5 h-5 text-[#5A3E36]" />
          <span className="hidden sm:inline text-xs">Phụ Huynh</span>
        </button>
      </header>

      {/* Thông báo bài bị khóa nếu chạm vào */}
      {lockedNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#FED000] text-[#5A3E36] border-3 border-[#5A3E36] px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl animate-bounce text-center">
          {lockedNotice}
        </div>
      )}

      {/* 2. Bạn Đồng Hành & Bộ Chuyển Đổi Nhanh Chuẩn Kiosk Trẻ Em */}
      <div className="flex flex-col items-center justify-center my-1 z-10">
        {/* Bộ chuyển đổi nhân vật 1 chạm */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full border-2 border-[#5A3E36]/20 shadow-sm mb-1">
          <button
            type="button"
            onClick={() => handleSwitchCompanion('pikachu')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs transition-all active:scale-95 ${
              currentCompanion === 'pikachu'
                ? 'bg-[#FED000] text-[#5A3E36] border-2 border-[#5A3E36] shadow-md scale-105'
                : 'text-[#8C6D62] hover:text-[#5A3E36]'
            }`}
            title="Đồng hành cùng Pikachu"
          >
            <span className="text-sm">⚡</span>
            <span>Pikachu</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchCompanion('kitty')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs transition-all active:scale-95 ${
              currentCompanion === 'kitty'
                ? 'bg-[#F48FB1] text-[#5A3E36] border-2 border-[#5A3E36] shadow-md scale-105'
                : 'text-[#8C6D62] hover:text-[#E91E63]'
            }`}
            title="Đồng hành cùng Kitty (Tự động đổi màu Kẹo Hồng)"
          >
            <span className="text-sm">🎀</span>
            <span>Kitty</span>
          </button>
        </div>

        {/* Nhân vật Đồng Hành */}
        <div className="relative cursor-pointer" onClick={handleCompanionClick}>
          <Companion character={currentCompanion} state={pikaState} size={165} />
          {/* Bong bóng lời chào */}
          <div className="absolute -top-2 -right-10 bg-white border-2 border-[#5A3E36] px-3 py-1.5 rounded-full text-xs font-bold text-[#5A3E36] shadow-md animate-bounce">
            {currentCompanion === 'kitty' ? `Chào ${childName}! 🎀` : `Chào ${childName}! ⚡`}
          </div>
        </div>
      </div>

      {/* 3. HERO BANNER: PHIÊN HỌC TỔNG HỢP 15 CÂU NGẪU NHIÊN CHỐNG LẶP */}
      <div className="w-full max-w-xl mx-auto my-1.5 z-10">
        <button
          onClick={onStartMultiQuestionSession}
          className={`w-full btn-kid min-h-[72px] border-3 border-[#5A3E36] rounded-3xl p-3 shadow-lg flex items-center justify-between active:scale-98 transition-transform ${
            currentCompanion === 'kitty'
              ? 'bg-gradient-to-r from-[#F8BBD0] via-[#F48FB1] to-[#F8BBD0]'
              : 'bg-gradient-to-r from-[#FED000] via-[#FFE055] to-[#FED000]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-[#5A3E36]/20">
              {currentCompanion === 'kitty' ? '🎀' : '⚡'}
            </div>
            <div className="text-left">
              <div className="font-black text-base sm:text-lg text-[#5A3E36] flex items-center gap-2 leading-tight">
                <span>Phiên Học Của {childName}</span>
                <span className="bg-[#FF3B30] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  15 CÂU
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#6D4C41] mt-0.5">
                Tổng hợp ngẫu nhiên • Tự động chống lặp • Thưởng nhãn dán 🎁
              </div>
            </div>
          </div>

          <div className="bg-[#5A3E36] text-white font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow">
            <Play className="w-4 h-4 fill-current" />
            <span>Chơi ngay</span>
          </div>
        </button>
      </div>

      {/* 3.1 CÁC KHÔNG GIAN SÁNG TẠO, TƯ DUY & GIẢI TRÍ */}
      <div className="w-full max-w-xl mx-auto my-2 grid grid-cols-3 gap-2 sm:gap-2.5 z-10">
        {/* 1. Bé Tập Tô */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsColoringOpen(true)}
          className="btn-kid min-h-[72px] bg-[#FFF3E0] hover:bg-[#FFE0B2] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">🖍️</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">Bé Tập Tô</span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">5 mẫu tranh</span>
        </motion.button>

        {/* 2. Đàn Xylophone */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsXylophoneOpen(true)}
          className="btn-kid min-h-[72px] bg-[#E1F5FE] hover:bg-[#B3E5FC] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">🎹</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">Đàn Gõ</span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">8 phím đồng dao</span>
        </motion.button>

        {/* 3. Ghép Hình & Tư Duy */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPuzzleOpen(true)}
          className="btn-kid min-h-[72px] bg-[#F3E5F5] hover:bg-[#E1BEE7] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">🧩</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">Ghép Hình</span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">Tư duy logic</span>
        </motion.button>

        {/* 4. Chuyện Kể Tương Tác */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsStoryOpen(true)}
          className="btn-kid min-h-[72px] bg-[#FFFDE7] hover:bg-[#FFF9C4] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">📚</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">Chuyện Kể</span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">Khám phá tranh</span>
        </motion.button>

        {/* 5. Nhà Pikachu / Nhà Kitty */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHouseOpen(true)}
          className="btn-kid min-h-[72px] bg-[#E0F2F1] hover:bg-[#B2DFDB] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">{currentCompanion === 'kitty' ? '🎀' : '🏠'}</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">
            {currentCompanion === 'kitty' ? 'Nhà Kitty' : 'Nhà Pikachu'}
          </span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">Dán sticker</span>
        </motion.button>

        {/* 6. Ôn Tập Nhẹ */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReviewOpen(true)}
          className="btn-kid min-h-[72px] bg-[#E8F5E9] hover:bg-[#C8E6C9] border-3 border-[#5A3E36] rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-sm transition-all"
        >
          <span className="text-2xl drop-shadow-sm">🔄</span>
          <span className="text-xs font-black text-[#5A3E36] mt-0.5 leading-tight">Ôn Tập Nhẹ</span>
          <span className="text-[10px] font-bold text-[#8C6D62] hidden sm:inline">5 câu nhớ bài</span>
        </motion.button>
      </div>


      {/* 4. Tab Chọn Module Từng Bài Học Lẻ */}

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-xl mx-auto mt-2 mb-1.5 px-1 z-10 gap-1.5">
        <span className="text-xs font-black uppercase tracking-wider text-[#8C6D62]">
          Chọn bài học lẻ ({currentActivities.length} bài):
        </span>
        <div className="flex gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => setSelectedModule('colors_shapes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'colors_shapes'
                ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🌈 Màu & Hình ({allActivities.filter((a) => a.module === 'colors_shapes').length})
          </button>

          <button
            onClick={() => setSelectedModule('numbers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'numbers'
                ? 'bg-[#FFD25E] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🔢 Con Số ({allActivities.filter((a) => a.module === 'numbers').length})
          </button>

          <button
            onClick={() => setSelectedModule('alphabet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'alphabet'
                ? 'bg-[#FF8A65] border-[#5A3E36] text-white shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🔤 Chữ Cái ({allActivities.filter((a) => a.module === 'alphabet').length})
          </button>

          <button
            onClick={() => setSelectedModule('tones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
              selectedModule === 'tones'
                ? 'bg-[#AB47BC] border-[#5A3E36] text-white shadow-sm'
                : 'bg-white/80 border-[#5A3E36]/20 text-[#8C6D62]'
            }`}
          >
            🎵 Dấu Thanh ({allActivities.filter((a) => a.module === 'tones').length})
          </button>
        </div>
      </div>

      {/* 5. Danh Sách Bài Học Từng Phần */}
      <main className="w-full max-w-xl mx-auto z-10 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentActivities.map((act) => {
            // Kiểm tra trạng thái khóa nhóm chữ cái
            let isLocked = false
            let groupBadge = ''
            if (act.module === 'alphabet') {
              const match = act.id.match(/alphabet_g(\d)_/)
              if (match) {
                const groupNum = parseInt(match[1], 10)
                groupBadge = `Nhóm ${groupNum}`
                if (!unlockedAlphabetGroups.includes(groupNum)) {
                  isLocked = true
                }
              }
            }

            return (
              <motion.button
                key={act.id}
                onClick={() => handleActivityClick(act)}
                whileHover={{ scale: isLocked ? 1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`btn-kid min-h-[76px] rounded-3xl p-3 border-3 shadow-sm flex items-center justify-between transition-transform text-left ${
                  isLocked
                    ? 'bg-[#F3EDE2]/80 border-[#5A3E36]/25 opacity-75'
                    : 'bg-white border-[#5A3E36]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl ${
                      isLocked
                        ? 'bg-gray-100 border-gray-300'
                        : 'bg-[#FFF8EC] border-[#5A3E36]/20'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : act.template === 'explore' ? (
                      '🎨'
                    ) : act.template === 'listen_pick' ? (
                      '👂'
                    ) : act.template === 'match' ? (
                      '🧩'
                    ) : act.template === 'tap_count' ? (
                      '🍎'
                    ) : act.template === 'trace' ? (
                      '✍️'
                    ) : (
                      '🧺'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-[#5A3E36] leading-snug">
                        {act.title}
                      </h3>
                      {groupBadge && (
                        <span className="text-[9px] font-black bg-[#5A3E36]/10 px-1.5 py-0.5 rounded-full text-[#5A3E36]">
                          {groupBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-[#8C6D62]">
                      {isLocked
                        ? 'Chưa mở khóa'
                        : act.template === 'explore'
                        ? 'Khám phá'
                        : act.template === 'listen_pick'
                        ? 'Nghe & Chọn'
                        : act.template === 'match'
                        ? 'Ghép đôi'
                        : act.template === 'tap_count'
                        ? 'Đếm chạm'
                        : act.template === 'trace'
                        ? 'Tô nét'
                        : 'Phân loại'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isLocked ? 'bg-gray-200 text-gray-400' : 'bg-[#7ED6C1] text-[#5A3E36]'
                  }`}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Sổ Nhãn Dán Modal */}
      <StickerAlbumModal
        isOpen={isStickerModalOpen}
        profileId={profileId}
        childName={childName}
        onClose={() => {
          setIsStickerModalOpen(false)
          db.rewards
            .where('profileId')
            .equals(profileId)
            .count()
            .then(setStickerCount)
        }}
      />

      {/* Đàn Xylophone Modal */}
      <XylophoneModal
        isOpen={isXylophoneOpen}
        onClose={() => setIsXylophoneOpen(false)}
      />

      {/* Phòng Tranh Bé Tập Tô Modal */}
      <ColoringStudioModal
        isOpen={isColoringOpen}
        childName={childName}
        onClose={() => setIsColoringOpen(false)}
      />

      {/* Ôn Tập Nhẹ Modal */}
      <SmartReviewModal
        isOpen={isReviewOpen}
        profileId={profileId}
        childName={childName}
        companion={currentCompanion}
        onClose={() => {
          setIsReviewOpen(false)
          db.activityRuns
            .filter((r) => r.completed)
            .count()
            .then(setTotalStars)
        }}
      />

      {/* Trò Chơi Ghép Hình & Tư Duy Modal */}
      <PuzzleGameModal
        isOpen={isPuzzleOpen}
        childName={childName}
        onClose={() => setIsPuzzleOpen(false)}
      />

      {/* Chuyện Kể Tương Tác Modal */}
      <StoryModal
        isOpen={isStoryOpen}
        childName={childName}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* Căn Phòng Của Pikachu / Kitty Modal */}
      <PikachuHouseModal
        isOpen={isHouseOpen}
        profileId={profileId}
        childName={childName}
        companion={currentCompanion}
        onClose={() => setIsHouseOpen(false)}
      />
    </div>
  )
}
export default HomeScreen
