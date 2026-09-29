import React, { useState } from 'react'
import { Sparkles, Zap, Settings, CheckCircle, ShieldCheck } from 'lucide-react'
import { Pikachu } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { ParentGate } from '@/core/gate/ParentGate'
import { HomeScreen } from '@/features/home/HomeScreen'
import { ActivityContainer } from '@/core/activity-engine/ActivityContainer'
import type { AnyActivityData } from '@/core/activity-engine/types'

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<AnyActivityData | null>(null)
  const [isParentGateOpen, setIsParentGateOpen] = useState(false)
  const [parentAreaActive, setParentAreaActive] = useState(false)

  // Mở khóa âm thanh iOS/iPadOS tại lần chạm đầu tiên
  const handleStartApp = () => {
    audioService.unlock()
    setIsUnlocked(true)
    audioService.playVoice('pikachu_greeting')
  }

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

      {/* 2. Điều hướng chính: Nếu chưa chọn bài học thì ở Trang chủ, đã chọn bài thì vào ActivityContainer */}
      {currentActivity ? (
        <ActivityContainer
          activity={currentActivity}
          onBack={() => setCurrentActivity(null)}
        />
      ) : (
        <HomeScreen
          onSelectActivity={(activity) => setCurrentActivity(activity)}
          onOpenParentGate={() => setIsParentGateOpen(true)}
        />
      )}

      {/* 3. Cổng Phụ Huynh Modal (Chống chạm nhầm với 2 điểm chạm 3 giây) */}
      <ParentGate
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false)
          setParentAreaActive(true)
        }}
      />

      {/* 4. Khu Vực Phụ Huynh (Settings, Tiến trình & Thông số) */}
      {parentAreaActive && (
        <div className="fixed inset-0 z-50 bg-[#FFF8EC] p-6 overflow-y-auto flex flex-col justify-between select-none">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6 border-b-2 border-[#5A3E36]/10 pb-4">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Settings className="w-7 h-7 text-[#7ED6C1]" />
                Khu Vực Phụ Huynh
              </h2>
              <button
                onClick={() => setParentAreaActive(false)}
                className="px-5 py-2.5 bg-[#5A3E36] text-white rounded-2xl font-bold active:scale-95"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#5A3E36]">
                  <CheckCircle className="w-5 h-5 text-[#7ED6C1]" />
                  Lát cắt dọc Phase 1a đã hoàn thành
                </h3>
                <p className="text-sm text-[#8C6D62] mb-3">
                  Đã kích hoạt 5 mẫu hoạt động cốt lõi cho module Màu & Hình và Con Số:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-bold text-[#5A3E36]">
                  <div className="p-2.5 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/10">🎨 1. Khám phá (explore)</div>
                  <div className="p-2.5 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/10">👂 2. Nghe & Chọn (listen_pick)</div>
                  <div className="p-2.5 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/10">🧩 3. Ghép bóng (match)</div>
                  <div className="p-2.5 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/10">🍎 4. Đếm chạm (tap_count)</div>
                  <div className="p-2.5 bg-[#FFF8EC] rounded-xl border border-[#5A3E36]/10">🧺 5. Phân loại giỏ (sort)</div>
                </div>
              </div>

              <div className="bg-[#FFF1D6] p-5 rounded-3xl border-3 border-[#F6B36B] text-sm">
                <h4 className="font-bold mb-1 text-[#5A3E36] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E65100]" />
                  Nguyên tắc sư phạm bảo vệ bé:
                </h4>
                <p className="text-[#6B514A] leading-relaxed">
                  Ứng dụng tuyệt đối không có chế độ "thua", không trừ điểm. Khi bé chọn chưa đúng, Pikachu sẽ động viên nhẹ nhàng và đáp án đúng sẽ sáng lên để hướng dẫn bé tự nhiên.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
