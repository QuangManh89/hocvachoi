import { db } from '@/core/storage/db'

export interface Sticker {
  id: string
  name: string
  icon: string
  category: 'pikachu' | 'animals' | 'objects' | 'nature'
  description: string
  bgColor: string
}

export const STICKERS: Sticker[] = [
  {
    id: 'stk_pika_detective',
    name: 'Pikachu Thám Tử',
    icon: '🔍⚡',
    category: 'pikachu',
    description: 'Thám tử Pikachu với kính lúp tinh nghịch',
    bgColor: '#FFF9C4',
  },
  {
    id: 'stk_pika_chef',
    name: 'Pikachu Đầu Bếp',
    icon: '👨‍🍳⚡',
    category: 'pikachu',
    description: 'Đầu bếp nhí nấu món ngon cho bạn bè',
    bgColor: '#FFE0B2',
  },
  {
    id: 'stk_pika_super',
    name: 'Pikachu Siêu Nhân',
    icon: '🦸⚡',
    category: 'pikachu',
    description: 'Chiếc áo choàng đỏ bay trong gió',
    bgColor: '#FFCDD2',
  },
  {
    id: 'stk_pika_student',
    name: 'Pikachu Đi Học',
    icon: '🎒⚡',
    category: 'pikachu',
    description: 'Bé ngoan mang balo tới trường',
    bgColor: '#E1BEE7',
  },
  {
    id: 'stk_cat',
    name: 'Mèo Bông Bạn Nhỏ',
    icon: '🐱✨',
    category: 'animals',
    description: 'Người bạn mèo tròn xoe đáng yêu',
    bgColor: '#C8E6C9',
  },
  {
    id: 'stk_turtle',
    name: 'Bé Rùa Chăm Chỉ',
    icon: '🐢🍃',
    category: 'animals',
    description: 'Từng bước vững vàng tiến lên',
    bgColor: '#DCEDC8',
  },
  {
    id: 'stk_dolphin',
    name: 'Cá Heo Vui Vẻ',
    icon: '🐬🌊',
    category: 'animals',
    description: 'Nhảy múa trên làn sóng biển xanh',
    bgColor: '#B3E5FC',
  },
  {
    id: 'stk_apple',
    name: 'Quả Táo Vàng',
    icon: '🍎⭐',
    category: 'objects',
    description: 'Phần thưởng ngọt ngào cho bé giỏi',
    bgColor: '#FFECB3',
  },
  {
    id: 'stk_rainbow',
    name: 'Cầu Vồng Kỳ Diệu',
    icon: '🌈☁️',
    category: 'nature',
    description: 'Bảy sắc rực rỡ sau cơn mưa mát',
    bgColor: '#E0F7FA',
  },
  {
    id: 'stk_firetruck',
    name: 'Xe Cứu Hỏa Oai Dũng',
    icon: '🚒🚨',
    category: 'objects',
    description: 'Chiếc xe đỏ dũng cảm luôn giúp đỡ mọi người',
    bgColor: '#FFCCBC',
  },
  {
    id: 'stk_star',
    name: 'Ngôi Sao May Mắn',
    icon: '🌟💫',
    category: 'nature',
    description: 'Lấp lánh trên bầu trời đêm dịu êm',
    bgColor: '#FFF59D',
  },
  {
    id: 'stk_rocket',
    name: 'Tàu Vũ Trụ Nhỏ',
    icon: '🚀🌌',
    category: 'objects',
    description: 'Bay cao vút khám phá những vì sao xa',
    bgColor: '#D1C4E9',
  },
]

/**
 * Lấy danh sách ID các nhãn dán bé đã mở khóa
 */
export async function getUnlockedStickerIds(profileId: string): Promise<string[]> {
  const items = await db.rewards
    .where('profileId')
    .equals(profileId)
    .toArray()
  return items.map((i) => i.stickerId)
}

/**
 * Chọn 1 nhãn dán chưa mở để tặng thưởng cho bé sau khi hoàn thành phiên học
 */
export async function awardRandomSticker(profileId: string): Promise<Sticker> {
  const unlockedIds = await getUnlockedStickerIds(profileId)
  const remaining = STICKERS.filter((s) => !unlockedIds.includes(s.id))

  let chosen: Sticker
  if (remaining.length > 0) {
    chosen = remaining[Math.floor(Math.random() * remaining.length)]
  } else {
    // Nếu bé đã sưu tập đủ cả bộ, tặng ngẫu nhiên một nhãn dán may mắn
    chosen = STICKERS[Math.floor(Math.random() * STICKERS.length)]
  }

  // Lưu vào IndexedDB
  await db.rewards.put({
    profileIdStickerId: `${profileId}_${chosen.id}`,
    profileId,
    stickerId: chosen.id,
    unlockedAt: Date.now(),
  })

  return chosen
}
