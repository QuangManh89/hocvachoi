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
    {"filename": "color_yellow.mp3", "text": "màu vàng", "rate": "-10%"},
    {"filename": "color_blue.mp3", "text": "màu xanh dương", "rate": "-10%"},
    {"filename": "color_green.mp3", "text": "màu xanh lá", "rate": "-10%"},
    {"filename": "shape_circle.mp3", "text": "hình tròn", "rate": "-10%"},
    {"filename": "shape_square.mp3", "text": "hình vuông", "rate": "-10%"},
    {"filename": "shape_triangle.mp3", "text": "hình tam giác", "rate": "-10%"},
    {"filename": "shape_star.mp3", "text": "ngôi sao", "rate": "-10%"},
    {"filename": "count_1.mp3", "text": "một", "rate": "-10%"},
    {"filename": "count_2.mp3", "text": "hai", "rate": "-10%"},
    {"filename": "count_3.mp3", "text": "ba", "rate": "-10%"},
    {"filename": "count_4.mp3", "text": "bốn", "rate": "-10%"},
    {"filename": "prompt_find_red.mp3", "text": "Bạn chạm vào màu đỏ nhé!", "rate": "-10%"},
    {"filename": "prompt_find_circle.mp3", "text": "Bạn chạm vào hình tròn nhé!", "rate": "-10%"},
    {"filename": "prompt_count_apples.mp3", "text": "Bé chạm từng quả để đếm nhé!", "rate": "-10%"},
    {"filename": "prompt_sort_colors.mp3", "text": "Bé bỏ vật vào đúng màu nhé!", "rate": "-10%"},
    {"filename": "prompt_match_shapes.mp3", "text": "Bé ghép hình với bóng nhé!", "rate": "-10%"},
    {"filename": "cheer_finish.mp3", "text": "Hoan hô! Bạn giỏi quá!", "rate": "-8%"},
]

async def generate_single(item):
    out_path = os.path.join(OUTPUT_DIR, item["filename"])
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        print(f" [SKIP] {item['filename']} đã có.")
        return

    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(
                text=item["text"],
                voice=VOICE,
                rate=item.get("rate", "-10%")
            )
            await communicate.save(out_path)
            print(f" [OK] {item['filename']} -> '{item['text']}'")
            return
        except Exception as e:
            if attempt < 2:
                await asyncio.sleep(1.0)
            else:
                print(f" [ERROR] Lỗi {item['filename']}: {e}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Bắt đầu tạo {len(CLIPS)} file âm thanh cho Phase 1a...\n")
    for item in CLIPS:
        await generate_single(item)
        await asyncio.sleep(0.4)
    print("\nHoàn tất tạo âm thanh Phase 1a!")

if __name__ == "__main__":
    asyncio.run(main())
