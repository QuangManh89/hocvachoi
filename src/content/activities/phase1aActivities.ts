import type { AnyActivityData } from '@/core/activity-engine/types'

export const phase1aActivities: AnyActivityData[] = [
  // 1. Mẫu EXPLORE: Khám phá màu sắc
  {
    id: 'colors_explore_basic',
    title: 'Khám phá Màu Sắc',
    module: 'colors_shapes',
    template: 'explore',
    ageMin: 2,
    learningGoal: 'Bé làm quen và nhận biết các màu sắc cơ bản qua việc chạm tự do',
    promptText: 'Chạm vào các ô màu để nghe Pikachu đọc nhé!',
    promptAudio: 'pikachu_greeting',
    rewardStars: 1,
    items: [
      { id: 'red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴' },
      { id: 'yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡' },
      { id: 'blue', label: 'Màu Xanh Dương', audioId: 'color_blue', color: '#448AFF', icon: '🔵' },
      { id: 'green', label: 'Màu Xanh Lá', audioId: 'color_green', color: '#66BB6A', icon: '🟢' },
    ],
  },

  // 2. Mẫu LISTEN_PICK: Nghe và chọn đúng màu
  {
    id: 'colors_listen_pick_red',
    title: 'Tìm Màu Đỏ',
    module: 'colors_shapes',
    template: 'listen_pick',
    ageMin: 2,
    learningGoal: 'Bé lắng nghe câu hỏi và chọn đúng ô màu tương ứng',
    promptText: 'Bạn chạm vào màu đỏ nhé!',
    promptAudio: 'prompt_find_red',
    targetId: 'choice_red',
    rewardStars: 1,
    choices: [
      { id: 'choice_blue', label: 'Màu Xanh', audioId: 'color_blue', color: '#448AFF', isCorrect: false },
      { id: 'choice_red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', isCorrect: true },
      { id: 'choice_yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', isCorrect: false },
    ],
  },

  // 3. Mẫu MATCH: Ghép hình dạng với bóng
  {
    id: 'shapes_match_shadow',
    title: 'Ghép Hình Với Bóng',
    module: 'colors_shapes',
    template: 'match',
    ageMin: 3,
    learningGoal: 'Bé rèn luyện tư duy nhận diện hình khối và bóng tương ứng',
    promptText: 'Bé ghép hình với bóng nhé!',
    promptAudio: 'prompt_match_shapes',
    rewardStars: 1,
    pairs: [
      { id: 'circle', label: 'Hình tròn', audioId: 'shape_circle', shapeType: 'circle', color: '#FF5252' },
      { id: 'square', label: 'Hình vuông', audioId: 'shape_square', shapeType: 'square', color: '#448AFF' },
      { id: 'triangle', label: 'Hình tam giác', audioId: 'shape_triangle', shapeType: 'triangle', color: '#FED000' },
    ],
  },

  // 4. Mẫu TAP_COUNT: Đếm chạm quả táo 1 đến 5
  {
    id: 'numbers_count_apples',
    title: 'Đếm Quả Cùng Pikachu',
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

  // 5. Mẫu SORT: Phân loại bóng vào giỏ màu
  {
    id: 'colors_sort_baskets',
    title: 'Phân Loại Vào Giỏ',
    module: 'colors_shapes',
    template: 'sort',
    ageMin: 3,
    learningGoal: 'Bé phân biệt màu sắc và nhóm các đồ vật tương đồng vào cùng một giỏ',
    promptText: 'Bé bỏ vật vào đúng giỏ cùng màu nhé!',
    promptAudio: 'prompt_sort_colors',
    rewardStars: 1,
    buckets: [
      { id: 'bucket_red', label: 'Giỏ Đỏ', color: '#FF5252' },
      { id: 'bucket_yellow', label: 'Giỏ Vàng', color: '#FED000' },
      { id: 'bucket_blue', label: 'Giỏ Xanh', color: '#448AFF' },
    ],
    items: [
      { id: 'item_1', bucketId: 'bucket_red', label: 'Dâu tây', color: '#FF5252', icon: '🍓' },
      { id: 'item_2', bucketId: 'bucket_yellow', label: 'Quả chuối', color: '#FED000', icon: '🍌' },
      { id: 'item_3', bucketId: 'bucket_blue', label: 'Ngôi sao', color: '#448AFF', icon: '⭐' },
    ],
  },
]

export const getActivityById = (id: string): AnyActivityData | undefined => {
  return phase1aActivities.find((a) => a.id === id)
}
