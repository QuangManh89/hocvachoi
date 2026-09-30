import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { X, Moon, Sun, RotateCcw, Trash2 } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'
import { db } from '@/core/storage/db'
import { STICKERS, getUnlockedStickerIds } from '@/content/stickers'

interface PikachuHouseModalProps {
  isOpen: boolean
  profileId: string
  childName: string
  onClose: () => void
}

interface PlacedItem {
  id: string
  icon: string
  name: string
  x: number // Phần trăm chiều rộng (0 - 100)
  y: number // Phần trăm chiều cao (0 - 100)
}

// Các đồ chơi trang trí khởi điểm cho phòng Pikachu
const STARTER_DECOR = [
  { id: 'dec_apple', name: 'Quả Táo', icon: '🍎' },
  { id: 'dec_cake', name: 'Bánh Kem', icon: '🍰' },
  { id: 'dec_ball', name: 'Quả Bóng', icon: '⚽' },
  { id: 'dec_balloon', name: 'Bong Bóng', icon: '🎈' },
  { id: 'dec_flower', name: 'Chậu Hoa', icon: '🪴' },
  { id: 'dec_milk', name: 'Hộp Sữa', icon: '🧃' },
]

export const PikachuHouseModal: React.FC<PikachuHouseModalProps> = ({
  isOpen,
  profileId,
  childName,
  onClose,
}) => {
  const [isNightMode, setIsNightMode] = useState(false)
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [selectedStickerIcon, setSelectedStickerIcon] = useState<string | null>(null)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [availableStickers, setAvailableStickers] = useState<{ id: string; name: string; icon: string }[]>([])
  const [noticeText, setNoticeText] = useState('Chạm sticker rồi chạm vào phòng để đặt nhé!')

  // Tải dữ liệu phòng từ IndexedDB
  useEffect(() => {
    if (!isOpen) return

    // 1. Tải danh sách đồ đã đặt
    db.settings.get(`house_decor_${profileId}`).then((saved) => {
      if (saved?.value && Array.isArray(saved.value)) {
        setPlacedItems(saved.value)
      } else {
        // Đồ trang trí mặc định
        setPlacedItems([
          { id: 'init_1', icon: '🍎', name: 'Quả Táo', x: 28, y: 72 },
          { id: 'init_2', icon: '🎈', name: 'Bong Bóng', x: 78, y: 35 },
        ])
      }
    })

    // 2. Lấy danh sách sticker bé đã mở khóa
    getUnlockedStickerIds(profileId).then((unlockedIds) => {
      const unlocked = STICKERS.filter((s) => unlockedIds.includes(s.id)).map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon.slice(0, 2), // Lấy icon emoji chính
      }))

      // Gộp cùng đồ trang trí khởi điểm
      const combined = [...STARTER_DECOR, ...unlocked]
      setAvailableStickers(combined)
    })
  }, [isOpen, profileId])

  if (!isOpen) return null

  // Lưu vị trí đồ vật vào Dexie IndexedDB
  const saveDecorToDb = (items: PlacedItem[]) => {
    setPlacedItems(items)
    db.settings.put({
      key: `house_decor_${profileId}`,
      value: items,
    })
  }

  // Chạm vào sàn / tường để đặt sticker
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStickerIcon) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)

    audioService.playSnap()
    const newItem: PlacedItem = {
      id: `item_${Date.now()}`,
      icon: selectedStickerIcon,
      name: 'Đồ trang trí',
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(15, Math.min(88, y)),
    }

    const updated = [...placedItems, newItem]
    saveDecorToDb(updated)
    setSelectedStickerIcon(null)
    setPikaState('cheer')
    setNoticeText('Pikachu rất thích món đồ này! Cảm ơn bé!')
    setTimeout(() => setPikaState(isNightMode ? 'sleep' : 'idle'), 1200)
  }

  // Xóa 1 món đồ khi chạm vào nó
  const handleRemovePlacedItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    audioService.playSpark(450)
    const updated = placedItems.filter((i) => i.id !== id)
    saveDecorToDb(updated)
    setNoticeText('Đã cất món đồ vào ngăn kéo!')
  }

  // Đổi chế độ Ngày / Đêm
  const handleToggleDayNight = () => {
    const nextMode = !isNightMode
    setIsNightMode(nextMode)

    if (nextMode) {
      setPikaState('sleep')
      audioService.playVoice('pikachu_buon_ngu')
      setNoticeText('Đêm rồi, Pikachu chúc bé ngủ ngon nhé... khò khò...')
    } else {
      setPikaState('wave')
      audioService.playVoice('pikachu_greeting')
      setNoticeText('Trời sáng rồi! Pikachu thức dậy chơi cùng bé nào!')
    }
  }

  // Chạm vào Pikachu
  const handlePikachuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    audioService.playSpark(700)
    if (isNightMode) {
      setPikaState('sleep')
      setNoticeText('Suỵt... Pikachu đang ngủ say giấc nồng zzz...')
    } else {
      setPikaState('cheer')
      setNoticeText(`Pika Pika! Pikachu yêu bé ${childName} nhất trần đời! ⚡`)
      setTimeout(() => setPikaState('idle'), 1500)
    }
  }

  // Dọn phòng
  const handleClearRoom = () => {
    saveDecorToDb([])
    audioService.playSpark(500)
    setNoticeText('Căn phòng đã được dọn sạch sẽ, bé hãy trang trí lại nào!')
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-3xl p-3 sm:p-5 shadow-2xl relative text-[#5A3E36] flex flex-col h-[94vh] max-h-[720px]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Thanh tiêu đề */}
        <div className="flex items-center justify-between gap-3 mb-2 pr-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFD25E] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-xl shadow-sm">
              🏠
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Căn Phòng Của Pikachu</h2>
              <p className="text-xs text-[#8C6D62]">Dùng sticker để trang trí góc nhỏ cho bạn nhỏ</p>
            </div>
          </div>

          {/* Nút chuyển Ngày / Đêm */}
          <button
            onClick={handleToggleDayNight}
            className={`px-3 py-1.5 rounded-2xl border-2 border-[#5A3E36] font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
              isNightMode ? 'bg-[#311B92] text-[#FED000]' : 'bg-[#FED000] text-[#5A3E36]'
            }`}
          >
            {isNightMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 fill-current text-[#FF7043]" />}
            <span>{isNightMode ? 'Ban Đêm 🌙' : 'Ban Ngày ☀️'}</span>
          </button>
        </div>

        {/* KHÔNG GIAN CĂN PHÒNG (CLICK ĐỂ ĐẶT ĐỒ TRANG TRÍ) */}
        <div
          onClick={handleRoomClick}
          className={`flex-1 rounded-3xl border-4 border-[#5A3E36] relative overflow-hidden shadow-inner cursor-pointer transition-colors duration-500 ${
            isNightMode
              ? 'bg-gradient-to-b from-[#1A237E] via-[#283593] to-[#3E2723]'
              : 'bg-gradient-to-b from-[#E1F5FE] via-[#FFF8EC] to-[#D7CCC8]'
          }`}
        >
          {/* Cửa sổ nhìn ra ngoài trời */}
          <div className="absolute top-4 left-6 w-28 h-32 bg-white/90 border-3 border-[#5A3E36] rounded-t-full rounded-b-2xl p-1.5 shadow flex flex-col justify-between overflow-hidden">
            <div
              className={`w-full h-full rounded-t-full rounded-b-xl flex flex-col items-center justify-center transition-colors ${
                isNightMode ? 'bg-[#0D47A1]' : 'bg-[#81D4FA]'
              }`}
            >
              <span className="text-3xl animate-bounce">
                {isNightMode ? '🌙' : '🌤️'}
              </span>
              <span className="text-[10px] font-black text-white/90 mt-0.5">
                {isNightMode ? 'Đêm Sao' : 'Nắng Ấm'}
              </span>
            </div>
          </div>

          {/* Kệ sách & Tranh treo tường */}
          <div className="absolute top-6 right-8 bg-[#8D6E63] border-2 border-[#4E342E] rounded-xl px-4 py-1.5 shadow flex items-center gap-2 text-xl">
            <span>📚</span>
            <span>🧸</span>
            <span>⭐</span>
          </div>

          {/* Sàn nhà & Thảm trải sàn */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#BCAAA4]/40 border-t-3 border-[#5A3E36]/30 flex items-center justify-center">
            {/* Thảm tròn dễ thương */}
            <div className="w-64 h-20 bg-[#FED000]/60 border-3 border-[#5A3E36]/30 rounded-full shadow-inner flex items-center justify-center text-xs font-black text-[#5A3E36]/60">
              Thảm êm của Pikachu
            </div>
          </div>

          {/* Giường ngủ êm ái góc phải */}
          <div className="absolute bottom-5 right-6 w-32 h-22 bg-[#FFF3E0] border-3 border-[#5A3E36] rounded-2xl shadow-md p-2 flex flex-col justify-between">
            <div className="w-10 h-6 bg-[#FED000] border-2 border-[#5A3E36] rounded-lg self-end" />
            <div className="w-full h-10 bg-[#FF8A65]/40 border-t-2 border-[#5A3E36] rounded-b-xl flex items-center justify-center text-xs font-black text-[#5A3E36]">
              🛏️ Giường ngủ
            </div>
          </div>

          {/* NHÂN VẬT PIKACHU Ở TRUNG TÂM PHÒNG */}
          <div
            onClick={handlePikachuClick}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
          >
            <Pikachu state={pikaState} size={155} />
            <div className="bg-white/95 border-2 border-[#5A3E36] px-3 py-1 rounded-full text-xs font-black text-[#5A3E36] shadow-sm -mt-2">
              {isNightMode ? 'Khò khò... zzz' : 'Chạm vào tớ nè!'}
            </div>
          </div>

          {/* CÁC ĐỒ VẬT STICKER BÉ ĐÃ ĐẶT VÀO PHÒNG */}
          {placedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 1.25 }}
              onClick={(e) => handleRemovePlacedItem(e, item.id)}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              title="Chạm để cất món đồ"
            >
              <div className="text-3xl sm:text-4xl drop-shadow-md filter hover:brightness-110">
                {item.icon}
              </div>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-0.5 bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full shadow">
                <Trash2 className="w-2.5 h-2.5" />
                <span>Cất</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* KHAY STICKER BÉ ĐÃ THU THẬP ĐƯỢC */}
        <div className="mt-2 bg-white/90 border-2 border-[#5A3E36]/20 rounded-2xl p-2 shadow-sm">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-black text-[#8C6D62] uppercase">
              Hộp Sticker Trang Trí ({availableStickers.length} món):
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#FF7043]">
                {selectedStickerIcon ? '👉 Chạm vào phòng để dán!' : 'Chạm 1 hình để chọn'}
              </span>
              <button
                onClick={handleClearRoom}
                className="text-[11px] font-bold text-[#8C6D62] hover:text-red-600 flex items-center gap-1 active:scale-95"
                title="Dọn sạch phòng"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Dọn sạch</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {availableStickers.map((stk) => {
              const isSelected = selectedStickerIcon === stk.icon

              return (
                <button
                  key={stk.id}
                  onClick={() => {
                    audioService.playSpark(620)
                    setSelectedStickerIcon(stk.icon)
                    setNoticeText(`Đã chọn ${stk.name}! Giờ bé chạm vào chỗ muốn đặt trong phòng nhé!`)
                  }}
                  className={`min-h-[50px] px-3 rounded-2xl border-2 flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#FED000] border-[#FF3B30] ring-3 ring-[#FF3B30]/30 scale-105 shadow-md'
                      : 'bg-[#FFF8EC] border-[#5A3E36]/20'
                  }`}
                >
                  <span className="text-2xl">{stk.icon}</span>
                  <span className="text-xs font-black text-[#5A3E36]">{stk.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Lời nhắn khích lệ */}
        <div className="text-center text-xs font-black text-[#5A3E36] mt-1.5">
          {noticeText}
        </div>
      </div>
    </div>
  )
}
export default PikachuHouseModal
