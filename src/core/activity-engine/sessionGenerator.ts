import { db } from '@/core/storage/db'

export interface SessionChoice {
  id: string
  label: string
  audioId: string
  color?: string
  icon?: string
  isCorrect: boolean
}

export interface SessionQuestion {
  id: string
  category: 'color' | 'shape' | 'number' | 'letter'
  promptText: string
  promptAudio: string
  choices: SessionChoice[]
}

// Ngân hàng câu hỏi phong phú đa chủ đề
export const QUESTION_POOL: SessionQuestion[] = [
  // 1. Màu sắc
  {
    id: 'q_color_red',
    category: 'color',
    promptText: 'Bạn chạm vào màu đỏ nhé!',
    promptAudio: 'prompt_find_red',
    choices: [
      { id: 'c_red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴', isCorrect: true },
      { id: 'c_blue', label: 'Màu Xanh', audioId: 'color_blue', color: '#448AFF', icon: '🔵', isCorrect: false },
      { id: 'c_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡', isCorrect: false },
    ],
  },
  {
    id: 'q_color_yellow',
    category: 'color',
    promptText: 'Bạn chạm vào màu vàng nhé!',
    promptAudio: 'prompt_find_yellow',
    choices: [
      { id: 'c_green', label: 'Màu Xanh Lá', audioId: 'color_green', color: '#66BB6A', icon: '🟢', isCorrect: false },
      { id: 'c_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡', isCorrect: true },
      { id: 'c_red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴', isCorrect: false },
    ],
  },
  {
    id: 'q_color_blue',
    category: 'color',
    promptText: 'Bạn chạm vào màu xanh dương nhé!',
    promptAudio: 'prompt_find_blue',
    choices: [
      { id: 'c_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡', isCorrect: false },
      { id: 'c_red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴', isCorrect: false },
      { id: 'c_blue', label: 'Màu Xanh Dương', audioId: 'color_blue', color: '#448AFF', icon: '🔵', isCorrect: true },
    ],
  },
  {
    id: 'q_color_green',
    category: 'color',
    promptText: 'Bạn chạm vào màu xanh lá nhé!',
    promptAudio: 'prompt_find_green',
    choices: [
      { id: 'c_green', label: 'Màu Xanh Lá', audioId: 'color_green', color: '#66BB6A', icon: '🟢', isCorrect: true },
      { id: 'c_blue', label: 'Màu Xanh Dương', audioId: 'color_blue', color: '#448AFF', icon: '🔵', isCorrect: false },
      { id: 'c_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡', isCorrect: false },
    ],
  },

  // 2. Hình dạng
  {
    id: 'q_shape_circle',
    category: 'shape',
    promptText: 'Bạn chạm vào hình tròn nhé!',
    promptAudio: 'prompt_find_circle',
    choices: [
      { id: 's_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: false },
      { id: 's_circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴', isCorrect: true },
      { id: 's_triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#FED000', icon: '🔺', isCorrect: false },
    ],
  },
  {
    id: 'q_shape_square',
    category: 'shape',
    promptText: 'Bạn chạm vào hình vuông nhé!',
    promptAudio: 'prompt_find_square',
    choices: [
      { id: 's_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: true },
      { id: 's_circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴', isCorrect: false },
      { id: 's_star', label: 'Ngôi Sao', audioId: 'shape_star', color: '#FED000', icon: '⭐', isCorrect: false },
    ],
  },
  {
    id: 'q_shape_triangle',
    category: 'shape',
    promptText: 'Bạn chạm vào hình tam giác nhé!',
    promptAudio: 'prompt_find_triangle',
    choices: [
      { id: 's_circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴', isCorrect: false },
      { id: 's_triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#FED000', icon: '🔺', isCorrect: true },
      { id: 's_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: false },
    ],
  },
  {
    id: 'q_shape_star',
    category: 'shape',
    promptText: 'Bạn chạm vào ngôi sao nhé!',
    promptAudio: 'prompt_find_star',
    choices: [
      { id: 's_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: false },
      { id: 's_triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#66BB6A', icon: '🔺', isCorrect: false },
      { id: 's_star', label: 'Ngôi Sao', audioId: 'shape_star', color: '#FED000', icon: '⭐', isCorrect: true },
    ],
  },

  // 3. Con số
  {
    id: 'q_number_1',
    category: 'number',
    promptText: 'Bé tìm số 1 nhé!',
    promptAudio: 'count_1',
    choices: [
      { id: 'n_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: true },
      { id: 'n_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: false },
      { id: 'n_3', label: 'Số 3', audioId: 'count_3', color: '#FED000', icon: '3️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_2',
    category: 'number',
    promptText: 'Bé tìm số 2 nhé!',
    promptAudio: 'count_2',
    choices: [
      { id: 'n_3', label: 'Số 3', audioId: 'count_3', color: '#66BB6A', icon: '3️⃣', isCorrect: false },
      { id: 'n_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: true },
      { id: 'n_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_3',
    category: 'number',
    promptText: 'Bé tìm số 3 nhé!',
    promptAudio: 'count_3',
    choices: [
      { id: 'n_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: false },
      { id: 'n_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: false },
      { id: 'n_3', label: 'Số 3', audioId: 'count_3', color: '#FED000', icon: '3️⃣', isCorrect: true },
    ],
  },
  {
    id: 'q_number_4',
    category: 'number',
    promptText: 'Bé tìm số 4 nhé!',
    promptAudio: 'count_4',
    choices: [
      { id: 'n_4', label: 'Số 4', audioId: 'count_4', color: '#AB47BC', icon: '4️⃣', isCorrect: true },
      { id: 'n_3', label: 'Số 3', audioId: 'count_3', color: '#FED000', icon: '3️⃣', isCorrect: false },
      { id: 'n_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_5',
    category: 'number',
    promptText: 'Bạn chạm vào số năm nhé!',
    promptAudio: 'prompt_find_number_5',
    choices: [
      { id: 'n_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: false },
      { id: 'n_5', label: 'Số 5', audioId: 'number_5', color: '#FF7043', icon: '5️⃣', isCorrect: true },
      { id: 'n_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: false },
    ],
  },

  // 4. Chữ cái Tiếng Việt
  {
    id: 'q_letter_a',
    category: 'letter',
    promptText: 'Bạn chạm vào chữ a nhé!',
    promptAudio: 'prompt_find_letter_a',
    choices: [
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: '🅰️', isCorrect: true },
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: '🅱️', isCorrect: false },
      { id: 'l_i', label: 'Chữ i', audioId: 'letter_i', color: '#FED000', icon: 'ℹ️', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_b',
    category: 'letter',
    promptText: 'Bạn chạm vào chữ bờ nhé!',
    promptAudio: 'prompt_find_letter_b',
    choices: [
      { id: 'l_dd', label: 'Chữ đờ', audioId: 'letter_dd', color: '#66BB6A', icon: 'Đ', isCorrect: false },
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: '🅱️', isCorrect: true },
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: '🅰️', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_dd',
    category: 'letter',
    promptText: 'Bạn chạm vào chữ đờ nhé!',
    promptAudio: 'prompt_find_letter_dd',
    choices: [
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: '🅰️', isCorrect: false },
      { id: 'l_dd', label: 'Chữ đờ', audioId: 'letter_dd', color: '#66BB6A', icon: 'Đ', isCorrect: true },
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: '🅱️', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_i',
    category: 'letter',
    promptText: 'Bạn chạm vào chữ i nhé!',
    promptAudio: 'prompt_find_letter_i',
    choices: [
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: '🅱️', isCorrect: false },
      { id: 'l_dd', label: 'Chữ đờ', audioId: 'letter_dd', color: '#66BB6A', icon: 'Đ', isCorrect: false },
      { id: 'l_i', label: 'Chữ i', audioId: 'letter_i', color: '#FED000', icon: 'ℹ️', isCorrect: true },
    ],
  },
]

/**
 * Thuật toán sinh 12 câu ngẫu nhiên chống trùng lặp theo hồ sơ bé
 */
export async function generate12QuestionSession(profileId: string): Promise<SessionQuestion[]> {
  try {
    // 1. Lấy lịch sử độ thành thạo và thời gian học gần nhất của bé
    const masteries = await db.itemMastery
      .where('profileId')
      .equals(profileId)
      .toArray()

    const masteryMap = new Map<string, { lastSeenAt: number; streak: number }>()
    masteries.forEach((m) => {
      masteryMap.set(m.itemId, { lastSeenAt: m.lastSeenAt, streak: m.streak })
    })

    // 2. Chấm điểm ưu tiên cho từng câu hỏi trong ngân hàng
    // - Chưa từng học: điểm ưu tiên cao nhất (chưa bao giờ xuất hiện)
    // - Đã học lâu nhất: điểm ưu tiên tiếp theo (cần ôn tập ngắt quãng)
    // - Vừa mới học xong gần đây: điểm ưu tiên thấp nhất (tránh trùng lặp)
    const now = Date.now()
    const scoredQuestions = QUESTION_POOL.map((q) => {
      const history = masteryMap.get(q.id)
      let score = 0

      if (!history) {
        // Chưa học bao giờ: ưu tiên cực cao
        score = 1000000 + Math.random() * 500
      } else {
        // Càng lâu chưa học thì điểm càng cao
        const elapsedMinutes = (now - history.lastSeenAt) / (1000 * 60)
        score = elapsedMinutes + Math.random() * 10
      }

      return { question: q, score }
    })

    // 3. Sắp xếp giảm dần theo điểm ưu tiên
    scoredQuestions.sort((a, b) => b.score - a.score)

    // 4. Lấy 12 câu đa dạng thể loại (cân đối Màu sắc, Hình khối, Số, Chữ cái)
    const selected: SessionQuestion[] = []
    const categoriesCount = { color: 0, shape: 0, number: 0, letter: 0 }

    for (const item of scoredQuestions) {
      if (selected.length >= 12) break

      const cat = item.question.category
      // Mỗi thể loại tối đa 4 câu để đảm bảo phiên học đa dạng
      if (categoriesCount[cat] < 4 || selected.length >= 10) {
        // Đảo ngẫu nhiên vị trí các lựa chọn đáp án
        const shuffledChoices = [...item.question.choices].sort(() => Math.random() - 0.5)
        selected.push({
          ...item.question,
          choices: shuffledChoices,
        })
        categoriesCount[cat]++
      }
    }

    // 5. Nếu chưa đủ 12 câu, bổ sung ngẫu nhiên các câu còn lại
    if (selected.length < 12) {
      for (const item of scoredQuestions) {
        if (selected.length >= 12) break
        if (!selected.some((s) => s.id === item.question.id)) {
          const shuffledChoices = [...item.question.choices].sort(() => Math.random() - 0.5)
          selected.push({
            ...item.question,
            choices: shuffledChoices,
          })
        }
      }
    }

    // Đảo thứ tự 12 câu để tạo sự bất ngờ thú vị cho bé
    return selected.sort(() => Math.random() - 0.5)
  } catch (e) {
    console.warn('Lỗi thuật toán chống trùng lặp, dùng fallback ngẫu nhiên:', e)
    // Fallback: Lấy 12 câu xáo trộn
    return [...QUESTION_POOL].sort(() => Math.random() - 0.5).slice(0, 12)
  }
}
