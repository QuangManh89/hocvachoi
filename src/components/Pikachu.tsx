import { motion } from 'motion/react'
import pikachuImg from '@/assets/images/pikachu.png'

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
  size = 240,
  onClick,
}) => {
  // Hoạt ảnh toàn thân theo từng trạng thái cảm xúc
  const containerVariants = {
    idle: {
      y: [0, -5, 0],
      rotate: [0, 0.6, 0, -0.6, 0],
      scale: [1, 1.01, 1],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
    },
    wave: {
      y: [0, -8, 0],
      rotate: [-2, 3, -2],
      scale: [1, 1.02, 1],
      transition: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' as const },
    },
    talk: {
      y: [0, -4, 0, -3, 0],
      scale: [1, 1.02, 1, 1.015, 1],
      rotate: [0, 0.8, 0, -0.8, 0],
      transition: { repeat: Infinity, duration: 0.75, ease: 'easeInOut' as const },
    },
    cheer: {
      y: [0, -32, 0],
      scale: [1, 1.08, 1],
      rotate: [-3, 3, -3],
      transition: { repeat: Infinity, duration: 0.55, ease: 'easeOut' as const },
    },
    think: {
      rotate: [5, 7, 5],
      y: [0, -3, 0],
      scale: 1,
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
    },
    encourage: {
      y: [0, 5, 0, 5, 0],
      scale: [1, 1.01, 1],
      transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' as const },
    },
    surprise: {
      scale: [1, 1.1, 1.06],
      y: [0, -12, -8],
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    sleep: {
      y: [0, 3, 0],
      scale: [1, 0.98, 1],
      rotate: [1, 2, 1],
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
      {/* 1. Hình ảnh 3D Pikachu gốc sắc nét */}
      <img
        src={pikachuImg}
        alt="Pikachu 3D"
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
        draggable={false}
      />

      {/* 2. Lớp mặt nạ biểu cảm động đặt chính xác theo toạ độ khuôn mặt */}
      <div className="absolute inset-0 pointer-events-none">
        {/* A. Trạng thái NÓI (talk): Miệng mở đóng khớp lời đọc */}
        {state === 'talk' && (
          <motion.div
            className="absolute left-[46.2%] top-[47.6%] w-[7.6%] h-[4.5%] flex items-center justify-center"
            initial={{ scaleY: 0.7 }}
            animate={{ scaleY: [0.6, 1.45, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.26 }}
          >
            {/* Hình miệng mở cười 3D dễ thương */}
            <svg viewBox="0 0 40 26" className="w-full h-full overflow-visible">
              {/* Nền miệng hồng đậm */}
              <ellipse cx="20" cy="13" rx="19" ry="12" fill="#D32F2F" stroke="#222" strokeWidth="2.5" />
              {/* Lưỡi hồng nhạt bên trong */}
              <ellipse cx="20" cy="17" rx="12" ry="7" fill="#FF8A80" />
            </svg>
          </motion.div>
        )}

        {/* B. Trạng thái NGỦ (sleep): Mắt nhắm tít ⌒ ⌒ & chữ Zzz bay lên */}
        {state === 'sleep' && (
          <>
            {/* Che mắt trái bằng mí mắt nhắm */}
            <div className="absolute left-[36.5%] top-[38%] w-[7.8%] h-[8%] bg-[#FED000] rounded-full flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 16 C 9 24 21 24 26 16" stroke="#222" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Che mắt phải bằng mí mắt nhắm */}
            <div className="absolute left-[55.8%] top-[38%] w-[7.8%] h-[8%] bg-[#FED000] rounded-full flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 16 C 9 24 21 24 26 16" stroke="#222" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Chữ Zzz bay lên */}
            <motion.div
              className="absolute right-[8%] top-[8%] flex flex-col items-center"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-5, -28] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            >
              <span className="text-xl font-black text-[#5A3E36] drop-shadow-md">Z</span>
              <span className="text-base font-black text-[#5A3E36]/90 ml-3 -mt-1 drop-shadow-md">z</span>
              <span className="text-xs font-black text-[#5A3E36]/80 ml-5 -mt-1 drop-shadow-md">z</span>
            </motion.div>
          </>
        )}

        {/* C. Trạng thái VUI SƯỚNG (cheer): Mắt cười tít ＾ ＾ & Tia chớp phát sáng từ 2 má */}
        {state === 'cheer' && (
          <>
            {/* Mắt trái cười tít */}
            <div className="absolute left-[36.5%] top-[38%] w-[7.8%] h-[8%] bg-[#FED000] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 18 C 9 9 21 9 26 18" stroke="#222" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Mắt phải cười tít */}
            <div className="absolute left-[55.8%] top-[38%] w-[7.8%] h-[8%] bg-[#FED000] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 30 30" className="w-full h-full">
                <path d="M 4 18 C 9 9 21 9 26 18" stroke="#222" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Miệng cười há to hạnh phúc */}
            <div className="absolute left-[45.5%] top-[47.2%] w-[9%] h-[5.5%] flex items-center justify-center">
              <svg viewBox="0 0 40 26" className="w-full h-full">
                <ellipse cx="20" cy="13" rx="18" ry="12" fill="#D32F2F" stroke="#222" strokeWidth="2.5" />
                <ellipse cx="20" cy="17" rx="11" ry="6.5" fill="#FF8A80" />
              </svg>
            </div>

            {/* Tia sét phát ra từ 2 má đỏ */}
            <motion.div
              className="absolute left-[24%] top-[44%] w-[8%] h-[12%]"
              animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              <svg viewBox="0 0 30 40" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,225,53,0.9)]">
                <polygon points="18,0 6,18 16,18 8,40 24,16 14,16" fill="#FFEE55" stroke="#F57F17" strokeWidth="1.5" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute right-[24%] top-[44%] w-[8%] h-[12%]"
              animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
            >
              <svg viewBox="0 0 30 40" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,225,53,0.9)]">
                <polygon points="12,0 24,18 14,18 22,40 6,16 16,16" fill="#FFEE55" stroke="#F57F17" strokeWidth="1.5" />
              </svg>
            </motion.div>
          </>
        )}

        {/* D. Trạng thái NGẠC NHIÊN (surprise): Mắt long lanh sao & miệng chữ O */}
        {state === 'surprise' && (
          <div className="absolute left-[47.2%] top-[47.5%] w-[5.6%] h-[5.6%] flex items-center justify-center">
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <ellipse cx="15" cy="15" rx="12" ry="14" fill="#D32F2F" stroke="#222" strokeWidth="3" />
            </svg>
          </div>
        )}

        {/* E. Trạng thái SUY NGHĨ (think): Biểu tượng bóng suy nghĩ ? */}
        {state === 'think' && (
          <motion.div
            className="absolute right-[12%] top-[12%] bg-white border-2 border-[#5A3E36] rounded-full w-9 h-9 flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="text-xl font-black text-[#5A3E36]">?</span>
          </motion.div>
        )}

        {/* F. Trạng thái VẪY TAY (wave): Ngôi sao lấp lánh ở bàn tay vẫy chào */}
        {state === 'wave' && (
          <motion.div
            className="absolute right-[28%] top-[58%] text-[#FED000]"
            animate={{ rotate: [0, 20, 0], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-md">
              <path d="M12 2L15 9L22 9L16.5 14L18.5 21L12 17L5.5 21L7.5 14L2 9L9 9Z" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
export default Pikachu
