import React from 'react'
import { Switch } from "@headlessui/react";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // 마운트 전까지는 렌더링하지 않도록 설정
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null

    const toggleThemeSwitch = (isChecked: boolean) => {
        isChecked ? setTheme('light') : setTheme('dark');
    }

    return (
        <>
            <Switch 
                checked={theme === 'light'}
                onChange={toggleThemeSwitch} 
                className="me-4 group relative inline-flex h-7 w-16 items-center rounded-md bg-gray-700 border border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-gray-600 hover:border-gray-500 data-[checked]:bg-violet-800 data-[checked]:border-violet-700 data-[checked]:hover:bg-violet-900"
            >
                <Moon size={12} className="absolute start-1.5 text-gray-400 transition-opacity duration-200 group-data-[checked]:opacity-30"/>
                <Sun size={12} className="absolute end-1.5 text-yellow-400 transition-opacity duration-200 opacity-30 group-data-[checked]:opacity-100"/>
                <span className="relative z-10 w-5 h-5 translate-x-1 rounded-full bg-white transition-all duration-200 group-data-[checked]:translate-x-10 shadow-md rtl:translate-x-[-4px] rtl:group-data-[checked]:translate-x-[-40px]" />
            </Switch>
        </>
    )
}

export default ThemeSwitch