import React, { useState } from 'react'
import { motion } from 'motion/react'
import { X, Sparkles, RotateCcw } from 'lucide-react'
import { audioService } from '@/core/audio/AudioService'
import { Pikachu, type PikachuState } from '@/components/Pikachu'

interface XylophoneModalProps {
  isOpen: boolean
  onClose: () => void
}

interface XylophoneKey {
  note: string
  solfege: string
  freq: number
  color: string
  height: string // Chiều dài thanh kim loại
}

const XYLOPHONE_KEYS: XylophoneKey[] = [
  { note: 'C4', solfege: 'Đồ', freq: 261.63, color: '#FF3B30', height: '100%' },
  { note: 'D4', solfege: 'Rê', freq: 293.66, color: '#FF9800', height: '93%' },
  { note: 'E4', solfege: 'Mi', freq: 329.63, color: '#FED000', height: '86%' },
  { note: 'F4', solfege: 'Pha', freq: 349.23, color: '#4CAF50', height: '80%' },
  { note: 'G4', solfege: 'Son', freq: 392.0, color: '#00BCD4', height: '74%' },
  { note: 'A4', solfege: 'La', freq: 440.0, color: '#2196F3', height: '68%' },
  { note: 'B4', solfege: 'Si', freq: 493.88, color: '#9C27B0', height: '62%' },
  { note: 'C5', solfege: 'Đố', freq: 523.25, color: '#E91E63', height: '56%' },
]

interface SongGuide {
  id: string
  title: string
  desc: string
  notes: number[] // Mảng các index phím (0 - 7)
}

const SONGS: SongGuide[] = [
  {
    id: 'free',
    title: '🎵 Chơi Tự Do',
    desc: 'Bé gõ tự do các nốt nhạc sáng tạo',
    notes: [],
  },
  {
    id: 'tam_vong',
    title: '🥁 Tập Tầm Vông',
    desc: 'Tập tầm vông, tay không tay có...',
    notes: [0, 2, 4, 4, 5, 4, 2, 2, 0],
  },
  {
    id: 'buom_vang',
    title: '🦋 Kìa Con Bướm Vàng',
    desc: 'Kìa con bướm vàng, xòe đôi cánh...',
    notes: [0, 1, 2, 0, 0, 1, 2, 0, 2, 3, 4, 2, 3, 4],
  },
]

