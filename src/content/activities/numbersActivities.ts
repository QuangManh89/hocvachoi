import type { AnyActivityData } from '@/core/activity-engine/types'

export const numbersActivities: AnyActivityData[] = [
  // 1. Mẫu EXPLORE: Khám phá mặt số 1 đến 5
  {
    id: 'numbers_1_5_explore',
    title: 'Khám Phá Số 1 Đến 5',
    module: 'numbers',
    template: 'explore',
    ageMin: 2,
    learningGoal: 'Bé làm quen mặt số và số lượng từ 1 đến 5',
    promptText: 'Chạm vào các số để nghe Pikachu đọc nhé!',
    promptAudio: 'pikachu_greeting',
    rewardStars: 1,
    items: [
      { id: 'num_1', label: 'Số 1', audioId: 'count_1', displayChar: '1', subLabel: '● Một', color: '#FFEBEE' },
      { id: 'num_2', label: 'Số 2', audioId: 'count_2', displayChar: '2', subLabel: '●● Hai', color: '#E3F2FD' },
      { id: 'num_3', label: 'Số 3', audioId: 'count_3', displayChar: '3', subLabel: '●●● Ba', color: '#FFFDE7' },
      { id: 'num_4', label: 'Số 4', audioId: 'count_4', displayChar: '4', subLabel: '●●●● Bốn', color: '#F3E5F5' },
      { id: 'num_5', label: 'Số 5', audioId: 'number_5', displayChar: '5', subLabel: '●●●●● Năm', color: '#E8F5E9' },
    ],
  },

  // 2. Mẫu EXPLORE: Khám phá mặt số 6 đến 10
  {
    id: 'numbers_6_10_explore',
    title: 'Khám Phá Số 6 Đến 10',
    module: 'numbers',
    template: 'explore',
    ageMin: 3,
    learningGoal: 'Bé làm quen mặt số và số lượng từ 6 đến 10',
    promptText: 'Chạm vào các số để nghe Pikachu đọc nhé!',
    promptAudio: 'pikachu_greeting',
    rewardStars: 1,
    items: [
      { id: 'num_6', label: 'Số 6', audioId: 'count_6', displayChar: '6', subLabel: 'Sáu', color: '#FFF3E0' },
      { id: 'num_7', label: 'Số 7', audioId: 'count_7', displayChar: '7', subLabel: 'Bảy', color: '#E0F2F1' },
      { id: 'num_8', label: 'Số 8', audioId: 'count_8', displayChar: '8', subLabel: 'Tám', color: '#FCE4EC' },
      { id: 'num_9', label: 'Số 9', audioId: 'count_9', displayChar: '9', subLabel: 'Chín', color: '#EDE7F6' },
      { id: 'num_10', label: 'Số 10', audioId: 'count_10', displayChar: '10', subLabel: 'Mười', color: '#FFF8E1' },
    ],
  },

  // 3. Mẫu TAP_COUNT: Đếm chạm quả táo 1 đến 5
  {
    id: 'numbers_count_apples',
    title: 'Đếm Táo Cùng Pikachu (1-5)',
    module: 'numbers',
    template: 'tap_count',
    ageMin: 2,
    learningGoal: 'Bé luyện tập đếm tuần tự từ 1 đến 5 bằng cử chỉ chạm ngón tay',
    promptText: 'Bé chạm từng quả táo để đếm nhé!',
    promptAudio: 'prompt_count_apples',
    targetCount: 5,
    itemIcon: '🍎',
    itemColor: '#FF5252',
    rewardStars: 1,
  },

  // 4. Mẫu TAP_COUNT: Đếm chạm hoa 1 đến 10
  {
    id: 'numbers_count_flowers',
    title: 'Đếm Hoa Cùng Pikachu (1-10)',
    module: 'numbers',
    template: 'tap_count',
    ageMin: 3,
    learningGoal: 'Bé mở rộng khả năng đếm tuần tự từ 1 đến 10',
    promptText: 'Bé đếm từng bông hoa nhé!',
    promptAudio: 'prompt_count_flowers',
    targetCount: 10,
    itemIcon: '🌸',
    itemColor: '#E91E63',
    rewardStars: 1,
  },

  // 5. Mẫu LISTEN_PICK: Nghe và chọn mặt số 1-5
  {
    id: 'numbers_listen_pick_1_5',
    title: 'Tìm Số (1 Đến 5)',
    module: 'numbers',
    template: 'listen_pick',
    ageMin: 2,
    learningGoal: 'Bé lắng nghe phát âm và nhận biết chữ số từ 1 đến 5',
    promptText: 'Bạn chạm vào số năm nhé!',
    promptAudio: 'prompt_find_number_5',
    targetId: 'choice_5',
    rewardStars: 1,
    choices: [
      { id: 'choice_2', label: 'Số 2', audioId: 'count_2', color: '#448AFF', icon: '2️⃣', isCorrect: false },
      { id: 'choice_5', label: 'Số 5', audioId: 'number_5', color: '#FF7043', icon: '5️⃣', isCorrect: true },
      { id: 'choice_1', label: 'Số 1', audioId: 'count_1', color: '#FF5252', icon: '1️⃣', isCorrect: false },
    ],
  },

  // 6. Mẫu LISTEN_PICK: Nghe và chọn mặt số 6-10
  {
    id: 'numbers_listen_pick_6_10',
    title: 'Tìm Số (6 Đến 10)',
    module: 'numbers',
    template: 'listen_pick',
    ageMin: 3,
    learningGoal: 'Bé lắng nghe phát âm và nhận biết chữ số từ 6 đến 10',
    promptText: 'Bé tìm số tám nhé!',
    promptAudio: 'prompt_find_number_8',
    targetId: 'choice_8',
    rewardStars: 1,
    choices: [
      { id: 'choice_6', label: 'Số 6', audioId: 'count_6', color: '#66BB6A', icon: '6️⃣', isCorrect: false },
      { id: 'choice_8', label: 'Số 8', audioId: 'count_8', color: '#AB47BC', icon: '8️⃣', isCorrect: true },
      { id: 'choice_10', label: 'Số 10', audioId: 'count_10', color: '#FED000', icon: '🔟', isCorrect: false },
    ],
  },

  // 7. Mẫu MATCH: Ghép số với số lượng
  {
    id: 'numbers_match_quantity',
    title: 'Ghép Số Với Số Lượng',
    module: 'numbers',
    template: 'match',
    ageMin: 3,
    learningGoal: 'Bé hiểu mối liên hệ giữa chữ số tượng trưng và số lượng đồ vật thực tế',
    promptText: 'Bé ghép số với số lượng quả nhé!',
    promptAudio: 'prompt_match_quantity',
    rewardStars: 1,
    pairs: [
      { id: 'pair_1', label: 'Số 1', audioId: 'count_1', leftType: 'number', leftValue: '1', rightType: 'count', rightValue: '🍓' },
      { id: 'pair_2', label: 'Số 2', audioId: 'count_2', leftType: 'number', leftValue: '2', rightType: 'count', rightValue: '🍌 🍌' },
      { id: 'pair_3', label: 'Số 3', audioId: 'count_3', leftType: 'number', leftValue: '3', rightType: 'count', rightValue: '🍎 🍎 🍎' },
      { id: 'pair_4', label: 'Số 4', audioId: 'count_4', leftType: 'number', leftValue: '4', rightType: 'count', rightValue: '⭐ ⭐ ⭐ ⭐' },
    ],
  },

  // 8. Mẫu LISTEN_PICK: So sánh nhiều hơn / ít hơn
  {
    id: 'numbers_more_less',
    title: 'Bên Nào Nhiều Hơn?',
    module: 'numbers',
    template: 'listen_pick',
    ageMin: 3,
    learningGoal: 'Bé quan sát trực quan và so sánh lượng nhiều hơn hoặc ít hơn',
    promptText: 'Bên nào nhiều quả hơn?',
    promptAudio: 'prompt_more_fruits',
    targetId: 'choice_more',
    rewardStars: 1,
    choices: [
      { id: 'choice_less', label: 'Ít hơn (2 quả)', audioId: 'so_it_hon', color: '#42A5F5', icon: '🍎 🍎', isCorrect: false },
      { id: 'choice_more', label: 'Nhiều hơn (5 quả)', audioId: 'so_nhieu_hon', color: '#FF7043', icon: '🍎 🍎 🍎 🍎 🍎', isCorrect: true },
    ],
  },

  // 9. Mẫu TRACE: Bé tập tô nét số 1
  {
    id: 'numbers_trace_1',
    title: 'Tô Nét Số 1',
    module: 'numbers',
    template: 'trace',
    ageMin: 2,
    learningGoal: 'Bé rèn luyện kỹ năng vận động tinh và viết số 1',
    promptText: 'Bé dùng tay tô theo nét số 1 nhé!',
    promptAudio: 'prompt_trace_number',
    rewardStars: 1,
    displayChar: '1',
    charAudio: 'count_1',
    subLabel: 'Số 1 - Một Quả Táo 🍎',
    strokes: [
      {
        id: 'stroke_num1_1',
        label: 'Nét xiên lên',
        guidePathD: 'M 35 38 L 50 22',
        points: [
          { x: 35, y: 38 },
          { x: 50, y: 22 },
        ],
      },
      {
        id: 'stroke_num1_2',
        label: 'Nét sổ thẳng',
        guidePathD: 'M 50 22 L 50 82',
        points: [
          { x: 50, y: 22 },
          { x: 50, y: 52 },
          { x: 50, y: 82 },
        ],
      },
    ],
  },

  // 10. Mẫu TRACE: Bé tập tô nét số 3
  {
    id: 'numbers_trace_3',
    title: 'Tô Nét Số 3',
    module: 'numbers',
    template: 'trace',
    ageMin: 3,
    learningGoal: 'Bé tập vẽ nét cong liên hoàn của số 3',
    promptText: 'Bé dùng tay tô theo nét số 3 nhé!',
    promptAudio: 'prompt_trace_number',
    rewardStars: 1,
    displayChar: '3',
    charAudio: 'count_3',
    subLabel: 'Số 3 - Ba Ngôi Sao ⭐',
    strokes: [
      {
        id: 'stroke_num3_1',
        label: 'Nét cong trên',
        guidePathD: 'M 32 28 C 45 18 68 18 68 35 C 68 45 58 50 48 50',
        points: [
          { x: 32, y: 28 },
          { x: 50, y: 20 },
          { x: 68, y: 32 },
          { x: 52, y: 50 },
        ],
      },
      {
        id: 'stroke_num3_2',
        label: 'Nét cong dưới',
        guidePathD: 'M 48 50 C 62 50 72 58 72 68 C 72 80 48 84 32 74',
        points: [
          { x: 52, y: 50 },
          { x: 70, y: 60 },
          { x: 68, y: 76 },
          { x: 34, y: 74 },
        ],
      },
    ],
  },
]
