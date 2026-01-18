import React from 'react'
import { useCustomTheme } from '@/hooks/useCustomTheme';

const AssistantIcon = () => {
  const customTheme = useCustomTheme();

  return (
    <>
        <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="assistantIconInk" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={customTheme.logo.inkGradientStart}/>
              <stop offset="100%" stopColor={customTheme.logo.inkGradientEnd}/>
            </linearGradient>
            
            <linearGradient id="assistantIconAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={customTheme.logo.accentGradientStart}/>
              <stop offset="100%" stopColor={customTheme.logo.accentGradientEnd}/>
            </linearGradient>
          </defs>
          
          <g transform="translate(3, 3)">
            <circle cx="5" cy="4" r="3.5" fill="none" stroke="url(#assistantIconInk)" strokeWidth="1.3"/>
            
            <circle cx="9.5" cy="4" r="3.5" fill="none" stroke="url(#assistantIconAccent)" strokeWidth="1.3" opacity="0.85"/>
            
            <path d="M1 12.5 Q7.25 10.5 13.5 12.5" stroke="url(#assistantIconInk)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M2 15 Q7.25 13 12.5 15" stroke="url(#assistantIconInk)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </g>
        </svg>
    </>
  )
}

export default AssistantIcon