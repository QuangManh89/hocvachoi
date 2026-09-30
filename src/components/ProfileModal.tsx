import React, { useState, useEffect } from 'react'
import { X, Check, User, Heart, Star, Flame, Award, Palette, Calendar } from 'lucide-react'
import { db, type Profile } from '@/core/storage/db'
import { getStreakData, type StreakData } from '@/core/mastery/streakTracker'
import { audioService } from '@/core/audio/AudioService'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onProfileUpdated: (updatedProfile: Profile) => void
}

const NICKNAME_SUGGESTIONS = [
  'Bé Bo',
  'Bé Bắp',
  'Bé Sam',
  'Bé Sâu',
  'Bé Nhím',
  'Bé Miu',
  'Bé Cún',
  'Bé Thỏ',
  'Bé Gấu',
]

const AVATAR_OPTIONS = [
  { icon: '⚡', label: 'Pikachu' },
  { icon: '🐱', label: 'Mèo Bông' },
  { icon: '🦖', label: 'Khủng Long' },
  { icon: '🐰', label: 'Thỏ Con' },
  { icon: '🐼', label: 'Gấu Trúc' },
  { icon: '🦁', label: 'Sư Tử' },
]

const THEME_OPTIONS: Array<{
  id: 'gold' | 'ocean' | 'candy' | 'forest'
  label: string
  color: string
}> = [
  { id: 'gold', label: 'Vàng Pikachu', color: '#FED000' },
  { id: 'ocean', label: 'Biển Xanh', color: '#4DD0E1' },
  { id: 'candy', label: 'Kẹo Hồng', color: '#F48FB1' },
  { id: 'forest', label: 'Rừng Xanh', color: '#81C784' },
]

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [nickname, setNickname] = useState('')
  const [ageBand, setAgeBand] = useState<'2-3' | '3-4' | '4-5'>('3-4')
  const [avatar, setAvatar] = useState('⚡')
  const [theme, setTheme] = useState<'gold' | 'ocean' | 'candy' | 'forest'>('gold')
  const [starsCount, setStarsCount] = useState(0)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'streak'>('info')

  useEffect(() => {
    if (!isOpen) return

    db.ensureDefaultProfile().then((prof) => {
      setProfile(prof)
      setNickname(prof.nickname)
      setAgeBand(prof.ageBand)
      setAvatar(prof.avatar || '⚡')
      setTheme(prof.theme || 'gold')

      getStreakData(prof.id).then(setStreakData)
    })

    db.activityRuns
      .filter((r) => r.completed)
      .count()
      .then((count) => setStarsCount(count))
  }, [isOpen])

  if (!isOpen || !profile) return null

  const handleSave = async () => {
    const trimmed = nickname.trim() || 'Bé Yêu'
    const updated: Profile = {
      ...profile,
      nickname: trimmed,
      ageBand,
      avatar,
      theme,
    }

    await db.profiles.put(updated)
    audioService.playVoice('pikachu_greeting')
    onProfileUpdated(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative text-[#5A3E36] max-h-[90vh] flex flex-col">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-10"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Tiêu đề Modal & Chuyển Tab */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FED000] flex items-center justify-center text-2xl shadow-sm border-2 border-[#5A3E36]">
            {avatar}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Góc Của Bé</h2>
            <p className="text-xs text-[#8C6D62]">Tên gọi, Avatar, Màu chủ đề & Lịch chăm học</p>
          </div>
        </div>

        {/* 2 Tab: Góc Bé vs Lịch Tem */}
        <div className="flex gap-2 mb-4 bg-white/80 p-1.5 rounded-2xl border-2 border-[#5A3E36]/15">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'info'
                ? 'bg-[#FED000] border-2 border-[#5A3E36] text-[#5A3E36] shadow-sm'
                : 'text-[#8C6D62]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hồ Sơ & Giao Diện</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streak')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'streak'
                ? 'bg-[#FF7043] border-2 border-[#5A3E36] text-white shadow-sm'
                : 'text-[#8C6D62]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Tem Chăm Học ({streakData?.currentStreak || 0}d)</span>
          </button>
        </div>

        {/* VÙNG NỘI DUNG CUỘN ĐƯỢC */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'info' ? (
            <div>
              {/* 1. Chọn Avatar Linh Vật */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#8C6D62] mb-1.5">
                  Chọn bạn đồng hành của bé:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.icon}
                      type="button"
                      onClick={() => setAvatar(opt.icon)}
                      className={`h-12 rounded-2xl border-2 flex items-center justify-center text-2xl transition-transform active:scale-95 ${
                        avatar === opt.icon
                          ? 'bg-[#FED000] border-[#5A3E36] shadow-md scale-105 ring-2 ring-[#FF7043]'
                          : 'bg-white/80 border-[#5A3E36]/20'
                      }`}
                      title={opt.label}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Nhập tên của bé */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#8C6D62] mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#FF8A65]" />
                  Tên gọi thân mật của bé:
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nhập tên bé (ví dụ: Bé Bắp)..."
                  maxLength={20}
                  className="w-full text-base font-bold px-3.5 py-2.5 bg-white rounded-2xl border-2 border-[#5A3E36]/30 focus:border-[#7ED6C1] outline-none text-[#5A3E36]"
                />

                {/* Gợi ý tên nhanh */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {NICKNAME_SUGGESTIONS.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setNickname(name)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                        nickname === name
                          ? 'bg-[#FED000] text-[#5A3E36] border-[#5A3E36]'
                          : 'bg-white/80 text-[#8C6D62] border-[#5A3E36]/20'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Chọn nhóm tuổi */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#8C6D62] mb-1.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[#FF5252]" />
                  Nhóm tuổi của bé:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: '2-3', label: '2-3 tuổi', desc: 'Làm quen' },
                    { val: '3-4', label: '3-4 tuổi', desc: 'Trọng tâm' },
                    { val: '4-5', label: '4-5 tuổi', desc: 'Tăng tốc' },
                  ].map((band) => (
                    <button
                      key={band.val}
                      type="button"
                      onClick={() => setAgeBand(band.val as any)}
                      className={`p-2 sm:p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center font-bold transition-all ${
                        ageBand === band.val
                          ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                          : 'bg-white/70 border-[#5A3E36]/20 text-[#8C6D62]'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{band.label}</span>
                      <span className="text-[10px] opacity-80">{band.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Chọn Màu Chủ Đề Giao Diện (Theme) */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#8C6D62] mb-1.5 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#AB47BC]" />
                  Màu chủ đề yêu thích của bé:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEME_OPTIONS.map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setTheme(thm.id)}
                      className={`p-2 rounded-xl border-2 font-bold text-xs flex items-center gap-2 transition-all ${
                        theme === thm.id
                          ? 'bg-white border-[#5A3E36] shadow-sm ring-2 ring-[#5A3E36]'
                          : 'bg-white/60 border-[#5A3E36]/15 text-[#8C6D62]'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-[#5A3E36]"
                        style={{ backgroundColor: thm.color }}
                      />
                      <span>{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Thống kê nhanh */}
              <div className="bg-white/70 p-3 rounded-2xl border-2 border-[#5A3E36]/15 mb-2 flex items-center justify-around">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#FFD25E] fill-[#FFD25E]" />
                  <span className="text-xs font-bold text-[#5A3E36]">{starsCount} Ngôi sao</span>
                </div>
                <div className="h-4 w-px bg-[#5A3E36]/20" />
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#FF7043] fill-[#FF7043]" />
                  <span className="text-xs font-bold text-[#5A3E36]">
                    Chuỗi {streakData?.currentStreak || 0} ngày
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: LỊCH TEM HOA CHĂM HỌC & HUY HIỆU */
            <div>
              {/* Thẻ Chuỗi ngày chăm học */}
              <div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white p-4 rounded-3xl border-3 border-[#5A3E36] shadow-md mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    🔥
                  </div>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider opacity-90">
                      Chuỗi Ngày Học Liên Tiếp
                    </div>
                    <div className="text-2xl font-black">
                      {streakData?.currentStreak || 0} Ngày Chăm Học
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-white/25 px-3 py-1 rounded-full text-xs font-bold">
                    Tổng: {streakData?.totalDaysLearned || 0} ngày
                  </span>
                </div>
              </div>

              {/* Lịch Tem Tuần Này (7 Ngày Thứ 2 -> CN) */}
              <div className="bg-white/80 border-2 border-[#5A3E36]/20 rounded-2xl p-3 mb-4">
                <div className="text-xs font-bold text-[#8C6D62] mb-2 flex items-center justify-between">
                  <span>🌻 Lịch tem tuần này (Bé học nhận 1 bông hoa):</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {streakData?.weekStamps.map((stamp) => (
                    <div
                      key={stamp.dateStr}
                      className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        stamp.isToday
                          ? 'bg-[#FED000]/30 border-[#5A3E36] font-black'
                          : 'bg-white border-[#5A3E36]/15'
                      }`}
                    >
                      <span className="text-[10px] text-[#8C6D62] font-extrabold">
                        {stamp.dayLabel}
                      </span>
                      <span className="text-xs font-bold mb-1">{stamp.dayNum}</span>

                      {/* Tem Hoa hướng dương hoặc chấm tròn */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-base">
                        {stamp.isCompleted ? (
                          <span title={`Đã hoàn thành ${stamp.activitiesCount} bài`}>🌻</span>
                        ) : stamp.isToday ? (
                          <span className="text-xs text-[#8C6D62] animate-pulse">⭕</span>
                        ) : (
                          <span className="text-[10px] text-gray-300">⚪</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danh sách Huy Hiệu Thành Tích */}
              <div>
                <div className="text-xs font-extrabold uppercase text-[#8C6D62] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#FED000]" />
                  <span>Huy hiệu danh dự của bé:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {streakData?.badges.map((b) => (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all ${
                        b.isUnlocked
                          ? 'bg-white border-[#5A3E36] shadow-sm'
                          : 'bg-[#F5EFE6]/60 border-[#5A3E36]/15 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border-2 ${
                          b.isUnlocked
                            ? 'bg-[#FFF8EC] border-[#5A3E36]/20'
                            : 'bg-gray-100 border-gray-300 grayscale'
                        }`}
                      >
                        {b.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-black text-xs text-[#5A3E36] leading-tight">
                          {b.title}
                        </div>
                        <div className="text-[10px] text-[#8C6D62] leading-tight mt-0.5">
                          {b.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nút lưu */}
        <div className="mt-4 pt-3 border-t-2 border-[#5A3E36]/10">
          <button
            onClick={handleSave}
            className="w-full btn-kid h-12 sm:h-13 bg-[#7ED6C1] border-3 border-[#5A3E36] text-[#5A3E36] text-lg font-black rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Lưu Góc Của Bé</span>
          </button>
        </div>
      </div>
    </div>
  )
}
export default ProfileModal
