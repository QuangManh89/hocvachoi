import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Settings, Sparkles, CheckCircle, Zap } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { ParentGate } from '@/core/gate/ParentGate'
import { db } from '@/core/storage/db'

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [speechText, setSpeechText] = useState('Chạm vào màn hình để bắt đầu nhé!')
  const [isParentGateOpen, setIsParentGateOpen] = useState(false)
  const [parentAreaActive, setParentAreaActive] = useState(false)
  const [profileName, setProfileName] = useState('Bé Yêu')

  useEffect(() => {
    // Khởi tạo DB Dexie và lấy profile
    db.ensureDefaultProfile().then((prof) => {
      setProfileName(prof.nickname)
    })

    // Lắng nghe sự kiện phát âm thanh để Pikachu tự mở miệng nói
    const cleanup = audioService.onVoiceStateChange(
      () => setPikaState('talk'),
      () => setPikaState('idle')
    )

    return cleanup
  }, [])

  // Mở khóa âm thanh iOS/iPadOS tại lần chạm đầu tiên
  const handleStartApp = () => {
    audioService.unlock()
    setIsUnlocked(true)
    setSpeechText('Chào bạn! Mình là Pikachu, chúng mình cùng chơi nào!')
    audioService.playVoice('pikachu_greeting')
  }

  // Chơi âm thanh và biểu cảm tương ứng
  const handlePlaySample = (clipId: string, text: string, state: PikachuState) => {
    setSpeechText(text)
    setPikaState(state)
    audioService.playVoice(clipId, () => {
      setPikaState('idle')
    })

    if (state === 'cheer') {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FED000', '#FF3B30', '#7ED6C1', '#4FB3D9'],
      })
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden bg-[#FFF8EC] text-[#5A3E36]">
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

      {/* 2. Header Bar: Profile, Thông tin & Nút Cổng Phụ Huynh */}
      <header className="flex justify-between items-center w-full z-10 pt-2">
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full border-2 border-[#5A3E36]/10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FED000] flex items-center justify-center font-bold text-lg text-[#5A3E36] shadow-sm">
            ⚡
          </div>
          <div>
            <div className="font-extrabold text-base leading-none">{profileName}</div>
            <span className="text-xs text-[#8C6D62]">3 tuổi (Lớp mầm)</span>
          </div>
        </div>

        {/* Nút Cổng Phụ Huynh (≥ 44px) */}
        <button
          onClick={() => setIsParentGateOpen(true)}
          className="p-3 bg-white/80 active:bg-white text-[#5A3E36] rounded-2xl border-2 border-[#5A3E36]/15 shadow-sm active:scale-95 transition-transform flex items-center gap-2 font-bold"
          title="Khu vực phụ huynh"
        >
          <Settings className="w-6 h-6 text-[#5A3E36]" />
          <span className="hidden sm:inline text-sm">Phụ Huynh</span>
        </button>
      </header>

      {/* 3. Khu Vực Chính: Pikachu & Lời Thoại */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-2">
        {/* Bong bóng lời thoại của Pikachu */}
        <div className="relative bg-white border-3 border-[#5A3E36] rounded-3xl px-6 py-4 shadow-md mb-4 max-w-md text-center">
          <p className="text-lg md:text-xl font-bold text-[#5A3E36] leading-snug">
            {speechText}
          </p>
          {/* Mũi nhọn bóng thoại chỉ xuống Pikachu */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-3 border-r-3 border-[#5A3E36] rotate-45" />
        </div>

        {/* Component Nhân vật Pikachu tương tác */}
        <div className="relative my-2">
          <Pikachu
            state={pikaState}
            size={230}
            onClick={() => handlePlaySample('pikachu_greeting', 'Chào bạn! Mình là Pikachu!', 'wave')}
          />
        </div>
      </main>

      {/* 4. Thanh Điều Khiển & Hoạt Động Mẫu (Các nút chạm lớn ≥ 80px) */}
      <footer className="w-full flex flex-col gap-3 z-10 pb-2">
        {/* Nhãn hướng dẫn */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D62]">
            Hoạt động mẫu (Phase 0 Spike)
          </span>
          <span className="text-xs text-[#8C6D62]">Chạm nút để nghe & xem Pikachu</span>
        </div>

        {/* Lưới nút chạm lớn chuẩn Kiosk Trẻ Em (≥ 80px) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {/* Nút 1: Chữ A */}
          <button
            onClick={() => handlePlaySample('letter_a', 'Chữ a: cái ao', 'talk')}
            className="btn-kid bg-[#FFD25E] border-3 border-[#5A3E36] text-[#5A3E36] shadow-sm flex flex-col p-2"
          >
            <span className="text-3xl font-black">A a</span>
            <span className="text-xs font-bold mt-1">cái ao</span>
          </button>

          {/* Nút 2: Chữ Bờ (B) */}
          <button
            onClick={() => handlePlaySample('letter_b', 'Chữ bờ: trái bóng', 'talk')}
            className="btn-kid bg-[#7ED6C1] border-3 border-[#5A3E36] text-[#5A3E36] shadow-sm flex flex-col p-2"
          >
            <span className="text-3xl font-black">B b</span>
            <span className="text-xs font-bold mt-1">trái bóng</span>
          </button>

          {/* Nút 3: Số 5 */}
          <button
            onClick={() => handlePlaySample('number_5', 'Số năm', 'cheer')}
            className="btn-kid bg-[#FF8A65] border-3 border-[#5A3E36] text-[#5A3E36] shadow-sm flex flex-col p-2"
          >
            <span className="text-3xl font-black">5</span>
            <span className="text-xs font-bold mt-1">số năm ⭐</span>
          </button>

          {/* Nút 4: Màu đỏ */}
          <button
            onClick={() => handlePlaySample('color_red', 'Màu đỏ', 'cheer')}
            className="btn-kid bg-[#B69CF2] border-3 border-[#5A3E36] text-[#5A3E36] shadow-sm flex flex-col p-2"
          >
            <span className="text-3xl font-black">🔴</span>
            <span className="text-xs font-bold mt-1">màu đỏ</span>
          </button>
        </div>

        {/* Thanh trạng thái cảm xúc của Pikachu để test */}
        <div className="flex justify-center gap-2 overflow-x-auto py-1">
          {(['idle', 'wave', 'talk', 'cheer', 'think', 'encourage', 'surprise', 'sleep'] as PikachuState[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => {
                  setPikaState(s)
                  if (s === 'cheer') {
                    handlePlaySample('cat_praise', 'Giỏi quá! Đúng rồi!', 'cheer')
                  } else if (s === 'encourage') {
                    handlePlaySample('cat_encourage', 'Không sao đâu, thử lại nhé!', 'encourage')
                  } else if (s === 'think') {
                    handlePlaySample('cat_hint', 'Ở đây nè!', 'think')
                  } else if (s === 'sleep') {
                    handlePlaySample('pikachu_sleep', 'Pikachu buồn ngủ rồi...', 'sleep')
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  pikaState === s
                    ? 'bg-[#5A3E36] text-white border-[#5A3E36]'
                    : 'bg-white/80 text-[#5A3E36] border-[#5A3E36]/20'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </footer>

      {/* 5. Cổng Phụ Huynh Modal (Chống chạm nhầm với 2 điểm chạm 3 giây) */}
      <ParentGate
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false)
          setParentAreaActive(true)
        }}
      />

      {/* 6. Khu Vực Phụ Huynh & Báo Cáo Kỹ Thuật Phase 0 */}
      {parentAreaActive && (
        <div className="fixed inset-0 z-50 bg-[#FFF8EC] p-6 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6 border-b-2 border-[#5A3E36]/10 pb-4">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Settings className="w-7 h-7 text-[#7ED6C1]" />
                Khu Vực Phụ Huynh (Pikachu Edition)
              </h2>
              <button
                onClick={() => setParentAreaActive(false)}
                className="px-4 py-2 bg-[#5A3E36] text-white rounded-xl font-bold active:scale-95"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#5A3E36]/10 shadow-sm">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#5A3E36]">
                  <CheckCircle className="w-5 h-5 text-[#7ED6C1]" />
                  Kiểm chứng Kỹ thuật Phase 0 (iPad Ready)
                </h3>
                <ul className="text-sm space-y-2 text-[#6B514A]">
                  <li>✅ <strong>Nhân vật đồng hành:</strong> Pikachu SVG đa lớp với 8 trạng thái cảm xúc, má hồng tích điện và đuôi tia sét.</li>
                  <li>✅ <strong>Âm thanh iPad:</strong> Đã chuyển sang `html5: true`, phát qua Media Session không sợ câm tiếng.</li>
                  <li>✅ <strong>Kiosk Trẻ em:</strong> Đã bật chống cuộn, chống phóng to, nút bấm ≥ 80px CSS.</li>
                  <li>✅ <strong>Cổng Phụ Huynh:</strong> Đã test thành công 2 điểm chạm giữ 3 giây.</li>
                  <li>✅ <strong>IndexedDB (Dexie):</strong> Đã kết nối cơ sở dữ liệu `hocvachoi_v1` lưu trữ hồ sơ.</li>
                </ul>
              </div>

              <div className="bg-[#FFF1D6] p-5 rounded-2xl border-2 border-[#F6B36B] text-sm">
                <h4 className="font-bold mb-1 text-[#5A3E36]">Kết nối kiểm thử với iPad:</h4>
                <p className="text-[#6B514A] mb-2">
                  Để thử nghiệm trực tiếp trên Safari iPad qua mạng LAN hoặc Cloudflare Tunnel:
                </p>
                <code className="block bg-white p-2 rounded-lg text-xs font-mono text-[#5A3E36] border border-[#5A3E36]/20">
                  cloudflared tunnel --url http://localhost:5173
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
