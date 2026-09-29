import asyncio
import os
import sys
import edge_tts

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "samples_audio"))
VOICE_FEMALE = "vi-VN-HoaiMyNeural"  # Giọng nữ Hoài My: trong sáng, ấm áp, thân thiện
VOICE_MALE = "vi-VN-NamMinhNeural"   # Giọng nam Nam Minh: rõ ràng, dứt khoát

# Danh sách các câu mẫu để kiểm tra giọng và ngữ điệu cho bé 3 tuổi
SAMPLES = [
    {
        "filename": "meo_bong_chao.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "Chào bạn! Mình là Mèo Bông, chúng mình cùng chơi nào!",
        "label": "Mèo Bông - Lời chào đầu"
    },
    {
        "filename": "meo_bong_khen.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-5%",
        "text": "Giỏi quá! Bạn làm đúng rồi!",
        "label": "Mèo Bông - Khen ngợi khi bé làm đúng"
    },
    {
        "filename": "meo_bong_dong_vien.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "Không sao đâu, thử lại nhé!",
        "label": "Mèo Bông - Động viên khi bé chọn sai (không chê)"
    },
    {
        "filename": "meo_bong_goi_y.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "Ở đây nè!",
        "label": "Mèo Bông - Gợi ý khi bé chần chừ"
    },
    {
        "filename": "meo_bong_buon_ngu.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-12%",
        "text": "Mình buồn ngủ rồi, hẹn gặp lại bạn nhé!",
        "label": "Mèo Bông - Kết thúc phiên chơi (10 phút)"
    },
    {
        "filename": "chu_a.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-15%",
        "text": "a",
        "label": "Chữ cái: a"
    },
    {
        "filename": "tu_ao.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "cái ao",
        "label": "Từ minh họa: cái ao"
    },
    {
        "filename": "chu_b.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-15%",
        "text": "bờ",
        "label": "Chữ cái: bờ (B)"
    },
    {
        "filename": "tu_banh.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "trái banh",
        "label": "Từ minh họa: trái banh"
    },
    {
        "filename": "chu_dd.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-15%",
        "text": "đờ",
        "label": "Chữ cái: đờ (Đ)"
    },
    {
        "filename": "tu_den.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "cái đèn",
        "label": "Từ minh họa: cái đèn"
    },
    {
        "filename": "chu_i.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-15%",
        "text": "i",
        "label": "Chữ cái: i (I)"
    },
    {
        "filename": "tu_heo.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "con heo",
        "label": "Từ minh họa: con heo"
    },
    {
        "filename": "so_nam.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-12%",
        "text": "năm",
        "label": "Con số: năm (5)"
    },
    {
        "filename": "mau_do.mp3",
        "voice": VOICE_FEMALE,
        "rate": "-10%",
        "text": "màu đỏ",
        "label": "Màu sắc: màu đỏ"
    },
    {
        "filename": "giong_nam_meo_bong_chao.mp3",
        "voice": VOICE_MALE,
        "rate": "-10%",
        "text": "Chào bạn! Mình là Mèo Bông, chúng mình cùng chơi nào!",
        "label": "[Đối chiếu Giọng Nam] Mèo Bông - Lời chào đầu"
    }
]

async def generate_single(item):
    out_path = os.path.join(OUTPUT_DIR, item["filename"])
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(
                text=item["text"],
                voice=item["voice"],
                rate=item.get("rate", "+0%")
            )
            await communicate.save(out_path)
            print(f" [OK] {item['filename']} -> {item['label']} (lời đọc: '{item['text']}')")
            return
        except Exception as e:
            if attempt < 2:
                await asyncio.sleep(1.0)
            else:
                print(f" [ERROR] Thất bại khi tạo {item['filename']}: {e}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Bắt đầu tạo {len(SAMPLES)} file âm thanh mẫu trong: {OUTPUT_DIR}\n")
    for item in SAMPLES:
        await generate_single(item)
        await asyncio.sleep(0.4)
    print("\nHoàn tất tạo toàn bộ âm thanh mẫu thành công!")

if __name__ == "__main__":
    asyncio.run(main())
