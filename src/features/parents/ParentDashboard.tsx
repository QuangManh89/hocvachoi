import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  Settings,
  X,
  Star,
  BookOpen,
  Clock,
  Download,
  Upload,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Moon,
  Sparkles,
  AlertCircle,
  Music,
  Printer,
  Calendar,
  RotateCw,
  Tablet,
  Flame,
  Check,
  Heart,
  Award,
} from 'lucide-react'
import { db, type Profile } from '@/core/storage/db'
import { ALPHABET_GROUPS, allActivities } from '@/content/activities'
import { downloadBackupFile, restoreBackupData } from '@/core/storage/backupService'
import { audioService } from '@/core/audio/AudioService'

interface ParentDashboardProps {
  profile: Profile
  onClose: () => void
  onProfileChange: (updated: Profile) => void
}

export interface WeeklyReportData {
  dateRangeText: string
  totalMinutes: number
  avgMinutesPerDay: number
  activeDaysCount: number
  totalRuns: number
  masteredNumbers: string[]
  masteredLetters: string[]
  masteredShapesColors: string[]
  learningItems: string[]
}

export interface PlayTogetherSuggestion {
  id: string
  icon: string
  title: string
  category: 'color_shape' | 'letter_song' | 'number_life' | 'body_emotion'
  categoryLabel: string
  badgeColor: string
  action: string
  benefit: string
}

