// hooks/useCustomTheme.tsx
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import lightTheme from '../themes/light.json'
import darkTheme from '../themes/dark.json'

type ThemeStyles = typeof lightTheme

let cachedTheme: ThemeStyles = darkTheme

export const useCustomTheme = (): ThemeStyles => {
  const { theme } = useTheme()
  const [customTheme, setCustomTheme] = useState(cachedTheme)

  useEffect(() => {
    let newTheme: ThemeStyles
    switch (theme) {
        case 'light':
            newTheme = lightTheme
            break
        case 'dark':
            newTheme = darkTheme
            break
        default:
            return
    }

    cachedTheme = newTheme
    setCustomTheme(newTheme)
  }, [theme])

  return customTheme
}