import type { AnyActivityData } from '@/core/activity-engine/types'

export const tonesActivities: AnyActivityData[] = [
  // 1. Mẫu EXPLORE: Khám phá 5 dấu thanh tiếng Việt
  {
    id: 'tones_explore',
    title: 'Khám Phá 5 Dấu Thanh',
    module: 'tones',
    template: 'explore',
    ageMin: 3,
    learningGoal: 'Bé làm quen tên gọi và hình dáng 5 dấu thanh tiếng Việt',
    promptText: 'Chạm vào từng dấu thanh để nghe Pikachu đọc nhé!',
    promptAudio: 'prompt_explore_tones',
    rewardStars: 1,
    items: [
      { id: 'tone_sac', label: 'Dấu Sắc', audioId: 'dau_sac', displayChar: 'ˊ', subLabel: '🐟 Con cá', color: '#FFEBEE' },
      { id: 'tone_huyen', label: 'Dấu Huyền', audioId: 'dau_huyen', displayChar: 'ˋ', subLabel: '🦆 Con cò', color: '#E3F2FD' },
      { id: 'tone_hoi', label: 'Dấu Hỏi', audioId: 'dau_hoi', displayChar: 'ˀ', subLabel: '🐯 Con hổ', color: '#FFFDE7' },
      { id: 'tone_nga', label: 'Dấu Ngã', audioId: 'dau_nga', displayChar: '˜', subLabel: '🧢 Cái mũ', color: '#F3E5F5' },
      { id: 'tone_nang', label: 'Dấu Nặng', audioId: 'dau_nang', displayChar: ' ̣', subLabel: '🦜 Con vẹt', color: '#E8F5E9' },
    ],
  },

  // 2. Mẫu LISTEN_PICK: Tìm Dấu Sắc
  {
    id: 'tones_find_sac',
    title: 'Tìm Dấu Sắc (/)',
    module: 'tones',
    template: 'listen_pick',
    ageMin: 3,
    learningGoal: 'Bé nhận biết hình dáng nét xiên phải của Dấu Sắc',
    promptText: 'Bé chạm vào Dấu Sắc nhé!',
    promptAudio: 'prompt_find_dau_sac',
    targetId: 'choice_sac',
    rewardStars: 1,
    choices: [
      { id: 'choice_sac', label: 'Dấu Sắc (/)', audioId: 'dau_sac', color: '#FF5252', icon: '⚡ /', isCorrect: true },
      { id: 'choice_huyen', label: 'Dấu Huyền (\\)', audioId: 'dau_huyen', color: '#448AFF', icon: '\\', isCorrect: false },
      { id: 'choice_nang', label: 'Dấu Nặng (.)', audioId: 'dau_nang', color: '#66BB6A', icon: '●', isCorrect: false },
    ],
  },

  // 3. Mẫu LISTEN_PICK: Tìm Dấu Huyền
  {
    id: 'tones_find_huyen',
    title: 'Tìm Dấu Huyền (\\)',
    module: 'tones',
    template: 'listen_pick',
    ageMin: 3,
    learningGoal: 'Bé nhận diện nét xiên trái của Dấu Huyền',
    promptText: 'Bé chạm vào Dấu Huyền nhé!',
    promptAudio: 'prompt_find_dau_huyen',
    targetId: 'choice_huyen',
    rewardStars: 1,
    choices: [
      { id: 'choice_hoi', label: 'Dấu Hỏi (?)', audioId: 'dau_hoi', color: '#FED000', icon: '?', isCorrect: false },
      { id: 'choice_huyen', label: 'Dấu Huyền (\\)', audioId: 'dau_huyen', color: '#42A5F5', icon: '\\', isCorrect: true },
      { id: 'choice_sac', label: 'Dấu Sắc (/)', audioId: 'dau_sac', color: '#FF7043', icon: '/', isCorrect: false },
    ],
  },

  // 4. Mẫu MATCH: Ghép dấu thanh với từ ngữ minh họa
  {
    id: 'tones_match_word',
    title: 'Ghép Dấu Với Hình',
    module: 'tones',
    template: 'match',
    ageMin: 3,
    learningGoal: 'Bé liên kết dấu thanh với các từ ngữ thân quen',
    promptText: 'Bé hãy ghép dấu thanh với từ phù hợp nhé!',
    promptAudio: 'prompt_match_tones',
    rewardStars: 1,
    pairs: [
      { id: 'pair_sac', label: 'Dấu Sắc', audioId: 'tu_ca', leftType: 'letter', leftValue: 'Dấu Sắc /', rightType: 'word', rightValue: '🐟 Con cá' },
      { id: 'pair_huyen', label: 'Dấu Huyền', audioId: 'tu_co', leftType: 'letter', leftValue: 'Dấu Huyền \\', rightType: 'word', rightValue: '🦆 Con cò' },
      { id: 'pair_hoi', label: 'Dấu Hỏi', audioId: 'tu_ho', leftType: 'letter', leftValue: 'Dấu Hỏi ?', rightType: 'word', rightValue: '🐯 Con hổ' },
      { id: 'pair_nang', label: 'Dấu Nặng', audioId: 'tu_vet', leftType: 'letter', leftValue: 'Dấu Nặng .', rightType: 'word', rightValue: '🦜 Con vẹt' },
    ],
  },

  // 5. Mẫu TRACE: Bé tập tô Dấu Sắc (/)
  {
    id: 'tones_trace_sac',
    title: 'Tô Dấu Sắc',
    module: 'tones',
    template: 'trace',
    ageMin: 3,
    learningGoal: 'Bé tập vẽ nét xiên hướng lên của Dấu Sắc',
    promptText: 'Bé dùng tay tô theo nét Dấu Sắc nhé!',
    promptAudio: 'prompt_trace_tone',
    rewardStars: 1,
    displayChar: '/',
    charAudio: 'dau_sac',
    subLabel: 'Dấu Sắc trong Con cá 🐟',
    strokes: [
      {
        id: 'stroke_sac_1',
        label: 'Nét xiên phải lên',
        guidePathD: 'M 28 72 L 72 28',
        points: [
          { x: 28, y: 72 },
          { x: 50, y: 50 },
          { x: 72, y: 28 },
        ],
      },
    ],
  },

  // 6. Mẫu TRACE: Bé tập tô Dấu Huyền (\)
  {
    id: 'tones_trace_huyen',
    title: 'Tô Dấu Huyền',
    module: 'tones',
    template: 'trace',
    ageMin: 3,
    learningGoal: 'Bé tập vẽ nét xiên hướng xuống của Dấu Huyền',
    promptText: 'Bé dùng tay tô theo nét Dấu Huyền nhé!',
    promptAudio: 'prompt_trace_tone',
    rewardStars: 1,
    displayChar: '\\',
    charAudio: 'dau_huyen',
    subLabel: 'Dấu Huyền trong Con cò 🦆',
    strokes: [
      {
        id: 'stroke_huyen_1',
        label: 'Nét xiên trái xuống',
        guidePathD: 'M 28 28 L 72 72',
        points: [
          { x: 28, y: 28 },
          { x: 50, y: 50 },
          { x: 72, y: 72 },
        ],
      },
    ],
  },

  // 7. Mẫu TRACE: Bé tập tô Dấu Hỏi (?)
  {
    id: 'tones_trace_hoi',
    title: 'Tô Dấu Hỏi',
    module: 'tones',
    template: 'trace',
    ageMin: 3,
    learningGoal: 'Bé tập vẽ móc câu uốn lượn của Dấu Hỏi',
    promptText: 'Bé dùng tay tô theo nét Dấu Hỏi nhé!',
    promptAudio: 'prompt_trace_tone',
    rewardStars: 1,
    displayChar: '?',
    charAudio: 'dau_hoi',
    subLabel: 'Dấu Hỏi trong Con hổ 🐯',
    strokes: [
      {
        id: 'stroke_hoi_1',
        label: 'Nét móc câu uốn cong',
        guidePathD: 'M 32 30 C 35 18 64 18 64 34 C 64 48 50 52 50 68',
        points: [
          { x: 32, y: 30 },
          { x: 48, y: 20 },
          { x: 64, y: 32 },
          { x: 52, y: 50 },
          { x: 50, y: 68 },
        ],
      },
      {
        id: 'stroke_hoi_2',
        label: 'Chấm dưới',
        guidePathD: 'M 50 80 L 50 82',
        points: [
          { x: 50, y: 80 },
        ],
      },
    ],
  },
]
