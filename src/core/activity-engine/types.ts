import { z } from 'zod'

export type ActivityTemplateType =
  | 'explore'
  | 'listen_pick'
  | 'match'
  | 'tap_count'
  | 'sort'

export type ModuleType = 'colors_shapes' | 'numbers' | 'alphabet'

export const ActivityBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  module: z.enum(['colors_shapes', 'numbers', 'alphabet']),
  template: z.enum(['explore', 'listen_pick', 'match', 'tap_count', 'sort']),
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

// 3. Template: Match (Ghép đôi hình - bóng)
export interface MatchPair {
  id: string
  label: string
  audioId: string
  shapeType: 'circle' | 'square' | 'triangle' | 'star'
  color: string
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
}

// 5. Template: Sort (Phân loại vào giỏ)
export interface SortBucket {
  id: string
  label: string
  color: string
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

export type AnyActivityData =
  | ExploreActivityData
  | ListenPickActivityData
  | MatchActivityData
  | TapCountActivityData
  | SortActivityData
