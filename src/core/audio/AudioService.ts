import { Howl, Howler } from 'howler'

type VoiceEndCallback = () => void

// Tự động gom 180 file âm thanh âm vần (Giọng Nữ Miền Nam)
const phonicsModules = import.meta.glob<{ default: string }>(
  '../../assets/sounds/phonics/*.mp3',
  { eager: true }
)

const phonicsAudioMap: Record<string, string> = {}
for (const [path, mod] of Object.entries(phonicsModules)) {
  const match = path.match(/\/([^/]+)\.mp3$/)
  if (match) {
    phonicsAudioMap[match[1]] = (mod as any).default || (mod as any)
  }
}

class AudioService {
  private static instance: AudioService
  private currentVoiceHowl: Howl | null = null
  private bgmHowl: Howl | null = null
  private isBgmEnabled: boolean = true
  private normalBgmVolume: number = 0.22
  private duckedBgmVolume: number = 0.06
  private isUnlocked: boolean = false
  private onVoiceStartListeners: Set<() => void> = new Set()
  private onVoiceEndListeners: Set<() => void> = new Set()

  // Bảng ánh xạ clipId sang đường dẫn file audio tĩnh bundled trong src/assets/sounds
  private staticAudioMap: Record<string, string> = {
    // Nhạc nền thư giãn nhẹ nhàng (BGM)
    bgm_gentle: new URL('../../assets/sounds/bgm_gentle.wav', import.meta.url).href,

    // Nhân vật bạn đồng hành (Pikachu & Kitty)
    pikachu_greeting: new URL('../../assets/sounds/pikachu_chao.mp3', import.meta.url).href,
    pikachu_sleep: new URL('../../assets/sounds/pikachu_buon_ngu.mp3', import.meta.url).href,
    kitty_greeting: new URL('../../assets/sounds/meo_bong_khen.mp3', import.meta.url).href,
    kitty_cheer: new URL('../../assets/sounds/cheer_finish.mp3', import.meta.url).href,
    cat_greeting: new URL('../../assets/sounds/pikachu_chao.mp3', import.meta.url).href,
    cat_praise: new URL('../../assets/sounds/meo_bong_khen.mp3', import.meta.url).href,
    cat_encourage: new URL('../../assets/sounds/meo_bong_dong_vien.mp3', import.meta.url).href,
    cat_hint: new URL('../../assets/sounds/meo_bong_goi_y.mp3', import.meta.url).href,
    cat_sleep: new URL('../../assets/sounds/pikachu_buon_ngu.mp3', import.meta.url).href,

    // Bảng chữ cái 29 chữ & Từ minh họa (5 nhóm)
    // Nhóm 1: a, e, i, o, u, y
    letter_a: new URL('../../assets/sounds/chu_a.mp3', import.meta.url).href,
    letter_a_word: new URL('../../assets/sounds/tu_ao.mp3', import.meta.url).href,
    letter_e: new URL('../../assets/sounds/chu_e.mp3', import.meta.url).href,
    letter_e_word: new URL('../../assets/sounds/tu_embe.mp3', import.meta.url).href,
    letter_i: new URL('../../assets/sounds/chu_i.mp3', import.meta.url).href,
    letter_i_word: new URL('../../assets/sounds/tu_heo.mp3', import.meta.url).href,
    letter_o: new URL('../../assets/sounds/chu_o.mp3', import.meta.url).href,
    letter_o_word: new URL('../../assets/sounds/tu_ong.mp3', import.meta.url).href,
    letter_u: new URL('../../assets/sounds/chu_u.mp3', import.meta.url).href,
    letter_u_word: new URL('../../assets/sounds/tu_ung.mp3', import.meta.url).href,
    letter_y: new URL('../../assets/sounds/chu_y.mp3', import.meta.url).href,
    letter_y_word: new URL('../../assets/sounds/tu_yta.mp3', import.meta.url).href,

    // Nhóm 2: ă, â, ê, ô, ơ, ư
    letter_a_breve: new URL('../../assets/sounds/chu_a_breve.mp3', import.meta.url).href,
    letter_a_breve_word: new URL('../../assets/sounds/tu_an.mp3', import.meta.url).href,
    letter_a_circumflex: new URL('../../assets/sounds/chu_a_circumflex.mp3', import.meta.url).href,
    letter_a_circumflex_word: new URL('../../assets/sounds/tu_am.mp3', import.meta.url).href,
    letter_e_circumflex: new URL('../../assets/sounds/chu_e_circumflex.mp3', import.meta.url).href,
    letter_e_circumflex_word: new URL('../../assets/sounds/tu_ech.mp3', import.meta.url).href,
    letter_o_circumflex: new URL('../../assets/sounds/chu_o_circumflex.mp3', import.meta.url).href,
    letter_o_circumflex_word: new URL('../../assets/sounds/tu_oto.mp3', import.meta.url).href,
    letter_o_horn: new URL('../../assets/sounds/chu_o_horn.mp3', import.meta.url).href,
    letter_o_horn_word: new URL('../../assets/sounds/tu_ot.mp3', import.meta.url).href,
    letter_u_horn: new URL('../../assets/sounds/chu_u_horn.mp3', import.meta.url).href,
    letter_u_horn_word: new URL('../../assets/sounds/tu_sutu.mp3', import.meta.url).href,

    // Nhóm 3: m, n, t, l, h, c
    letter_m: new URL('../../assets/sounds/chu_m.mp3', import.meta.url).href,
    letter_m_word: new URL('../../assets/sounds/tu_meo.mp3', import.meta.url).href,
    letter_n: new URL('../../assets/sounds/chu_n.mp3', import.meta.url).href,
    letter_n_word: new URL('../../assets/sounds/tu_non.mp3', import.meta.url).href,
    letter_t: new URL('../../assets/sounds/chu_t.mp3', import.meta.url).href,
    letter_t_word: new URL('../../assets/sounds/tu_tau.mp3', import.meta.url).href,
    letter_l: new URL('../../assets/sounds/chu_l.mp3', import.meta.url).href,
    letter_l_word: new URL('../../assets/sounds/tu_la.mp3', import.meta.url).href,
    letter_h: new URL('../../assets/sounds/chu_h.mp3', import.meta.url).href,
    letter_h_word: new URL('../../assets/sounds/tu_hoa.mp3', import.meta.url).href,
    letter_c: new URL('../../assets/sounds/chu_c.mp3', import.meta.url).href,
    letter_c_word: new URL('../../assets/sounds/tu_ca.mp3', import.meta.url).href,

    // Nhóm 4: b, p, v, x, s, r
    letter_b: new URL('../../assets/sounds/chu_b.mp3', import.meta.url).href,
    letter_b_word: new URL('../../assets/sounds/tu_banh.mp3', import.meta.url).href,
    letter_p: new URL('../../assets/sounds/chu_p.mp3', import.meta.url).href,
    letter_p_word: new URL('../../assets/sounds/tu_pin.mp3', import.meta.url).href,
    letter_v: new URL('../../assets/sounds/chu_v.mp3', import.meta.url).href,
    letter_v_word: new URL('../../assets/sounds/tu_vit.mp3', import.meta.url).href,
    letter_x: new URL('../../assets/sounds/chu_x.mp3', import.meta.url).href,
    letter_x_word: new URL('../../assets/sounds/tu_xe.mp3', import.meta.url).href,
    letter_s: new URL('../../assets/sounds/chu_s.mp3', import.meta.url).href,
    letter_s_word: new URL('../../assets/sounds/tu_sao.mp3', import.meta.url).href,
    letter_r: new URL('../../assets/sounds/chu_r.mp3', import.meta.url).href,
    letter_r_word: new URL('../../assets/sounds/tu_rua.mp3', import.meta.url).href,

    // Nhóm 5: d, đ, g, k, q
    letter_d: new URL('../../assets/sounds/chu_d.mp3', import.meta.url).href,
    letter_d_word: new URL('../../assets/sounds/tu_de.mp3', import.meta.url).href,
    letter_dd: new URL('../../assets/sounds/chu_dd.mp3', import.meta.url).href,
    letter_dd_word: new URL('../../assets/sounds/tu_den.mp3', import.meta.url).href,
    letter_g: new URL('../../assets/sounds/chu_g.mp3', import.meta.url).href,
    letter_g_word: new URL('../../assets/sounds/tu_ga.mp3', import.meta.url).href,
    letter_k: new URL('../../assets/sounds/chu_k.mp3', import.meta.url).href,
    letter_k_word: new URL('../../assets/sounds/tu_keo.mp3', import.meta.url).href,
    letter_q: new URL('../../assets/sounds/chu_q.mp3', import.meta.url).href,
    letter_q_word: new URL('../../assets/sounds/tu_quat.mp3', import.meta.url).href,

    // Số & Đếm 1 đến 10
    count_1: new URL('../../assets/sounds/count_1.mp3', import.meta.url).href,
    count_2: new URL('../../assets/sounds/count_2.mp3', import.meta.url).href,
    count_3: new URL('../../assets/sounds/count_3.mp3', import.meta.url).href,
    count_4: new URL('../../assets/sounds/count_4.mp3', import.meta.url).href,
    count_5: new URL('../../assets/sounds/count_5.mp3', import.meta.url).href,
    count_6: new URL('../../assets/sounds/count_6.mp3', import.meta.url).href,
    count_7: new URL('../../assets/sounds/count_7.mp3', import.meta.url).href,
    count_8: new URL('../../assets/sounds/count_8.mp3', import.meta.url).href,
    count_9: new URL('../../assets/sounds/count_9.mp3', import.meta.url).href,
    count_10: new URL('../../assets/sounds/count_10.mp3', import.meta.url).href,
    number_5: new URL('../../assets/sounds/so_nam.mp3', import.meta.url).href,

    // So sánh số lượng & kích thước
    so_nhieu_hon: new URL('../../assets/sounds/so_nhieu_hon.mp3', import.meta.url).href,
    so_it_hon: new URL('../../assets/sounds/so_it_hon.mp3', import.meta.url).href,
    so_to_hon: new URL('../../assets/sounds/so_to_hon.mp3', import.meta.url).href,
    so_nho_hon: new URL('../../assets/sounds/so_nho_hon.mp3', import.meta.url).href,

    // Màu sắc 10 màu cơ bản & màu ấm/lạnh
    color_red: new URL('../../assets/sounds/mau_do.mp3', import.meta.url).href,
    color_yellow: new URL('../../assets/sounds/color_yellow.mp3', import.meta.url).href,
    color_blue: new URL('../../assets/sounds/color_blue.mp3', import.meta.url).href,
    color_green: new URL('../../assets/sounds/color_green.mp3', import.meta.url).href,
    color_orange: new URL('../../assets/sounds/color_orange.mp3', import.meta.url).href,
    color_purple: new URL('../../assets/sounds/color_purple.mp3', import.meta.url).href,
    color_pink: new URL('../../assets/sounds/color_pink.mp3', import.meta.url).href,
    color_brown: new URL('../../assets/sounds/color_brown.mp3', import.meta.url).href,
    color_black: new URL('../../assets/sounds/color_black.mp3', import.meta.url).href,
    color_white: new URL('../../assets/sounds/color_white.mp3', import.meta.url).href,
    color_warm: new URL('../../assets/sounds/color_warm.mp3', import.meta.url).href,
    color_cool: new URL('../../assets/sounds/color_cool.mp3', import.meta.url).href,

    // 6 Hình dạng cơ bản
    shape_circle: new URL('../../assets/sounds/shape_circle.mp3', import.meta.url).href,
    shape_square: new URL('../../assets/sounds/shape_square.mp3', import.meta.url).href,
    shape_triangle: new URL('../../assets/sounds/shape_triangle.mp3', import.meta.url).href,
    shape_star: new URL('../../assets/sounds/shape_star.mp3', import.meta.url).href,
    shape_rectangle: new URL('../../assets/sounds/shape_rectangle.mp3', import.meta.url).href,
    shape_heart: new URL('../../assets/sounds/shape_heart.mp3', import.meta.url).href,

    // Lời nhắc hoạt động & Câu hỏi
    prompt_find_red: new URL('../../assets/sounds/prompt_find_red.mp3', import.meta.url).href,
    prompt_find_yellow: new URL('../../assets/sounds/prompt_find_yellow.mp3', import.meta.url).href,
    prompt_find_blue: new URL('../../assets/sounds/prompt_find_blue.mp3', import.meta.url).href,
    prompt_find_green: new URL('../../assets/sounds/prompt_find_green.mp3', import.meta.url).href,
    prompt_find_orange: new URL('../../assets/sounds/prompt_find_orange.mp3', import.meta.url).href,
    prompt_find_purple: new URL('../../assets/sounds/prompt_find_purple.mp3', import.meta.url).href,
    prompt_find_pink: new URL('../../assets/sounds/prompt_find_pink.mp3', import.meta.url).href,
    prompt_sort_warm_cool: new URL('../../assets/sounds/prompt_sort_warm_cool.mp3', import.meta.url).href,
    prompt_sort_colors: new URL('../../assets/sounds/prompt_sort_colors.mp3', import.meta.url).href,

    prompt_find_circle: new URL('../../assets/sounds/prompt_find_circle.mp3', import.meta.url).href,
    prompt_find_square: new URL('../../assets/sounds/prompt_find_square.mp3', import.meta.url).href,
    prompt_find_triangle: new URL('../../assets/sounds/prompt_find_triangle.mp3', import.meta.url).href,
    prompt_find_star: new URL('../../assets/sounds/prompt_find_star.mp3', import.meta.url).href,
    prompt_find_rectangle: new URL('../../assets/sounds/prompt_find_rectangle.mp3', import.meta.url).href,
    prompt_find_heart: new URL('../../assets/sounds/prompt_find_heart.mp3', import.meta.url).href,
    prompt_match_shapes: new URL('../../assets/sounds/prompt_match_shapes.mp3', import.meta.url).href,
    prompt_sort_shapes: new URL('../../assets/sounds/prompt_sort_shapes.mp3', import.meta.url).href,

    prompt_find_number_1: new URL('../../assets/sounds/prompt_find_number_1.mp3', import.meta.url).href,
    prompt_find_number_2: new URL('../../assets/sounds/prompt_find_number_2.mp3', import.meta.url).href,
    prompt_find_number_3: new URL('../../assets/sounds/prompt_find_number_3.mp3', import.meta.url).href,
    prompt_find_number_4: new URL('../../assets/sounds/prompt_find_number_4.mp3', import.meta.url).href,
    prompt_find_number_5: new URL('../../assets/sounds/prompt_find_number_5.mp3', import.meta.url).href,
    prompt_find_number_6: new URL('../../assets/sounds/prompt_find_number_6.mp3', import.meta.url).href,
    prompt_find_number_7: new URL('../../assets/sounds/prompt_find_number_7.mp3', import.meta.url).href,
    prompt_find_number_8: new URL('../../assets/sounds/prompt_find_number_8.mp3', import.meta.url).href,
    prompt_find_number_9: new URL('../../assets/sounds/prompt_find_number_9.mp3', import.meta.url).href,
    prompt_find_number_10: new URL('../../assets/sounds/prompt_find_number_10.mp3', import.meta.url).href,
    prompt_count_apples: new URL('../../assets/sounds/prompt_count_apples.mp3', import.meta.url).href,
    prompt_count_flowers: new URL('../../assets/sounds/prompt_count_flowers.mp3', import.meta.url).href,
    prompt_more_fruits: new URL('../../assets/sounds/prompt_more_fruits.mp3', import.meta.url).href,
    prompt_less_fruits: new URL('../../assets/sounds/prompt_less_fruits.mp3', import.meta.url).href,
    prompt_bigger: new URL('../../assets/sounds/prompt_bigger.mp3', import.meta.url).href,
    prompt_smaller: new URL('../../assets/sounds/prompt_smaller.mp3', import.meta.url).href,
    prompt_match_quantity: new URL('../../assets/sounds/prompt_match_quantity.mp3', import.meta.url).href,

    // Lời nhắc chữ cái
    prompt_find_letter_a: new URL('../../assets/sounds/prompt_find_letter_a.mp3', import.meta.url).href,
    prompt_find_letter_e: new URL('../../assets/sounds/prompt_find_letter_e.mp3', import.meta.url).href,
    prompt_find_letter_i: new URL('../../assets/sounds/prompt_find_letter_i.mp3', import.meta.url).href,
    prompt_find_letter_o: new URL('../../assets/sounds/prompt_find_letter_o.mp3', import.meta.url).href,
    prompt_find_letter_u: new URL('../../assets/sounds/prompt_find_letter_u.mp3', import.meta.url).href,
    prompt_find_letter_y: new URL('../../assets/sounds/prompt_find_letter_y.mp3', import.meta.url).href,

    prompt_find_letter_a_breve: new URL('../../assets/sounds/prompt_find_letter_a_breve.mp3', import.meta.url).href,
    prompt_find_letter_a_circumflex: new URL('../../assets/sounds/prompt_find_letter_a_circumflex.mp3', import.meta.url).href,
    prompt_find_letter_e_circumflex: new URL('../../assets/sounds/prompt_find_letter_e_circumflex.mp3', import.meta.url).href,
    prompt_find_letter_o_circumflex: new URL('../../assets/sounds/prompt_find_letter_o_circumflex.mp3', import.meta.url).href,
    prompt_find_letter_o_horn: new URL('../../assets/sounds/prompt_find_letter_o_horn.mp3', import.meta.url).href,
    prompt_find_letter_u_horn: new URL('../../assets/sounds/prompt_find_letter_u_horn.mp3', import.meta.url).href,

    prompt_find_letter_m: new URL('../../assets/sounds/prompt_find_letter_m.mp3', import.meta.url).href,
    prompt_find_letter_n: new URL('../../assets/sounds/prompt_find_letter_n.mp3', import.meta.url).href,
    prompt_find_letter_t: new URL('../../assets/sounds/prompt_find_letter_t.mp3', import.meta.url).href,
    prompt_find_letter_l: new URL('../../assets/sounds/prompt_find_letter_l.mp3', import.meta.url).href,
    prompt_find_letter_h: new URL('../../assets/sounds/prompt_find_letter_h.mp3', import.meta.url).href,
    prompt_find_letter_c: new URL('../../assets/sounds/prompt_find_letter_c.mp3', import.meta.url).href,

    prompt_find_letter_b: new URL('../../assets/sounds/prompt_find_letter_b.mp3', import.meta.url).href,
    prompt_find_letter_p: new URL('../../assets/sounds/prompt_find_letter_p.mp3', import.meta.url).href,
    prompt_find_letter_v: new URL('../../assets/sounds/prompt_find_letter_v.mp3', import.meta.url).href,
    prompt_find_letter_x: new URL('../../assets/sounds/prompt_find_letter_x.mp3', import.meta.url).href,
    prompt_find_letter_s: new URL('../../assets/sounds/prompt_find_letter_s.mp3', import.meta.url).href,
    prompt_find_letter_r: new URL('../../assets/sounds/prompt_find_letter_r.mp3', import.meta.url).href,

    prompt_find_letter_d: new URL('../../assets/sounds/prompt_find_letter_d.mp3', import.meta.url).href,
    prompt_find_letter_dd: new URL('../../assets/sounds/prompt_find_letter_dd.mp3', import.meta.url).href,
    prompt_find_letter_g: new URL('../../assets/sounds/prompt_find_letter_g.mp3', import.meta.url).href,
    prompt_find_letter_k: new URL('../../assets/sounds/prompt_find_letter_k.mp3', import.meta.url).href,
    prompt_find_letter_q: new URL('../../assets/sounds/prompt_find_letter_q.mp3', import.meta.url).href,
    prompt_match_letter_word: new URL('../../assets/sounds/prompt_match_letter_word.mp3', import.meta.url).href,
    prompt_trace_letter: new URL('../../assets/sounds/prompt_trace_letter.mp3', import.meta.url).href,
    prompt_trace_number: new URL('../../assets/sounds/prompt_trace_number.mp3', import.meta.url).href,

    // Dấu thanh tiếng Việt
    dau_sac: new URL('../../assets/sounds/dau_sac.mp3', import.meta.url).href,
    dau_huyen: new URL('../../assets/sounds/dau_huyen.mp3', import.meta.url).href,
    dau_hoi: new URL('../../assets/sounds/dau_hoi.mp3', import.meta.url).href,
    dau_nga: new URL('../../assets/sounds/dau_nga.mp3', import.meta.url).href,
    dau_nang: new URL('../../assets/sounds/dau_nang.mp3', import.meta.url).href,
    tu_co: new URL('../../assets/sounds/tu_co.mp3', import.meta.url).href,
    tu_ho: new URL('../../assets/sounds/tu_ho.mp3', import.meta.url).href,
    tu_mu: new URL('../../assets/sounds/tu_mu.mp3', import.meta.url).href,
    tu_vet: new URL('../../assets/sounds/tu_vet.mp3', import.meta.url).href,

    prompt_explore_tones: new URL('../../assets/sounds/prompt_explore_tones.mp3', import.meta.url).href,
    prompt_find_dau_sac: new URL('../../assets/sounds/prompt_find_dau_sac.mp3', import.meta.url).href,
    prompt_find_dau_huyen: new URL('../../assets/sounds/prompt_find_dau_huyen.mp3', import.meta.url).href,
    prompt_find_dau_hoi: new URL('../../assets/sounds/prompt_find_dau_hoi.mp3', import.meta.url).href,
    prompt_find_dau_nga: new URL('../../assets/sounds/prompt_find_dau_nga.mp3', import.meta.url).href,
    prompt_find_dau_nang: new URL('../../assets/sounds/prompt_find_dau_nang.mp3', import.meta.url).href,
    prompt_match_tones: new URL('../../assets/sounds/prompt_match_tones.mp3', import.meta.url).href,
    prompt_trace_tone: new URL('../../assets/sounds/prompt_trace_tone.mp3', import.meta.url).href,

    cheer_finish: new URL('../../assets/sounds/cheer_finish.mp3', import.meta.url).href,

  }

