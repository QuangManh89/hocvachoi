import { db } from '@/core/storage/db'

export interface DayStamp {
  dateStr: string // YYYY-MM-DD
  dayLabel: string // T2, T3, T4, T5, T6, T7, CN
  dayNum: number // 1 - 31
  isToday: boolean
  isCompleted: boolean
  activitiesCount: number
}

export interface BadgeInfo {
  id: string
  title: string
  desc: string
  icon: string
  isUnlocked: boolean
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  weekStamps: DayStamp[]
  badges: BadgeInfo[]
}

/**
 * Lấy ngày dạng YYYY-MM-DD theo giờ địa phương
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Tính toán chuỗi ngày học liên tiếp và lịch tem tuần
 */
export async function getStreakData(profileId: string): Promise<StreakData> {
  const runs = await db.activityRuns
    .where('profileId')
    .equals(profileId)
    .filter((r) => r.completed)
    .toArray()

  // Tập hợp các ngày đã học và số lượng bài mỗi ngày
  const dateCounts: Record<string, number> = {}
  for (const run of runs) {
    const dStr = formatDateKey(new Date(run.startedAt))
    dateCounts[dStr] = (dateCounts[dStr] || 0) + 1
  }

  const uniqueDateList = Object.keys(dateCounts).sort()
  const totalDaysLearned = uniqueDateList.length

  // Tính Streak hiện tại
  const today = new Date()
  const todayStr = formatDateKey(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = formatDateKey(yesterday)

  let currentStreak = 0
  if (dateCounts[todayStr]) {
    // Có học hôm nay
    currentStreak = 1
    let checkDate = new Date(yesterday)
    while (dateCounts[formatDateKey(checkDate)]) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  } else if (dateCounts[yesterdayStr]) {
    // Chưa học hôm nay nhưng hôm qua có học (chuỗi chưa đứt)
    currentStreak = 1
    let checkDate = new Date(yesterday)
    checkDate.setDate(checkDate.getDate() - 1)
    while (dateCounts[formatDateKey(checkDate)]) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  // Tạo lịch 7 ngày trong tuần hiện tại (Thứ 2 đến Chủ Nhật)
  const dayOfWeek = today.getDay() // 0 = CN, 1 = T2...
  const distanceToMonday = (dayOfWeek + 6) % 7
  const monday = new Date(today)
  monday.setDate(monday.getDate() - distanceToMonday)

  const weekLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const weekStamps: DayStamp[] = []

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday)
    cur.setDate(cur.getDate() + i)
    const curStr = formatDateKey(cur)
    const count = dateCounts[curStr] || 0

    weekStamps.push({
      dateStr: curStr,
      dayLabel: weekLabels[i],
      dayNum: cur.getDate(),
      isToday: curStr === todayStr,
      isCompleted: count > 0,
      activitiesCount: count,
    })
  }

  // Danh hiệu đạt được
  const rewardsCount = await db.rewards.where('profileId').equals(profileId).count()
  const badges: BadgeInfo[] = [
    {
      id: 'streak_1',
      title: 'Khởi Đầu Vui Vẻ',
      desc: 'Hoàn thành ngày học đầu tiên',
      icon: '🌱',
      isUnlocked: totalDaysLearned >= 1,
    },
    {
      id: 'streak_3',
      title: 'Bé Chăm Chỉ',
      desc: 'Học liên tiếp 3 ngày',
      icon: '🥉',
      isUnlocked: currentStreak >= 3,
    },
    {
      id: 'streak_7',
      title: 'Ngôi Sao Kiên Trì',
      desc: 'Học liên tiếp trọn vẹn 7 ngày',
      icon: '🥇',
      isUnlocked: currentStreak >= 7,
    },
    {
      id: 'badge_10_stars',
      title: 'Bàn Tay Khéo Léo',
      desc: 'Đạt từ 10 ngôi sao bài học',
      icon: '⭐',
      isUnlocked: runs.length >= 10,
    },
    {
      id: 'badge_stickers',
      title: 'Nhà Sưu Tập Nhí',
      desc: 'Sở hữu từ 5 nhãn dán đáng yêu',
      icon: '🎁',
      isUnlocked: rewardsCount >= 5,
    },
  ]

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, 1),
    totalDaysLearned,
    weekStamps,
    badges,
  }
}
