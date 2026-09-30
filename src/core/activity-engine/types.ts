import { z } from 'zod'

export type ActivityTemplateType =
  | 'explore'
  | 'listen_pick'
  | 'match'
  | 'tap_count'
  | 'sort'
  | 'trace'

export type ModuleType = 'colors_shapes' | 'numbers' | 'alphabet' | 'tones'

export const ActivityBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  module: z.enum(['colors_shapes', 'numbers', 'alphabet', 'tones']),
  template: z.enum(['explore', 'listen_pick', 'match', 'tap_count', 'sort', 'trace']),
  ageMin: z.number().default(2),
  learningGoal: z.string(),
  promptText: z.string(),
  promptAudio: z.string(),
  rewardStars: z.number().default(1),
})

export type ActivityBase = z.infer<typeof ActivityBaseSchema>

// 1. Template: Explore (Khám phá)
export interface ExploreItem {
  id: string
  label: string
  audioId: string
  color?: string
  icon?: string
  displayChar?: string
  subLabel?: string
}

export interface ExploreActivityData extends ActivityBase {
  template: 'explore'
  items: ExploreItem[]
}

// 2. Template: Listen & Pick (Nghe - Chọn)
export interface ChoiceItem {
  id: string
  label: string
  audioId: string
  color?: string
  icon?: string
  isCorrect: boolean
}

export interface ListenPickActivityData extends ActivityBase {
  template: 'listen_pick'
  targetId: string
  choices: ChoiceItem[]
}

// 3. Template: Match (Ghép đôi hình-bóng, chữ-từ, số-lượng)
export interface MatchPair {
  id: string
  label: string
  audioId: string
  // Left side
  leftType?: 'shape' | 'letter' | 'number' | 'icon'
  leftValue?: string
  leftColor?: string
  // Right side
  rightType?: 'shadow' | 'word' | 'count' | 'icon'
  rightValue?: string
  rightColor?: string
  // Backward compatibility:
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'rectangle' | 'heart'
  color?: string
}

export interface MatchActivityData extends ActivityBase {
  template: 'match'
  pairs: MatchPair[]
}

// 4. Template: Tap Count (Đếm chạm)
export interface TapCountActivityData extends ActivityBase {
  template: 'tap_count'
  targetCount: number
  itemIcon: string
  itemColor: string
  startNumber?: number
}

// 5. Template: Sort (Phân loại vào giỏ)
export interface SortBucket {
  id: string
  label: string
  color: string
  icon?: string
}

export interface SortItem {
  id: string
  bucketId: string
  label: string
  color: string
  icon: string
}

export interface SortActivityData extends ActivityBase {
  template: 'sort'
  buckets: SortBucket[]
  items: SortItem[]
}

// 6. Template: Trace (Tô nét Chữ & Số)
export interface TracePoint {
  x: number // Phần trăm toạ độ X (0 - 100)
  y: number // Phần trăm toạ độ Y (0 - 100)
}

export interface TraceStroke {
  id: string
  label?: string
  guidePathD?: string // SVG path string để vẽ đường đứt nét hướng dẫn
  points: TracePoint[] // Danh sách các điểm mốc cần chạm qua
}

export interface TraceActivityData extends ActivityBase {
  template: 'trace'
  displayChar: string // Ký tự hiển thị lớn (VD: 'A', 'O', '1', '2')
  charAudio: string   // Mã audio phát âm (VD: 'letter_a', 'count_1')
  subLabel?: string   // Từ gợi nhớ (VD: 'Cái ao', 'Một ông mặt trời')
  strokes: TraceStroke[]
  guideSvgViewBox?: string // Default '0 0 100 100'
}

export type AnyActivityData =
  | ExploreActivityData
  | ListenPickActivityData
  | MatchActivityData
  | TapCountActivityData
  | SortActivityData
  | TraceActivityData

