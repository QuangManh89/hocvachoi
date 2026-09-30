import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { X, RotateCcw, Printer, Eraser, Check } from 'lucide-react'
import { Pikachu, type PikachuState } from '@/components/Pikachu'
import { audioService } from '@/core/audio/AudioService'

interface ColoringStudioModalProps {
  isOpen: boolean
  childName: string
  onClose: () => void
}

interface TemplateItem {
  id: string
  title: string
  icon: string
  renderSvg: () => React.ReactNode
}

// 8 Màu sáp tươi sáng cho bé
const CRAYON_PALETTE = [
  { name: 'Đỏ', hex: '#FF3B30' },
  { name: 'Cam', hex: '#FF9800' },
  { name: 'Vàng', hex: '#FED000' },
  { name: 'Xanh Lá', hex: '#4CAF50' },
  { name: 'Xanh Dương', hex: '#00BCD4' },
  { name: 'Tím', hex: '#9C27B0' },
  { name: 'Hồng', hex: '#E91E63' },
  { name: 'Nâu Đất', hex: '#795548' },
]

// 3 Cỡ nét bút
const BRUSH_SIZES = [
  { id: 'small', label: 'Nét Nhỏ', size: 10, iconSize: 8 },
  { id: 'medium', label: 'Nét Vừa', size: 22, iconSize: 14 },
  { id: 'large', label: 'Nét To', size: 38, iconSize: 22 },
]

