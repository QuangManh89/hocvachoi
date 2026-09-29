import Dexie, { type Table } from 'dexie'

export interface Profile {
  id: string
  nickname: string
  ageBand: '2-3' | '3-4' | '4-5'
  createdAt: number
}

export interface ActivityRun {
  id?: number
  profileId: string
  activityId: string
  startedAt: number
  durationMs: number
  attempts: number
  hints: number
  hesitations: number
  completed: boolean
}

export interface ItemMastery {
  profileIdItemId: string // [profileId+itemId]
  profileId: string
  itemId: string
  level: number // 0-4
  streak: number
  lastSeenAt: number
  nextReviewAt?: number
}

export interface RewardItem {
  profileIdStickerId: string
  profileId: string
  stickerId: string
  unlockedAt: number
}

export interface SettingItem {
  key: string
  value: any
}

export interface VoiceClip {
  clipId: string
  blob: Blob
  mimeType: string
  durationMs: number
  recordedAt: number
}

export class HocVaChoiDatabase extends Dexie {
  profiles!: Table<Profile, string>
  activityRuns!: Table<ActivityRun, number>
  itemMastery!: Table<ItemMastery, string>
  rewards!: Table<RewardItem, string>
  settings!: Table<SettingItem, string>
  voiceClips!: Table<VoiceClip, string>

  constructor() {
    super('hocvachoi_v1')
    this.version(1).stores({
      profiles: 'id, ageBand, createdAt',
      activityRuns: '++id, profileId, activityId, completed, startedAt',
      itemMastery: 'profileIdItemId, profileId, itemId, level, nextReviewAt',
      rewards: 'profileIdStickerId, profileId, stickerId, unlockedAt',
      settings: 'key',
      voiceClips: 'clipId, recordedAt',
    })
  }

  /**
   * Khởi tạo hồ sơ mặc định cho bé 3 tuổi nếu chưa có
   */
  async ensureDefaultProfile(): Promise<Profile> {
    const existing = await this.profiles.toCollection().first()
    if (existing) return existing

    const defaultProfile: Profile = {
      id: 'profile_default',
      nickname: 'Bé Yêu',
      ageBand: '3-4',
      createdAt: Date.now(),
    }
    await this.profiles.add(defaultProfile)

    // Khởi tạo cài đặt mặc định
    await this.settings.bulkPut([
      { key: 'volume', value: 1.0 },
      { key: 'sessionLimitMinutes', value: 10 },
      { key: 'reducedMotion', value: false },
      { key: 'unlockedAlphabetGroups', value: [1] }, // Mặc định mở nhóm 1
    ])

    return defaultProfile
  }
}

export const db = new HocVaChoiDatabase()
export default db