  private constructor() {
    this.initLifecycleListeners()
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  /**
   * Mở khóa toàn diện âm thanh trên iOS/iPadOS Safari & Chrome:
   * 1. Kích hoạt Web AudioContext đồng bộ
   * 2. Kích hoạt và dọn dẹp ngay HTML5 Audio element câm để thiết lập quyền Media Playback
   */
  public unlock(): void {
    if (this.isUnlocked) return

    try {
      // 1. Mở khóa Web AudioContext (Howler)
      if (Howler.ctx) {
        if (Howler.ctx.state === 'suspended') {
          Howler.ctx.resume()
        }
        // Tạo 1 sample silent buffer để đánh thức AudioContext
        const buffer = Howler.ctx.createBuffer(1, 1, 22050)
        const source = Howler.ctx.createBufferSource()
        source.buffer = buffer
        source.connect(Howler.ctx.destination)
        source.start(0)
      }

      // 2. Mở khóa HTML5 Audio element với một data URI âm thanh câm (silent wav)
      // Sau khi kích hoạt AudioSession, lập tức dừng và xóa src để không tạo Now Playing session rác
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
      silentAudio.play().then(() => {
        silentAudio.pause()
        silentAudio.removeAttribute('src')
        silentAudio.load()
      }).catch(() => {
        // bỏ qua nếu bị chặn
      })

      this.isUnlocked = true
    } catch (e) {
      console.warn('Lỗi khi mở khóa âm thanh iOS/iPad:', e)
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
    // Tự động giảm âm lượng nhạc nền (Ducking) khi có giọng nói
    if (this.bgmHowl && this.bgmHowl.playing()) {
      this.bgmHowl.fade(this.bgmHowl.volume(), this.duckedBgmVolume, 250)
    }
  }

  private notifyEnd() {
    this.onVoiceEndListeners.forEach((fn) => fn())
    // Khôi phục âm lượng nhạc nền êm đềm khi kết thúc giọng nói
    if (this.bgmHowl && this.bgmHowl.playing()) {
      this.bgmHowl.fade(this.bgmHowl.volume(), this.normalBgmVolume, 500)
    }
  }

  /**
   * Phát nhạc nền thư giãn (BGM):
   * SỬ DỤNG html5: false (Web Audio API) ĐỂ KHÔNG ĐĂNG KÝ VÀO WIDGET NOW PLAYING TRÊN IPAD,
   * TỰ ĐỘNG SUSPEND / TẮT KHI BÉ THOÁT RA MÀN HÌNH CHÍNH HOẶC ĐÓNG TRÌNH DUYỆT.
   */
  public startBGM(): void {
    if (!this.isBgmEnabled) return
    const bgmUrl = this.staticAudioMap.bgm_gentle
    if (!bgmUrl) return

    if (!this.bgmHowl) {
      this.bgmHowl = new Howl({
        src: [bgmUrl],
        loop: true,
        html5: false, // Dùng Web Audio API: Không tạo Now Playing widget trên iPad, tự động ngắt khi thoát app
        volume: this.normalBgmVolume,
      })
    }

    if (!this.bgmHowl.playing()) {
      this.bgmHowl.play()
    }
  }

  /**
   * Lắng nghe vòng đời của ứng dụng và tab trình duyệt (iOS Safari, Chrome iPadOS):
   * Tự động tắt ngay lập tức nhạc nền và âm thanh khi:
   * - Người dùng tắt Chrome hoặc vuốt về màn hình chính
   * - Khóa màn hình iPad
   * - Chuyển sang tab khác hoặc đóng tab
   */
  private initLifecycleListeners(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const onBackground = () => {
      this.handleAppBackground()
    }

    const onForeground = () => {
      this.handleAppForeground()
    }

    // 1. Sự kiện thay đổi hiển thị tab (Chuẩn W3C Page Visibility API)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        onBackground()
      } else if (document.visibilityState === 'visible') {
        onForeground()
      }
    })

