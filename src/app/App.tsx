import React, { useState, useEffect } from 'react'
import { Sparkles, Zap } from 'lucide-react'
import { Pikachu } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { ParentGate } from '@/core/gate/ParentGate'
import { ProfileModal } from '@/components/ProfileModal'
import { ParentDashboard } from '@/features/parents/ParentDashboard'
import { HomeScreen } from '@/features/home/HomeScreen'
import { ActivityContainer } from '@/core/activity-engine/ActivityContainer'
import { MultiQuestionSession } from '@/core/activity-engine/MultiQuestionSession'
import type { AnyActivityData } from '@/core/activity-engine/types'
import { db, type Profile } from '@/core/storage/db'

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<AnyActivityData | null>(null)
  const [isMultiSessionActive, setIsMultiSessionActive] = useState(false)
  const [isParentGateOpen, setIsParentGateOpen] = useState(false)
  const [parentAreaActive, setParentAreaActive] = useState(false)

  // Khởi tạo hồ sơ bé từ Dexie
  useEffect(() => {
    db.ensureDefaultProfile().then((prof) => {
      setProfile(prof)
    })
  }, [])

  // Mở khóa âm thanh iOS/iPadOS tại lần chạm đầu tiên
  const handleStartApp = async () => {
    audioService.unlock()
    setIsUnlocked(true)
    audioService.playVoice('pikachu_greeting')

    const bgmSetting = await db.settings.get('bgmEnabled')
    const isBgmEnabled = bgmSetting ? Boolean(bgmSetting.value) : true
    audioService.setBGMEnabled(isBgmEnabled)
  }

  const childName = profile ? profile.nickname : 'Bé Yêu'
  const ageBand = profile ? profile.ageBand : '3-4'
  const profileId = profile ? profile.id : 'profile_default'

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FFF8EC] text-[#5A3E36] select-none">
      {/* 1. Màn che "Chạm để bắt đầu" mở khóa Audio iOS Safari */}
      {!isUnlocked && (
        <div
          onClick={handleStartApp}
          className="fixed inset-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer p-6"
        >
          <Pikachu state="wave" size={240} className="mb-6 drop-shadow-2xl" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#5A3E36] mb-3 text-center flex items-center justify-center gap-2">
            <span>Học Và Chơi cùng Pikachu</span>
            <Zap className="w-8 h-8 text-[#FED000] fill-[#FED000]" />
          </h1>
          <p className="text-lg md:text-xl text-[#8C6D62] mb-3 text-center max-w-sm">
            Ứng dụng học sớm tiếng Việt cho bé
          </p>
          <p className="text-xs text-[#8C6D62]/80 mb-6 text-center max-w-xs">
            💡 Lưu ý trên iPad: Vuốt góc phải xuống kiểm tra biểu tượng Quả Chuông không bị gạch chéo
          </p>
          <button className="btn-kid bg-[#FED000] text-[#5A3E36] text-2xl font-black px-10 py-5 rounded-3xl shadow-lg border-4 border-white active:scale-95 transition-transform flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#FF3B30]" />
            <span>Chạm Để Bắt Đầu</span>
          </button>
        </div>
      )}

      {/* 2. Điều hướng chính: */}
      {isMultiSessionActive ? (
        // A. Chế độ Phiên học tổng hợp 15 câu ngẫu nhiên chống lặp bài
        <MultiQuestionSession
          profileId={profileId}
          childName={childName}
          onBack={() => setIsMultiSessionActive(false)}
        />
      ) : currentActivity ? (
        // B. Chế độ Chơi từng bài học lẻ
        <ActivityContainer
          activity={currentActivity}
          onBack={() => setCurrentActivity(null)}
        />
      ) : (
        // C. Màn hình Trang Chủ (HomeScreen)
        <HomeScreen
          profileId={profileId}
          childName={childName}
          ageBand={ageBand}
          onSelectActivity={(activity) => setCurrentActivity(activity)}
          onOpenParentGate={() => setIsParentGateOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onStartMultiQuestionSession={() => setIsMultiSessionActive(true)}
        />
      )}

      {/* 3. Modal Quản Lý Hồ Sơ & Đổi Tên Bé */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* 4. Cổng Phụ Huynh Modal (Chống chạm nhầm với 2 điểm chạm 3 giây) */}
      <ParentGate
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false)
          setParentAreaActive(true)
        }}
      />

      {/* 5. Khu Vực Phụ Huynh Dashboard */}
      {parentAreaActive && profile && (
        <ParentDashboard
          profile={profile}
          onClose={() => setParentAreaActive(false)}
          onProfileChange={(updated) => setProfile(updated)}
        />
      )}
    </div>
  )
}
export default App
