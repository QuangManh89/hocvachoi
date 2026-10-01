import React from 'react'
import { motion } from 'motion/react'
import kittyImg from '@/assets/images/kitty.png'

export type KittyState =
  | 'idle'
  | 'wave'
  | 'talk'
  | 'cheer'
  | 'think'
  | 'encourage'
  | 'surprise'
  | 'sleep'

interface KittyProps {
  state?: KittyState
  className?: string
  size?: number
  onClick?: () => void
}

export const Kitty: React.FC<KittyProps> = ({
  state = 'idle',
  className = '',
  size = 240,
  onClick,
}) => {
  // Hoạt ảnh toàn thân theo từng trạng thái cảm xúc của Kitty
  const containerVariants = {
    idle: {
      y: [0, -4, 0],
      rotate: [0, 0.6, 0, -0.6, 0],
      scale: [1, 1.01, 1],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
    },
    wave: {
      y: [0, -6, 0],
      rotate: [-1.5, 2.5, -1.5],
      scale: [1, 1.02, 1],
      transition: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' as const },
    },
    talk: {
      y: [0, -3, 0, -2, 0],
      scale: [1, 1.02, 1, 1.01, 1],
      rotate: [0, 0.7, 0, -0.7, 0],
      transition: { repeat: Infinity, duration: 0.75, ease: 'easeInOut' as const },
    },
    cheer: {
      y: [0, -28, 0],
      scale: [1, 1.08, 1],
      rotate: [-2, 2, -2],
      transition: { repeat: Infinity, duration: 0.55, ease: 'easeOut' as const },
    },
    think: {
      rotate: [4, 6, 4],
      y: [0, -3, 0],
      scale: 1,
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
    },
    encourage: {
      y: [0, 4, 0, 4, 0],
      scale: [1, 1.01, 1],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' as const },
    },
    surprise: {
      scale: [1, 1.1, 1.05],
      y: [0, -10, -6],
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    sleep: {
      y: [0, 3, 0],
      scale: [1, 0.98, 1],
      rotate: [1, 2.5, 1],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const },
    },
  }

  return (
    <motion.div
      className={`relative inline-block select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      variants={containerVariants}
      animate={state}
      onClick={onClick}
    >
      {/* 1. Hình ảnh Kitty gốc sắc nét trên khung vuông */}
      <img
        src={kittyImg}
        alt="Kitty Công Chúa"
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
        draggable={false}
      />

      {/* 2. Lớp mặt nạ biểu cảm động theo toạ độ khuôn mặt Kitty */}
      <div className="absolute inset-0 pointer-events-none">
        {/* A. Trạng thái NÓI (talk): Miệng nhỏ xinh mở đóng nhịp nhàng */}
        {state === 'talk' && (
          <motion.div
            className="absolute left-[50.2%] top-[52.3%] w-[5.6%] h-[3.8%] flex items-center justify-center -translate-x-1/2"
            initial={{ scaleY: 0.6 }}
            animate={{ scaleY: [0.5, 1.4, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.25 }}
          >
            <svg viewBox="0 0 40 26" className="w-full h-full overflow-visible">
              <ellipse cx="20" cy="13" rx="19" ry="12" fill="#E91E63" stroke="#4A1525" strokeWidth="2.5" />
              <ellipse cx="20" cy="16" rx="12" ry="7" fill="#FF80AB" />
            </svg>
          </motion.div>
        )}

        {/* B. Trạng thái NGỦ (sleep): Mắt nhắm tít ⌒ ⌒ & chữ Zzz hồng bay lên */}
        {state === 'sleep' && (
          <>
            {/* Che mắt trái bằng mí mắt nhắm */}
            <div className="absolute left-[37.2%] top-[43.5%] w-[4.5%] h-[4.5%] bg-white rounded-full flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 16 C 9 24 21 24 26 16" stroke="#4A1525" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Che mắt phải bằng mí mắt nhắm */}
            <div className="absolute left-[63.3%] top-[43.5%] w-[4.5%] h-[4.5%] bg-white rounded-full flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 16 C 9 24 21 24 26 16" stroke="#4A1525" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Bong bóng Zzz hồng bay lên */}
            <motion.div
              className="absolute right-[12%] top-[10%] flex flex-col items-center"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-5, -28] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            >
              <span className="text-xl font-black text-[#E91E63] drop-shadow-md">Z</span>
              <span className="text-base font-black text-[#F06292] ml-3 -mt-1 drop-shadow-md">z</span>
              <span className="text-xs font-black text-[#F48FB1] ml-5 -mt-1 drop-shadow-md">z</span>
            </motion.div>
          </>
        )}

        {/* C. Trạng thái VUI SƯỚNG (cheer): Mắt cười ＾ ＾ & Trái tim, Ngôi sao lấp lánh */}
        {state === 'cheer' && (
          <>
            {/* Mắt trái cười tít */}
            <div className="absolute left-[37.2%] top-[43.5%] w-[4.5%] h-[4.5%] bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 18 C 9 9 21 9 26 18" stroke="#4A1525" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Mắt phải cười tít */}
            <div className="absolute left-[63.3%] top-[43.5%] w-[4.5%] h-[4.5%] bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 18 C 9 9 21 9 26 18" stroke="#4A1525" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Trái tim hồng toả sáng quanh Kitty */}
            <motion.div
              className="absolute left-[18%] top-[12%] text-2xl"
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0], y: [-5, -25] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
            >
              💖
            </motion.div>

            <motion.div
              className="absolute right-[16%] top-[14%] text-2xl"
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0], y: [-5, -28] }}
              transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute left-[48%] top-[-2%] text-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.3, 0.9], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              👑
            </motion.div>
          </>
        )}

        {/* D. Trạng thái SUY NGHĨ (think): Dấu hỏi dễ thương bay bổng */}
        {state === 'think' && (
          <motion.div
            className="absolute right-[8%] top-[16%] bg-white/95 px-2.5 py-1 rounded-2xl shadow-lg border-2 border-[#E91E63] flex items-center justify-center"
            initial={{ scale: 0, opacity: 0, y: 5 }}
            animate={{ scale: [0.95, 1.08, 0.95], opacity: 1, y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            <span className="text-xl font-black text-[#E91E63]">?</span>
            <span className="text-xs font-bold text-[#F06292] ml-1">...</span>
          </motion.div>
        )}

        {/* E. Trạng thái ĐỘNG VIÊN (encourage): Má hồng phát sáng & Tim cổ vũ */}
        {state === 'encourage' && (
          <>
            <motion.div
              className="absolute left-[26%] top-[48%] w-[10%] h-[7%] bg-[#FF80AB]/40 rounded-full blur-[2px]"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <motion.div
              className="absolute left-[67%] top-[48%] w-[10%] h-[7%] bg-[#FF80AB]/40 rounded-full blur-[2px]"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <motion.div
              className="absolute right-[14%] top-[18%] text-lg"
              initial={{ scale: 0.8, y: 0 }}
              animate={{ scale: [1, 1.2, 1], y: [-2, -8, -2] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              🌸
            </motion.div>
          </>
        )}

        {/* F. Trạng thái NGẠC NHIÊN (surprise): Tia sáng lấp lánh */}
        {state === 'surprise' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute top-[8%] left-[22%] text-lg">✨</div>
            <div className="absolute top-[6%] right-[20%] text-lg">⭐</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Kitty