const PLAY_TOGETHER_IDEAS: PlayTogetherSuggestion[] = [
  {
    id: 'pt_1',
    icon: '🔴',
    title: 'Thợ Săn Sắc Màu Quanh Nhà',
    category: 'color_shape',
    categoryLabel: 'Màu Sắc & Đời Sống',
    badgeColor: 'bg-red-100 text-red-700 border-red-300',
    action: 'Ba mẹ hô to: "Pikachu nhờ bé tìm 3 đồ vật màu đỏ trong phòng khách!". Cùng bé chạy đi tìm chiếc gối, quả táo, hay chiếc áo màu đỏ.',
    benefit: 'Chuyển hóa nhận biết màu sắc từ màn hình sang không gian thực tế 3D.',
  },
  {
    id: 'pt_2',
    icon: '🎵',
    title: 'Hát Bài "Kìa Con Bướm Vàng"',
    category: 'letter_song',
    categoryLabel: 'Âm Nhạc & Chữ Cái',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
    action: 'Cùng bé hát vang bài "Kìa con bướm vàng" và vỗ tay nhịp nhàng. Khi hát đến từ "Vàng", "Bay", ba mẹ và bé cùng vỗ tay thật to!',
    benefit: 'Rèn luyện ngữ điệu cao thấp của tiếng Việt và kích thích thính giác.',
  },
  {
    id: 'pt_3',
    icon: '🥄',
    title: 'Bé Giúp Mẹ Đếm Thìa Đũa',
    category: 'number_life',
    categoryLabel: 'Số Lượng Thực Tế',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    action: 'Trước giờ ăn, nhờ bé: "Bé lấy giúp mẹ 3 chiếc thìa cho cả nhà nhé!". Cùng bé chạm đếm từng chiếc: "Một, hai, ba!".',
    benefit: 'Hình thành khái niệm số lượng gắn liền với sinh hoạt gia đình.',
  },
  {
    id: 'pt_4',
    icon: '🏠',
    title: 'Lâu Đài Hình Học Từ Chăn Gối',
    category: 'color_shape',
    categoryLabel: 'Hình Dạng & Không Gian',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    action: 'Dùng gối vuông làm tường, chăn tam giác làm mái nhà. Ba mẹ hỏi: "Ngôi nhà của Pikachu có mái hình gì nhỉ?" để bé trả lời.',
    benefit: 'Phát triển tư duy hình học và kích thích trí tưởng tượng không gian.',
  },
  {
    id: 'pt_5',
    icon: '🌾',
    title: 'Vẽ Nét Chữ Trên Đĩa Bột',
    category: 'letter_song',
    categoryLabel: 'Vận Động Tinh & Chữ Cái',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
    action: 'Đổ một lớp mỏng bột mì lên đĩa phẳng. Ba mẹ dùng ngón tay vẽ chữ A hoặc O, sau đó bé vẽ đè lên hoặc lắc nhẹ đĩa để vẽ chữ mới.',
    benefit: 'Cảm giác xúc giác đầu ngón tay giúp não bộ ghi nhớ mặt chữ sâu hơn.',
  },
  {
    id: 'pt_6',
    icon: '🍇',
    title: 'Đĩa Trái Cây Đếm Ngon Lành',
    category: 'number_life',
    categoryLabel: 'Số Lượng & Xúc Giác',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-300',
    action: 'Xếp 5 quả nho hoặc múi quýt lên đĩa. Mẹ bảo: "Bé ăn 1 quả, còn mấy quả nào?". Cùng bé đếm lại số quả còn lại.',
    benefit: 'Hình thành khái niệm thêm - bớt số lượng tự nhiên không áp lực.',
  },
  {
    id: 'pt_7',
    icon: '🐰',
    title: 'Đoán Cảm Xúc Cùng Bé',
    category: 'body_emotion',
    categoryLabel: 'Cảm Xúc & Ngôn Ngữ',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-300',
    action: 'Mẹ làm điệu bộ Pikachu cười tít mắt rồi hỏi: "Mẹ đang vui hay đang buồn ngủ?". Sau đó tới lượt bé làm mặt cười hoặc ngạc nhiên.',
    benefit: 'Phát triển trí tuệ cảm xúc (EQ) và khả năng biểu đạt cảm xúc.',
  },
  {
    id: 'pt_8',
    icon: '🔍',
    title: 'Trò Chơi "Tôi Nhìn Thấy..."',
    category: 'color_shape',
    categoryLabel: 'Quan Sát & Từ Vựng',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-300',
    action: 'Ba mẹ nói: "Tôi nhìn thấy một vật hình tròn màu vàng trên tường". Bé sẽ đảo mắt tìm chiếc đồng hồ tròn!',
    benefit: 'Rèn luyện khả năng tập trung, lắng nghe gợi ý và tư duy liên tưởng.',
  },
]

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  onClose,
  onProfileChange,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'alphabet' | 'limits' | 'backup' | 'play_cards'>('progress')
  const [totalStars, setTotalStars] = useState(0)
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [unlockedGroups, setUnlockedGroups] = useState<number[]>([1])
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState<number>(20)
  const [quietHoursEnabled, setQuietHoursEnabled] = useState<boolean>(false)
  const [quietHoursStart, setQuietHoursStart] = useState<string>('21:00')
  const [quietHoursEnd, setQuietHoursEnd] = useState<string>('07:00')
  const [isBgmEnabled, setIsBgmEnabled] = useState<boolean>(true)
  const [storageInfo, setStorageInfo] = useState<{ isPersisted: boolean; usageMb: string } | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Báo cáo tuần & Gợi ý chơi cùng con
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData | null>(null)
  const [selectedIdeaIndices, setSelectedIdeaIndices] = useState<number[]>([0, 1, 2])
  const [hasPlayedToday, setHasPlayedToday] = useState(false)

  const checkStoragePersistence = async () => {
    if (navigator.storage && navigator.storage.persisted) {
      const isPersisted = await navigator.storage.persisted()
      let usageMb = '0'
      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate()
        if (estimate.usage) {
          usageMb = (estimate.usage / (1024 * 1024)).toFixed(2)
        }
      }
      setStorageInfo({ isPersisted, usageMb })
    }
  }

  const loadWeeklyReportData = async (profId: string) => {
    try {
      const now = Date.now()
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

      const startDate = new Date(sevenDaysAgo)
      const endDate = new Date(now)
      const pad = (n: number) => n.toString().padStart(2, '0')
      const dateRangeText = `${pad(startDate.getDate())}/${pad(startDate.getMonth() + 1)} - ${pad(endDate.getDate())}/${pad(endDate.getMonth() + 1)}/${endDate.getFullYear()}`

      const runs = await db.activityRuns
        .where('profileId')
        .equals(profId)
        .filter((r) => r.startedAt >= sevenDaysAgo)
        .toArray()

      const activeDates = new Set<string>()
      let totalDurationMs = 0
      runs.forEach((r) => {
        const d = new Date(r.startedAt).toISOString().split('T')[0]
        activeDates.add(d)
        totalDurationMs += r.durationMs && r.durationMs > 0 ? r.durationMs : 45000
      })

      const totalMinutes = Math.max(runs.length > 0 ? 1 : 0, Math.round(totalDurationMs / 60000))
      const activeDaysCount = activeDates.size
      const avgMinutesPerDay = activeDaysCount > 0 ? Math.round(totalMinutes / activeDaysCount) : (runs.length > 0 ? 1 : 0)

      const masteries = await db.itemMastery
        .where('profileId')
        .equals(profId)
        .toArray()

      const masteredNumbers: string[] = []
      const masteredLetters: string[] = []
      const masteredShapesColors: string[] = []
      const learningItems: string[] = []

      masteries.forEach((m) => {
        const isStrong = m.level >= 2 || m.streak >= 2
        const idLower = m.itemId.toLowerCase()

        if (idLower.includes('num_') || idLower.startsWith('n_')) {
          const match = idLower.match(/\d+/)
          const label = match ? `Số ${match[0]}` : m.itemId
          if (isStrong) masteredNumbers.push(label)
          else learningItems.push(label)
        } else if (idLower.includes('let_') || idLower.startsWith('l_')) {
          const char = idLower
            .replace(/q_let_|l_/, '')
            .replace('_cir', '')
            .replace('_horn', '')
            .replace('_breve', '')
            .toUpperCase()
          const label = `Chữ ${char}`
          if (isStrong) masteredLetters.push(label)
          else learningItems.push(label)
        } else if (
          idLower.includes('shape') ||
          idLower.includes('color') ||
          idLower.startsWith('c_') ||
          idLower.startsWith('sh_')
        ) {
          let label = 'Hình Khối'
          if (idLower.includes('red') || idLower.includes('do')) label = 'Màu Đỏ'
          else if (idLower.includes('yellow') || idLower.includes('vang')) label = 'Màu Vàng'
          else if (idLower.includes('blue') || idLower.includes('xanh_duong')) label = 'Màu Xanh'
          else if (idLower.includes('green') || idLower.includes('xanh_la')) label = 'Màu Xanh Lá'
          else if (idLower.includes('circle') || idLower.includes('tron')) label = 'Hình Tròn'
          else if (idLower.includes('square') || idLower.includes('vuong')) label = 'Hình Vuông'
          else if (idLower.includes('triangle') || idLower.includes('tam_giac')) label = 'Hình Tam Giác'
          else if (idLower.includes('rectangle') || idLower.includes('chu_nhat')) label = 'Hình Chữ Nhật'
          else if (idLower.includes('heart') || idLower.includes('trai_tim')) label = 'Hình Trái Tim'
          else if (idLower.includes('star') || idLower.includes('ngoi_sao')) label = 'Ngôi Sao'

          if (isStrong) masteredShapesColors.push(label)
          else learningItems.push(label)
        }
      })

      masteredNumbers.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0
        return numA - numB
      })

      setWeeklyReport({
        dateRangeText,
        totalMinutes,
        avgMinutesPerDay,
        activeDaysCount,
        totalRuns: runs.length,
        masteredNumbers: Array.from(new Set(masteredNumbers)),
        masteredLetters: Array.from(new Set(masteredLetters)),
        masteredShapesColors: Array.from(new Set(masteredShapesColors)),
        learningItems: Array.from(new Set(learningItems)),
      })
    } catch (err) {
      console.warn('Lỗi nạp báo cáo tuần:', err)
    }
  }

  const handleShuffleIdeas = () => {
    const allIndices = Array.from({ length: PLAY_TOGETHER_IDEAS.length }, (_, i) => i)
    const shuffled = allIndices.sort(() => 0.5 - Math.random())
    setSelectedIdeaIndices(shuffled.slice(0, 3))
  }

  const handleMarkPlayedTogether = async () => {
    const todayStr = new Date().toISOString().split('T')[0]
    await db.settings.put({ key: 'lastParentBondingDate', value: todayStr })
    setHasPlayedToday(true)
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
    })
    setStatusMessage('Tuyệt vời! Thời gian tương tác trực tiếp là món quà quý giá nhất cho bé yêu ❤️')
  }

  // Nạp dữ liệu cấu hình và tiến trình từ Dexie
  useEffect(() => {
    // 1. Sao & Hoạt động hoàn thành
    db.activityRuns.toArray().then((runs) => {
      const completed = runs.filter((r) => r.completed).map((r) => r.activityId)
      setCompletedActivities(Array.from(new Set(completed)))
      setTotalStars(runs.filter((r) => r.completed).length)
    })

    // 2. Cài đặt nhóm chữ cái
    db.settings.get('unlockedAlphabetGroups').then((s) => {
      if (s?.value) setUnlockedGroups(s.value)
    })

    // 3. Cài đặt thời gian
    db.settings.get('dailyTimeLimitMinutes').then((s) => {
      if (s?.value) setDailyLimitMinutes(s.value)
    })

    db.settings.get('quietHours').then((s) => {
      if (s?.value) {
        setQuietHoursEnabled(s.value.enabled)
        setQuietHoursStart(s.value.start || '21:00')
        setQuietHoursEnd(s.value.end || '07:00')
      }
    })

    // 4. Cài đặt nhạc nền BGM
    db.settings.get('bgmEnabled').then((s) => {
      if (s !== undefined && s.value !== undefined) {
        setIsBgmEnabled(Boolean(s.value))
      }
    })

    // 5. Kiểm tra tương tác chơi cùng con hôm nay
    const todayStr = new Date().toISOString().split('T')[0]
    db.settings.get('lastParentBondingDate').then((s) => {
      if (s?.value === todayStr) {
        setHasPlayedToday(true)
      }
    })

    // 6. Tính toán Báo cáo tuần
    loadWeeklyReportData(profile.id)

    // 7. Kiểm tra lưu trữ bền vững
    checkStoragePersistence()
  }, [profile.id])

  const handleRequestPersistence = async () => {
    if (navigator.storage && navigator.storage.persist) {
      const persisted = await navigator.storage.persist()
      if (persisted) {
        setStatusMessage('Đã cấp quyền lưu trữ bền vững thành công!')
      } else {
        setStatusMessage('Trình duyệt chưa cho phép lưu trữ bền vững.')
      }
      checkStoragePersistence()
    }
  }

  const handleToggleGroup = async (groupId: number) => {
    if (groupId === 1) return // Nhóm 1 luôn mở mặc định
    let next: number[]
    if (unlockedGroups.includes(groupId)) {
      next = unlockedGroups.filter((g) => g !== groupId)
    } else {
      next = [...unlockedGroups, groupId].sort((a, b) => a - b)
    }
    setUnlockedGroups(next)
    await db.settings.put({ key: 'unlockedAlphabetGroups', value: next })
  }

  const handleUpdateDailyLimit = async (minutes: number) => {
    setDailyLimitMinutes(minutes)
    await db.settings.put({ key: 'dailyTimeLimitMinutes', value: minutes })
  }

  const handleToggleQuietHours = async (enabled: boolean) => {
    setQuietHoursEnabled(enabled)
    await db.settings.put({
      key: 'quietHours',
      value: { enabled, start: quietHoursStart, end: quietHoursEnd },
    })
  }

  const handleToggleBgm = async (enabled: boolean) => {
    setIsBgmEnabled(enabled)
    audioService.setBGMEnabled(enabled)
    await db.settings.put({ key: 'bgmEnabled', value: enabled })
  }

  const handleBackupDownload = async () => {
    try {
      await downloadBackupFile()
      setStatusMessage('Đã xuất file sao lưu (.hvc) thành công!')
    } catch (e) {
      console.error(e)
      setStatusMessage('Lỗi khi xuất file sao lưu.')
    }
  }

  const handleFileRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const result = await restoreBackupData(file)
    setStatusMessage(result.message)
    if (result.success) {
      // Làm mới dữ liệu hiển thị
      const prof = await db.ensureDefaultProfile()
      onProfileChange(prof)
      const runs = await db.activityRuns.toArray()
      setTotalStars(runs.filter((r) => r.completed).length)
      const s = await db.settings.get('unlockedAlphabetGroups')
      if (s?.value) setUnlockedGroups(s.value)
    }
  }

  // Thống kê theo module
  const colorsCount = allActivities.filter((a) => a.module === 'colors_shapes').length
  const colorsDone = completedActivities.filter((id) => id.startsWith('colors_') || id.startsWith('shapes_')).length

  const numbersCount = allActivities.filter((a) => a.module === 'numbers').length
  const numbersDone = completedActivities.filter((id) => id.startsWith('numbers_')).length

  const alphabetCount = allActivities.filter((a) => a.module === 'alphabet').length
  const alphabetDone = completedActivities.filter((id) => id.startsWith('alphabet_')).length

  return (
    <div className="fixed inset-0 z-50 bg-[#FFF8EC] flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header Khu Vực Phụ Huynh */}
      <header className="bg-white border-b-2 border-[#5A3E36]/15 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#7ED6C1]/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-[#2E7D32]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#5A3E36] leading-tight">
              Khu Vực Phụ Huynh
            </h2>
            <p className="text-xs text-[#8C6D62]">
              Học Và Chơi cùng Pikachu • {profile.nickname} ({profile.ageBand} tuổi)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-2xl bg-[#FFF8EC] border-2 border-[#5A3E36]/20 active:scale-95 transition-transform"
          title="Đóng"
        >
          <X className="w-6 h-6 text-[#5A3E36]" />
        </button>
      </header>

      {/* Thông báo trạng thái nếu có */}
      {statusMessage && (
        <div className="bg-[#7ED6C1] text-[#1B5E20] px-4 py-2 font-bold text-xs flex justify-between items-center animate-fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="underline ml-2">
            Đóng
          </button>
        </div>
      )}

      {/* 2. Menu các Tab chức năng */}
      <div className="bg-white/60 border-b border-[#5A3E36]/10 px-4 py-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
            activeTab === 'progress'
              ? 'bg-[#FED000] text-[#5A3E36] shadow-sm border-2 border-[#5A3E36]'
              : 'text-[#8C6D62] hover:bg-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Tiến Trình ({completedActivities.length}/30)</span>
        </button>

        <button
          onClick={() => setActiveTab('alphabet')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
            activeTab === 'alphabet'
              ? 'bg-[#FED000] text-[#5A3E36] shadow-sm border-2 border-[#5A3E36]'
              : 'text-[#8C6D62] hover:bg-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bảng Chữ Cái (5 Nhóm)</span>
        </button>

        <button
          onClick={() => setActiveTab('limits')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
            activeTab === 'limits'
              ? 'bg-[#FED000] text-[#5A3E36] shadow-sm border-2 border-[#5A3E36]'
              : 'text-[#8C6D62] hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Thời Gian & Giờ Ngủ</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
            activeTab === 'backup'
              ? 'bg-[#FED000] text-[#5A3E36] shadow-sm border-2 border-[#5A3E36]'
              : 'text-[#8C6D62] hover:bg-white'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Sao Lưu & Bộ Nhớ</span>
        </button>

        <button
          onClick={() => setActiveTab('play_cards')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
            activeTab === 'play_cards'
              ? 'bg-[#FED000] text-[#5A3E36] shadow-sm border-2 border-[#5A3E36]'
              : 'text-[#8C6D62] hover:bg-white'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Thẻ Chơi Cùng Con (In 🖨️)</span>
        </button>
      </div>

      {/* 3. Nội Dung Tab */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-3xl mx-auto w-full space-y-4">
        {/* --- TAB 1: TIẾN TRÌNH & THỐNG KÊ & BÁO CÁO TUẦN --- */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* 1. KHỐI BÁO CÁO TUẦN CHO PHỤ HUYNH */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#5A3E36]/15 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="font-black text-lg text-[#5A3E36]">Báo Cáo Tuần Của Bé {profile.nickname}</h3>
                  </div>
                  <p className="text-xs text-[#8C6D62] mt-0.5">
                    Tổng kết nhịp độ học tập và mức độ ghi nhớ 7 ngày qua
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FFF8EC] px-3 py-1.5 rounded-full border border-[#5A3E36]/20 text-xs font-bold text-[#8C6D62]">
                  <Calendar className="w-3.5 h-3.5 text-[#5A3E36]" />
                  <span>{weeklyReport?.dateRangeText || '7 ngày gần nhất'}</span>
                </div>
              </div>

              {/* 3 Thống kê trọng tâm: Thời gian trung bình, ngày chăm học, phiên hoàn thành */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#448AFF]/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#1565C0]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#5A3E36]">
                      {weeklyReport?.avgMinutesPerDay || 0} phút<span className="text-xs font-bold text-[#8C6D62]">/ngày</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#2E7D32]">
                      {(weeklyReport?.avgMinutesPerDay || 0) <= 20 ? '✅ Nhịp độ rất lý tưởng' : '⚠️ Vượt 20 phút/ngày'}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF7043]/20 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 text-[#D84315]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#5A3E36]">
                      {weeklyReport?.activeDaysCount || 0} / 7 <span className="text-xs font-bold text-[#8C6D62]">ngày</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#8C6D62]">
                      {(weeklyReport?.activeDaysCount || 0) >= 3 ? '🔥 Bé học rất chăm chỉ' : 'Bé đang tạo thói quen'}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FED000]/30 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-[#F57F17]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#5A3E36]">
                      {weeklyReport?.totalRuns || 0} <span className="text-xs font-bold text-[#8C6D62]">bài học</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#8C6D62]">
                      Đã hoàn thành xuất sắc
                    </div>
                  </div>
                </div>
              </div>

              {/* Những chữ / số bé đã nhớ vững */}
              <div className="pt-1">
                <div className="font-extrabold text-xs text-[#5A3E36] mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#FED000] text-[#5A3E36]" />
                  <span>Chữ, Số & Kiến Thức Bé Đã Nhớ Vững (Mastered):</span>
                </div>

                {(!weeklyReport ||
                  (weeklyReport.masteredNumbers.length === 0 &&
                    weeklyReport.masteredLetters.length === 0 &&
                    weeklyReport.masteredShapesColors.length === 0)) ? (
                  <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-dashed border-[#5A3E36]/30 text-xs text-[#8C6D62] text-center">
                    Bé đang trong giai đoạn làm quen và trải nghiệm! Khi bé trả lời đúng liên tiếp trong các phiên 15 câu, danh sách chữ và số bé nhớ vững sẽ tự động cập nhật tại đây ⭐.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {weeklyReport.masteredNumbers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#8C6D62] bg-[#5A3E36]/10 px-2 py-0.5 rounded-lg">🔢 Con số:</span>
                        {weeklyReport.masteredNumbers.map((num) => (
                          <span
                            key={num}
                            className="inline-flex items-center gap-1 text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xl shadow-xs"
                          >
                            <span>{num}</span>
                            <span className="text-[10px] text-amber-500">★★★</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {weeklyReport.masteredLetters.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#8C6D62] bg-[#5A3E36]/10 px-2 py-0.5 rounded-lg">🔤 Chữ cái:</span>
                        {weeklyReport.masteredLetters.map((letItem) => (
                          <span
                            key={letItem}
                            className="inline-flex items-center gap-1 text-xs font-black bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-xl shadow-xs"
                          >
                            <span>{letItem}</span>
                            <span className="text-[10px] text-amber-500">★★★</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {weeklyReport.masteredShapesColors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#8C6D62] bg-[#5A3E36]/10 px-2 py-0.5 rounded-lg">🎨 Màu & Hình:</span>
                        {weeklyReport.masteredShapesColors.map((sc) => (
                          <span
                            key={sc}
                            className="inline-flex items-center gap-1 text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl shadow-xs"
                          >
                            <span>{sc}</span>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 2. KHỐI 3 GỢI Ý "CHƠI CÙNG CON" HÔM NAY (PARENT-CHILD BONDING) */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#FED000] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-black text-base text-[#5A3E36] flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-[#FF5252] text-[#FF5252]" />
                    <span>3 Gợi Ý "Chơi Cùng Con" Hôm Nay</span>
                  </h3>
                  <p className="text-xs text-[#8C6D62] mt-0.5">
                    Ý tưởng tương tác thực tế giữa ba mẹ và bé sau giờ học, không cần màn hình
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffleIdeas}
                    className="px-3 py-1.5 rounded-xl border border-[#5A3E36]/20 bg-[#FFF8EC] text-xs font-bold text-[#5A3E36] flex items-center gap-1.5 active:scale-95 transition-transform hover:bg-[#FED000]/20"
                    title="Đổi 3 gợi ý khác"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Đổi gợi ý khác</span>
                  </button>

                  <button
                    onClick={handleMarkPlayedTogether}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all ${
                      hasPlayedToday
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-[#FED000] text-[#5A3E36] border-[#5A3E36]'
                    }`}
                  >
                    {hasPlayedToday ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span>Đã chơi hôm nay ❤️</span>
                      </>
                    ) : (
                      <span>Đánh dấu đã chơi 🎉</span>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Thẻ Gợi Ý */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {selectedIdeaIndices.map((idx) => {
                  const idea = PLAY_TOGETHER_IDEAS[idx]
                  if (!idea) return null
                  return (
                    <div
                      key={idea.id}
                      className="bg-[#FFF8EC] p-3.5 rounded-2xl border-2 border-[#5A3E36]/15 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-2xl">{idea.icon}</span>
                          <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full ${idea.badgeColor}`}>
                            {idea.categoryLabel}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-[#5A3E36] mb-1 leading-snug">{idea.title}</h4>
                        <p className="text-xs text-[#5A3E36] leading-relaxed mb-2">
                          👉 {idea.action}
                        </p>
                      </div>
                      <div className="text-[10px] font-semibold text-[#8C6D62] italic border-t border-[#5A3E36]/10 pt-1.5">
                        🎯 {idea.benefit}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Khối tổng quan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm text-center">
                <span className="text-2xl">⭐</span>
                <div className="text-2xl font-black text-[#5A3E36] mt-1">{totalStars}</div>
                <div className="text-xs font-bold text-[#8C6D62]">Tổng Sao Đạt Được</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm text-center">
                <span className="text-2xl">🌈</span>
                <div className="text-2xl font-black text-[#5A3E36] mt-1">
                  {colorsDone}/{colorsCount}
                </div>
                <div className="text-xs font-bold text-[#8C6D62]">Màu & Hình</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm text-center">
                <span className="text-2xl">🔢</span>
                <div className="text-2xl font-black text-[#5A3E36] mt-1">
                  {numbersDone}/{numbersCount}
                </div>
                <div className="text-xs font-bold text-[#8C6D62]">Con Số</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm text-center">
                <span className="text-2xl">🔤</span>
                <div className="text-2xl font-black text-[#5A3E36] mt-1">
                  {alphabetDone}/{alphabetCount}
                </div>
                <div className="text-xs font-bold text-[#8C6D62]">Chữ Cái</div>
              </div>
            </div>

            {/* Chi tiết từng module */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FED000]" />
                Tiến độ làm chủ kiến thức của bé
              </h3>
              <p className="text-xs text-[#8C6D62] leading-relaxed">
                Ứng dụng áp dụng phương pháp lặp lại ngắt quãng (Spaced Repetition). Mỗi lần bé hoàn thành câu hỏi, Pikachu ghi nhận để tự động ôn luyện các từ bé hay nhầm và tạo câu hỏi mới.
              </p>

              <div className="space-y-2 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span>Màu sắc & Hình dạng</span>
                    <span>{Math.round((colorsDone / colorsCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#FFF8EC] h-3 rounded-full overflow-hidden border border-[#5A3E36]/20">
                    <div
                      className="bg-[#7ED6C1] h-full rounded-full transition-all"
                      style={{ width: `${(colorsDone / colorsCount) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span>Con số & Đếm (1 - 10)</span>
                    <span>{Math.round((numbersDone / numbersCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#FFF8EC] h-3 rounded-full overflow-hidden border border-[#5A3E36]/20">
                    <div
                      className="bg-[#FFD25E] h-full rounded-full transition-all"
                      style={{ width: `${(numbersDone / numbersCount) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span>Bảng chữ cái tiếng Việt (29 chữ)</span>
                    <span>{Math.round((alphabetDone / alphabetCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#FFF8EC] h-3 rounded-full overflow-hidden border border-[#5A3E36]/20">
                    <div
                      className="bg-[#FF8A65] h-full rounded-full transition-all"
                      style={{ width: `${(alphabetDone / alphabetCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: QUẢN LÝ 5 NHÓM CHỮ CÁI --- */}
        {activeTab === 'alphabet' && (
          <div className="space-y-4">
            <div className="bg-[#FFF1D6] p-4 rounded-3xl border-2 border-[#F6B36B] text-xs text-[#6B514A] leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#E65100] shrink-0 mt-0.5" />
              <div>
                <strong>Lộ trình học theo từng bước:</strong> Bé 3 tuổi nên bắt đầu với <strong>Nhóm 1</strong> (các nguyên âm đơn giản). Khi bé đã nhớ và phát âm tốt, phụ huynh có thể mở các nhóm tiếp theo.
              </div>
            </div>

            <div className="space-y-3">
              {ALPHABET_GROUPS.map((group) => {
                const isUnlocked = unlockedGroups.includes(group.id)
                const isDefault = group.id === 1

                return (
                  <div
                    key={group.id}
                    className={`p-4 rounded-3xl border-3 transition-all flex items-center justify-between ${
                      isUnlocked
                        ? 'bg-white border-[#5A3E36]/20 shadow-sm'
                        : 'bg-[#F5EFE6]/70 border-dashed border-[#5A3E36]/20 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-[#5A3E36]">{group.name}</span>
                        {isDefault && (
                          <span className="bg-[#7ED6C1] text-[#1B5E20] text-[10px] font-black px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-[#FF5252] mt-0.5 tracking-wider">
                        {group.letters}
                      </div>
                      <div className="text-xs text-[#8C6D62] mt-0.5">{group.desc}</div>
                    </div>

                    <div>
                      {isDefault ? (
                        <div className="flex items-center gap-1 text-xs font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-300">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Luôn mở</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleGroup(group.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black border-2 flex items-center gap-1.5 active:scale-95 shadow-sm transition-all ${
                            isUnlocked
                              ? 'bg-[#7ED6C1] text-[#1B5E20] border-[#2E7D32]'
                              : 'bg-white text-[#5A3E36] border-[#5A3E36]/30'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <Unlock className="w-4 h-4" />
                              <span>Đã mở</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-[#8C6D62]" />
                              <span>Mở khóa</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* --- TAB 3: THỜI GIAN & GIỜ NGHỈ NGƠI --- */}
        {activeTab === 'limits' && (
          <div className="space-y-4">
            {/* Giới hạn thời gian chơi hàng ngày */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm">
              <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#448AFF]" />
                Giới hạn thời gian chơi mỗi ngày
              </h3>
              <p className="text-xs text-[#8C6D62] mb-4 leading-relaxed">
                Bảo vệ mắt cho bé 3 tuổi. Khi hết thời lượng cài đặt, Pikachu sẽ nhẹ nhàng vươn vai nhắc bé nghỉ ngơi cùng ba mẹ.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[15, 20, 30, 0].map((mins) => {
                  const isSelected = dailyLimitMinutes === mins
                  return (
                    <button
                      key={mins}
                      onClick={() => handleUpdateDailyLimit(mins)}
                      className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm border-3 transition-all ${
                        isSelected
                          ? 'bg-[#FED000] border-[#5A3E36] text-[#5A3E36] shadow-sm'
                          : 'bg-[#FFF8EC] border-[#5A3E36]/15 text-[#8C6D62]'
                      }`}
                    >
                      {mins === 0 ? 'Không giới hạn' : `${mins} Phút`}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Chế độ giờ yên lặng / Giờ đi ngủ */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#AB47BC]" />
                  Chế độ Giờ Đi Ngủ (Quiet Hours)
                </h3>
                <button
                  onClick={() => handleToggleQuietHours(!quietHoursEnabled)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border-2 transition-all ${
                    quietHoursEnabled
                      ? 'bg-[#7ED6C1] text-[#1B5E20] border-[#2E7D32]'
                      : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}
                >
                  {quietHoursEnabled ? 'Đang bật' : 'Đang tắt'}
                </button>
              </div>

              <p className="text-xs text-[#8C6D62] mb-3 leading-relaxed">
                Trong khung giờ đi ngủ (từ {quietHoursStart} đến {quietHoursEnd}), Pikachu sẽ nằm ngủ say và phát lời ru nhẹ nhàng, nhắc bé đã đến giờ ngủ.
              </p>

              {quietHoursEnabled && (
                <div className="flex items-center gap-3 bg-[#FFF8EC] p-3 rounded-2xl border border-[#5A3E36]/15 text-xs font-bold">
                  <span>Khung giờ ngủ:</span>
                  <span className="bg-white px-3 py-1 rounded-xl border border-[#5A3E36]/20 font-black">
                    {quietHoursStart} - {quietHoursEnd}
                  </span>
                </div>
              )}
            </div>

            {/* Nhạc nền thư giãn nhẹ nhàng (BGM) */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#2E7D32]" />
                  Nhạc nền êm dịu (Background Music)
                </h3>
                <button
                  onClick={() => handleToggleBgm(!isBgmEnabled)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border-2 transition-all ${
                    isBgmEnabled
                      ? 'bg-[#7ED6C1] text-[#1B5E20] border-[#2E7D32]'
                      : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}
                >
                  {isBgmEnabled ? 'Đang bật' : 'Đang tắt'}
                </button>
              </div>

              <p className="text-xs text-[#8C6D62] leading-relaxed">
                Nhạc Kalimba mộc nhẹ nhàng giúp bé thư giãn và tập trung. Khi Pikachu nói, nhạc sẽ tự động nhỏ lại để bé nghe rõ từng từ ngữ.
              </p>
            </div>

            {/* Hướng dẫn cài đặt Kiosk Toàn Màn Hình cho iPad */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36] shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                <Tablet className="w-5 h-5 text-[#448AFF]" />
                Cài Đặt Chế Độ Toàn Màn Hình Cho iPad (Kiosk PWA)
              </h3>
              <p className="text-xs text-[#8C6D62] leading-relaxed">
                Biến iPad thành máy học chuyên biệt cho bé, chạy toàn màn hình không có thanh địa chỉ Safari và ngăn bé bấm nhầm thoát ra ngoài.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 text-xs text-[#5A3E36] space-y-1.5">
                  <div className="font-black text-sm flex items-center gap-1.5 text-[#5A3E36]">
                    <span>1️⃣ Thêm vào Màn hình chính</span>
                  </div>
                  <p className="leading-relaxed">
                    Mở trình duyệt <strong>Safari trên iPad</strong>, bấm nút <strong>Chia Sẻ (Share)</strong> ở góc trên ➔ Chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                  </p>
                  <p className="text-[11px] text-[#2E7D32] font-bold">
                    ✅ Icon sắc nét Retina sẽ xuất hiện ngoài màn hình, mở app toàn màn hình 100%!
                  </p>
                </div>

                <div className="bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 text-xs text-[#5A3E36] space-y-1.5">
                  <div className="font-black text-sm flex items-center gap-1.5 text-[#5A3E36]">
                    <span>2️⃣ Khóa màn hình Guided Access</span>
                  </div>
                  <p className="leading-relaxed">
                    Vào <strong>Cài đặt iPad ➔ Trợ năng ➔ Truy cập được hướng dẫn (Guided Access)</strong> và Bật lên. Khi vào app, <strong>bấm nút Nguồn 3 lần</strong>.
                  </p>
                  <p className="text-[11px] text-[#1565C0] font-bold">
                    🛡️ Bé sẽ không thể vuốt thoát ra YouTube, Safari hay xóa nhầm ứng dụng!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: SAO LƯU & BỘ NHỚ --- */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            {/* Sao lưu dữ liệu */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#FF7043]" />
                Sao lưu & Khôi phục dữ liệu (.hvc)
              </h3>
              <p className="text-xs text-[#8C6D62] leading-relaxed">
                Toàn bộ tiến trình học, số sao, hồ sơ bé được lưu hoàn toàn trên thiết bị của bạn (IndexedDB). Hãy tải file sao lưu định kỳ để không lo mất dữ liệu khi đổi máy iPad.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleBackupDownload}
                  className="flex-1 btn-kid py-3.5 px-4 bg-[#7ED6C1] text-[#1B5E20] rounded-2xl font-black text-sm border-3 border-[#2E7D32] flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  <span>Xuất File Sao Lưu (.hvc)</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 btn-kid py-3.5 px-4 bg-white text-[#5A3E36] rounded-2xl font-black text-sm border-3 border-[#5A3E36] flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                  <span>Khôi Phục Từ File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".hvc,.json"
                  className="hidden"
                  onChange={handleFileRestore}
                />
              </div>
            </div>

            {/* Lưu trữ bền vững iPad Safari */}
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36]/15 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-[#5A3E36] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
                Lưu trữ bền vững iPad Safari (Persistent Storage)
              </h3>
              <p className="text-xs text-[#8C6D62] leading-relaxed">
                Yêu cầu trình duyệt iOS Safari bảo vệ bộ nhớ của ứng dụng, không tự ý giải phóng dữ liệu khi thiết bị sắp đầy bộ nhớ.
              </p>

              <div className="flex justify-between items-center bg-[#FFF8EC] p-3.5 rounded-2xl border border-[#5A3E36]/15 text-xs font-bold">
                <div>
                  <div>Trạng thái: {storageInfo?.isPersisted ? '✅ Đã bảo vệ bền vững' : '⚠️ Tiêu chuẩn'}</div>
                  <div className="text-[11px] text-[#8C6D62] mt-0.5">Dung lượng app đã dùng: ~{storageInfo?.usageMb || '0'} MB</div>
                </div>

                {!storageInfo?.isPersisted && (
                  <button
                    onClick={handleRequestPersistence}
                    className="px-3.5 py-2 bg-[#FED000] text-[#5A3E36] font-black rounded-xl border-2 border-[#5A3E36] active:scale-95 shadow-sm"
                  >
                    Bảo vệ ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: THẺ CHƠI CÙNG CON & IN ẤN --- */}
        {activeTab === 'play_cards' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border-3 border-[#5A3E36] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-black text-lg text-[#5A3E36] flex items-center gap-2">
                  <span>🖨️ Thẻ Hoạt Động Chơi Cùng Con</span>
                </h3>
                <p className="text-xs text-[#8C6D62] mt-1">
                  Trò chơi tương tác thực tế giữa ba mẹ và bé gắn liền với bài học. Bấm nút In để in ra giấy A4.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-kid bg-[#FED000] text-[#5A3E36] font-black text-sm px-5 py-2.5 rounded-2xl border-2 border-[#5A3E36] shadow-sm flex items-center gap-2 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>In Ra Giấy (A4)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'card_1',
                  icon: '🍎',
                  title: 'Đếm Trái Cây & Bánh Quy',
                  tag: 'Môn: Số Lượng (1-5)',
                  goal: 'Phát triển cảm nhận lượng qua giác quan nếm và cầm nắm.',
                  howTo: 'Đặt từ 1 đến 5 quả quýt hoặc chiếc bánh quy lên đĩa. Mẹ cùng bé chạm ngón tay vào từng cái rồi đếm to: "Một, Hai, Ba!". Khi đếm xong, bé được thưởng thức món ăn!',
                  color: '#FFEBEE',
                },
                {
                  id: 'card_2',
                  icon: '🌈',
                  title: 'Đi Tìm Sắc Màu Quanh Nhà',
                  tag: 'Môn: Màu Sắc Cơ Bản',
                  goal: 'Nhận biết màu sắc trong môi trường sống thực tế.',
                  howTo: 'Ba mẹ hô to: "Pikachu bảo tìm một món đồ màu ĐỎ trong phòng khách!". Bé sẽ chạy quanh phòng, tìm và chỉ vào món đồ màu đỏ. Tiếp tục với màu Vàng, Xanh...',
                  color: '#FFFDE7',
                },
                {
                  id: 'card_3',
                  icon: '🌾',
                  title: 'Vẽ Nét Chữ Trên Đĩa Bột',
                  tag: 'Môn: Tô Nét & Chữ Cái',
                  goal: 'Luyện vận động tinh ngón tay và nhớ hình dáng chữ.',
                  howTo: 'Đổ một lớp mỏng bột mì hoặc bột gạo lên một chiếc đĩa phẳng. Ba mẹ viết mẫu chữ A hoặc số 1, sau đó bé dùng ngón trỏ vẽ lại. Lắc nhẹ đĩa để xóa và vẽ chữ khác!',
                  color: '#E8F5E9',
                },
                {
                  id: 'card_4',
                  icon: '🏠',
                  title: 'Xây Nhà Bằng Khối Hình',
                  tag: 'Môn: Hình Dạng Cơ Bản',
                  goal: 'Hiểu sự phối hợp giữa các hình học trong cuộc sống.',
                  howTo: 'Dùng giấy bìa cắt thành các hình tam giác, vuông, tròn. Mẹ và bé cùng ghép: Hình vuông làm thân nhà, tam giác làm mái ngói, hình tròn làm ông mặt trời chiếu sáng.',
                  color: '#E3F2FD',
                },
                {
                  id: 'card_5',
                  icon: '🎵',
                  title: 'Đố Vui 5 Dấu Thanh',
                  tag: 'Môn: Dấu Thanh Tiếng Việt',
                  goal: 'Phân biệt cao độ giọng nói và ngữ điệu tiếng Việt.',
                  howTo: 'Ba mẹ đố vui: "Con gì bơi dưới nước có dấu sắc? -> Con Cá!", "Con gì ăn cỏ kêu ù bò có dấu huyền? -> Con Bò!", "Con gì chúa sơn lâm có dấu hỏi? -> Con Hổ!".',
                  color: '#F3E5F5',
                },
                {
                  id: 'card_6',
                  icon: '🖐️',
                  title: 'Soi Bóng Bàn Tay Trên Tường',
                  tag: 'Môn: Ghép Đôi & Hình Bóng',
                  goal: 'Rèn luyện khả năng quan sát không gian và trí tưởng tượng.',
                  howTo: 'Tắt bớt đèn, dùng đèn pin chiếu lên tường. Ba mẹ tạo dáng bàn tay thành con chim đang bay, con thỏ vểnh tai hoặc con chó sủa để bé đoán tên con vật.',
                  color: '#FFF3E0',
                },
              ].map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-4 rounded-3xl border-3 border-[#5A3E36] shadow-sm flex flex-col justify-between"
                  style={{ borderLeftWidth: '8px', borderLeftColor: '#FED000' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{card.icon}</span>
                      <span className="text-[10px] font-black bg-[#5A3E36]/10 px-2 py-0.5 rounded-full text-[#5A3E36]">
                        {card.tag}
                      </span>
                    </div>
                    <h4 className="font-black text-base text-[#5A3E36] mb-1">{card.title}</h4>
                    <p className="text-[11px] font-bold text-[#8C6D62] mb-2 italic">
                      🎯 Mục tiêu: {card.goal}
                    </p>
                    <div className="bg-[#FFF8EC] p-2.5 rounded-xl border border-[#5A3E36]/15 text-xs text-[#5A3E36] leading-relaxed">
                      <strong>👉 Cách chơi:</strong> {card.howTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
export default ParentDashboard
