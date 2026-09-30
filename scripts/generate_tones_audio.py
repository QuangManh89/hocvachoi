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
    {"filename": "dau_sac.mp3", "text": "Dấu Sắc"},
    {"filename": "dau_huyen.mp3", "text": "Dấu Huyền"},
    {"filename": "dau_hoi.mp3", "text": "Dấu Hỏi"},
    {"filename": "dau_nga.mp3", "text": "Dấu Ngã"},
    {"filename": "dau_nang.mp3", "text": "Dấu Nặng"},
    {"filename": "am_ma.mp3", "text": "Ma"},
    {"filename": "am_ma_sac.mp3", "text": "Má"},
    {"filename": "am_ma_huyen.mp3", "text": "Mà"},
    {"filename": "am_ma_hoi.mp3", "text": "Mả"},
    {"filename": "am_ma_nga.mp3", "text": "Mã"},
    {"filename": "am_ma_nang.mp3", "text": "Mạ"},
    {"filename": "prompt_explore_tones.mp3", "text": "Bé chạm vào từng dấu thanh để nghe nhé!"},
    {"filename": "prompt_find_dau_sac.mp3", "text": "Bé chạm vào Dấu Sắc nhé!"},
    {"filename": "prompt_find_dau_huyen.mp3", "text": "Bé chạm vào Dấu Huyền nhé!"},
    {"filename": "prompt_find_dau_hoi.mp3", "text": "Bé chạm vào Dấu Hỏi nhé!"},
    {"filename": "prompt_find_dau_nga.mp3", "text": "Bé chạm vào Dấu Ngã nhé!"},
    {"filename": "prompt_find_dau_nang.mp3", "text": "Bé chạm vào Dấu Nặng nhé!"},
    {"filename": "prompt_match_tones.mp3", "text": "Bé hãy ghép dấu thanh với từ phù hợp nhé!"},
    {"filename": "prompt_trace_tone.mp3", "text": "Bé dùng tay tô theo nét dấu thanh nhé!"},
]

async def generate_single(item):
    out_path = os.path.join(OUTPUT_DIR, item["filename"])
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        print(f" [SKIP] {item['filename']} đã có.")
        return

    for attempt in range(4):
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
            if attempt < 3:
                await asyncio.sleep(1.2)
            else:
                print(f" [ERROR] Lỗi {item['filename']}: {e}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Bắt đầu tạo {len(PROMPTS)} audio dấu thanh...\n")
    for item in PROMPTS:
        await generate_single(item)
        await asyncio.sleep(0.4)
    print("\nHoàn tất tạo audio dấu thanh!")

if __name__ == "__main__":
    asyncio.run(main())
