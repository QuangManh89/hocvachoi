import React, { useState, useEffect, useRef } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { db, type Profile } from '@/core/storage/db'
import { ALPHABET_GROUPS, allActivities } from '@/content/activities'
import { downloadBackupFile, restoreBackupData } from '@/core/storage/backupService'

interface ParentDashboardProps {
  profile: Profile
  onClose: () => void
  onProfileChange: (updated: Profile) => void
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  onClose,
  onProfileChange,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'alphabet' | 'limits' | 'backup'>('progress')
  const [totalStars, setTotalStars] = useState(0)
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [unlockedGroups, setUnlockedGroups] = useState<number[]>([1])
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState<number>(20)
  const [quietHoursEnabled, setQuietHoursEnabled] = useState<boolean>(false)
  const [quietHoursStart, setQuietHoursStart] = useState<string>('21:00')
  const [quietHoursEnd, setQuietHoursEnd] = useState<string>('07:00')
  const [storageInfo, setStorageInfo] = useState<{ isPersisted: boolean; usageMb: string } | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    // 4. Kiểm tra lưu trữ bền vững
    checkStoragePersistence()
  }, [])

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
      </div>

      {/* 3. Nội Dung Tab */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-3xl mx-auto w-full space-y-4">
        {/* --- TAB 1: TIẾN TRÌNH & THỐNG KÊ --- */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
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
      </main>
    </div>
  )
}
export default ParentDashboard
