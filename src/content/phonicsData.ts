// Dữ liệu Bảng Âm Vần Lớp 1 chuẩn hóa tiếng Việt NFC
// Hỗ trợ phát âm giọng Nữ miền Nam (vi-VN-HoaiMyNeural)

export interface PhonicsItem {
  id: string
  text: string
  read: string
  type: 'tone' | 'sound' | 'rhyme'
  semester?: 1 | 2
  symbol?: string
  example?: string
}

export const PHONICS_TONES: PhonicsItem[] = [
  {
    "id": "dau_huyen",
    "symbol": "`",
    "text": "Dấu huyền",
    "read": "Dấu huyền",
    "type": "tone",
    "example": "bà 👵"
  },
  {
    "id": "dau_sac",
    "symbol": "´",
    "text": "Dấu sắc",
    "read": "Dấu sắc",
    "type": "tone",
    "example": "bé 👶"
  },
  {
    "id": "dau_nang",
    "symbol": ".",
    "text": "Dấu nặng",
    "read": "Dấu nặng",
    "type": "tone",
    "example": "mẹ 👩"
  },
  {
    "id": "dau_hoi",
    "symbol": "ˀ",
    "text": "Dấu hỏi",
    "read": "Dấu hỏi",
    "type": "tone",
    "example": "cỏ 🌿"
  },
  {
    "id": "dau_nga",
    "symbol": "~",
    "text": "Dấu ngã",
    "read": "Dấu ngã",
    "type": "tone",
    "example": "gỗ 🪵"
  }
];

