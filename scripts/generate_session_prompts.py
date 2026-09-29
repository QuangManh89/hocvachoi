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

PROMPTS = [
    {"filename": "prompt_find_yellow.mp3", "text": "Bạn chạm vào màu vàng nhé!", "rate": "-10%"},
    {"filename": "prompt_find_blue.mp3", "text": "Bạn chạm vào màu xanh dương nhé!", "rate": "-10%"},
    {"filename": "prompt_find_green.mp3", "text": "Bạn chạm vào màu xanh lá nhé!", "rate": "-10%"},
    {"filename": "prompt_find_square.mp3", "text": "Bạn chạm vào hình vuông nhé!", "rate": "-10%"},
    {"filename": "prompt_find_triangle.mp3", "text": "Bạn chạm vào hình tam giác nhé!", "rate": "-10%"},
    {"filename": "prompt_find_star.mp3", "text": "Bạn chạm vào ngôi sao nhé!", "rate": "-10%"},
    {"filename": "prompt_find_letter_a.mp3", "text": "Bạn chạm vào chữ a nhé!", "rate": "-10%"},
    {"filename": "prompt_find_letter_b.mp3", "text": "Bạn chạm vào chữ bờ nhé!", "rate": "-10%"},
    {"filename": "prompt_find_letter_dd.mp3", "text": "Bạn chạm vào chữ đờ nhé!", "rate": "-10%"},
    {"filename": "prompt_find_letter_i.mp3", "text": "Bạn chạm vào chữ i nhé!", "rate": "-10%"},
    {"filename": "prompt_find_number_5.mp3", "text": "Bạn chạm vào số năm nhé!", "rate": "-10%"},
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
    print(f"Bắt đầu tạo {len(PROMPTS)} prompt audio bổ sung cho phiên 12 câu...\n")
    for item in PROMPTS:
        await generate_single(item)
        await asyncio.sleep(0.35)
    print("\nHoàn tất tạo prompt audio!")

if __name__ == "__main__":
    asyncio.run(main())
