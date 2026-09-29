import React from 'react'
import { motion } from 'motion/react'

export type PikachuState =
  | 'idle'
  | 'wave'
  | 'talk'
  | 'cheer'
  | 'think'
  | 'encourage'
  | 'surprise'
  | 'sleep'

interface PikachuProps {
  state?: PikachuState
  className?: string
  size?: number
  onClick?: () => void
}

export const Pikachu: React.FC<PikachuProps> = ({
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
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' as const },
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
      y: [0, -26, 0],
      scale: [1, 1.07, 1],
      rotate: [-3, 3, -3],
      transition: { repeat: Infinity, duration: 0.55, ease: 'easeOut' as const },
    },
    think: {
      rotate: [5, 7, 5],
      y: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
    },
    encourage: {
      y: [0, 4, 0, 4, 0],
      transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' as const },
    },
    surprise: {
      scale: [1, 1.1, 1.06],
      y: [0, -10, -6],
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    sleep: {
      y: [0, 2, 0],
      scale: [1, 0.97, 1],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const },
    },
  }

  // Hoạt ảnh tai trái
  const leftEarVariants = {
    idle: {
      rotate: [-3, 3, -3],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const },
    },
    cheer: { rotate: -15, y: -4 },
    think: { rotate: -12 },
    surprise: { rotate: -18, scale: 1.05 },
    sleep: { rotate: -15 },
  }

  // Hoạt ảnh tai phải
  const rightEarVariants = {
    idle: {
      rotate: [3, -3, 3],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const },
    },
    wave: {
      rotate: [10, -5, 10],
      transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' as const },
    },
    cheer: { rotate: 15, y: -4 },
    think: { rotate: 8 },
    surprise: { rotate: 18, scale: 1.05 },
    sleep: { rotate: 15 },
  }

  // Hoạt ảnh tay phải (vẫy chào)
  const rightHandVariants = {
    idle: { rotate: 0 },
    wave: {
      rotate: [-20, 30, -20],
      transition: { repeat: Infinity, duration: 0.65, ease: 'easeInOut' as const },
    },
    talk: { rotate: [0, 10, 0] },
    cheer: { rotate: -40, y: -10 },
    think: { rotate: -35, y: -6 },
    encourage: { rotate: 0 },
    surprise: { rotate: -25 },
    sleep: { rotate: 0 },
  }

  // Hoạt ảnh tay trái
  const leftHandVariants = {
    idle: { rotate: 0 },
    wave: { rotate: 0 },
    talk: { rotate: [0, -8, 0] },
    cheer: { rotate: 40, y: -10 },
    think: { rotate: 0 },
    encourage: { rotate: 0 },
    surprise: { rotate: 25 },
    sleep: { rotate: 0 },
  }

  // Hoạt ảnh đuôi tia sét (đung đưa)
  const tailVariants = {
    idle: {
      rotate: [-8, 8, -8],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
    },
    wave: {
      rotate: [-15, 15, -15],
      transition: { repeat: Infinity, duration: 1, ease: 'easeInOut' as const },
    },
    cheer: {
      rotate: [-25, 25, -25],
      transition: { repeat: Infinity, duration: 0.45, ease: 'easeInOut' as const },
    },
    sleep: { rotate: 0 },
  }

  const yellowPika = '#FED000'
  const redCheek = '#FF3B30'
  const brownBorder = '#5A3E36'
  const brownTail = '#8B4513'

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
        {/* Đuôi tia sét đặc trưng của Pikachu (Lightning Bolt Tail) */}
        <motion.g
          variants={tailVariants}
          style={{ originX: '140px', originY: '150px' }}
        >
          {/* Gốc đuôi màu nâu */}
          <path
            d="M 135 150 L 148 140 L 152 148 L 138 158 Z"
            fill={brownTail}
            stroke={brownBorder}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Đoạn giữa tia sét màu vàng */}
          <path
            d="M 148 140 L 165 125 L 158 122 L 175 105 L 168 100 L 195 72 L 182 108 L 174 105 L 162 124 L 168 127 Z"
            fill={yellowPika}
            stroke={brownBorder}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Chân sau / Bàn chân tròn xoe ngồi */}
        <ellipse cx="68" cy="172" rx="15" ry="10" fill={yellowPika} stroke={brownBorder} strokeWidth="5" />
        <ellipse cx="132" cy="172" rx="15" ry="10" fill={yellowPika} stroke={brownBorder} strokeWidth="5" />
        {/* Móng chân nhỏ */}
        <path d="M 60 176 L 62 171 M 68 177 L 68 171 M 76 176 L 74 171" stroke={brownBorder} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 124 176 L 126 171 M 132 177 L 132 171 M 140 176 L 138 171" stroke={brownBorder} strokeWidth="2.5" strokeLinecap="round" />

        {/* Thân tròn mập mạp của Pikachu */}
        <ellipse cx="100" cy="136" rx="46" ry="42" fill={yellowPika} stroke={brownBorder} strokeWidth="6" />

        {/* Bụng Pikachu (sáng hơn nhẹ) */}
        <ellipse cx="100" cy="142" rx="32" ry="26" fill="#FFF275" opacity="0.6" />

        {/* Sọc nâu sau lưng Pikachu */}
        <path d="M 132 118 C 142 122 144 130 138 134 Z" fill={brownBorder} />
        <path d="M 130 142 C 142 145 142 153 134 156 Z" fill={brownBorder} />

        {/* 2 Tai dài đặc trưng của Pikachu */}
        {/* Tai trái */}
        <motion.g
          variants={leftEarVariants}
          style={{ originX: '65px', originY: '48px' }}
        >
          {/* Thân tai vàng */}
          <path
            d="M 68 46 C 50 20 30 -5 18 -15 C 10 -22 2 -18 6 -5 C 18 20 48 42 62 52 Z"
            fill={yellowPika}
            stroke={brownBorder}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Đầu tai nhọn màu đen */}
          <path
            d="M 18 -15 C 10 -22 2 -18 6 -5 C 12 6 22 1 28 -7 Z"
            fill="#222222"
          />
        </motion.g>

        {/* Tai phải */}
        <motion.g
          variants={rightEarVariants}
          style={{ originX: '135px', originY: '48px' }}
        >
          {/* Thân tai vàng */}
          <path
            d="M 132 46 C 150 20 170 -5 182 -15 C 190 -22 198 -18 194 -5 C 182 20 152 42 138 52 Z"
            fill={yellowPika}
            stroke={brownBorder}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Đầu tai nhọn màu đen */}
          <path
            d="M 182 -15 C 190 -22 198 -18 194 -5 C 188 6 178 1 172 -7 Z"
            fill="#222222"
          />
        </motion.g>

        {/* Đầu Pikachu tròn to tỉ lệ Chibi */}
        <g id="head">
          <ellipse cx="100" cy="68" rx="55" ry="48" fill={yellowPika} stroke={brownBorder} strokeWidth="6" />

          {/* Má đỏ tròn xoe tích điện (Biểu tượng số 1 của Pikachu) */}
          <circle cx="62" cy="80" r="14" fill={redCheek} stroke={brownBorder} strokeWidth="3" />
          <circle cx="138" cy="80" r="14" fill={redCheek} stroke={brownBorder} strokeWidth="3" />

          {/* Mắt Pikachu */}
          {state === 'sleep' ? (
            // Mắt nhắm ngủ "⌒ ⌒"
            <>
              <path d="M 68 64 C 74 72 82 72 88 64" stroke={brownBorder} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 112 64 C 118 72 126 72 132 64" stroke={brownBorder} strokeWidth="5.5" strokeLinecap="round" />
            </>
          ) : state === 'cheer' ? (
            // Mắt cười tít hạnh phúc "＾ ＾"
            <>
              <path d="M 68 66 C 74 58 84 58 88 66" stroke={brownBorder} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 112 66 C 118 58 128 58 132 66" stroke={brownBorder} strokeWidth="5.5" strokeLinecap="round" />
            </>
          ) : (
            // Mắt to đen tròn long lanh có đốm sáng trắng
            <>
              {/* Mắt trái */}
              <circle cx="78" cy="62" r="9" fill="#242424" />
              <circle cx="75" cy="59" r="3.5" fill="#FFFFFF" />
              <circle cx="81" cy="65" r="1.6" fill="#FFFFFF" />

              {/* Mắt phải */}
              <circle cx="122" cy="62" r="9" fill="#242424" />
              <circle cx="119" cy="59" r="3.5" fill="#FFFFFF" />
              <circle cx="125" cy="65" r="1.6" fill="#FFFFFF" />
            </>
          )}

          {/* Mũi tam giác nhỏ xíu màu đen */}
          <polygon points="100,71 98,68 102,68" fill={brownBorder} />

          {/* Miệng Pikachu */}
          {state === 'talk' ? (
            // Miệng nói mở đóng vui nhộn
            <motion.path
              d="M 92 76 C 92 88 108 88 108 76 Z"
              fill="#E3350D"
              stroke={brownBorder}
              strokeWidth="3.5"
              strokeLinejoin="round"
              animate={{ scaleY: [0.6, 1.4, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.28 }}
            />
          ) : state === 'surprise' ? (
            // Miệng tròn chữ "O"
            <ellipse cx="100" cy="80" rx="6" ry="8" fill="#E3350D" stroke={brownBorder} strokeWidth="3.5" />
          ) : (
            // Miệng cười mèo số 3 dễ thương "ω"
            <path
              d="M 91 76 C 95 80 99 79 100 76 C 101 79 105 80 109 76"
              stroke={brownBorder}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* Tay trái nhỏ nhắn */}
        <motion.ellipse
          cx="68"
          cy="126"
          rx="10"
          ry="13"
          fill={yellowPika}
          stroke={brownBorder}
          strokeWidth="5"
          variants={leftHandVariants}
          style={{ originX: '72px', originY: '118px' }}
        />

        {/* Tay phải nhỏ nhắn (Vẫy chào) */}
        <motion.ellipse
          cx="132"
          cy="126"
          rx="10"
          ry="13"
          fill={yellowPika}
          stroke={brownBorder}
          strokeWidth="5"
          variants={rightHandVariants}
          style={{ originX: '128px', originY: '118px' }}
        />

        {/* Ký hiệu ngủ Zzz khi sleep */}
        {state === 'sleep' && (
          <motion.g
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [-5, -28] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <text x="145" y="42" fill={brownBorder} fontSize="20" fontWeight="bold" fontFamily="sans-serif">
              Z
            </text>
            <text x="162" y="28" fill={brownBorder} fontSize="15" fontWeight="bold" fontFamily="sans-serif">
              z
            </text>
            <text x="175" y="16" fill={brownBorder} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              z
            </text>
          </motion.g>
        )}

        {/* Tia chớp nhỏ bắn ra từ má khi Cheer! */}
        {state === 'cheer' && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <path d="M 45 70 L 35 78 L 42 80 L 30 92 L 40 85 L 34 83 Z" fill="#FFE135" stroke={brownBorder} strokeWidth="2" />
            <path d="M 155 70 L 165 78 L 158 80 L 170 92 L 160 85 L 166 83 Z" fill="#FFE135" stroke={brownBorder} strokeWidth="2" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  )
}
export default Pikachu