export const PHONICS_SOUNDS: PhonicsItem[] = [
  {
    "id": "am_a",
    "text": "a",
    "read": "a",
    "type": "sound",
    "example": "ba 👨"
  },
  {
    "id": "am_a_breve",
    "text": "ă",
    "read": "á",
    "type": "sound",
    "example": "khăn 🧣"
  },
  {
    "id": "am_a_circumflex",
    "text": "â",
    "read": "ớ",
    "type": "sound",
    "example": "cây 🌳"
  },
  {
    "id": "am_b",
    "text": "b",
    "read": "bờ",
    "type": "sound",
    "example": "bóng ⚽"
  },
  {
    "id": "am_c",
    "text": "c",
    "read": "cờ",
    "type": "sound",
    "example": "cá 🐟"
  },
  {
    "id": "am_o",
    "text": "o",
    "read": "o",
    "type": "sound",
    "example": "ong 🐝"
  },
  {
    "id": "am_o_circumflex",
    "text": "ô",
    "read": "ô",
    "type": "sound",
    "example": "ô dù ☂️"
  },
  {
    "id": "am_o_horn",
    "text": "ơ",
    "read": "ơ",
    "type": "sound",
    "example": "cờ 🚩"
  },
  {
    "id": "am_v",
    "text": "v",
    "read": "vờ",
    "type": "sound",
    "example": "vịt 🦆"
  },
  {
    "id": "am_e",
    "text": "e",
    "read": "e",
    "type": "sound",
    "example": "xe 🚗"
  },
  {
    "id": "am_e_circumflex",
    "text": "ê",
    "read": "ê",
    "type": "sound",
    "example": "bê 🐮"
  },
  {
    "id": "am_d",
    "text": "d",
    "read": "dờ",
    "type": "sound",
    "example": "dê 🐐"
  },
  {
    "id": "am_dd",
    "text": "đ",
    "read": "đờ",
    "type": "sound",
    "example": "đò 🛶"
  },
  {
    "id": "am_i",
    "text": "i",
    "read": "i",
    "type": "sound",
    "example": "bi 🔮"
  },
  {
    "id": "am_k",
    "text": "k",
    "read": "cờ",
    "type": "sound",
    "example": "kẹo 🍬"
  },
  {
    "id": "am_l",
    "text": "l",
    "read": "lờ",
    "type": "sound",
    "example": "lá 🍃"
  },
  {
    "id": "am_h",
    "text": "h",
    "read": "hờ",
    "type": "sound",
    "example": "hoa 🌸"
  },
  {
    "id": "am_ch",
    "text": "ch",
    "read": "chờ",
    "type": "sound",
    "example": "chim 🐦"
  },
  {
    "id": "am_kh",
    "text": "kh",
    "read": "khờ",
    "type": "sound",
    "example": "khỉ 🐒"
  },
  {
    "id": "am_n",
    "text": "n",
    "read": "nờ",
    "type": "sound",
    "example": "nơ 🎀"
  },
  {
    "id": "am_m",
    "text": "m",
    "read": "mờ",
    "type": "sound",
    "example": "mèo 🐱"
  },
  {
    "id": "am_u",
    "text": "u",
    "read": "u",
    "type": "sound",
    "example": "đu đủ 🍈"
  },
  {
    "id": "am_u_horn",
    "text": "ư",
    "read": "ư",
    "type": "sound",
    "example": "sư tử 🦁"
  },
  {
    "id": "am_g",
    "text": "g",
    "read": "gờ",
    "type": "sound",
    "example": "gà 🐔"
  },
  {
    "id": "am_gh",
    "text": "gh",
    "read": "gờ",
    "type": "sound",
    "example": "ghế 🪑"
  },
  {
    "id": "am_ng",
    "text": "ng",
    "read": "ngờ",
    "type": "sound",
    "example": "ngựa 🐎"
  },
  {
    "id": "am_ngh",
    "text": "ngh",
    "read": "ngờ",
    "type": "sound",
    "example": "nghé 🐃"
  },
  {
    "id": "am_t",
    "text": "t",
    "read": "tờ",
    "type": "sound",
    "example": "tàu 🚢"
  },
  {
    "id": "am_th",
    "text": "th",
    "read": "thờ",
    "type": "sound",
    "example": "thỏ 🐰"
  },
  {
    "id": "am_nh",
    "text": "nh",
    "read": "nhờ",
    "type": "sound",
    "example": "nhà 🏠"
  },
  {
    "id": "am_r",
    "text": "r",
    "read": "rờ",
    "type": "sound",
    "example": "rùa 🐢"
  },
  {
    "id": "am_tr",
    "text": "tr",
    "read": "trờ",
    "type": "sound",
    "example": "trăng 🌙"
  },
  {
    "id": "am_ia",
    "text": "ia",
    "read": "ia",
    "type": "sound",
    "example": "mía 🎋"
  },
  {
    "id": "am_ua",
    "text": "ua",
    "read": "ua",
    "type": "sound",
    "example": "cua 🦀"
  },
  {
    "id": "am_ua_horn",
    "text": "ưa",
    "read": "ưa",
    "type": "sound",
    "example": "dưa 🍉"
  },
  {
    "id": "am_p",
    "text": "p",
    "read": "pờ",
    "type": "sound",
    "example": "pin 🔋"
  },
  {
    "id": "am_ph",
    "text": "ph",
    "read": "phờ",
    "type": "sound",
    "example": "phở 🍜"
  },
  {
    "id": "am_s",
    "text": "s",
    "read": "sờ",
    "type": "sound",
    "example": "sao ⭐"
  },
  {
    "id": "am_x",
    "text": "x",
    "read": "xờ",
    "type": "sound",
    "example": "xe 🚙"
  },
  {
    "id": "am_q_qu",
    "text": "q-qu",
    "read": "quờ",
    "type": "sound",
    "example": "quạt 🪭"
  },
  {
    "id": "am_y",
    "text": "y",
    "read": "i",
    "type": "sound",
    "example": "y tế 🩺"
  },
  {
    "id": "am_gi",
    "text": "gi",
    "read": "gi",
    "type": "sound",
    "example": "giỏ 🧺"
  }
];

