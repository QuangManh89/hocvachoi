import asyncio
import os
import sys
import edge_tts

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "assets", "sounds"))
VOICE = "vi-VN-HoaiMyNeural"

CLIPS = [
    # --- 1. Chữ cái & Từ minh họa Nhóm 1 (a, e, i, o, u, y) ---
    {"filename": "chu_e.mp3", "text": "chữ e", "rate": "-12%"},
    {"filename": "chu_o.mp3", "text": "chữ o", "rate": "-12%"},
    {"filename": "chu_u.mp3", "text": "chữ u", "rate": "-12%"},
    {"filename": "chu_y.mp3", "text": "chữ i dài", "rate": "-12%"},
    {"filename": "tu_embe.mp3", "text": "em bé", "rate": "-12%"},
    {"filename": "tu_ong.mp3", "text": "con ong", "rate": "-12%"},
    {"filename": "tu_ung.mp3", "text": "đôi ủng", "rate": "-12%"},
    {"filename": "tu_yta.mp3", "text": "y tá", "rate": "-12%"},
    {"filename": "prompt_find_letter_e.mp3", "text": "Bạn chạm vào chữ e nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_o.mp3", "text": "Bạn chạm vào chữ o nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_u.mp3", "text": "Bạn chạm vào chữ u nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_y.mp3", "text": "Bạn chạm vào chữ y nhé!", "rate": "-12%"},

    # --- 2. Chữ cái & Từ minh họa Nhóm 2 (ă, â, ê, ô, ơ, ư) ---
    {"filename": "chu_a_breve.mp3", "text": "chữ á", "rate": "-12%"},
    {"filename": "chu_a_circumflex.mp3", "text": "chữ ớ", "rate": "-12%"},
    {"filename": "chu_e_circumflex.mp3", "text": "chữ ê", "rate": "-12%"},
    {"filename": "chu_o_circumflex.mp3", "text": "chữ ô", "rate": "-12%"},
    {"filename": "chu_o_horn.mp3", "text": "chữ ơ", "rate": "-12%"},
    {"filename": "chu_u_horn.mp3", "text": "chữ ư", "rate": "-12%"},
    {"filename": "tu_an.mp3", "text": "bé ăn cơm", "rate": "-12%"},
    {"filename": "tu_am.mp3", "text": "ấm nước", "rate": "-12%"},
    {"filename": "tu_ech.mp3", "text": "con ếch", "rate": "-12%"},
    {"filename": "tu_oto.mp3", "text": "ô tô", "rate": "-12%"},
    {"filename": "tu_ot.mp3", "text": "quả ớt", "rate": "-12%"},
    {"filename": "tu_sutu.mp3", "text": "sư tử", "rate": "-12%"},
    {"filename": "prompt_find_letter_a_breve.mp3", "text": "Bạn chạm vào chữ á nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_a_circumflex.mp3", "text": "Bạn chạm vào chữ ớ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_e_circumflex.mp3", "text": "Bạn chạm vào chữ ê nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_o_circumflex.mp3", "text": "Bạn chạm vào chữ ô nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_o_horn.mp3", "text": "Bạn chạm vào chữ ơ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_u_horn.mp3", "text": "Bạn chạm vào chữ ư nhé!", "rate": "-12%"},

    # --- 3. Chữ cái & Từ minh họa Nhóm 3 (m, n, t, l, h, c) ---
    {"filename": "chu_m.mp3", "text": "chữ mờ", "rate": "-12%"},
    {"filename": "chu_n.mp3", "text": "chữ nờ", "rate": "-12%"},
    {"filename": "chu_t.mp3", "text": "chữ tờ", "rate": "-12%"},
    {"filename": "chu_l.mp3", "text": "chữ lờ", "rate": "-12%"},
    {"filename": "chu_h.mp3", "text": "chữ hờ", "rate": "-12%"},
    {"filename": "chu_c.mp3", "text": "chữ cờ", "rate": "-12%"},
    {"filename": "tu_meo.mp3", "text": "con mèo", "rate": "-12%"},
    {"filename": "tu_non.mp3", "text": "cái nón", "rate": "-12%"},
    {"filename": "tu_tau.mp3", "text": "con tàu", "rate": "-12%"},
    {"filename": "tu_la.mp3", "text": "chiếc lá", "rate": "-12%"},
    {"filename": "tu_hoa.mp3", "text": "bông hoa", "rate": "-12%"},
    {"filename": "tu_ca.mp3", "text": "con cá", "rate": "-12%"},
    {"filename": "prompt_find_letter_m.mp3", "text": "Bạn chạm vào chữ mờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_n.mp3", "text": "Bạn chạm vào chữ nờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_t.mp3", "text": "Bạn chạm vào chữ tờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_l.mp3", "text": "Bạn chạm vào chữ lờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_h.mp3", "text": "Bạn chạm vào chữ hờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_c.mp3", "text": "Bạn chạm vào chữ cờ nhé!", "rate": "-12%"},

    # --- 4. Chữ cái & Từ minh họa Nhóm 4 (b, p, v, x, s, r) ---
    {"filename": "chu_p.mp3", "text": "chữ pờ", "rate": "-12%"},
    {"filename": "chu_v.mp3", "text": "chữ vờ", "rate": "-12%"},
    {"filename": "chu_x.mp3", "text": "chữ xờ", "rate": "-12%"},
    {"filename": "chu_s.mp3", "text": "chữ sờ", "rate": "-12%"},
    {"filename": "chu_r.mp3", "text": "chữ rờ", "rate": "-12%"},
    {"filename": "tu_pin.mp3", "text": "cục pin", "rate": "-12%"},
    {"filename": "tu_vit.mp3", "text": "con vịt", "rate": "-12%"},
    {"filename": "tu_xe.mp3", "text": "xe hơi", "rate": "-12%"},
    {"filename": "tu_sao.mp3", "text": "ngôi sao", "rate": "-12%"},
    {"filename": "tu_rua.mp3", "text": "con rùa", "rate": "-12%"},
    {"filename": "prompt_find_letter_p.mp3", "text": "Bạn chạm vào chữ pờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_v.mp3", "text": "Bạn chạm vào chữ vờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_x.mp3", "text": "Bạn chạm vào chữ xờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_s.mp3", "text": "Bạn chạm vào chữ sờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_r.mp3", "text": "Bạn chạm vào chữ rờ nhé!", "rate": "-12%"},

    # --- 5. Chữ cái & Từ minh họa Nhóm 5 (d, đ, g, k, q) ---
    {"filename": "chu_d.mp3", "text": "chữ dờ", "rate": "-12%"},
    {"filename": "chu_g.mp3", "text": "chữ gờ", "rate": "-12%"},
    {"filename": "chu_k.mp3", "text": "chữ ca", "rate": "-12%"},
    {"filename": "chu_q.mp3", "text": "chữ cu", "rate": "-12%"},
    {"filename": "tu_de.mp3", "text": "con dê", "rate": "-12%"},
    {"filename": "tu_ga.mp3", "text": "con gà", "rate": "-12%"},
    {"filename": "tu_keo.mp3", "text": "kẹo ngọt", "rate": "-12%"},
    {"filename": "tu_quat.mp3", "text": "cái quạt", "rate": "-12%"},
    {"filename": "prompt_find_letter_d.mp3", "text": "Bạn chạm vào chữ dờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_g.mp3", "text": "Bạn chạm vào chữ gờ nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_k.mp3", "text": "Bạn chạm vào chữ ca nhé!", "rate": "-12%"},
    {"filename": "prompt_find_letter_q.mp3", "text": "Bạn chạm vào chữ cu nhé!", "rate": "-12%"},

    # --- 6. Số & Đếm 5 -> 10, So sánh ---
    {"filename": "count_5.mp3", "text": "năm", "rate": "-12%"},
    {"filename": "count_6.mp3", "text": "sáu", "rate": "-12%"},
    {"filename": "count_7.mp3", "text": "bảy", "rate": "-12%"},
    {"filename": "count_8.mp3", "text": "tám", "rate": "-12%"},
    {"filename": "count_9.mp3", "text": "chín", "rate": "-12%"},
    {"filename": "count_10.mp3", "text": "mười", "rate": "-12%"},
    {"filename": "prompt_find_number_1.mp3", "text": "Bé tìm số một nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_2.mp3", "text": "Bé tìm số hai nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_3.mp3", "text": "Bé tìm số ba nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_4.mp3", "text": "Bé tìm số bốn nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_6.mp3", "text": "Bé tìm số sáu nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_7.mp3", "text": "Bé tìm số bảy nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_8.mp3", "text": "Bé tìm số tám nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_9.mp3", "text": "Bé tìm số chín nhé!", "rate": "-12%"},
    {"filename": "prompt_find_number_10.mp3", "text": "Bé tìm số mười nhé!", "rate": "-12%"},
    {"filename": "prompt_count_flowers.mp3", "text": "Bé đếm từng bông hoa nhé!", "rate": "-12%"},
    {"filename": "prompt_more_fruits.mp3", "text": "Bên nào nhiều quả hơn?", "rate": "-12%"},
    {"filename": "prompt_less_fruits.mp3", "text": "Bên nào ít quả hơn?", "rate": "-12%"},
    {"filename": "prompt_bigger.mp3", "text": "Hình nào to hơn?", "rate": "-12%"},
    {"filename": "prompt_smaller.mp3", "text": "Hình nào nhỏ hơn?", "rate": "-12%"},
    {"filename": "so_nhieu_hon.mp3", "text": "nhiều hơn", "rate": "-12%"},
    {"filename": "so_it_hon.mp3", "text": "ít hơn", "rate": "-12%"},
    {"filename": "so_to_hon.mp3", "text": "to hơn", "rate": "-12%"},
    {"filename": "so_nho_hon.mp3", "text": "nhỏ hơn", "rate": "-12%"},

    # --- 7. Màu sắc & Hình khối bổ sung ---
    {"filename": "color_orange.mp3", "text": "màu cam", "rate": "-12%"},
    {"filename": "color_purple.mp3", "text": "màu tím", "rate": "-12%"},
    {"filename": "color_pink.mp3", "text": "màu hồng", "rate": "-12%"},
    {"filename": "color_brown.mp3", "text": "màu nâu", "rate": "-12%"},
    {"filename": "color_black.mp3", "text": "màu đen", "rate": "-12%"},
    {"filename": "color_white.mp3", "text": "màu trắng", "rate": "-12%"},
    {"filename": "color_warm.mp3", "text": "màu ấm", "rate": "-12%"},
    {"filename": "color_cool.mp3", "text": "màu lạnh", "rate": "-12%"},
    {"filename": "shape_rectangle.mp3", "text": "hình chữ nhật", "rate": "-12%"},
    {"filename": "shape_heart.mp3", "text": "hình trái tim", "rate": "-12%"},
    {"filename": "prompt_find_orange.mp3", "text": "Bạn chạm vào màu cam nhé!", "rate": "-12%"},
    {"filename": "prompt_find_purple.mp3", "text": "Bạn chạm vào màu tím nhé!", "rate": "-12%"},
    {"filename": "prompt_find_pink.mp3", "text": "Bạn chạm vào màu hồng nhé!", "rate": "-12%"},
    {"filename": "prompt_find_rectangle.mp3", "text": "Bạn chạm vào hình chữ nhật nhé!", "rate": "-12%"},
    {"filename": "prompt_find_heart.mp3", "text": "Bạn chạm vào hình trái tim nhé!", "rate": "-12%"},
    {"filename": "prompt_sort_warm_cool.mp3", "text": "Bé phân loại màu ấm và màu lạnh nhé!", "rate": "-12%"},
    {"filename": "prompt_sort_shapes.mp3", "text": "Bé bỏ hình vào đúng giỏ nhé!", "rate": "-12%"},
    {"filename": "prompt_match_letter_word.mp3", "text": "Bé ghép chữ với hình phù hợp nhé!", "rate": "-12%"},
    {"filename": "prompt_match_quantity.mp3", "text": "Bé ghép số với số lượng quả nhé!", "rate": "-12%"},
]

async def generate_single(item):
    out_path = os.path.join(OUTPUT_DIR, item["filename"])
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return f"[SKIP] {item['filename']}"

    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(
                text=item["text"],
                voice=VOICE,
                rate=item.get("rate", "-12%")
            )
            await communicate.save(out_path)
            return f"[OK] {item['filename']} -> '{item['text']}'"
        except Exception as e:
            if attempt < 2:
                await asyncio.sleep(1.0)
            else:
                return f"[ERROR] {item['filename']}: {e}"

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Tổng số clips cần xử lý: {len(CLIPS)}")
    
    # Chạy theo batch nhỏ 4 tác vụ đồng thời để tăng tốc mà không quá tải
    batch_size = 4
    for i in range(0, len(CLIPS), batch_size):
        batch = CLIPS[i:i+batch_size]
        results = await asyncio.gather(*(generate_single(item) for item in batch))
        for r in results:
            print(f" {r}")
        await asyncio.sleep(0.3)
    
    print("\nHoàn tất tạo âm thanh cho Phase 1b!")

if __name__ == "__main__":
    asyncio.run(main())