export const ColoringStudioModal: React.FC<ColoringStudioModalProps> = ({
  isOpen,
  childName,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState(CRAYON_PALETTE[2].hex) // Mặc định vàng Pikachu
  const [brushSize, setBrushSize] = useState(22)
  const [isEraser, setIsEraser] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('pikachu')
  const [pikaState, setPikaState] = useState<PikachuState>('wave')
  const [praiseText, setPraiseText] = useState('Bé chọn màu rồi tô tranh nhé!')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const strokeCountRef = useRef(0)

  // 5 Mẫu tranh phác thảo dễ thương
  const TEMPLATES: TemplateItem[] = [
    {
      id: 'pikachu',
      title: 'Pikachu',
      icon: '⚡',
      renderSvg: () => (
        <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none stroke-[#3E2723] fill-none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Tai trái */}
          <path d="M 120 140 Q 60 70 50 30 Q 80 40 140 100" />
          <path d="M 50 30 Q 70 45 90 70" strokeWidth="8" />
          {/* Tai phải */}
          <path d="M 280 140 Q 340 70 350 30 Q 320 40 260 100" />
          <path d="M 350 30 Q 330 45 310 70" strokeWidth="8" />
          {/* Khuôn mặt & Thân tròn */}
          <path d="M 115 150 Q 80 230 110 310 Q 140 370 200 370 Q 260 370 290 310 Q 320 230 285 150 Q 250 110 200 110 Q 150 110 115 150 Z" />
          {/* Mắt to tròn */}
          <circle cx="155" cy="205" r="15" fill="#3E2723" />
          <circle cx="151" cy="200" r="5" fill="#FFFFFF" />
          <circle cx="245" cy="205" r="15" fill="#3E2723" />
          <circle cx="241" cy="200" r="5" fill="#FFFFFF" />
          {/* Mũi xinh */}
          <polygon points="198,222 202,222 200,225" fill="#3E2723" />
          {/* Nụ cười */}
          <path d="M 188 235 Q 200 245 200 238 Q 200 245 212 235" />
          {/* Má tròn điện năng */}
          <circle cx="128" cy="245" r="18" strokeDasharray="3 3" />
          <circle cx="272" cy="245" r="18" strokeDasharray="3 3" />
          {/* Hai tay chụm lại */}
          <path d="M 150 280 Q 180 300 200 285 Q 220 300 250 280" />
          {/* Đuôi sấm sét */}
          <path d="M 280 320 L 330 300 L 315 270 L 360 250 L 350 210 L 380 200" />
        </svg>
      ),
    },
    {
      id: 'apple',
      title: 'Quả Táo',
      icon: '🍎',
      renderSvg: () => (
        <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none stroke-[#3E2723] fill-none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Cuống táo */}
          <path d="M 200 100 Q 210 50 240 40" strokeWidth="8" />
          {/* Chiếc lá xinh */}
          <path d="M 205 85 Q 270 60 270 95 Q 240 120 205 85 Z" fill="none" strokeWidth="5" />
          <path d="M 205 85 Q 240 90 270 95" strokeWidth="3" />
          {/* Thân quả táo */}
          <path d="M 200 100 C 130 80 80 140 80 230 C 80 330 150 360 200 340 C 250 360 320 330 320 230 C 320 140 270 80 200 100 Z" />
          {/* Đốm sáng phản chiếu */}
          <path d="M 125 160 Q 110 200 115 240" strokeWidth="6" strokeDasharray="6 12" />
        </svg>
      ),
    },
    {
      id: 'cat',
      title: 'Mèo Con',
      icon: '🐱',
      renderSvg: () => (
        <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none stroke-[#3E2723] fill-none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Đầu mèo & 2 tai nhọn */}
          <path d="M 120 170 L 90 70 L 180 120 Q 200 115 220 120 L 310 70 L 280 170 Q 330 230 320 290 Q 290 360 200 360 Q 110 360 80 290 Q 70 230 120 170 Z" />
          {/* Tai trong */}
          <path d="M 110 145 L 100 95 L 155 128" strokeWidth="4" />
          <path d="M 290 145 L 300 95 L 245 128" strokeWidth="4" />
          {/* Mắt */}
          <ellipse cx="150" cy="220" rx="14" ry="18" fill="#3E2723" />
          <circle cx="145" cy="214" r="5" fill="#FFFFFF" />
          <ellipse cx="250" cy="220" rx="14" ry="18" fill="#3E2723" />
          <circle cx="245" cy="214" r="5" fill="#FFFFFF" />
          {/* Mũi tam giác */}
          <polygon points="194,245 206,245 200,252" fill="#3E2723" />
          {/* Miệng cười */}
          <path d="M 188 260 Q 200 270 200 262 Q 200 270 212 260" strokeWidth="4" />
          {/* Râu mèo 2 bên */}
          <line x1="80" y1="230" x2="130" y2="240" strokeWidth="4" />
          <line x1="75" y1="255" x2="128" y2="255" strokeWidth="4" />
          <line x1="80" y1="280" x2="130" y2="270" strokeWidth="4" />
          <line x1="320" y1="230" x2="270" y2="240" strokeWidth="4" />
          <line x1="325" y1="255" x2="272" y2="255" strokeWidth="4" />
          <line x1="320" y1="280" x2="270" y2="270" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: 'car',
      title: 'Xe Ô Tô',
      icon: '🚗',
      renderSvg: () => (
        <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none stroke-[#3E2723] fill-none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Thân xe trên mui */}
          <path d="M 100 240 L 140 150 L 270 150 L 320 240 Z" />
          {/* Cửa sổ 2 bên */}
          <path d="M 148 162 L 195 162 L 195 228 L 115 228 Z" strokeWidth="4" />
          <path d="M 205 162 L 262 162 L 305 228 L 205 228 Z" strokeWidth="4" />
          {/* Thân dưới */}
          <path d="M 50 240 L 350 240 Q 365 240 365 260 L 360 290 L 310 290 Q 310 250 260 250 Q 210 250 210 290 L 170 290 Q 170 250 120 250 Q 70 250 70 290 L 40 290 L 35 260 Q 35 240 50 240 Z" />
          {/* Bánh xe trước & sau */}
          <circle cx="120" cy="290" r="30" fill="none" strokeWidth="6" />
          <circle cx="120" cy="290" r="14" fill="#3E2723" />
          <circle cx="260" cy="290" r="30" fill="none" strokeWidth="6" />
          <circle cx="260" cy="290" r="14" fill="#3E2723" />
          {/* Đèn pha & Khói xe */}
          <ellipse cx="40" cy="255" rx="6" ry="10" />
          <ellipse cx="360" cy="255" rx="6" ry="10" />
          {/* Mặt đường */}
          <line x1="20" y1="330" x2="380" y2="330" strokeWidth="4" strokeDasharray="16 12" />
        </svg>
      ),
    },
    {
      id: 'blank',
      title: 'Tự Do',
      icon: '🎨',
      renderSvg: () => (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 pointer-events-none opacity-25">
          <div className="text-right w-full text-xs font-black text-[#5A3E36]">Bé {childName} sáng tạo 🌟</div>
          <div className="text-4xl text-[#5A3E36]/30">✨</div>
          <div className="text-center text-[10px] text-[#5A3E36] font-bold">Học Và Chơi cùng Pikachu</div>
        </div>
      ),
    },
  ]

  // Khởi tạo Canvas với High-DPI Retina
  const initCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#FFFDF9'
      ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(initCanvas, 50)
      window.addEventListener('resize', initCanvas)
      return () => window.removeEventListener('resize', initCanvas)
    }
  }, [isOpen, selectedTemplate])

  // Xử lý vẽ Pointer Events (chống rung chạm ngón tay trên iPad)
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    const pos = getCanvasCoords(e)
    lastPosRef.current = pos

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, (isEraser ? 36 : brushSize) / 2, 0, Math.PI * 2)
    ctx.fillStyle = isEraser ? '#FFFDF9' : selectedColor
    ctx.fill()

    strokeCountRef.current += 1
    if (strokeCountRef.current % 12 === 0) {
      setPikaState('cheer')
      setPraiseText('Đẹp quá! Bé tô khéo tay ghê!')
      setTimeout(() => setPikaState('idle'), 1200)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const currentPos = getCanvasCoords(e)
    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    ctx.strokeStyle = isEraser ? '#FFFDF9' : selectedColor
    ctx.lineWidth = isEraser ? 36 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPosRef.current = currentPos
  }

  const handlePointerUp = () => {
    isDrawingRef.current = false
    lastPosRef.current = null
  }

  // Nút xóa sạch vẽ lại
  const handleClear = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    ctx.fillStyle = '#FFFDF9'
    ctx.fillRect(0, 0, rect.width, rect.height)
    setPraiseText('Đã xóa sạch! Bé vẽ tranh mới nào!')
    audioService.playVoice('pikachu_greeting')
  }

  // In / Tải tranh về thiết bị
  const handlePrintOrSave = () => {
    setPikaState('cheer')
    audioService.playVoice('cheer_finish')
    window.print()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E36]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#FFF8EC] border-4 border-[#5A3E36] rounded-3xl w-full max-w-4xl p-3 sm:p-5 shadow-2xl relative text-[#5A3E36] flex flex-col h-[94vh]">
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white/80 active:bg-white rounded-full border-2 border-[#5A3E36]/20 transition-transform active:scale-95 z-20"
        >
          <X className="w-5 h-5 text-[#5A3E36]" />
        </button>

        {/* Thanh tiêu đề & Chọn mẫu tranh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pr-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF8A65] rounded-2xl border-2 border-[#5A3E36] flex items-center justify-center text-xl shadow-sm text-white">
              🖍️
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Phòng Tranh Bé Tập Tô</h2>
              <p className="text-xs text-[#8C6D62]">Chọn mẫu tranh và màu sáp để tô cùng Pikachu</p>
            </div>
          </div>

          {/* Chọn mẫu tranh */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl.id)
                  handleClear()
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1 shrink-0 ${
                  selectedTemplate === tmpl.id
                    ? 'bg-[#FED000] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                    : 'bg-white border-[#5A3E36]/20 text-[#8C6D62]'
                }`}
              >
                <span>{tmpl.icon}</span>
                <span>{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KHÔNG GIAN VẼ CHÍNH: KHUNG CANVAS TRÊN IPAD */}
        <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0">
          {/* CỘT BÊN TRÁI: KHUNG TRANH CANVAS */}
          <div
            ref={containerRef}
            className="relative flex-1 bg-[#FFFDF9] border-4 border-[#5A3E36] rounded-3xl shadow-inner overflow-hidden touch-none"
            style={{ touchAction: 'none' }}
          >
            {/* Lớp Canvas cho bé vẽ nét sáp */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-crosshair z-0"
            />

            {/* Lớp Viền Phác Thảo Nét (Overlay SVG) nằm phía trên, giữ nét luôn sắc sảo */}
            <div className="absolute inset-0 pointer-events-none z-10 p-2 sm:p-6 flex items-center justify-center">
              {TEMPLATES.find((t) => t.id === selectedTemplate)?.renderSvg()}
            </div>
          </div>

          {/* CỘT BÊN PHẢI: HỘP MÀU SÁP & CÔNG CỤ (KIOSK TOUCH TARGETS) */}
          <div className="w-full md:w-56 flex flex-col justify-between gap-2.5 shrink-0">
            {/* 1. Hàng Cỡ Bút & Tẩy */}
            <div className="bg-white/90 border-2 border-[#5A3E36]/15 rounded-2xl p-2 shadow-sm">
              <div className="text-[11px] font-black text-[#8C6D62] uppercase mb-1.5">
                Cỡ Nét & Tẩy:
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {BRUSH_SIZES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBrushSize(b.size)
                      setIsEraser(false)
                    }}
                    className={`flex-1 min-h-[46px] rounded-xl border-2 flex items-center justify-center transition-all ${
                      !isEraser && brushSize === b.size
                        ? 'bg-[#FED000] border-[#5A3E36] scale-105 shadow-sm'
                        : 'bg-white border-[#5A3E36]/20'
                    }`}
                    title={b.label}
                  >
                    <div
                      className="rounded-full bg-[#5A3E36]"
                      style={{ width: b.iconSize, height: b.iconSize }}
                    />
                  </button>
                ))}

                {/* Nút Cục Tẩy */}
                <button
                  onClick={() => setIsEraser(true)}
                  className={`flex-1 min-h-[46px] rounded-xl border-2 flex items-center justify-center transition-all ${
                    isEraser
                      ? 'bg-[#FF8A65] text-white border-[#5A3E36] scale-105 shadow-sm'
                      : 'bg-white text-[#5A3E36] border-[#5A3E36]/20'
                  }`}
                  title="Cục tẩy"
                >
                  <Eraser className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Bảng 8 Màu Sáp Tươi Sáng */}
            <div className="bg-white/90 border-2 border-[#5A3E36]/15 rounded-2xl p-2.5 shadow-sm flex-1 flex flex-col justify-center">
              <div className="text-[11px] font-black text-[#8C6D62] uppercase mb-2">
                Hộp Màu Sáp (8 Màu):
              </div>
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                {CRAYON_PALETTE.map((c) => {
                  const isSelected = !isEraser && selectedColor === c.hex
                  return (
                    <motion.button
                      key={c.hex}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedColor(c.hex)
                        setIsEraser(false)
                      }}
                      style={{ backgroundColor: c.hex }}
                      className={`min-h-[50px] md:min-h-[54px] rounded-2xl border-3 flex items-center justify-center shadow-md relative transition-transform ${
                        isSelected
                          ? 'border-[#5A3E36] ring-4 ring-[#5A3E36]/30 scale-105 z-10'
                          : 'border-white/80'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white/90 border border-[#5A3E36] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-[#5A3E36] stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* 3. Nút Thao Tác: Xóa Hết & In Tranh */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex-1 btn-kid min-h-[46px] bg-white border-2 border-[#5A3E36] rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 text-[#8C6D62]" />
                <span>Vẽ Lại</span>
              </button>

              <button
                onClick={handlePrintOrSave}
                className="flex-1 btn-kid min-h-[46px] bg-[#FED000] border-2 border-[#5A3E36] rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                title="In tranh hoặc lưu tranh cho bé"
              >
                <Printer className="w-4 h-4 text-[#5A3E36]" />
                <span>In Tranh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pikachu khích lệ ở góc dưới */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#5A3E36]/10 px-1">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={() => setPikaState('cheer')}>
              <Pikachu state={pikaState} size={50} />
            </div>
            <div className="text-xs font-black text-[#5A3E36]">
              {praiseText}
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#8C6D62] hidden sm:block">
            Vẽ bằng ngón tay • Tự do sáng tạo
          </div>
        </div>
      </div>
    </div>
  )
}
export default ColoringStudioModal
