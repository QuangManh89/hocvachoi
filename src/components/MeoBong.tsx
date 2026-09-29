import React from 'react'
import { motion } from 'motion/react'

export type MeoBongState =
  | 'idle'
  | 'wave'
  | 'talk'
  | 'cheer'
  | 'think'
  | 'encourage'
  | 'surprise'
  | 'sleep'

interface MeoBongProps {
  state?: MeoBongState
  className?: string
  size?: number
  onClick?: () => void
}

export const MeoBong: React.FC<MeoBongProps> = ({
  state = 'idle',
  className = '',
  size = 200,
  onClick,
}) => {
  // Hoạt ảnh toàn thân theo từng trạng thái
  const bodyVariants = {
    idle: {
      y: [0, -3, 0],
      rotate: [0, 0.5, 0],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
    },
    wave: {
      y: [0, -4, 0],
      rotate: [-1, 1, -1],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' as const },
    },
    talk: {
      y: [0, -3, 0, -2, 0],
      scale: [1, 1.02, 1, 1.01, 1],
      transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' as const },
    },
    cheer: {
      y: [0, -24, 0],
      scale: [1, 1.06, 1],
      rotate: [-2, 2, -2],
      transition: { repeat: Infinity, duration: 0.6, ease: 'easeOut' as const },
    },
    think: {
      rotate: [4, 6, 4],
      y: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
    },
    encourage: {
      y: [0, 4, 0, 4, 0],
      transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' as const },
    },
    surprise: {
      scale: [1, 1.08, 1.05],
      y: [0, -8, -5],
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    sleep: {
      y: [0, 2, 0],
      scale: [1, 0.98, 1],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const },
    },
  }

  // Hoạt ảnh tay phải (vẫy chào hoặc giơ cao)
  const rightHandVariants = {
    idle: { rotate: 0 },
    wave: {
      rotate: [-20, 25, -20],
      transition: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' as const },
    },
    talk: { rotate: [0, 8, 0] },
    cheer: { rotate: -45, y: -8 },
    think: { rotate: -35, y: -4 },
    encourage: { rotate: 0 },
    surprise: { rotate: -20 },
    sleep: { rotate: 0 },
  }

  // Hoạt ảnh tay trái
  const leftHandVariants = {
    idle: { rotate: 0 },
    wave: { rotate: 0 },
    talk: { rotate: [0, -6, 0] },
    cheer: { rotate: 45, y: -8 },
    think: { rotate: 0 },
    encourage: { rotate: 0 },
    surprise: { rotate: 20 },
    sleep: { rotate: 0 },
  }

  // Hoạt ảnh đuôi đung đưa
  const tailVariants = {
    idle: {
      rotate: [-6, 6, -6],
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
    },
    wave: {
      rotate: [-12, 12, -12],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' as const },
    },
    cheer: {
      rotate: [-25, 25, -25],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' as const },
    },
    sleep: { rotate: 0 },
  }

  const furColor = '#FFF1D6'
  const spotColor = '#F6B36B'
  const pinkColor = '#FF9FB2'
  const borderColor = '#5A3E36'
  const scarfColor = '#4FB3D9'

  return (
    <motion.div
      className={`relative inline-block select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      variants={bodyVariants}
      animate={state}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Đuôi Mèo Bông */}
        <motion.path
          d="M 140 145 C 165 145 185 130 180 105 C 176 85 160 90 162 100 C 164 112 150 125 135 128"
          stroke={borderColor}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          variants={tailVariants}
          style={{ originX: '135px', originY: '145px' }}
        />
        {/* Đốm đuôi */}
        <circle cx="178" cy="98" r="8" fill={spotColor} />

        {/* Chân sau / Chân trái phải ngồi */}
        <ellipse cx="65" cy="170" rx="16" ry="10" fill={furColor} stroke={borderColor} strokeWidth="5" />
        <ellipse cx="135" cy="170" rx="16" ry="10" fill={furColor} stroke={borderColor} strokeWidth="5" />

        {/* Thân tròn chibi hình quả trứng */}
        <ellipse cx="100" cy="135" rx="46" ry="40" fill={furColor} stroke={borderColor} strokeWidth="6" />

        {/* Bụng Mèo (Màu sáng nhẹ) */}
        <ellipse cx="100" cy="142" rx="30" ry="24" fill="#FFFDF8" />

        {/* Đốm cam ở lưng/hông */}
        <path d="M 132 120 C 145 125 146 142 135 148 Z" fill={spotColor} />

        {/* Khăn / Nơ xanh trời (nhận diện cố định) */}
        <path
          d="M 72 108 C 85 116 115 116 128 108 C 132 115 120 123 100 122 C 80 123 68 115 72 108 Z"
          fill={scarfColor}
          stroke={borderColor}
          strokeWidth="4"
        />
        {/* Mối nơ */}
        <circle cx="100" cy="116" r="6" fill="#3AA0C6" stroke={borderColor} strokeWidth="3" />
        <path d="M 96 120 L 92 132 L 99 128 L 105 133 L 102 120 Z" fill={scarfColor} stroke={borderColor} strokeWidth="3" />

        {/* Đầu Mèo Bông to tròn (tỉ lệ 1:1 với thân) */}
        <g id="head">
          {/* Tai trái */}
          <path
            d="M 52 52 C 40 32 50 15 70 28 C 76 32 78 40 76 48 Z"
            fill={furColor}
            stroke={borderColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Lòng tai trái hồng */}
          <path d="M 56 46 C 48 35 55 24 67 32 Z" fill={pinkColor} />

          {/* Tai phải */}
          <path
            d="M 148 52 C 160 32 150 15 130 28 C 124 32 122 40 124 48 Z"
            fill={furColor}
            stroke={borderColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Lòng tai phải hồng */}
          <path d="M 144 46 C 152 35 145 24 133 32 Z" fill={pinkColor} />

          {/* Khối đầu tròn */}
          <ellipse cx="100" cy="65" rx="55" ry="46" fill={furColor} stroke={borderColor} strokeWidth="6" />

          {/* Đốm cam đặc trưng trên đỉnh đầu */}
          <path
            d="M 90 20 C 110 20 128 26 132 40 C 124 48 110 46 95 38 C 88 34 85 24 90 20 Z"
            fill={spotColor}
          />

          {/* Mắt Mèo Bông */}
          {state === 'sleep' ? (
            // Mắt nhắm ngủ "⌒ ⌒"
            <>
              <path d="M 72 66 C 76 72 84 72 88 66" stroke={borderColor} strokeWidth="5" strokeLinecap="round" />
              <path d="M 112 66 C 116 72 124 72 128 66" stroke={borderColor} strokeWidth="5" strokeLinecap="round" />
            </>
          ) : state === 'cheer' ? (
            // Mắt cười tít "＾ ＾"
            <>
              <path d="M 72 68 C 76 60 84 60 88 68" stroke={borderColor} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 112 68 C 116 60 124 60 128 68" stroke={borderColor} strokeWidth="5.5" strokeLinecap="round" />
            </>
          ) : (
            // Mắt tròn đen to bóng với 2 đốm sáng trắng
            <>
              {/* Mắt trái */}
              <circle cx="80" cy="64" r="9" fill="#2B2B2B" />
              <circle cx="77" cy="61" r="3.2" fill="#FFFFFF" />
              <circle cx="83" cy="67" r="1.5" fill="#FFFFFF" />

              {/* Mắt phải */}
              <circle cx="120" cy="64" r="9" fill="#2B2B2B" />
              <circle cx="117" cy="61" r="3.2" fill="#FFFFFF" />
              <circle cx="123" cy="67" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Má hồng hào 2 bên */}
          <ellipse cx="68" cy="74" rx="7" ry="4.5" fill={pinkColor} opacity="0.85" />
          <ellipse cx="132" cy="74" rx="7" ry="4.5" fill={pinkColor} opacity="0.85" />

          {/* Mũi tam giác bo tròn hồng */}
          <path d="M 97 70 C 97 68 103 68 103 70 L 100 74 Z" fill={pinkColor} stroke={borderColor} strokeWidth="2" strokeLinejoin="round" />

          {/* Miệng Mèo Bông */}
          {state === 'talk' ? (
            // Miệng nói mở đóng
            <motion.path
              d="M 94 76 C 94 84 106 84 106 76 Z"
              fill={pinkColor}
              stroke={borderColor}
              strokeWidth="3.5"
              animate={{ scaleY: [0.6, 1.4, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          ) : state === 'surprise' ? (
            // Miệng tròn "O" ngạc nhiên
            <ellipse cx="100" cy="78" rx="5" ry="6" fill={pinkColor} stroke={borderColor} strokeWidth="3.5" />
          ) : (
            // Miệng cười "ω" ngọt ngào
            <path
              d="M 93 75 C 96 79 100 78 100 75 C 100 78 104 79 107 75"
              stroke={borderColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* 3 sợi râu mỗi bên ngắn, cong nhẹ */}
          {/* Râu trái */}
          <path d="M 64 68 L 48 66" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 63 73 L 46 74" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 64 78 L 49 82" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
          {/* Râu phải */}
          <path d="M 136 68 L 152 66" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 137 73 L 154 74" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 136 78 L 151 82" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Tay trái */}
        <motion.ellipse
          cx="62"
          cy="126"
          rx="10"
          ry="14"
          fill={furColor}
          stroke={borderColor}
          strokeWidth="5"
          variants={leftHandVariants}
          style={{ originX: '65px', originY: '118px' }}
        />

        {/* Tay phải (Vẫy tay) */}
        <motion.ellipse
          cx="138"
          cy="126"
          rx="10"
          ry="14"
          fill={furColor}
          stroke={borderColor}
          strokeWidth="5"
          variants={rightHandVariants}
          style={{ originX: '135px', originY: '118px' }}
        />

        {/* Ký hiệu ngủ Zzz */}
        {state === 'sleep' && (
          <motion.g
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [-5, -25] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <text x="145" y="45" fill={borderColor} fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              Z
            </text>
            <text x="160" y="32" fill={borderColor} fontSize="14" fontWeight="bold" fontFamily="sans-serif">
              z
            </text>
            <text x="172" y="22" fill={borderColor} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              z
            </text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  )
}
export default MeoBong