    // 2. Sự kiện rời trang / đóng tab / chuyển ứng dụng trên iOS WebKit
    window.addEventListener('pagehide', onBackground)
    window.addEventListener('beforeunload', onBackground)

    // 3. Sự kiện mất tiêu điểm khi vuốt thanh đa nhiệm trên iPad
    window.addEventListener('blur', () => {
      if (document.visibilityState === 'hidden') {
        onBackground()
      }
    })

    // 4. Nếu trình duyệt có MediaSession API, gắn handler để đồng bộ trạng thái pause
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none'
        navigator.mediaSession.setActionHandler('pause', () => {
          this.pauseBGM()
          this.stopVoice()
        })
        navigator.mediaSession.setActionHandler('play', () => {
          if (this.isBgmEnabled && this.isUnlocked) {
            this.startBGM()
          }
        })
      } catch {
        // bỏ qua nếu trình duyệt không hỗ trợ setActionHandler
      }
    }
  }

  /**
   * Xử lý khi ứng dụng bị ẩn / thu nhỏ / tắt ra màn hình chính
   */
  public handleAppBackground(): void {
    // 1. Tạm dừng ngay lập tức nhạc nền
    if (this.bgmHowl) {
      try {
        this.bgmHowl.pause()
      } catch {
        // bỏ qua
      }
    }

    // 2. Dừng ngay câu thoại đang phát dở
    this.stopVoice()

    // 3. Suspend Web AudioContext để hệ điều hành giải phóng Audio Engine
    if (Howler.ctx && Howler.ctx.state === 'running') {
      try {
        Howler.ctx.suspend()
      } catch {
        // bỏ qua
      }
    }

    // 4. Đồng bộ MediaSession thành 'none' để tắt hoàn toàn widget Now Playing trên iPad
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none'
      } catch {
        // bỏ qua
      }
    }
  }

  /**
   * Xử lý khi ứng dụng được mở lại trên màn hình
   */
  public handleAppForeground(): void {
    // 1. Đánh thức lại AudioContext nếu đang suspended
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      try {
        Howler.ctx.resume()
      } catch {
        // bỏ qua
      }
    }

    // 2. Khôi phục nhạc nền nếu người dùng đã mở khóa âm thanh và cài đặt bật nhạc nền
    if (this.isUnlocked && this.isBgmEnabled) {
      setTimeout(() => {
        if (document.visibilityState === 'visible' && this.isBgmEnabled) {
          this.startBGM()
        }
      }, 150)
    }
  }

  /**
   * Tạm dừng nhạc nền
   */
  public pauseBGM(): void {
    if (this.bgmHowl && this.bgmHowl.playing()) {
      this.bgmHowl.pause()
    }
  }

  /**
   * Bật / Tắt nhạc nền theo ý phụ huynh
   */
  public setBGMEnabled(enabled: boolean): void {
    this.isBgmEnabled = enabled
    if (enabled) {
      this.startBGM()
    } else {
      this.pauseBGM()
    }
  }

  public isBGMActive(): boolean {
    return this.isBgmEnabled && (this.bgmHowl?.playing() ?? false)
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
   * Phát âm thanh lấp lánh khi bé vẽ hoặc tô nét chạm trúng điểm mốc (Sparkle Sound FX)
   */
  public playSpark(frequency = 659.25): void {
    if (!Howler.ctx) return
    try {
      const ctx = Howler.ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)
    } catch {
      // AudioContext có thể chưa sẵn sàng, bỏ qua
    }
  }

  /**
   * Phát tiếng "tách" hít vào vị trí (Snap FX) khi gắn mảnh ghép hoặc dán sticker
   */
  public playSnap(): void {
    if (!Howler.ctx) return
    try {
      const ctx = Howler.ctx
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08) // A5
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.12)
    } catch {
      // Bỏ qua
    }
  }

  /**
   * Chuỗi 3 nốt chuông ngân vui tươi (Chime FX) khi hoàn thành mảnh ghép hoặc lật trang truyện
   */
  public playChime(): void {
    if (!Howler.ctx) return
    try {
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playSpark(freq), idx * 80)
      })
    } catch {
      // Bỏ qua
    }
  }


  /**
   * Phát nốt nhạc chuông Xylophone với chuỗi họa âm ngân vang trong trẻo
   */
  public playNote(freq: number, duration = 0.85): void {
    if (!Howler.ctx) return
    try {
      const ctx = Howler.ctx
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime
      // 1. Họa âm cơ bản (sine wave ngân dài)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(freq, now)
      gain1.gain.setValueAtTime(0.25, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + duration)

      // 2. Họa âm sắc bén của phím gõ kim loại (triangle wave tắt nhanh)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq * 2, now)
      gain2.gain.setValueAtTime(0.12, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.35)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now)
      osc2.stop(now + duration * 0.35)
    } catch {
      // Bỏ qua nếu Web Audio chưa sẵn sàng
    }
  }

  /**
   * Phát một câu thoại:
   * SỬ DỤNG html5: true ĐỂ PHÁT QUA MEDIA AUDIO SESSION TRÊN IPAD
   * (Giúp nghe được âm thanh ngay cả khi iPad đang bật chế độ Im Lặng trong Control Center)
   */
  public playVoice(clipId: string, onEnd?: VoiceEndCallback): void {
    this.stopVoice()
    this.unlock()

    const soundUrl = this.staticAudioMap[clipId]

    if (soundUrl) {
      const howl = new Howl({
        src: [soundUrl],
        html5: false, // Dùng Web Audio API để phát tức thì và không bị dính widget Now Playing trên iPad
        preload: true,
        volume: 1.0,
        onloaderror: (_id, err) => {
          console.warn(`Lỗi tải âm thanh [${clipId}]:`, err)
          this.notifyEnd()
          onEnd?.()
        },
        onplayerror: (_id, err) => {
          console.warn(`Lỗi phát âm thanh [${clipId}]:`, err)
          // Nếu html5: true gặp sự cố, thử fallback sang html5: false
          this.playWithWebAudioFallback(soundUrl, onEnd)
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
   * Fallback phát lại qua Web Audio nếu cần
   */
  private playWithWebAudioFallback(soundUrl: string, onEnd?: VoiceEndCallback) {
    try {
      const howl = new Howl({
        src: [soundUrl],
        html5: false,
        volume: 1.0,
        onplay: () => this.notifyStart(),
        onend: () => {
          this.notifyEnd()
          onEnd?.()
        },
      })
      this.currentVoiceHowl = howl
      howl.play()
    } catch {
      this.notifyEnd()
      onEnd?.()
    }
  }

  /**
   * Đọc to một từ hoặc văn bản tiếng Việt bất kỳ (sử dụng file âm thanh nếu có, hoặc Web Speech vi-VN)
   */
  public speakText(text: string, onEnd?: VoiceEndCallback): void {
    if (this.staticAudioMap[text]) {
      this.playVoice(text, onEnd)
    } else {
      this.stopVoice()
      this.unlock()
      this.fallbackWebSpeech(text, onEnd)
    }
  }

  /**
   * Đọc to lựa chọn bé bấm vào (số, chữ cái, màu sắc, hình khối...)
   * Nếu có audioId trong kho âm thanh thì phát file audio chuẩn, nếu không sẽ đọc nhãn (label) tiếng Việt
   */
  public playChoice(audioId?: string, label?: string, onEnd?: VoiceEndCallback): void {
    if (audioId && this.staticAudioMap[audioId]) {
      this.playVoice(audioId, onEnd)
    } else if (label) {
      this.speakText(label, onEnd)
    } else {
      onEnd?.()
    }
  }

  /**
   * Phát âm thanh âm vần hoặc dấu thanh (Giọng Nữ Miền Nam chuẩn ngọt ngào)
   */
  public playPhonics(id: string, fallbackText?: string, onEnd?: VoiceEndCallback): void {
    this.stopVoice()
    this.unlock()

    const soundUrl = phonicsAudioMap[id] || this.staticAudioMap[id]

    if (soundUrl) {
      const howl = new Howl({
        src: [soundUrl],
        html5: false, // Dùng Web Audio API cực nhanh, không latency, không kích hoạt Now Playing
        volume: 1.0,
        onloaderror: (_id, err) => {
          console.warn(`Lỗi nạp âm vần [${id}]:`, err)
          this.notifyEnd()
          onEnd?.()
        },
        onplayerror: (_id, err) => {
          console.warn(`Lỗi phát âm vần [${id}]:`, err)
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
    } else if (fallbackText) {
      this.speakText(fallbackText, onEnd)
    } else {
      onEnd?.()
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