export const XylophoneModal: React.FC<XylophoneModalProps> = ({ isOpen, onClose }) => {
  const [selectedSong, setSelectedSong] = useState<SongGuide>(SONGS[0])
  const [songStep, setSongStep] = useState(0)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [activeKeyIdx, setActiveKeyIdx] = useState<number | null>(null)

  if (!isOpen) return null

  const handleKeyPress = (key: XylophoneKey, idx: number) => {
    // 1. Phát âm thanh ngân vang
    audioService.playNote(key.freq, 0.9)
    setActiveKeyIdx(idx)
    setTimeout(() => setActiveKeyIdx(null), 250)

    // 2. Pikachu nhún nhảy
    setPikaState('cheer')
    setTimeout(() => setPikaState('idle'), 1000)

    // 3. Tiến trình bài hát hướng dẫn
    if (selectedSong.notes.length > 0) {
      const targetIdx = selectedSong.notes[songStep]
      if (idx === targetIdx) {
        if (songStep + 1 < selectedSong.notes.length) {
          setSongStep((s) => s + 1)
        } else {
          // Hoàn thành bài hát
          setPikaState('cheer')
          audioService.playVoice('cheer_finish')
          setSongStep(0)
        }
      }
    }
  }

  const nextTargetIdx =
    selectedSong.notes.length > 0 ? selectedSong.notes[songStep] : null

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl relative text-[#5A3E36] flex flex-col max-h-[92vh]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Tiêu đề & Chọn bài */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-[#FED000] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-2xl shadow-sm">
              🎹
            </div>
            <div>
              <h2 className="text-xl font-black flex items-center gap-1.5">
                <span>Đàn Gõ Xylophone & Đồng Dao</span>
              </h2>
              <p className="text-xs text-[#8C6D62]">Chạm vào phím để gõ đàn cùng Pikachu</p>
            </div>
          </div>

          {/* Danh sách bài hát */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {SONGS.map((song) => (
              <button
                key={song.id}
                onClick={() => {
                  setSelectedSong(song)
                  setSongStep(0)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 ${
                  selectedSong.id === song.id
                    ? 'bg-[#FED000] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                    : 'bg-white border-[#5A3E36]/20 text-[#8C6D62]'
                }`}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>

        {/* Khung Hướng Dẫn Bài Hát */}
        {selectedSong.notes.length > 0 && (
          <div className="bg-white/80 border-2 border-[#5A3E36]/15 rounded-2xl p-2.5 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7043]" />
              <span className="text-xs font-bold text-[#5A3E36]">
                Bài: <strong>{selectedSong.title}</strong> — Gõ nốt tiếp theo:{' '}
                <strong className="text-[#FF3B30] text-sm">
                  {nextTargetIdx !== null ? XYLOPHONE_KEYS[nextTargetIdx].solfege : 'Xong!'}
                </strong>
              </span>
            </div>

            <button
              onClick={() => setSongStep(0)}
              className="p-1 rounded-lg text-xs font-bold text-[#8C6D62] hover:text-[#5A3E36] flex items-center gap-1"
              title="Gõ lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gõ lại</span>
            </button>
          </div>
        )}

        {/* BẢNG ĐÀN XYLOPHONE TRẺ EM (TOUCH-ACTION: NONE) */}
        <div
          className="relative bg-gradient-to-b from-[#8D6E63] to-[#5D4037] p-3 sm:p-5 rounded-3xl border-4 border-[#3E2723] shadow-xl flex items-center justify-between gap-1.5 sm:gap-2.5 h-[230px] sm:h-[270px] touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Hai thanh đỡ bằng gỗ chạy ngang */}
          <div className="absolute top-[20%] left-2 right-2 h-4 bg-[#4E342E] rounded shadow-inner -z-0" />
          <div className="absolute bottom-[20%] left-2 right-2 h-4 bg-[#4E342E] rounded shadow-inner -z-0" />

          {/* 8 Phím Đàn */}
          {XYLOPHONE_KEYS.map((k, idx) => {
            const isTarget = nextTargetIdx === idx
            const isActive = activeKeyIdx === idx

            return (
              <motion.button
                key={k.note}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleKeyPress(k, idx)}
                style={{
                  height: k.height,
                  backgroundColor: k.color,
                }}
                className={`relative flex-1 rounded-2xl border-3 border-[#3E2723] shadow-lg flex flex-col justify-between items-center py-3 text-white font-black z-10 transition-all cursor-pointer ${
                  isTarget
                    ? 'ring-4 ring-white animate-pulse'
                    : isActive
                    ? 'brightness-125 scale-102'
                    : ''
                }`}
              >
                {/* Đinh tán trên */}
                <div className="w-3 h-3 rounded-full bg-white/70 shadow-sm border border-[#3E2723]/30" />

                {/* Tên nốt Solfege */}
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg drop-shadow">{k.solfege}</span>
                  <span className="text-[10px] opacity-80">{k.note}</span>
                </div>

                {/* Đinh tán dưới */}
                <div className="w-3 h-3 rounded-full bg-white/70 shadow-sm border border-[#3E2723]/30" />

                {/* Ngón tay chỉ nốt đích */}
                {isTarget && (
                  <div className="absolute -top-7 text-2xl animate-bounce pointer-events-none">
                    👇
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Pikachu đứng nhảy múa bên dưới */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => handleKeyPress(XYLOPHONE_KEYS[0], 0)}>
              <Pikachu state={pikaState} size={85} />
            </div>
            <div className="text-xs font-bold text-[#5A3E36] bg-white px-3 py-1.5 rounded-2xl border-2 border-[#5A3E36]/15 shadow-sm">
              {selectedSong.id === 'free'
                ? '🎶 Bé gõ các phím đàn nghe vui tai chưa kìa!'
                : `👉 Gõ theo bàn tay chỉ để chơi bài "${selectedSong.title}" nhé!`}
            </div>
          </div>

          <div className="text-right text-[11px] font-bold text-[#8C6D62] hidden sm:block">
            Âm thanh chuông ngân 100% tự nhiên
          </div>
        </div>
      </div>
    </div>
  )
}
export default XylophoneModal