export const PHONICS_RHYMES_K1: PhonicsItem[] = [
  {
    "id": "van_i_a",
    "text": "ia",
    "read": "ia",
    "type": "rhyme",
    "semester": 1,
    "example": "thìa 🥄"
  },
  {
    "id": "van_u_a",
    "text": "ua",
    "read": "ua",
    "type": "rhyme",
    "semester": 1,
    "example": "rùa 🐢"
  },
  {
    "id": "van_u_horn_a",
    "text": "ưa",
    "read": "ưa",
    "type": "rhyme",
    "semester": 1,
    "example": "mưa 🌧️"
  },
  {
    "id": "van_a_o",
    "text": "ao",
    "read": "ao",
    "type": "rhyme",
    "semester": 1,
    "example": "áo 👕"
  },
  {
    "id": "van_e_o",
    "text": "eo",
    "read": "eo",
    "type": "rhyme",
    "semester": 1,
    "example": "mèo 🐱"
  },
  {
    "id": "van_a_u",
    "text": "au",
    "read": "au",
    "type": "rhyme",
    "semester": 1,
    "example": "tàu 🚢"
  },
  {
    "id": "van_e_circumflex_u",
    "text": "êu",
    "read": "êu",
    "type": "rhyme",
    "semester": 1,
    "example": "kêu 📢"
  },
  {
    "id": "van_a_circumflex_u",
    "text": "âu",
    "read": "âu",
    "type": "rhyme",
    "semester": 1,
    "example": "cầu 🌉"
  },
  {
    "id": "van_i_u",
    "text": "iu",
    "read": "iu",
    "type": "rhyme",
    "semester": 1,
    "example": "dìu 🤝"
  },
  {
    "id": "van_u_horn_u",
    "text": "ưu",
    "read": "ưu",
    "type": "rhyme",
    "semester": 1,
    "example": "cừu 🐑"
  },
  {
    "id": "van_a_i",
    "text": "ai",
    "read": "ai",
    "type": "rhyme",
    "semester": 1,
    "example": "tai 👂"
  },
  {
    "id": "van_o_i",
    "text": "oi",
    "read": "oi",
    "type": "rhyme",
    "semester": 1,
    "example": "voi 🐘"
  },
  {
    "id": "van_o_circumflex_i",
    "text": "ôi",
    "read": "ôi",
    "type": "rhyme",
    "semester": 1,
    "example": "ổi 🍐"
  },
  {
    "id": "van_o_horn_i",
    "text": "ơi",
    "read": "ơi",
    "type": "rhyme",
    "semester": 1,
    "example": "bơi 🏊"
  },
  {
    "id": "van_u_i",
    "text": "ui",
    "read": "ui",
    "type": "rhyme",
    "semester": 1,
    "example": "túi 👜"
  },
  {
    "id": "van_u_horn_i",
    "text": "ưi",
    "read": "ưi",
    "type": "rhyme",
    "semester": 1,
    "example": "ngửi 👃"
  },
  {
    "id": "van_a_y",
    "text": "ay",
    "read": "ay",
    "type": "rhyme",
    "semester": 1,
    "example": "tay ✋"
  },
  {
    "id": "van_a_circumflex_y",
    "text": "ây",
    "read": "ây",
    "type": "rhyme",
    "semester": 1,
    "example": "mây ☁️"
  },
  {
    "id": "van_a_c",
    "text": "ac",
    "read": "ac",
    "type": "rhyme",
    "semester": 1,
    "example": "bạc 🪙"
  },
  {
    "id": "van_a_circumflex_c",
    "text": "âc",
    "read": "âc",
    "type": "rhyme",
    "semester": 1,
    "example": "bấc 🕯️"
  },
  {
    "id": "van_a_breve_c",
    "text": "ăc",
    "read": "ăc",
    "type": "rhyme",
    "semester": 1,
    "example": "mắc 🪝"
  },
  {
    "id": "van_o_c",
    "text": "oc",
    "read": "oc",
    "type": "rhyme",
    "semester": 1,
    "example": "cóc 🐸"
  },
  {
    "id": "van_o_circumflex_c",
    "text": "ôc",
    "read": "ôc",
    "type": "rhyme",
    "semester": 1,
    "example": "ốc 🐚"
  },
  {
    "id": "van_u_c",
    "text": "uc",
    "read": "uc",
    "type": "rhyme",
    "semester": 1,
    "example": "trúc 🎋"
  },
  {
    "id": "van_u_horn_c",
    "text": "ưc",
    "read": "ưc",
    "type": "rhyme",
    "semester": 1,
    "example": "mực 🦑"
  },
  {
    "id": "van_a_t",
    "text": "at",
    "read": "at",
    "type": "rhyme",
    "semester": 1,
    "example": "hạt 🌰"
  },
  {
    "id": "van_a_breve_t",
    "text": "ăt",
    "read": "ăt",
    "type": "rhyme",
    "semester": 1,
    "example": "mặt 😊"
  },
  {
    "id": "van_a_circumflex_t",
    "text": "ât",
    "read": "ât",
    "type": "rhyme",
    "semester": 1,
    "example": "đất 🌍"
  },
  {
    "id": "van_e_t",
    "text": "et",
    "read": "et",
    "type": "rhyme",
    "semester": 1,
    "example": "vẹt 🦜"
  },
  {
    "id": "van_e_circumflex_t",
    "text": "êt",
    "read": "êt",
    "type": "rhyme",
    "semester": 1,
    "example": "tết 🧧"
  },
  {
    "id": "van_i_t",
    "text": "it",
    "read": "it",
    "type": "rhyme",
    "semester": 1,
    "example": "vịt 🦆"
  },
  {
    "id": "van_o_t",
    "text": "ot",
    "read": "ot",
    "type": "rhyme",
    "semester": 1,
    "example": "ngọt 🍯"
  },
  {
    "id": "van_o_circumflex_t",
    "text": "ôt",
    "read": "ôt",
    "type": "rhyme",
    "semester": 1,
    "example": "cột 🏛️"
  },
  {
    "id": "van_o_horn_t",
    "text": "ơt",
    "read": "ơt",
    "type": "rhyme",
    "semester": 1,
    "example": "ớt 🌶️"
  },
  {
    "id": "van_u_t",
    "text": "ut",
    "read": "ut",
    "type": "rhyme",
    "semester": 1,
    "example": "bút ✏️"
  },
  {
    "id": "van_u_horn_t",
    "text": "ưt",
    "read": "ưt",
    "type": "rhyme",
    "semester": 1,
    "example": "mứt 🍬"
  },
  {
    "id": "van_a_n",
    "text": "an",
    "read": "an",
    "type": "rhyme",
    "semester": 1,
    "example": "bàn 🪵"
  },
  {
    "id": "van_a_breve_n",
    "text": "ăn",
    "read": "ăn",
    "type": "rhyme",
    "semester": 1,
    "example": "khăn 🧣"
  },
  {
    "id": "van_a_circumflex_n",
    "text": "ân",
    "read": "ân",
    "type": "rhyme",
    "semester": 1,
    "example": "sân 🏡"
  },
  {
    "id": "van_e_n",
    "text": "en",
    "read": "en",
    "type": "rhyme",
    "semester": 1,
    "example": "kèn 🎺"
  },
  {
    "id": "van_e_circumflex_n",
    "text": "ên",
    "read": "ên",
    "type": "rhyme",
    "semester": 1,
    "example": "nến 🕯️"
  },
  {
    "id": "van_i_n",
    "text": "in",
    "read": "in",
    "type": "rhyme",
    "semester": 1,
    "example": "chín  chín chín"
  },
  {
    "id": "van_o_n",
    "text": "on",
    "read": "on",
    "type": "rhyme",
    "semester": 1,
    "example": "con 🐣"
  },
  {
    "id": "van_o_circumflex_n",
    "text": "ôn",
    "read": "ôn",
    "type": "rhyme",
    "semester": 1,
    "example": "tôm 🦐"
  },
  {
    "id": "van_o_horn_n",
    "text": "ơn",
    "read": "ơn",
    "type": "rhyme",
    "semester": 1,
    "example": "sơn 🎨"
  },
  {
    "id": "van_u_n",
    "text": "un",
    "read": "un",
    "type": "rhyme",
    "semester": 1,
    "example": "giun 🪱"
  },
  {
    "id": "van_a_n_g",
    "text": "ang",
    "read": "ang",
    "type": "rhyme",
    "semester": 1,
    "example": "vàng 🪙"
  },
  {
    "id": "van_a_breve_n_g",
    "text": "ăng",
    "read": "ăng",
    "type": "rhyme",
    "semester": 1,
    "example": "trăng 🌙"
  },
  {
    "id": "van_a_circumflex_n_g",
    "text": "âng",
    "read": "âng",
    "type": "rhyme",
    "semester": 1,
    "example": "tầng 🏢"
  },
  {
    "id": "van_o_n_g",
    "text": "ong",
    "read": "ong",
    "type": "rhyme",
    "semester": 1,
    "example": "ong 🐝"
  },
  {
    "id": "van_o_circumflex_n_g",
    "text": "ông",
    "read": "ông",
    "type": "rhyme",
    "semester": 1,
    "example": "ông 👴"
  },
  {
    "id": "van_u_n_g",
    "text": "ung",
    "read": "ung",
    "type": "rhyme",
    "semester": 1,
    "example": "súng 🔫"
  },
  {
    "id": "van_u_horn_n_g",
    "text": "ưng",
    "read": "ưng",
    "type": "rhyme",
    "semester": 1,
    "example": "rừng 🌲"
  },
  {
    "id": "van_a_c_h",
    "text": "ach",
    "read": "ach",
    "type": "rhyme",
    "semester": 1,
    "example": "sách 📖"
  },
  {
    "id": "van_e_circumflex_c_h",
    "text": "êch",
    "read": "êch",
    "type": "rhyme",
    "semester": 1,
    "example": "ếch 🐸"
  },
  {
    "id": "van_i_c_h",
    "text": "ich",
    "read": "ich",
    "type": "rhyme",
    "semester": 1,
    "example": "thích ❤️"
  },
  {
    "id": "van_a_m",
    "text": "am",
    "read": "am",
    "type": "rhyme",
    "semester": 1,
    "example": "cam 🍊"
  },
  {
    "id": "van_a_breve_m",
    "text": "ăm",
    "read": "ăm",
    "type": "rhyme",
    "semester": 1,
    "example": "nằm 🛌"
  },
  {
    "id": "van_a_circumflex_m",
    "text": "âm",
    "read": "âm",
    "type": "rhyme",
    "semester": 1,
    "example": "nấm 🍄"
  },
  {
    "id": "van_e_m",
    "text": "em",
    "read": "em",
    "type": "rhyme",
    "semester": 1,
    "example": "kem 🍦"
  },
  {
    "id": "van_e_circumflex_m",
    "text": "êm",
    "read": "êm",
    "type": "rhyme",
    "semester": 1,
    "example": "đêm 🌌"
  },
  {
    "id": "van_o_m",
    "text": "om",
    "read": "om",
    "type": "rhyme",
    "semester": 1,
    "example": "chòm ⭐"
  },
  {
    "id": "van_o_circumflex_m",
    "text": "ôm",
    "read": "ôm",
    "type": "rhyme",
    "semester": 1,
    "example": "ôm 🤗"
  },
  {
    "id": "van_o_horn_m",
    "text": "ơm",
    "read": "ơm",
    "type": "rhyme",
    "semester": 1,
    "example": "cơm 🍚"
  },
  {
    "id": "van_i_m",
    "text": "im",
    "read": "im",
    "type": "rhyme",
    "semester": 1,
    "example": "tim 💖"
  },
  {
    "id": "van_u_m",
    "text": "um",
    "read": "um",
    "type": "rhyme",
    "semester": 1,
    "example": "chum 🏺"
  },
  {
    "id": "van_a_p",
    "text": "ap",
    "read": "ap",
    "type": "rhyme",
    "semester": 1,
    "example": "tháp 🗼"
  },
  {
    "id": "van_a_breve_p",
    "text": "ăp",
    "read": "ăp",
    "type": "rhyme",
    "semester": 1,
    "example": "bắp 🌽"
  },
  {
    "id": "van_a_circumflex_p",
    "text": "âp",
    "read": "âp",
    "type": "rhyme",
    "semester": 1,
    "example": "tập 📚"
  },
  {
    "id": "van_e_p",
    "text": "ep",
    "read": "ep",
    "type": "rhyme",
    "semester": 1,
    "example": "dép 🩴"
  },
  {
    "id": "van_e_circumflex_p",
    "text": "êp",
    "read": "êp",
    "type": "rhyme",
    "semester": 1,
    "example": "bếp 🍳"
  },
  {
    "id": "van_o_p",
    "text": "op",
    "read": "op",
    "type": "rhyme",
    "semester": 1,
    "example": "cọp 🐅"
  },
  {
    "id": "van_o_circumflex_p",
    "text": "ôp",
    "read": "ôp",
    "type": "rhyme",
    "semester": 1,
    "example": "hộp 📦"
  },
  {
    "id": "van_o_horn_p",
    "text": "ơp",
    "read": "ơp",
    "type": "rhyme",
    "semester": 1,
    "example": "lớp 🏫"
  },
  {
    "id": "van_i_p",
    "text": "ip",
    "read": "ip",
    "type": "rhyme",
    "semester": 1,
    "example": "nhịp 🎵"
  },
  {
    "id": "van_u_p",
    "text": "up",
    "read": "up",
    "type": "rhyme",
    "semester": 1,
    "example": "búp 🪆"
  },
  {
    "id": "van_a_n_h",
    "text": "anh",
    "read": "anh",
    "type": "rhyme",
    "semester": 1,
    "example": "chanh 🍋"
  },
  {
    "id": "van_e_circumflex_n_h",
    "text": "ênh",
    "read": "ênh",
    "type": "rhyme",
    "semester": 1,
    "example": "kênh 📺"
  },
  {
    "id": "van_i_n_h",
    "text": "inh",
    "read": "inh",
    "type": "rhyme",
    "semester": 1,
    "example": "bình 🏺"
  },
  {
    "id": "van_u_horn_o_horn_u",
    "text": "ươu",
    "read": "ươu",
    "type": "rhyme",
    "semester": 1,
    "example": "hươu 🦌"
  },
  {
    "id": "van_i_e_circumflex_u",
    "text": "iêu",
    "read": "iêu",
    "type": "rhyme",
    "semester": 1,
    "example": "diều 🪁"
  },
  {
    "id": "van_y_e_circumflex_u",
    "text": "yêu",
    "read": "yêu",
    "type": "rhyme",
    "semester": 1,
    "example": "yêu ❤️"
  },
  {
    "id": "van_u_o_circumflex_i",
    "text": "uôi",
    "read": "uôi",
    "type": "rhyme",
    "semester": 1,
    "example": "chuối 🍌"
  },
  {
    "id": "van_u_horn_o_horn_i",
    "text": "ươi",
    "read": "ươi",
    "type": "rhyme",
    "semester": 1,
    "example": "bưởi 🍈"
  },
  {
    "id": "van_i_e_circumflex_c",
    "text": "iêc",
    "read": "iêc",
    "type": "rhyme",
    "semester": 1,
    "example": "tiệc 🎂"
  },
  {
    "id": "van_u_o_circumflex_c",
    "text": "uôc",
    "read": "uôc",
    "type": "rhyme",
    "semester": 1,
    "example": "cuốc ⛏️"
  },
  {
    "id": "van_u_horn_o_horn_c",
    "text": "ươc",
    "read": "ươc",
    "type": "rhyme",
    "semester": 1,
    "example": "nước 💧"
  },
  {
    "id": "van_i_e_circumflex_t",
    "text": "iêt",
    "read": "iêt",
    "type": "rhyme",
    "semester": 1,
    "example": "viết ✍️"
  },
  {
    "id": "van_y_e_circumflex_t",
    "text": "yêt",
    "read": "yêt",
    "type": "rhyme",
    "semester": 1,
    "example": "yết 📜"
  },
  {
    "id": "van_u_o_circumflex_t",
    "text": "uôt",
    "read": "uôt",
    "type": "rhyme",
    "semester": 1,
    "example": "chuột 🐭"
  },
  {
    "id": "van_u_horn_o_horn_t",
    "text": "ươt",
    "read": "ươt",
    "type": "rhyme",
    "semester": 1,
    "example": "mướt 🌿"
  },
  {
    "id": "van_i_e_circumflex_n",
    "text": "iên",
    "read": "iên",
    "type": "rhyme",
    "semester": 1,
    "example": "biển 🌊"
  },
  {
    "id": "van_y_e_circumflex_n",
    "text": "yên",
    "read": "yên",
    "type": "rhyme",
    "semester": 1,
    "example": "yên 🕊️"
  },
  {
    "id": "van_u_o_circumflex_n",
    "text": "uôn",
    "read": "uôn",
    "type": "rhyme",
    "semester": 1,
    "example": "chuồn 🛸"
  },
  {
    "id": "van_u_horn_o_horn_n",
    "text": "ươn",
    "read": "ươn",
    "type": "rhyme",
    "semester": 1,
    "example": "vườn 🌺"
  },
  {
    "id": "van_i_e_circumflex_n_g",
    "text": "iêng",
    "read": "iêng",
    "type": "rhyme",
    "semester": 1,
    "example": "chiêng 🔔"
  },
  {
    "id": "van_y_e_circumflex_n_g",
    "text": "yêng",
    "read": "yêng",
    "type": "rhyme",
    "semester": 1,
    "example": "yểng 🐦"
  },
  {
    "id": "van_u_o_circumflex_n_g",
    "text": "uông",
    "read": "uông",
    "type": "rhyme",
    "semester": 1,
    "example": "chuông 🔔"
  },
  {
    "id": "van_u_horn_o_horn_n_g",
    "text": "ương",
    "read": "ương",
    "type": "rhyme",
    "semester": 1,
    "example": "hương 🌸"
  },
  {
    "id": "van_i_e_circumflex_m",
    "text": "iêm",
    "read": "iêm",
    "type": "rhyme",
    "semester": 1,
    "example": "diêm 🪵"
  },
  {
    "id": "van_y_e_circumflex_m",
    "text": "yêm",
    "read": "yêm",
    "type": "rhyme",
    "semester": 1,
    "example": "yếm 🎽"
  },
  {
    "id": "van_u_o_circumflex_m",
    "text": "uôm",
    "read": "uôm",
    "type": "rhyme",
    "semester": 1,
    "example": "buồm ⛵"
  },
  {
    "id": "van_u_horn_o_horn_m",
    "text": "ươm",
    "read": "ươm",
    "type": "rhyme",
    "semester": 1,
    "example": "bướm 🦋"
  },
  {
    "id": "van_i_e_circumflex_p",
    "text": "iêp",
    "read": "iêp",
    "type": "rhyme",
    "semester": 1,
    "example": "tiếp ➡️"
  },
  {
    "id": "van_u_horn_o_horn_p",
    "text": "ươp",
    "read": "ươp",
    "type": "rhyme",
    "semester": 1,
    "example": "mướp 🥒"
  }
];

