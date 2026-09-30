import { colorsShapesActivities } from './colorsShapesActivities'
import { numbersActivities } from './numbersActivities'
import { alphabetActivities } from './alphabetActivities'
import { tonesActivities } from './tonesActivities'
import type { AnyActivityData } from '@/core/activity-engine/types'

// Tổng hợp hoạt động của các module
export const allActivities: AnyActivityData[] = [
  ...colorsShapesActivities, // Màu & Hình
  ...numbersActivities,      // Con Số & Đếm
  ...alphabetActivities,     // Bảng Chữ Cái (5 nhóm)
  ...tonesActivities,        // 5 Dấu Thanh Tiếng Việt
]

export const getActivityById = (id: string): AnyActivityData | undefined => {
  return allActivities.find((a) => a.id === id)
}

export const getActivitiesByModule = (
  module: 'colors_shapes' | 'numbers' | 'alphabet' | 'tones'
): AnyActivityData[] => {
  return allActivities.filter((a) => a.module === module)
}

// Bảng nhóm chữ cái
export const ALPHABET_GROUPS = [
  { id: 1, name: 'Nhóm 1: Nguyên âm cơ bản', letters: 'a, e, i, o, u, y', desc: '6 chữ cơ bản không dấu' },
  { id: 2, name: 'Nhóm 2: Nguyên âm có dấu', letters: 'ă, â, ê, ô, ơ, ư', desc: '6 chữ có dấu mũ và móc' },
  { id: 3, name: 'Nhóm 3: Phụ âm quen thuộc', letters: 'm, n, t, l, h, c', desc: '6 phụ âm gần gũi với bé' },
  { id: 4, name: 'Nhóm 4: Phụ âm tiếp theo', letters: 'b, p, v, x, s, r', desc: '6 phụ âm mở rộng' },
  { id: 5, name: 'Nhóm 5: Phụ âm dễ nhầm', letters: 'd, đ, g, k, q', desc: '5 phụ âm phân biệt và quy tắc' },
]
