import React, { useState, useRef, useEffect, useCallback } from 'react'
import { RotateCcw, Sparkles, Volume2 } from 'lucide-react'
import type { TraceActivityData, TracePoint } from '../types'
import { audioService } from '@/core/audio/AudioService'
import type { PikachuState } from '@/components/Pikachu'

interface TraceTemplateProps {
  activity: TraceActivityData
  onComplete: () => void
  onFeedback: (text: string, state: PikachuState) => void
}

interface SparkleParticle {
  id: number
  x: number
  y: number
  color: string
}

export const TraceTemplate: React.FC<TraceTemplateProps> = ({
  activity,
  onComplete,
  onFeedback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isPointerDownRef = useRef(false)

  // Chỉ số nét đang tô (0, 1, 2...)
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0)
  // Các điểm mốc đã chạm trúng trong nét hiện tại
  const [completedPointsByStroke, setCompletedPointsByStroke] = useState<number[][]>(() =>
    activity.strokes.map(() => [])
  )
  // Các điểm mốc tự do bé đã vẽ qua (để render đường mực tô màu)
  const [drawnPathsByStroke, setDrawnPathsByStroke] = useState<TracePoint[][]>(() =>
    activity.strokes.map(() => [])
  )
  // Danh sách hiệu ứng lấp lánh (sparkles)
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([])
  // Trạng thái đã hoàn thành toàn bộ chữ/số
  const [isAllDone, setIsAllDone] = useState(false)

  const currentStroke = activity.strokes[activeStrokeIdx] || activity.strokes[0]
  const currentCompletedPoints = completedPointsByStroke[activeStrokeIdx] || []
  const nextTargetPointIdx = currentCompletedPoints.length < currentStroke.points.length
    ? currentCompletedPoints.length
    : null

  // Khởi tạo lại khi đổi bài
  useEffect(() => {
    setActiveStrokeIdx(0)
    setCompletedPointsByStroke(activity.strokes.map(() => []))
    setDrawnPathsByStroke(activity.strokes.map(() => []))
    setIsAllDone(false)
    setSparkles([])
  }, [activity])

  // Thêm tia sáng lấp lánh tại vị trí chạm
  const addSparkle = useCallback((x: number, y: number) => {
    const colors = ['#FED000', '#FF7043', '#4DD0E1', '#81C784', '#BA68C8']
    const newSparkle: SparkleParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
    setSparkles((prev) => [...prev.slice(-8), newSparkle])
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
    }, 600)
  }, [])

  // Xử lý kiểm tra va chạm giữa ngón tay bé và điểm mốc
  const checkPointerHit = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || isAllDone) return
      const rect = containerRef.current.getBoundingClientRect()
      const px = ((clientX - rect.left) / rect.width) * 100
      const py = ((clientY - rect.top) / rect.height) * 100

      // Thêm toạ độ vẽ vào nét hiện tại
      setDrawnPathsByStroke((prev) => {
        const copy = [...prev]
        const currentPoints = copy[activeStrokeIdx] || []
        copy[activeStrokeIdx] = [...currentPoints, { x: px, y: py }]
        return copy
      })

      // Kiểm tra xem có chạm gần điểm mốc tiếp theo không (Bán kính dung sai 14% toạ độ)
      const stroke = activity.strokes[activeStrokeIdx]
      if (!stroke) return

      const completedInThisStroke = completedPointsByStroke[activeStrokeIdx] || []
      const nextIdx = completedInThisStroke.length

      if (nextIdx < stroke.points.length) {
        const targetPt = stroke.points[nextIdx]
        const dist = Math.hypot(px - targetPt.x, py - targetPt.y)

        // Khoảng cách tiếp cận hợp lệ cho trẻ 3 tuổi (~14%)
        if (dist <= 14) {
          const newCompleted = [...completedInThisStroke, nextIdx]
          setCompletedPointsByStroke((prev) => {
            const next = [...prev]
            next[activeStrokeIdx] = newCompleted
            return next
          })

          // Âm thanh lấp lánh (nốt tăng dần theo tiến độ)
          const freq = 520 + nextIdx * 90
          audioService.playSpark(freq)
          addSparkle(targetPt.x, targetPt.y)

          // Nếu đã hoàn thành tất cả điểm mốc của nét này
          if (newCompleted.length === stroke.points.length) {
            if (activeStrokeIdx < activity.strokes.length - 1) {
              // Còn nét tiếp theo
              onFeedback('Giỏi quá! Tô nét tiếp nào!', 'cheer')
              setActiveStrokeIdx((idx) => idx + 1)
            } else {
              // Đã hoàn thành toàn bộ chữ / số
              setIsAllDone(true)
              onFeedback(`Bé tô rất đẹp! Đây là ${activity.displayChar}`, 'cheer')
              audioService.playVoice(activity.charAudio)
              setTimeout(() => {
                onComplete()
              }, 1600)
            }
          }
        }
      }
    },
    [
      activity,
      activeStrokeIdx,
      completedPointsByStroke,
      isAllDone,
      onComplete,
      onFeedback,
      addSparkle,
    ]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // bỏ qua nếu browser không hỗ trợ
    }
    checkPointerHit(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return
    checkPointerHit(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // bỏ qua
    }
  }

  // Chơi lại từ đầu
  const handleReset = () => {
    setActiveStrokeIdx(0)
    setCompletedPointsByStroke(activity.strokes.map(() => []))
    setDrawnPathsByStroke(activity.strokes.map(() => []))
    setIsAllDone(false)
    setSparkles([])
    onFeedback('Bé cùng tô lại nào!', 'talk')
  }

  // Phát âm thanh của chữ/số khi chạm vào icon loa nhỏ
  const handlePlayCharSound = () => {
    audioService.playVoice(activity.charAudio)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-xl mx-auto p-2 select-none">
      {/* 1. Tiêu đề hướng dẫn & Tiến độ nét */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayCharSound}
            className="w-10 h-10 bg-[#FFD25E] rounded-full border-2 border-[#5A3E36] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5 text-[#5A3E36]" />
          </button>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-[#5A3E36] flex items-center gap-1.5">
              <span>{activity.subLabel || `Tô nét: ${activity.displayChar}`}</span>
            </div>
            <div className="text-[11px] font-bold text-[#8C6D62]">
              Nét {activeStrokeIdx + 1} / {activity.strokes.length}
            </div>
          </div>
        </div>

        {/* Nút Làm lại nét */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 bg-white/90 border-2 border-[#5A3E36]/20 px-3 py-1.5 rounded-2xl text-xs font-black text-[#5A3E36] shadow-sm active:scale-95 transition-transform"
          title="Tô lại từ đầu"
        >
          <RotateCcw className="w-4 h-4 text-[#8C6D62]" />
          <span>Tô lại</span>
        </button>
      </div>

      {/* 2. BẢNG TÔ NÉT SVG CHÍNH (TOUCH-ACTION: NONE) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] bg-white rounded-3xl border-4 border-[#5A3E36] shadow-xl overflow-hidden cursor-crosshair touch-none flex items-center justify-center"
        style={{ touchAction: 'none' }}
      >
        {/* Nền chữ cái chìm kích thước lớn */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 font-black text-[180px] sm:text-[220px] text-[#5A3E36] select-none pointer-events-none">
          {activity.displayChar}
        </div>

        {/* Lớp SVG hiển thị đường nét và nét tô */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          {/* A. Đường đứt nét hướng dẫn (Dashed guide lines) cho mọi nét */}
          {activity.strokes.map((stroke, sIdx) => {
            const isCurrent = sIdx === activeStrokeIdx
            const isDone = completedPointsByStroke[sIdx]?.length === stroke.points.length

            if (stroke.guidePathD) {
              return (
                <path
                  key={`guide-${stroke.id}`}
                  d={stroke.guidePathD}
                  fill="none"
                  stroke={isDone ? '#81C784' : isCurrent ? '#FFB300' : '#E0D6C8'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={isDone ? 'none' : '2, 4'}
                  opacity={isDone ? 0.4 : isCurrent ? 0.9 : 0.4}
                />
              )
            }

            // Nếu không có guidePathD, vẽ đường thẳng nối các điểm mốc
            const pathData = stroke.points.reduce((acc, pt, idx) => {
              return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
            }, '')

            return (
              <path
                key={`guide-fallback-${stroke.id}`}
                d={pathData}
                fill="none"
                stroke={isDone ? '#81C784' : isCurrent ? '#FFB300' : '#E0D6C8'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isDone ? 'none' : '2, 4'}
                opacity={isDone ? 0.4 : isCurrent ? 0.9 : 0.4}
              />
            )
          })}

          {/* B. Đường nét mực bé đã vẽ (Traced Lines) */}
          {drawnPathsByStroke.map((pts, sIdx) => {
            if (pts.length < 2) return null
            const pathD = pts.reduce((acc, pt, idx) => {
              return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
            }, '')
            const strokeColor = sIdx === 0 ? '#FED000' : sIdx === 1 ? '#FF7043' : '#4DD0E1'
            return (
              <path
                key={`drawn-${sIdx}`}
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            )
          })}

          {/* C. Các Điểm Mốc Checkpoints (Vòng tròn hướng dẫn bé chạm) */}
          {activity.strokes.map((stroke, sIdx) => {
            const isCurrentStroke = sIdx === activeStrokeIdx
            const completedPts = completedPointsByStroke[sIdx] || []

            return stroke.points.map((pt, pIdx) => {
              const isHit = completedPts.includes(pIdx)
              const isNextTarget = isCurrentStroke && nextTargetPointIdx === pIdx

              return (
                <g key={`pt-${stroke.id}-${pIdx}`}>
                  {/* Vòng hào quang nhấp nháy cho điểm đích tiếp theo */}
                  {isNextTarget && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="#FED000"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Vòng tròn điểm mốc */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHit ? '4.5' : isNextTarget ? '5' : '3.5'}
                    fill={isHit ? '#4CAF50' : isNextTarget ? '#FF9800' : '#FFF8EC'}
                    stroke={isHit ? '#2E7D32' : '#5A3E36'}
                    strokeWidth="1.5"
                  />

                  {/* Số thứ tự điểm chạm */}
                  <text
                    x={pt.x}
                    y={pt.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="3"
                    fontWeight="bold"
                    fill={isHit ? '#FFFFFF' : '#5A3E36'}
                  >
                    {pIdx + 1}
                  </text>
                </g>
              )
            })
          })}
        </svg>

        {/* D. Hiệu ứng tia sáng lấp lánh (Sparkle Particles) */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
            }}
          >
            <Sparkles className="w-7 h-7 text-[#FED000] drop-shadow-md" />
          </div>
        ))}

        {/* E. Bàn tay / Ngón tay hướng dẫn bé điểm xuất phát */}
        {nextTargetPointIdx !== null && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 text-3xl animate-bounce"
            style={{
              left: `${currentStroke.points[nextTargetPointIdx].x}%`,
              top: `${currentStroke.points[nextTargetPointIdx].y + 4}%`,
            }}
          >
            👆
          </div>
        )}
      </div>

      {/* 3. Lời chỉ dẫn dưới cùng */}
      <div className="mt-2 text-center">
        <span className="bg-[#FFF8EC] border-2 border-[#5A3E36]/20 px-4 py-1.5 rounded-full text-xs font-black text-[#5A3E36] shadow-sm">
          {isAllDone
            ? '🎉 Bé tô xong rồi! Xuất sắc quá!'
            : '👉 Bé kéo ngón tay theo đường nét từ số 1 nhé!'}
        </span>
      </div>
    </div>
  )
}
export default TraceTemplate
