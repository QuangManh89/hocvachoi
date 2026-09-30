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
  group?: number // Cho các câu hỏi chữ cái (1 - 5)
  promptText: string
  promptAudio: string
  choices: SessionChoice[]
}

// Ngân hàng câu hỏi phong phú đa chủ đề
export const QUESTION_POOL: SessionQuestion[] = [
  // --- 1. MÀU SẮC ---
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
  {
    id: 'q_color_orange',
    category: 'color',
    promptText: 'Bạn chạm vào màu cam nhé!',
    promptAudio: 'prompt_find_orange',
    choices: [
      { id: 'c_orange', label: 'Màu Cam', audioId: 'color_orange', color: '#FF9800', icon: '🟠', isCorrect: true },
      { id: 'c_red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴', isCorrect: false },
      { id: 'c_purple', label: 'Màu Tím', audioId: 'color_purple', color: '#AB47BC', icon: '🟣', isCorrect: false },
    ],
  },
  {
    id: 'q_color_purple',
    category: 'color',
    promptText: 'Bạn chạm vào màu tím nhé!',
    promptAudio: 'prompt_find_purple',
    choices: [
      { id: 'c_blue', label: 'Màu Xanh', audioId: 'color_blue', color: '#448AFF', icon: '🔵', isCorrect: false },
      { id: 'c_purple', label: 'Màu Tím', audioId: 'color_purple', color: '#AB47BC', icon: '🟣', isCorrect: true },
      { id: 'c_pink', label: 'Màu Hồng', audioId: 'color_pink', color: '#F48FB1', icon: '🌸', isCorrect: false },
    ],
  },
  {
    id: 'q_color_pink',
    category: 'color',
    promptText: 'Bạn chạm vào màu hồng nhé!',
    promptAudio: 'prompt_find_pink',
    choices: [
      { id: 'c_pink', label: 'Màu Hồng', audioId: 'color_pink', color: '#F48FB1', icon: '🌸', isCorrect: true },
      { id: 'c_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡', isCorrect: false },
      { id: 'c_green', label: 'Màu Xanh Lá', audioId: 'color_green', color: '#66BB6A', icon: '🟢', isCorrect: false },
    ],
  },

  // --- 2. HÌNH DẠNG ---
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
  {
    id: 'q_shape_rectangle',
    category: 'shape',
    promptText: 'Bạn chạm vào hình chữ nhật nhé!',
    promptAudio: 'prompt_find_rectangle',
    choices: [
      { id: 's_circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴', isCorrect: false },
      { id: 's_rectangle', label: 'Hình Chữ Nhật', audioId: 'shape_rectangle', color: '#66BB6A', icon: '🟩', isCorrect: true },
      { id: 's_star', label: 'Ngôi Sao', audioId: 'shape_star', color: '#FED000', icon: '⭐', isCorrect: false },
    ],
  },
  {
    id: 'q_shape_heart',
    category: 'shape',
    promptText: 'Bạn chạm vào hình trái tim nhé!',
    promptAudio: 'prompt_find_heart',
    choices: [
      { id: 's_triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#FED000', icon: '🔺', isCorrect: false },
      { id: 's_heart', label: 'Hình Trái Tim', audioId: 'shape_heart', color: '#E91E63', icon: '💖', isCorrect: true },
      { id: 's_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: false },
    ],
  },

  // --- 3. CON SỐ (1 - 10) ---
  {
    id: 'q_number_1',
    category: 'number',
    promptText: 'Bé tìm số 1 nhé!',
    promptAudio: 'prompt_find_number_1',
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
    promptAudio: 'prompt_find_number_2',
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
    promptAudio: 'prompt_find_number_3',
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
    promptAudio: 'prompt_find_number_4',
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
  {
    id: 'q_number_6',
    category: 'number',
    promptText: 'Bé tìm số 6 nhé!',
    promptAudio: 'prompt_find_number_6',
    choices: [
      { id: 'n_6', label: 'Số 6', audioId: 'count_6', color: '#66BB6A', icon: '6️⃣', isCorrect: true },
      { id: 'n_4', label: 'Số 4', audioId: 'count_4', color: '#AB47BC', icon: '4️⃣', isCorrect: false },
      { id: 'n_7', label: 'Số 7', audioId: 'count_7', color: '#26A69A', icon: '7️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_7',
    category: 'number',
    promptText: 'Bé tìm số 7 nhé!',
    promptAudio: 'prompt_find_number_7',
    choices: [
      { id: 'n_5', label: 'Số 5', audioId: 'number_5', color: '#FF7043', icon: '5️⃣', isCorrect: false },
      { id: 'n_7', label: 'Số 7', audioId: 'count_7', color: '#26A69A', icon: '7️⃣', isCorrect: true },
      { id: 'n_8', label: 'Số 8', audioId: 'count_8', color: '#AB47BC', icon: '8️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_8',
    category: 'number',
    promptText: 'Bé tìm số 8 nhé!',
    promptAudio: 'prompt_find_number_8',
    choices: [
      { id: 'n_6', label: 'Số 6', audioId: 'count_6', color: '#66BB6A', icon: '6️⃣', isCorrect: false },
      { id: 'n_8', label: 'Số 8', audioId: 'count_8', color: '#AB47BC', icon: '8️⃣', isCorrect: true },
      { id: 'n_9', label: 'Số 9', audioId: 'count_9', color: '#FFCA28', icon: '9️⃣', isCorrect: false },
    ],
  },
  {
    id: 'q_number_9',
    category: 'number',
    promptText: 'Bé tìm số 9 nhé!',
    promptAudio: 'prompt_find_number_9',
    choices: [
      { id: 'n_9', label: 'Số 9', audioId: 'count_9', color: '#FFCA28', icon: '9️⃣', isCorrect: true },
      { id: 'n_7', label: 'Số 7', audioId: 'count_7', color: '#26A69A', icon: '7️⃣', isCorrect: false },
      { id: 'n_10', label: 'Số 10', audioId: 'count_10', color: '#42A5F5', icon: '🔟', isCorrect: false },
    ],
  },
  {
    id: 'q_number_10',
    category: 'number',
    promptText: 'Bé tìm số 10 nhé!',
    promptAudio: 'prompt_find_number_10',
    choices: [
      { id: 'n_8', label: 'Số 8', audioId: 'count_8', color: '#AB47BC', icon: '8️⃣', isCorrect: false },
      { id: 'n_10', label: 'Số 10', audioId: 'count_10', color: '#42A5F5', icon: '🔟', isCorrect: true },
      { id: 'n_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: false },
    ],
  },

  // --- 4. BẢNG CHỮ CÁI TIẾNG VIỆT (THEO 5 NHÓM) ---
  // Nhóm 1: a, e, i, o, u, y
  {
    id: 'q_letter_a',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ a nhé!',
    promptAudio: 'prompt_find_letter_a',
    choices: [
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: 'A a', isCorrect: true },
      { id: 'l_e', label: 'Chữ e', audioId: 'letter_e', color: '#448AFF', icon: 'E e', isCorrect: false },
      { id: 'l_o', label: 'Chữ o', audioId: 'letter_o', color: '#FED000', icon: 'O o', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_e',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ e nhé!',
    promptAudio: 'prompt_find_letter_e',
    choices: [
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: 'A a', isCorrect: false },
      { id: 'l_e', label: 'Chữ e', audioId: 'letter_e', color: '#448AFF', icon: 'E e', isCorrect: true },
      { id: 'l_u', label: 'Chữ u', audioId: 'letter_u', color: '#66BB6A', icon: 'U u', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_i',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ i nhé!',
    promptAudio: 'prompt_find_letter_i',
    choices: [
      { id: 'l_o', label: 'Chữ o', audioId: 'letter_o', color: '#FED000', icon: 'O o', isCorrect: false },
      { id: 'l_y', label: 'Chữ y', audioId: 'letter_y', color: '#AB47BC', icon: 'Y y', isCorrect: false },
      { id: 'l_i', label: 'Chữ i', audioId: 'letter_i', color: '#42A5F5', icon: 'I i', isCorrect: true },
    ],
  },
  {
    id: 'q_letter_o',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ o nhé!',
    promptAudio: 'prompt_find_letter_o',
    choices: [
      { id: 'l_o', label: 'Chữ o', audioId: 'letter_o', color: '#FED000', icon: 'O o', isCorrect: true },
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: 'A a', isCorrect: false },
      { id: 'l_u', label: 'Chữ u', audioId: 'letter_u', color: '#66BB6A', icon: 'U u', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_u',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ u nhé!',
    promptAudio: 'prompt_find_letter_u',
    choices: [
      { id: 'l_e', label: 'Chữ e', audioId: 'letter_e', color: '#448AFF', icon: 'E e', isCorrect: false },
      { id: 'l_u', label: 'Chữ u', audioId: 'letter_u', color: '#66BB6A', icon: 'U u', isCorrect: true },
      { id: 'l_o', label: 'Chữ o', audioId: 'letter_o', color: '#FED000', icon: 'O o', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_y',
    category: 'letter',
    group: 1,
    promptText: 'Bạn chạm vào chữ y nhé!',
    promptAudio: 'prompt_find_letter_y',
    choices: [
      { id: 'l_y', label: 'Chữ y', audioId: 'letter_y', color: '#AB47BC', icon: 'Y y', isCorrect: true },
      { id: 'l_i', label: 'Chữ i', audioId: 'letter_i', color: '#42A5F5', icon: 'I i', isCorrect: false },
      { id: 'l_a', label: 'Chữ a', audioId: 'letter_a', color: '#FF5252', icon: 'A a', isCorrect: false },
    ],
  },

  // Nhóm 2: ă, â, ê, ô, ơ, ư
  {
    id: 'q_letter_o_circumflex',
    category: 'letter',
    group: 2,
    promptText: 'Bạn chạm vào chữ ô nhé!',
    promptAudio: 'prompt_find_letter_o_circumflex',
    choices: [
      { id: 'l_o_cir', label: 'Chữ ô', audioId: 'letter_o_circumflex', color: '#AB47BC', icon: 'Ô ô', isCorrect: true },
      { id: 'l_e_cir', label: 'Chữ ê', audioId: 'letter_e_circumflex', color: '#66BB6A', icon: 'Ê ê', isCorrect: false },
      { id: 'l_u_horn', label: 'Chữ ư', audioId: 'letter_u_horn', color: '#448AFF', icon: 'Ư ư', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_e_circumflex',
    category: 'letter',
    group: 2,
    promptText: 'Bạn chạm vào chữ ê nhé!',
    promptAudio: 'prompt_find_letter_e_circumflex',
    choices: [
      { id: 'l_e_cir', label: 'Chữ ê', audioId: 'letter_e_circumflex', color: '#66BB6A', icon: 'Ê ê', isCorrect: true },
      { id: 'l_o_cir', label: 'Chữ ô', audioId: 'letter_o_circumflex', color: '#AB47BC', icon: 'Ô ô', isCorrect: false },
      { id: 'l_a_breve', label: 'Chữ á', audioId: 'letter_a_breve', color: '#FF5252', icon: 'Ă ă', isCorrect: false },
    ],
  },

  // Nhóm 3: m, n, t, l, h, c
  {
    id: 'q_letter_m',
    category: 'letter',
    group: 3,
    promptText: 'Bạn chạm vào chữ mờ nhé!',
    promptAudio: 'prompt_find_letter_m',
    choices: [
      { id: 'l_n', label: 'Chữ nờ', audioId: 'letter_n', color: '#448AFF', icon: 'N n', isCorrect: false },
      { id: 'l_m', label: 'Chữ mờ', audioId: 'letter_m', color: '#FF5252', icon: 'M m', isCorrect: true },
      { id: 'l_c', label: 'Chữ cờ', audioId: 'letter_c', color: '#FED000', icon: 'C c', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_c',
    category: 'letter',
    group: 3,
    promptText: 'Bạn chạm vào chữ cờ nhé!',
    promptAudio: 'prompt_find_letter_c',
    choices: [
      { id: 'l_c', label: 'Chữ cờ', audioId: 'letter_c', color: '#FED000', icon: 'C c', isCorrect: true },
      { id: 'l_m', label: 'Chữ mờ', audioId: 'letter_m', color: '#FF5252', icon: 'M m', isCorrect: false },
      { id: 'l_h', label: 'Chữ hờ', audioId: 'letter_h', color: '#66BB6A', icon: 'H h', isCorrect: false },
    ],
  },

  // Nhóm 4: b, p, v, x, s, r
  {
    id: 'q_letter_b',
    category: 'letter',
    group: 4,
    promptText: 'Bạn chạm vào chữ bờ nhé!',
    promptAudio: 'prompt_find_letter_b',
    choices: [
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: 'B b', isCorrect: true },
      { id: 'l_p', label: 'Chữ pờ', audioId: 'letter_p', color: '#AB47BC', icon: 'P p', isCorrect: false },
      { id: 'l_v', label: 'Chữ vờ', audioId: 'letter_v', color: '#66BB6A', icon: 'V v', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_v',
    category: 'letter',
    group: 4,
    promptText: 'Bạn chạm vào chữ vờ nhé!',
    promptAudio: 'prompt_find_letter_v',
    choices: [
      { id: 'l_v', label: 'Chữ vờ', audioId: 'letter_v', color: '#66BB6A', icon: 'V v', isCorrect: true },
      { id: 'l_b', label: 'Chữ bờ', audioId: 'letter_b', color: '#448AFF', icon: 'B b', isCorrect: false },
      { id: 'l_s', label: 'Chữ sờ', audioId: 'letter_s', color: '#FED000', icon: 'S s', isCorrect: false },
    ],
  },

  // Nhóm 5: d, đ, g, k, q
  {
    id: 'q_letter_dd',
    category: 'letter',
    group: 5,
    promptText: 'Bạn chạm vào chữ đờ nhé!',
    promptAudio: 'prompt_find_letter_dd',
    choices: [
      { id: 'l_d', label: 'Chữ dờ', audioId: 'letter_d', color: '#FF5252', icon: 'D d', isCorrect: false },
      { id: 'l_dd', label: 'Chữ đờ', audioId: 'letter_dd', color: '#66BB6A', icon: 'Đ đ', isCorrect: true },
      { id: 'l_g', label: 'Chữ gờ', audioId: 'letter_g', color: '#448AFF', icon: 'G g', isCorrect: false },
    ],
  },
  {
    id: 'q_letter_g',
    category: 'letter',
    group: 5,
    promptText: 'Bạn chạm vào chữ gờ nhé!',
    promptAudio: 'prompt_find_letter_g',
    choices: [
      { id: 'l_g', label: 'Chữ gờ', audioId: 'letter_g', color: '#448AFF', icon: 'G g', isCorrect: true },
      { id: 'l_dd', label: 'Chữ đờ', audioId: 'letter_dd', color: '#66BB6A', icon: 'Đ đ', isCorrect: false },
      { id: 'l_k', label: 'Chữ ca', audioId: 'letter_k', color: '#FED000', icon: 'K k', isCorrect: false },
    ],
  },
]

/**
 * Thuật toán sinh 15 câu ngẫu nhiên chống trùng lặp theo hồ sơ bé và nhóm chữ cái đã mở
 */
export async function generate15QuestionSession(profileId: string): Promise<SessionQuestion[]> {
  try {
    // 1. Kiểm tra các nhóm chữ cái đã mở từ Dexie
    const unlockedSetting = await db.settings.get('unlockedAlphabetGroups')
    const unlockedGroups: number[] = unlockedSetting?.value || [1]

    // 2. Lọc ngân hàng câu hỏi phù hợp
    const availableQuestions = QUESTION_POOL.filter((q) => {
      if (q.category === 'letter') {
        return q.group ? unlockedGroups.includes(q.group) : true
      }
      return true
    })

    // 3. Lấy lịch sử độ thành thạo và thời gian học gần nhất của bé
    const masteries = await db.itemMastery
      .where('profileId')
      .equals(profileId)
      .toArray()

    const masteryMap = new Map<string, { lastSeenAt: number; streak: number }>()
    masteries.forEach((m) => {
      masteryMap.set(m.itemId, { lastSeenAt: m.lastSeenAt, streak: m.streak })
    })

    // 4. Chấm điểm ưu tiên cho từng câu hỏi
    const now = Date.now()
    const scoredQuestions = availableQuestions.map((q) => {
      const history = masteryMap.get(q.id)
      let score = 0

      if (!history) {
        // Chưa học bao giờ: ưu tiên cao nhất
        score = 1000000 + Math.random() * 500
      } else {
        // Càng lâu chưa học thì điểm càng cao
        const elapsedMinutes = (now - history.lastSeenAt) / (1000 * 60)
        score = elapsedMinutes + Math.random() * 10
      }

      return { question: q, score }
    })

    // 5. Sắp xếp giảm dần theo điểm ưu tiên
    scoredQuestions.sort((a, b) => b.score - a.score)

    // 6. Lấy 15 câu đa dạng thể loại (cân đối Màu sắc, Hình khối, Số, Chữ cái)
    const selected: SessionQuestion[] = []
    const categoriesCount = { color: 0, shape: 0, number: 0, letter: 0 }

    for (const item of scoredQuestions) {
      if (selected.length >= 15) break

      const cat = item.question.category
      // Mỗi thể loại khoảng 4 câu để phiên học cân bằng
      if (categoriesCount[cat] < 5 || selected.length >= 11) {
        const shuffledChoices = [...item.question.choices].sort(() => Math.random() - 0.5)
        selected.push({
          ...item.question,
          choices: shuffledChoices,
        })
        categoriesCount[cat]++
      }
    }

    // 7. Nếu chưa đủ 15 câu, bổ sung các câu còn lại
    if (selected.length < 15) {
      for (const item of scoredQuestions) {
        if (selected.length >= 15) break
        if (!selected.some((s) => s.id === item.question.id)) {
          const shuffledChoices = [...item.question.choices].sort(() => Math.random() - 0.5)
          selected.push({
            ...item.question,
            choices: shuffledChoices,
          })
        }
      }
    }

    // Đảo thứ tự 15 câu để tạo sự bất ngờ thú vị cho bé
    return selected.sort(() => Math.random() - 0.5)
  } catch (e) {
    console.warn('Lỗi thuật toán chống trùng lặp, dùng fallback ngẫu nhiên:', e)
    return [...QUESTION_POOL].sort(() => Math.random() - 0.5).slice(0, 15)
  }
}

// Giữ lại tên cũ để tương thích ngược
export const generate12QuestionSession = generate15QuestionSession
