import type { AnyActivityData } from '@/core/activity-engine/types'

export const colorsShapesActivities: AnyActivityData[] = [
  // 1. Mẫu EXPLORE: Khám phá 10 màu cơ bản
  {
    id: 'colors_explore_10',
    title: 'Khám Phá 10 Màu Sắc',
    module: 'colors_shapes',
    template: 'explore',
    ageMin: 2,
    learningGoal: 'Bé làm quen và nhận biết 10 màu sắc cơ bản qua việc chạm tự do',
    promptText: 'Chạm vào các ô màu để nghe Pikachu đọc nhé!',
    promptAudio: 'pikachu_greeting',
    rewardStars: 1,
    items: [
      { id: 'red', label: 'Màu Đỏ', audioId: 'color_red', color: '#FF5252', icon: '🔴' },
      { id: 'yellow', label: 'Màu Vàng', audioId: 'color_yellow', color: '#FED000', icon: '🟡' },
      { id: 'blue', label: 'Màu Xanh Dương', audioId: 'color_blue', color: '#448AFF', icon: '🔵' },
      { id: 'green', label: 'Màu Xanh Lá', audioId: 'color_green', color: '#66BB6A', icon: '🟢' },
      { id: 'orange', label: 'Màu Cam', audioId: 'color_orange', color: '#FF9800', icon: '🟠' },
      { id: 'purple', label: 'Màu Tím', audioId: 'color_purple', color: '#AB47BC', icon: '🟣' },
      { id: 'pink', label: 'Màu Hồng', audioId: 'color_pink', color: '#F48FB1', icon: '🌸' },
      { id: 'brown', label: 'Màu Nâu', audioId: 'color_brown', color: '#8D6E63', icon: '🟤' },
      { id: 'black', label: 'Màu Đen', audioId: 'color_black', color: '#37474F', icon: '⚫' },
      { id: 'white', label: 'Màu Trắng', audioId: 'color_white', color: '#FFFFFF', icon: '⚪' },
    ],
  },

  // 2. Mẫu SORT: Phân biệt Màu Ấm (Nóng) và Màu Lạnh
  {
    id: 'colors_warm_cool_sort',
    title: 'Phân Loại Màu Ấm & Lạnh',
    module: 'colors_shapes',
    template: 'sort',
    ageMin: 3,
    learningGoal: 'Bé phân biệt nhóm màu ấm (đỏ, vàng, cam) và nhóm màu lạnh (xanh dương, xanh lá, tím)',
    promptText: 'Bé phân loại màu ấm và màu lạnh nhé!',
    promptAudio: 'prompt_sort_warm_cool',
    rewardStars: 1,
    buckets: [
      { id: 'bucket_warm', label: 'Màu Ấm', color: '#FF7043', icon: '☀️' },
      { id: 'bucket_cool', label: 'Màu Lạnh', color: '#42A5F5', icon: '❄️' },
    ],
    items: [
      { id: 'item_fire', bucketId: 'bucket_warm', label: 'Màu Đỏ', color: '#FF5252', icon: '🔴' },
      { id: 'item_sun', bucketId: 'bucket_warm', label: 'Màu Vàng', color: '#FED000', icon: '🟡' },
      { id: 'item_orange', bucketId: 'bucket_warm', label: 'Màu Cam', color: '#FF9800', icon: '🟠' },
      { id: 'item_sea', bucketId: 'bucket_cool', label: 'Màu Xanh Dương', color: '#448AFF', icon: '🔵' },
      { id: 'item_leaf', bucketId: 'bucket_cool', label: 'Màu Xanh Lá', color: '#66BB6A', icon: '🟢' },
      { id: 'item_grape', bucketId: 'bucket_cool', label: 'Màu Tím', color: '#AB47BC', icon: '🟣' },
    ],
  },

  // 3. Mẫu EXPLORE: Khám phá 6 hình khối cơ bản
  {
    id: 'shapes_explore_6',
    title: 'Khám Phá 6 Hình Khối',
    module: 'colors_shapes',
    template: 'explore',
    ageMin: 2,
    learningGoal: 'Bé làm quen tên gọi và đặc điểm nhận dạng 6 hình khối cơ bản',
    promptText: 'Chạm vào các hình để nghe Pikachu đọc nhé!',
    promptAudio: 'pikachu_greeting',
    rewardStars: 1,
    items: [
      { id: 'circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴' },
      { id: 'square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦' },
      { id: 'triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#FED000', icon: '🔺' },
      { id: 'rectangle', label: 'Hình Chữ Nhật', audioId: 'shape_rectangle', color: '#66BB6A', icon: '🟩' },
      { id: 'star', label: 'Ngôi Sao', audioId: 'shape_star', color: '#FF9800', icon: '⭐' },
      { id: 'heart', label: 'Trái Tim', audioId: 'shape_heart', color: '#E91E63', icon: '💖' },
    ],
  },

  // 4. Mẫu MATCH: Ghép hình với bóng
  {
    id: 'shapes_match_shadow',
    title: 'Ghép Hình Với Bóng',
    module: 'colors_shapes',
    template: 'match',
    ageMin: 3,
    learningGoal: 'Bé rèn luyện tư duy không gian và nhận diện bóng tương ứng',
    promptText: 'Bé ghép hình với bóng nhé!',
    promptAudio: 'prompt_match_shapes',
    rewardStars: 1,
    pairs: [
      { id: 'circle', label: 'Hình tròn', audioId: 'shape_circle', shapeType: 'circle', color: '#FF5252' },
      { id: 'square', label: 'Hình vuông', audioId: 'shape_square', shapeType: 'square', color: '#448AFF' },
      { id: 'triangle', label: 'Hình tam giác', audioId: 'shape_triangle', shapeType: 'triangle', color: '#FED000' },
      { id: 'star', label: 'Ngôi sao', audioId: 'shape_star', shapeType: 'star', color: '#FF9800' },
    ],
  },

  // 5. Mẫu LISTEN_PICK: Nghe và chọn hình đúng
  {
    id: 'shapes_listen_pick',
    title: 'Tìm Hình Cùng Pikachu',
    module: 'colors_shapes',
    template: 'listen_pick',
    ageMin: 2,
    learningGoal: 'Bé lắng nghe tên hình khối và chạm chọn hình khối đúng',
    promptText: 'Bạn chạm vào hình tròn nhé!',
    promptAudio: 'prompt_find_circle',
    targetId: 'choice_circle',
    rewardStars: 1,
    choices: [
      { id: 'choice_square', label: 'Hình Vuông', audioId: 'shape_square', color: '#448AFF', icon: '🟦', isCorrect: false },
      { id: 'choice_circle', label: 'Hình Tròn', audioId: 'shape_circle', color: '#FF5252', icon: '🔴', isCorrect: true },
      { id: 'choice_triangle', label: 'Hình Tam Giác', audioId: 'shape_triangle', color: '#FED000', icon: '🔺', isCorrect: false },
    ],
  },

  // 6. Mẫu SORT: Phân loại đồ vật vào giỏ màu sắc
  {
    id: 'colors_sort_baskets',
    title: 'Phân Loại Vào Giỏ Màu',
    module: 'colors_shapes',
    template: 'sort',
    ageMin: 3,
    learningGoal: 'Bé phân biệt màu sắc và nhóm các đồ vật tương đồng vào cùng một giỏ',
    promptText: 'Bé bỏ vật vào đúng giỏ cùng màu nhé!',
    promptAudio: 'prompt_sort_colors',
    rewardStars: 1,
    buckets: [
      { id: 'bucket_red', label: 'Giỏ Đỏ', color: '#FF5252', icon: '🧺' },
      { id: 'bucket_yellow', label: 'Giỏ Vàng', color: '#FED000', icon: '🧺' },
      { id: 'bucket_blue', label: 'Giỏ Xanh', color: '#448AFF', icon: '🧺' },
    ],
    items: [
      { id: 'item_1', bucketId: 'bucket_red', label: 'Dâu tây', color: '#FF5252', icon: '🍓' },
      { id: 'item_2', bucketId: 'bucket_yellow', label: 'Quả chuối', color: '#FED000', icon: '🍌' },
      { id: 'item_3', bucketId: 'bucket_blue', label: 'Viên kim cương', color: '#448AFF', icon: '💎' },
      { id: 'item_4', bucketId: 'bucket_red', label: 'Quả táo', color: '#FF5252', icon: '🍎' },
      { id: 'item_5', bucketId: 'bucket_yellow', label: 'Ngôi sao', color: '#FED000', icon: '⭐' },
      { id: 'item_6', bucketId: 'bucket_blue', label: 'Quả bóng', color: '#448AFF', icon: '⚽' },
    ],
  },

  // 7. Mẫu SORT: Phân loại theo hình khối
  {
    id: 'shapes_sort_baskets',
    title: 'Phân Loại Vào Giỏ Hình',
    module: 'colors_shapes',
    template: 'sort',
    ageMin: 3,
    learningGoal: 'Bé phân biệt hình dạng và đưa đồ vật vào đúng hình khối tương ứng',
    promptText: 'Bé bỏ hình vào đúng giỏ nhé!',
    promptAudio: 'prompt_sort_shapes',
    rewardStars: 1,
    buckets: [
      { id: 'bucket_circle', label: 'Giỏ Hình Tròn', color: '#FF5252', icon: '🔴' },
      { id: 'bucket_square', label: 'Giỏ Hình Vuông', color: '#448AFF', icon: '🟦' },
      { id: 'bucket_triangle', label: 'Giỏ Tam Giác', color: '#FED000', icon: '🔺' },
    ],
    items: [
      { id: 'shape_item_1', bucketId: 'bucket_circle', label: 'Trái cam', color: '#FF9800', icon: '🍊' },
      { id: 'shape_item_2', bucketId: 'bucket_square', label: 'Hộp quà', color: '#AB47BC', icon: '🎁' },
      { id: 'shape_item_3', bucketId: 'bucket_triangle', label: 'Miếng dưa hấu', color: '#66BB6A', icon: '🍉' },
      { id: 'shape_item_4', bucketId: 'bucket_circle', label: 'Mặt trời', color: '#FF5252', icon: '🌞' },
      { id: 'shape_item_5', bucketId: 'bucket_square', label: 'Bánh mì', color: '#8D6E63', icon: '🍞' },
      { id: 'shape_item_6', bucketId: 'bucket_triangle', label: 'Cây thông', color: '#2E7D32', icon: '🌲' },
    ],
  },
]
