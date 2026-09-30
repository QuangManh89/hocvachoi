import React from 'react'

export type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart'

interface ShapeGraphicProps {
  type?: string
  className?: string
  size?: number
}

/**
 * Kiểm tra xem một item / choice có phải là một trong 6 hình khối cơ bản hay không
 */
export function isShapeItem(item: { id?: string; label?: string; shapeType?: string; icon?: string }): boolean {
  const text = `${item.id || ''} ${item.label || ''} ${item.shapeType || ''}`.toLowerCase()
  return (
    text.includes('circle') ||
    text.includes('tròn') ||
    text.includes('square') ||
    text.includes('vuông') ||
    text.includes('triangle') ||
    text.includes('tam giác') ||
    text.includes('rectangle') ||
    text.includes('chữ nhật') ||
    text.includes('star') ||
    text.includes('ngôi sao') ||
    text.includes('heart') ||
    text.includes('trái tim')
  )
}

/**
 * Component hiển thị đồ họa SVG hình khối sắc nét, to rõ ràng, tỷ lệ chuẩn xác cho bé
 */
export const ShapeGraphic: React.FC<ShapeGraphicProps> = ({
  type = '',
  className = '',
  size = 46,
}) => {
  const t = type.toLowerCase()

  // 1. HÌNH CHỮ NHẬT: Tỷ lệ dài chuẩn (Rộng 66px, Cao 36px), không bị nhầm sang hình vuông
  if (t.includes('rectangle') || t.includes('chữ nhật')) {
    return (
      <svg
        width={Math.round(size * 1.55)}
        height={Math.round(size * 0.88)}
        viewBox="0 0 70 40"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="rectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="60%" stopColor="#43A047" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="3"
          width="64"
          height="34"
          rx="8"
          fill="url(#rectGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Điểm bóng sáng 3D */}
        <rect x="7" y="6" width="56" height="7" rx="3.5" fill="#FFFFFF" opacity="0.35" />
      </svg>
    )
  }

  // 2. HÌNH TAM GIÁC: Kích thước to, rõ nét, các đỉnh cân đối, màu đỏ cam nổi bật trên nền vàng
  if (t.includes('triangle') || t.includes('tam giác')) {
    return (
      <svg
        width={Math.round(size * 1.25)}
        height={Math.round(size * 1.15)}
        viewBox="0 0 54 48"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="triGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" />
            <stop offset="60%" stopColor="#F4511E" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>
        </defs>
        <polygon
          points="27,3 52,45 2,45"
          fill="url(#triGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Điểm sáng trong tam giác */}
        <polygon points="27,8 39,38 15,38" fill="#FFFFFF" opacity="0.25" />
      </svg>
    )
  }

  // 3. HÌNH TRÁI TIM: Đỏ hồng tươi tắn, viền sáng dễ nhìn, độ tương phản cao
  if (t.includes('heart') || t.includes('trái tim')) {
    return (
      <svg
        width={Math.round(size * 1.2)}
        height={Math.round(size * 1.1)}
        viewBox="0 0 54 48"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF1744" />
            <stop offset="60%" stopColor="#E91E63" />
            <stop offset="100%" stopColor="#C2185B" />
          </linearGradient>
        </defs>
        <path
          d="M27 44 C27 44 4 28 4 15 A11 11 0 0 1 27 10 A11 11 0 0 1 50 15 C50 28 27 44 27 44 Z"
          fill="url(#heartGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Đốm sáng phản chiếu */}
        <circle cx="16" cy="15" r="3.5" fill="#FFFFFF" opacity="0.65" />
        <circle cx="21" cy="20" r="1.5" fill="#FFFFFF" opacity="0.65" />
      </svg>
    )
  }

  // 4. HÌNH VUÔNG: Khối vuông xanh dương bo góc 3D
  if (t.includes('square') || t.includes('vuông')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="sqGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#42A5F5" />
            <stop offset="60%" stopColor="#1E88E5" />
            <stop offset="100%" stopColor="#1565C0" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="42" height="42" rx="10" fill="url(#sqGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="8" y="7" width="34" height="8" rx="4" fill="#FFFFFF" opacity="0.35" />
      </svg>
    )
  }

  // 5. HÌNH TRÒN: Quả cầu đỏ 3D bóng bẩy
  if (t.includes('circle') || t.includes('tròn')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <radialGradient id="circGrad" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FF8A80" />
            <stop offset="40%" stopColor="#FF5252" />
            <stop offset="100%" stopColor="#C62828" />
          </radialGradient>
        </defs>
        <circle cx="25" cy="25" r="21" fill="url(#circGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
        <ellipse cx="19" cy="16" rx="6" ry="3" fill="#FFFFFF" opacity="0.55" />
      </svg>
    )
  }

  // 6. NGÔI SAO: Ngôi sao vàng óng 3D
  if (t.includes('star') || t.includes('sao')) {
    return (
      <svg
        width={Math.round(size * 1.15)}
        height={Math.round(size * 1.15)}
        viewBox="0 0 50 50"
        className={`drop-shadow-md shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEE58" />
            <stop offset="60%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>
        </defs>
        <polygon
          points="25,3 32,17 48,19 36,30 39,46 25,38 11,46 14,30 2,19 18,17"
          fill="url(#starGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon points="25,7 30,17 40,19 32,27 34,38 25,32 16,38 18,27 10,19 20,17" fill="#FFFFFF" opacity="0.25" />
      </svg>
    )
  }

  return null
}
export default ShapeGraphic
