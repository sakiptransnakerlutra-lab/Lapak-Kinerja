import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  // Dimension classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses} shrink-0 relative flex items-center justify-center`}>
        {/* Official Kabupaten Luwu Utara Coat of Arms Vector */}
        <svg
          viewBox="0 0 300 360"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Shield Outline */}
          <path
            d="M 50 20 
               C 65 20, 80 12, 90 20 
               C 110 32, 140 10, 150 12 
               C 160 10, 190 32, 210 20 
               C 220 12, 235 20, 250 20 
               C 270 20, 280 32, 280 50 
               L 280 180 
               C 280 250, 200 310, 150 345 
               C 100 310, 20 250, 20 180 
               L 20 50 
               C 20 32, 30 20, 50 20 Z"
            fill="#0fa958"
            stroke="#111827"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Inner Shield border line */}
          <path
            d="M 52 25 
               C 66 25, 80 17, 90 24 
               C 110 36, 140 15, 150 17 
               C 160 15, 190 36, 210 24 
               C 220 17, 234 25, 248 25 
               C 265 25, 275 35, 275 52 
               L 275 178 
               C 275 245, 198 303, 150 338 
               C 102 303, 25 245, 25 178 
               L 25 52 
               C 25 35, 35 25, 52 25 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Sago Palm Trunk & Pedestal */}
          {/* Base rock / pedestal */}
          <path
            d="M 85 235 L 215 235 L 205 265 L 95 265 Z"
            fill="#996633"
            stroke="#261a0d"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Lontara script characters representation on stone */}
          <g stroke="#1a1108" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            <path d="M 112 248 C 114 243, 120 244, 122 250 C 124 254, 128 253, 130 248" />
            <path d="M 138 245 C 142 251, 146 244, 150 249" />
            <path d="M 160 247 C 163 243, 168 246, 172 252" />
            <path d="M 178 245 C 182 251, 187 248, 190 252" />
          </g>

          {/* Sago tree trunk */}
          <path
            d="M 132 155 Q 125 195, 118 235 L 182 235 Q 175 195, 168 155 Z"
            fill="#8d5b2c"
            stroke="#261a0d"
            strokeWidth="3.5"
          />
          {/* Trunk ridges */}
          <path d="M 126 180 Q 150 186, 174 180" stroke="#5a3817" strokeWidth="2.5" fill="none" />
          <path d="M 122 205 Q 150 212, 178 205" stroke="#5a3817" strokeWidth="2.5" fill="none" />
          <path d="M 120 225 Q 150 231, 180 225" stroke="#5a3817" strokeWidth="2.5" fill="none" />

          {/* Yellow badik sheath holder bracket in center */}
          <path
            d="M 144 200 L 144 268 L 156 268 L 156 200 L 172 200 L 172 178 L 164 178 L 164 190 L 136 190 L 136 178 L 128 178 L 128 200 Z"
            fill="#ffd700"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Red stripes on badik bracket */}
          <rect x="129" y="184" width="7" height="6" fill="#e11d48" />
          <rect x="164" y="184" width="7" height="6" fill="#e11d48" />

          {/* Sago Palm Green Fronds (Pohon Sagu) */}
          <g stroke="#1a3311" strokeWidth="2.5" strokeLinejoin="round">
            {/* Center Fronds */}
            <path d="M 150 160 Q 150 115, 150 90 Q 155 115, 150 160" fill="#2e7d32" />
            <path d="M 150 160 Q 140 110, 130 96 Q 144 116, 150 160" fill="#388e3c" />
            <path d="M 150 160 Q 160 110, 170 96 Q 156 116, 150 160" fill="#388e3c" />
            
            {/* Left curved Fronds */}
            <path d="M 148 160 Q 120 120, 88 115 Q 122 135, 148 160" fill="#43a047" />
            <path d="M 148 160 Q 105 130, 68 138 Q 112 150, 148 160" fill="#2e7d32" />
            <path d="M 148 160 Q 100 148, 62 165 Q 110 166, 148 160" fill="#388e3c" />
            <path d="M 148 160 Q 110 168, 70 190 Q 115 178, 148 160" fill="#43a047" />

            {/* Right curved Fronds */}
            <path d="M 152 160 Q 180 120, 212 115 Q 178 135, 152 160" fill="#43a047" />
            <path d="M 152 160 Q 195 130, 232 138 Q 188 150, 152 160" fill="#2e7d32" />
            <path d="M 152 160 Q 200 148, 238 165 Q 190 166, 152 160" fill="#388e3c" />
            <path d="M 152 160 Q 190 168, 230 190 Q 185 178, 152 160" fill="#43a047" />

            {/* Individual leaf pinnate leaflets highlights */}
            <path d="M 150 92 L 150 160" stroke="#7cb342" strokeWidth="2" />
            <path d="M 132 98 L 150 160" stroke="#7cb342" strokeWidth="1.5" />
            <path d="M 168 98 L 150 160" stroke="#7cb342" strokeWidth="1.5" />
            <path d="M 90 117 L 148 160" stroke="#7cb342" strokeWidth="1.5" />
            <path d="M 210 117 L 152 160" stroke="#7cb342" strokeWidth="1.5" />
          </g>

          {/* Red Royal Umbrella (Pajung Adat Luwu) */}
          <g>
            {/* Umbrella Canopy */}
            <path
              d="M 50 95 C 60 62, 110 52, 150 52 C 190 52, 240 62, 250 95 C 235 98, 220 94, 205 98 C 190 94, 175 98, 160 94 C 150 96, 140 94, 125 98 C 110 94, 95 98, 80 94 C 65 98, 55 95, 50 95 Z"
              fill="#dc2626"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Canopy Ribs */}
            <path d="M 150 52 L 150 95" stroke="#7f1d1d" strokeWidth="2.5" />
            <path d="M 150 52 Q 130 70, 115 95" stroke="#7f1d1d" strokeWidth="2.5" />
            <path d="M 150 52 Q 170 70, 185 95" stroke="#7f1d1d" strokeWidth="2.5" />
            <path d="M 150 52 Q 100 70, 80 95" stroke="#7f1d1d" strokeWidth="2.5" />
            <path d="M 150 52 Q 200 70, 220 95" stroke="#7f1d1d" strokeWidth="2.5" />

            {/* Golden fringe border & hanging tassels */}
            <path
              d="M 48 95 L 252 95 L 252 101 L 48 101 Z"
              fill="#f59e0b"
              stroke="#111827"
              strokeWidth="2"
            />
            {/* Golden tassel droplets */}
            {[56, 70, 84, 98, 112, 126, 140, 154, 168, 182, 196, 210, 224, 238, 246].map((x, i) => (
              <circle key={i} cx={x} cy="104" r="2.5" fill="#f59e0b" stroke="#111827" strokeWidth="1.2" />
            ))}
          </g>

          {/* Golden 5-pointed Star on Golden Lotus Base at Apex */}
          <g>
            {/* Lotus Bud / Base */}
            <path
              d="M 136 53 C 142 46, 150 42, 150 42 C 150 42, 158 46, 164 53 C 156 56, 144 56, 136 53 Z"
              fill="#eab308"
              stroke="#111827"
              strokeWidth="2"
            />
            {/* 5-pointed Star */}
            <polygon
              points="150,18 155,32 170,32 158,41 162,55 150,46 138,55 142,41 130,32 145,32"
              fill="#ffd700"
              stroke="#111827"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Left: Golden Rice Stalk (Padi) */}
          <g>
            <path
              d="M 68 245 C 45 200, 32 150, 72 100"
              stroke="#b45309"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Rice grains */}
            {[
              [70, 102, -20], [62, 112, -40], [74, 118, 10], [54, 128, -45],
              [68, 135, 10], [48, 146, -45], [63, 153, 10], [44, 166, -40],
              [58, 172, 15], [42, 186, -35], [56, 192, 20], [44, 208, -30],
              [58, 214, 25], [50, 228, -20], [64, 232, 25]
            ].map(([cx, cy, rot], i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="6"
                ry="3.5"
                transform={`rotate(${rot}, ${cx}, ${cy})`}
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Right: Cotton Branch (Kapas) */}
          <g>
            <path
              d="M 232 245 C 255 200, 268 150, 228 100"
              stroke="#166534"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Cotton bolls with green sepals */}
            {[
              [234, 106], [248, 126], [238, 150], [252, 175], [242, 202], [232, 228]
            ].map(([cx, cy], i) => (
              <g key={i}>
                {/* Green sepals */}
                <path
                  d={`M ${cx - 7} ${cy + 5} Q ${cx} ${cy - 2} ${cx + 7} ${cy + 5}`}
                  stroke="#166534"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* White fluffy cotton boll */}
                <circle cx={cx - 4} cy={cy - 2} r="4" fill="#ffffff" stroke="#111827" strokeWidth="1.2" />
                <circle cx={cx + 4} cy={cy - 2} r="4" fill="#ffffff" stroke="#111827" strokeWidth="1.2" />
                <circle cx={cx} cy={cy - 6} r="4.5" fill="#ffffff" stroke="#111827" strokeWidth="1.2" />
                <circle cx={cx} cy={cy - 1} r="3.5" fill="#f1f5f9" />
              </g>
            ))}
          </g>

          {/* Indonesian Merah Putih Ribbon at bottom corners */}
          <g stroke="#111827" strokeWidth="2.5" strokeLinejoin="round">
            {/* Left red-white banner knot */}
            <path d="M 26 195 C 38 215, 60 230, 80 240 L 75 255 C 50 245, 30 225, 20 205 Z" fill="#dc2626" />
            <path d="M 22 208 C 34 225, 52 238, 73 248 L 70 262 C 46 250, 28 234, 16 218 Z" fill="#ffffff" />

            {/* Right red-white banner knot */}
            <path d="M 274 195 C 262 215, 240 230, 220 240 L 225 255 C 250 245, 270 225, 280 205 Z" fill="#dc2626" />
            <path d="M 278 208 C 266 225, 248 238, 227 248 L 230 262 C 254 250, 272 234, 284 218 Z" fill="#ffffff" />
          </g>

          {/* White Ribbon Scroll Banner with 'LUWU UTARA' */}
          <g>
            {/* Folded ribbon ends */}
            <path d="M 40 262 L 68 252 L 68 274 L 40 286 Z" fill="#e2e8f0" stroke="#111827" strokeWidth="2.5" />
            <path d="M 260 262 L 232 252 L 232 274 L 260 286 Z" fill="#e2e8f0" stroke="#111827" strokeWidth="2.5" />

            {/* Main curved white ribbon banner */}
            <path
              d="M 50 268 
                 C 100 292, 200 292, 250 268 
                 L 242 304 
                 C 196 332, 104 332, 58 304 Z"
              fill="#ffffff"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Curved Text Path: 'LUWU UTARA' */}
            <path
              id="luwuUtaraTextPath"
              d="M 64 296 C 112 320, 188 320, 236 296"
              fill="none"
              stroke="none"
            />
            <text fill="#dc2626" stroke="#000000" strokeWidth="1.2" fontWeight="900" fontSize="23" letterSpacing="2">
              <textPath href="#luwuUtaraTextPath" startOffset="50%" textAnchor="middle">
                LUWU UTARA
              </textPath>
            </text>
          </g>
        </svg>
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-white font-sans">
              LAPAK KINERJA
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SAKIP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]">
            Dinas Transnaker Luwu Utara
          </p>
        </div>
      )}
    </div>
  );
};
