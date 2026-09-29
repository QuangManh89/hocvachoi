import { Howl, Howler } from 'howler'

type VoiceEndCallback = () => void

class AudioService {
  private static instance: AudioService
  private currentVoiceHowl: Howl | null = null
  private isUnlocked: boolean = false
  private onVoiceStartListeners: Set<() => void> = new Set()
  private onVoiceEndListeners: Set<() => void> = new Set()

  // Bảng ánh xạ clipId sang đường dẫn file audio tĩnh bundled trong src/assets/sounds
  private staticAudioMap: Record<string, string> = {
    // Mèo Bông
    cat_greeting: new URL('../../assets/sounds/meo_bong_chao.mp3', import.meta.url).href,
    cat_praise: new URL('../../assets/sounds/meo_bong_khen.mp3', import.meta.url).href,
    cat_encourage: new URL('../../assets/sounds/meo_bong_dong_vien.mp3', import.meta.url).href,
    cat_hint: new URL('../../assets/sounds/meo_bong_goi_y.mp3', import.meta.url).href,
    cat_sleep: new URL('../../assets/sounds/meo_bong_buon_ngu.mp3', import.meta.url).href,

    // Chữ cái
    letter_a: new URL('../../assets/sounds/chu_a.mp3', import.meta.url).href,
    letter_a_word: new URL('../../assets/sounds/tu_ao.mp3', import.meta.url).href,
    letter_b: new URL('../../assets/sounds/chu_b.mp3', import.meta.url).href,
    letter_b_word: new URL('../../assets/sounds/tu_banh.mp3', import.meta.url).href,
    letter_dd: new URL('../../assets/sounds/chu_dd.mp3', import.meta.url).href,
    letter_dd_word: new URL('../../assets/sounds/tu_den.mp3', import.meta.url).href,
    letter_i: new URL('../../assets/sounds/chu_i.mp3', import.meta.url).href,
    letter_i_word: new URL('../../assets/sounds/tu_heo.mp3', import.meta.url).href,

    // Số & màu
    number_5: new URL('../../assets/sounds/so_nam.mp3', import.meta.url).href,
    color_red: new URL('../../assets/sounds/mau_do.mp3', import.meta.url).href,
  }

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  /**
   * Mở khóa Web Audio context trên iOS Safari tại màn hình "Chạm để bắt đầu"
   */
  public async unlock(): Promise<boolean> {
    if (this.isUnlocked) return true
    try {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        await Howler.ctx.resume()
      }
      this.isUnlocked = true
      return true
    } catch (e) {
      console.warn('Lỗi khi mở khóa âm thanh iOS:', e)
      return false
    }
  }

  /**
   * Đăng ký lắng nghe khi Mèo Bông bắt đầu nói và kết thúc nói
   */
  public onVoiceStateChange(onStart: () => void, onEnd: () => void): () => void {
    this.onVoiceStartListeners.add(onStart)
    this.onVoiceEndListeners.add(onEnd)
    return () => {
      this.onVoiceStartListeners.delete(onStart)
      this.onVoiceEndListeners.delete(onEnd)
    }
  }

  private notifyStart() {
    this.onVoiceStartListeners.forEach((fn) => fn())
  }

  private notifyEnd() {
    this.onVoiceEndListeners.forEach((fn) => fn())
  }

  /**
   * Dừng giọng nói hiện tại
   */
  public stopVoice() {
    if (this.currentVoiceHowl) {
      this.currentVoiceHowl.stop()
      this.currentVoiceHowl.unload()
      this.currentVoiceHowl = null
      this.notifyEnd()
    }
  }

  /**
   * Phát một câu thoại (Chỉ cho phép 1 giọng nói phát tại 1 thời điểm)
   */
  public playVoice(clipId: string, onEnd?: VoiceEndCallback): void {
    this.stopVoice()
    this.unlock()

    const soundUrl = this.staticAudioMap[clipId]

    if (soundUrl) {
      const howl = new Howl({
        src: [soundUrl],
        html5: false, // Dùng Web Audio API để không có độ trễ trên iPad
        volume: 1.0,
        onloaderror: (_id, err) => {
          console.warn(`Lỗi tải âm thanh [${clipId}]:`, err)
          this.notifyEnd()
          onEnd?.()
        },
        onplay: () => {
          this.notifyStart()
        },
        onend: () => {
          this.notifyEnd()
          onEnd?.()
        },
      })

      this.currentVoiceHowl = howl
      howl.play()
    } else {
      console.warn(`Không tìm thấy âm thanh clipId [${clipId}], fallback dev Web Speech`)
      this.fallbackWebSpeech(clipId, onEnd)
    }
  }

  /**
   * Fallback tổng hợp giọng nói Web Speech cho môi trường dev khi chưa có file âm thanh
   */
  private fallbackWebSpeech(text: string, onEnd?: VoiceEndCallback) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'vi-VN'
      utterance.rate = 0.9

      utterance.onstart = () => this.notifyStart()
      utterance.onend = () => {
        this.notifyEnd()
        onEnd?.()
      }
      utterance.onerror = () => {
        this.notifyEnd()
        onEnd?.()
      }

      window.speechSynthesis.speak(utterance)
    } else {
      onEnd?.()
    }
  }
}

export const audioService = AudioService.getInstance()
export default audioService
