import React, { useState, useEffect } from 'react'
import { X, Check, User, Heart, Star } from 'lucide-react'
import { db, type Profile } from '@/core/storage/db'

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

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [nickname, setNickname] = useState('')
  const [ageBand, setAgeBand] = useState<'2-3' | '3-4' | '4-5'>('3-4')
  const [starsCount, setStarsCount] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    db.ensureDefaultProfile().then((prof) => {
      setProfile(prof)
      setNickname(prof.nickname)
      setAgeBand(prof.ageBand)
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
    }

    await db.profiles.put(updated)
    onProfileUpdated(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-[#5A3E36]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95"
        >
          <X className="w-6 h-6 text-[#5A3E36]" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD25E] flex items-center justify-center text-2xl shadow-sm border-2 border-[#5A3E36]">
            👶
          </div>
          <div>
            <h2 className="text-2xl font-black">Hồ Sơ Của Bé</h2>
            <p className="text-xs text-[#8C6D62]">Quản lý tên và theo dõi lịch sử bài học</p>
          </div>
        </div>

        {/* 1. Nhập tên của bé */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-[#8C6D62] mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#FF8A65]" />
            Tên gọi thân mật của bé:
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nhập tên bé (ví dụ: Bé Bắp)..."
            maxLength={20}
            className="w-full text-lg font-bold px-4 py-3 bg-white rounded-2xl border-3 border-[#5A3E36]/30 focus:border-[#7ED6C1] focus:ring-4 focus:ring-[#7ED6C1]/30 outline-none text-[#5A3E36]"
          />

          {/* Gợi ý tên nhanh */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {NICKNAME_SUGGESTIONS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setNickname(name)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
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

        {/* 2. Chọn nhóm tuổi */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#8C6D62] mb-2 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#FF5252]" />
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
                className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center font-bold transition-all ${
                  ageBand === band.val
                    ? 'bg-[#7ED6C1] border-[#5A3E36] text-[#5A3E36] shadow-md scale-102'
                    : 'bg-white/70 border-[#5A3E36]/20 text-[#8C6D62]'
                }`}
              >
                <span className="text-base font-extrabold">{band.label}</span>
                <span className="text-[10px] opacity-80">{band.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Thống kê nhanh */}
        <div className="bg-white/70 p-3.5 rounded-2xl border-2 border-[#5A3E36]/15 mb-6 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FFD25E] fill-[#FFD25E]" />
            <span className="text-sm font-bold text-[#5A3E36]">{starsCount} Sao đã đạt</span>
          </div>
          <div className="h-6 w-px bg-[#5A3E36]/20" />
          <div className="text-xs font-bold text-[#8C6D62]">
            Chống lặp bài học: <span className="text-green-600">Đang bật</span>
          </div>
        </div>

        {/* Nút lưu */}
        <button
          onClick={handleSave}
          className="w-full btn-kid h-14 bg-[#7ED6C1] border-3 border-[#5A3E36] text-[#5A3E36] text-xl font-black rounded-2xl shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>Lưu Hồ Sơ</span>
        </button>
      </div>
    </div>
  )
}
export default ProfileModal
