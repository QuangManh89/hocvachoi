import math
import wave
import struct
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

OUTPUT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "assets", "sounds", "bgm_gentle.wav"))

SAMPLE_RATE = 22050
DURATION = 12.0 # 12 giây lặp hoàn hảo

# Thang âm ngũ cung ấm áp, thư giãn (C major pentatonic: C, D, E, G, A, C5, E5)
NOTES = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'G4': 392.00,
    'A4': 440.00,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'G5': 783.99,
}

# Giai điệu Kalimba / Hộp nhạc êm đềm cho bé 3 tuổi (nhẹ nhàng, vui tươi, thư giãn)
MELODY = [
    # (nốt, thời điểm bắt đầu (giây), độ ngân (giây), âm lượng 0-1)
    ('C4', 0.0, 1.8, 0.5),
    ('G4', 0.5, 1.5, 0.4),
    ('E4', 1.0, 1.8, 0.45),
    ('C5', 1.5, 2.0, 0.5),

    ('A4', 3.0, 1.8, 0.45),
    ('E5', 3.5, 2.0, 0.5),
    ('G4', 4.0, 1.6, 0.4),
    ('D5', 4.5, 2.0, 0.45),

    ('E4', 6.0, 1.8, 0.5),
    ('G4', 6.5, 1.5, 0.4),
    ('C5', 7.0, 2.2, 0.5),
    ('E5', 7.5, 2.5, 0.55),

    ('D5', 9.0, 1.8, 0.45),
    ('A4', 9.5, 1.6, 0.4),
    ('G4', 10.0, 1.8, 0.45),
    ('C4', 10.5, 2.0, 0.4),
]

num_samples = int(SAMPLE_RATE * DURATION)
audio_data = [0.0] * num_samples

for note_name, start_time, decay_time, volume in MELODY:
    freq = NOTES[note_name]
    start_sample = int(start_time * SAMPLE_RATE)
    decay_samples = int(decay_time * SAMPLE_RATE)
    
    for i in range(decay_samples):
        idx = (start_sample + i) % num_samples
        t = i / SAMPLE_RATE
        
        # Sóng âm Kalimba: Sóng sin cơ bản + họa âm bậc 2 và bậc 3 nhẹ, tạo cảm giác mộc
        env = math.exp(-3.2 * t / decay_time) # Đường cong suy giảm êm dịu
        val = (
            math.sin(2 * math.pi * freq * t) * 0.7 +
            math.sin(2 * math.pi * freq * 2.0 * t) * 0.2 +
            math.sin(2 * math.pi * freq * 3.0 * t) * 0.08
        ) * env * volume
        
        audio_data[idx] += val

# Chuẩn hóa âm lượng không bị rè
max_val = max(abs(x) for x in audio_data)
if max_val > 0:
    scale = 0.75 / max_val
    audio_data = [x * scale for x in audio_data]

# Ghi ra file WAV chuẩn PCM 16-bit
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with wave.open(OUTPUT_PATH, 'w') as wav_file:
    wav_file.setnchannels(1) # Mono
    wav_file.setsampwidth(2) # 16-bit
    wav_file.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for sample in audio_data:
        int_sample = int(sample * 32767.0)
        int_sample = max(-32768, min(32767, int_sample))
        frames.extend(struct.pack('<h', int_sample))
        
    wav_file.writeframes(frames)

print(f"Đã tạo file nhạc nền BGM êm dịu thành công tại: {OUTPUT_PATH}")
