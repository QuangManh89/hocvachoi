import { db } from './db'

export interface BackupData {
  schemaVersion: number
  exportedAt: number
  profiles: any[]
  activityRuns: any[]
  itemMastery: any[]
  rewards: any[]
  settings: any[]
}

/**
 * Xuất dữ liệu IndexedDB thành file .hvc (JSON chuẩn hóa Unicode NFC)
 */
export async function exportBackupData(): Promise<Blob> {
  const profiles = await db.profiles.toArray()
  const activityRuns = await db.activityRuns.toArray()
  const itemMastery = await db.itemMastery.toArray()
  const rewards = await db.rewards.toArray()
  const settings = await db.settings.toArray()

  const data: BackupData = {
    schemaVersion: 1,
    exportedAt: Date.now(),
    profiles,
    activityRuns,
    itemMastery,
    rewards,
    settings,
  }

  // Chuẩn hóa Unicode NFC trước khi đóng gói
  const jsonString = JSON.stringify(data, null, 2).normalize('NFC')
  return new Blob([jsonString], { type: 'application/json' })
}

/**
 * Tải file sao lưu về máy hoặc mở Share Sheet trên iOS Safari
 */
export async function downloadBackupFile(): Promise<void> {
  const blob = await exportBackupData()
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `hocvachoi_backup_${dateStr}.hvc`

  const file = new File([blob], filename, { type: 'application/json' })

  // Nếu trình duyệt hỗ trợ navigator.canShare (iOS Safari Share Sheet)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Sao lưu Học Và Chơi',
        text: 'File sao lưu tiến trình học của bé',
        files: [file],
      })
      return
    } catch (e: any) {
      if (e.name === 'AbortError') return
      console.warn('Lỗi Share Sheet, chuyển sang tải file truyền thống:', e)
    }
  }

  // Tải file trực tiếp qua thẻ <a>
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Khôi phục dữ liệu từ file .hvc đã xuất
 */
export async function restoreBackupData(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text()
    const normalizedText = text.normalize('NFC')
    const data: BackupData = JSON.parse(normalizedText)

    if (!data.schemaVersion || !data.profiles) {
      return { success: false, message: 'File sao lưu không hợp lệ hoặc bị hỏng.' }
    }

    // Ghi đè hoặc cập nhật vào IndexedDB
    await db.transaction('rw', [db.profiles, db.activityRuns, db.itemMastery, db.rewards, db.settings], async () => {
      if (data.profiles.length > 0) {
        await db.profiles.bulkPut(data.profiles)
      }
      if (data.activityRuns?.length > 0) {
        await db.activityRuns.bulkPut(data.activityRuns)
      }
      if (data.itemMastery?.length > 0) {
        await db.itemMastery.bulkPut(data.itemMastery)
      }
      if (data.rewards?.length > 0) {
        await db.rewards.bulkPut(data.rewards)
      }
      if (data.settings?.length > 0) {
        await db.settings.bulkPut(data.settings)
      }
    })

    return {
      success: true,
      message: `Khôi phục thành công! Đã phục hồi dữ liệu từ ngày ${new Date(data.exportedAt).toLocaleDateString('vi-VN')}.`,
    }
  } catch (error) {
    console.error('Lỗi khôi phục backup:', error)
    return { success: false, message: 'Có lỗi xảy ra khi đọc file sao lưu.' }
  }
}
