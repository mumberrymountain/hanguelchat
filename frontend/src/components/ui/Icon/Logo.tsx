import React from 'react'
import { useCustomTheme } from '@/hooks/useCustomTheme';

const Logo = () => {

  const customTheme = useCustomTheme();

  return (
    <>
      <div className={`ms-2`} dir={'ltr'}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 100" className="h-12 w-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={customTheme.logo.inkGradientStart}/>
              <stop offset="100%" stopColor={customTheme.logo.inkGradientEnd}/>
            </linearGradient>
            
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={customTheme.logo.accentGradientStart}/>
              <stop offset="100%" stopColor={customTheme.logo.accentGradientEnd}/>
            </linearGradient>
          </defs>
          
          <g transform="translate(15, 15)">
            <circle cx="22" cy="18" r="12" fill="none" stroke="url(#ink)" strokeWidth="3"/>
            
            <circle cx="38" cy="18" r="12" fill="none" stroke="url(#accent)" strokeWidth="3" opacity="0.85"/>
            
            <path d="M8 50 Q30 42 52 50" stroke="url(#ink)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M12 62 Q30 55 48 62" stroke="url(#ink)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </g>
          
          <text x="85" y="60" fill="url(#ink)" fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fontSize="38" fontWeight="900">한</text>
          <text x="127" y="60" fill="url(#ink)" fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fontSize="38" fontWeight="100">글</text>
          <text x="165" y="60" fill="url(#accent)" fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fontSize="38" fontWeight="500">챗</text>
          
        </svg>
      </div>
    </>
  )
}

export default Logo