export const PHONICS_RHYMES_K2: PhonicsItem[] = [
  {
    "id": "van_o_a",
    "text": "oa",
    "read": "oa",
    "type": "rhyme",
    "semester": 2,
    "example": "hoa 🌸"
  },
  {
    "id": "van_o_e",
    "text": "oe",
    "read": "oe",
    "type": "rhyme",
    "semester": 2,
    "example": "lóe ✨"
  },
  {
    "id": "van_u_e_circumflex",
    "text": "uê",
    "read": "uê",
    "type": "rhyme",
    "semester": 2,
    "example": "huệ 💐"
  },
  {
    "id": "van_u_y",
    "text": "uy",
    "read": "uy",
    "type": "rhyme",
    "semester": 2,
    "example": "huy 🎖️"
  },
  {
    "id": "van_o_a_i",
    "text": "oai",
    "read": "oai",
    "type": "rhyme",
    "semester": 2,
    "example": "xoài 🥭"
  },
  {
    "id": "van_o_a_y",
    "text": "oay",
    "read": "oay",
    "type": "rhyme",
    "semester": 2,
    "example": "xoay 🔄"
  },
  {
    "id": "van_o_a_c",
    "text": "oac",
    "read": "oac",
    "type": "rhyme",
    "semester": 2,
    "example": "khoác 🧥"
  },
  {
    "id": "van_o_a_t",
    "text": "oat",
    "read": "oat",
    "type": "rhyme",
    "semester": 2,
    "example": "thoát 🚪"
  },
  {
    "id": "van_o_a_n",
    "text": "oan",
    "read": "oan",
    "type": "rhyme",
    "semester": 2,
    "example": "khoan 🪛"
  },
  {
    "id": "van_o_a_n_g",
    "text": "oang",
    "read": "oang",
    "type": "rhyme",
    "semester": 2,
    "example": "hoẵng 🦌"
  },
  {
    "id": "van_u_a_circumflex_n",
    "text": "uân",
    "read": "uân",
    "type": "rhyme",
    "semester": 2,
    "example": "xuân 🌸"
  },
  {
    "id": "van_u_y_e_circumflex_n",
    "text": "uyên",
    "read": "uyên",
    "type": "rhyme",
    "semester": 2,
    "example": "khuyên 🐦"
  },
  {
    "id": "van_u_y_t",
    "text": "uyt",
    "read": "uyt",
    "type": "rhyme",
    "semester": 2,
    "example": "huýt 😙"
  },
  {
    "id": "van_o_a_breve_t",
    "text": "oăt",
    "read": "oăt",
    "type": "rhyme",
    "semester": 2,
    "example": "thoắt ⚡"
  },
  {
    "id": "van_u_a_circumflex_t",
    "text": "uât",
    "read": "uât",
    "type": "rhyme",
    "semester": 2,
    "example": "xuất 🚀"
  },
  {
    "id": "van_u_y_e_circumflex_t",
    "text": "uyêt",
    "read": "uyêt",
    "type": "rhyme",
    "semester": 2,
    "example": "tuyết ❄️"
  },
  {
    "id": "van_o_a_n_h",
    "text": "oanh",
    "read": "oanh",
    "type": "rhyme",
    "semester": 2,
    "example": "doanh 🏢"
  },
  {
    "id": "van_u_y_n_h",
    "text": "uynh",
    "read": "uynh",
    "type": "rhyme",
    "semester": 2,
    "example": "huynh 👦"
  },
  {
    "id": "van_u_y_c_h",
    "text": "uych",
    "read": "uych",
    "type": "rhyme",
    "semester": 2,
    "example": "uých 💥"
  },
  {
    "id": "van_o_a_breve_n_g",
    "text": "oăng",
    "read": "oăng",
    "type": "rhyme",
    "semester": 2,
    "example": "hoẵng 🦘"
  },
  {
    "id": "van_o_a_m",
    "text": "oam",
    "read": "oam",
    "type": "rhyme",
    "semester": 2,
    "example": "ngoạm 👄"
  },
  {
    "id": "van_o_a_p",
    "text": "oap",
    "read": "oap",
    "type": "rhyme",
    "semester": 2,
    "example": "ngoáp 🥱"
  },
  {
    "id": "van_o_a_breve_n",
    "text": "oăn",
    "read": "oăn",
    "type": "rhyme",
    "semester": 2,
    "example": "xoăn 🦱"
  },
  {
    "id": "van_o_e_n",
    "text": "oen",
    "read": "oen",
    "type": "rhyme",
    "semester": 2,
    "example": "hoen 💧"
  },
  {
    "id": "van_o_o_n_g",
    "text": "oong",
    "read": "oong",
    "type": "rhyme",
    "semester": 2,
    "example": "xoong 🍲"
  },
  {
    "id": "van_o_o_c",
    "text": "ooc",
    "read": "ooc",
    "type": "rhyme",
    "semester": 2,
    "example": "moóc 🚚"
  },
  {
    "id": "van_u_y_n",
    "text": "uyn",
    "read": "uyn",
    "type": "rhyme",
    "semester": 2,
    "example": "buýt 🚌"
  },
  {
    "id": "van_u_y_a",
    "text": "uya",
    "read": "uya",
    "type": "rhyme",
    "semester": 2,
    "example": "khuya 🌃"
  }
];

export const ALL_PHONICS_ITEMS: PhonicsItem[] = [
  ...PHONICS_TONES,
  ...PHONICS_SOUNDS,
  ...PHONICS_RHYMES_K1,
  ...PHONICS_RHYMES_K2,
];

export const PHONICS_BY_ID: Record<string, PhonicsItem> = Object.fromEntries(
  ALL_PHONICS_ITEMS.map((item) => [item.id, item])
);
