import React from 'react'
import { useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCustomTheme } from '@/hooks/useCustomTheme'

const LocaleListbox = () => {
    const localeSetting = [
        { id: 1, name: "Ko", code: 'ko' },
        { id: 2, name: "En", code: 'en' },
        { id: 3, name: "Jp", code: "jp"},
        { id: 4, name: "Cn", code: "cn"},
        { id: 5, name: "Ar", code: "ar"},
    ]
    const router = useRouter()
    const currentLocale = useLocale()
    const customTheme = useCustomTheme()
    
    const [selectedLocale, setSelectedLocale] = useState(
        localeSetting.find(lang => lang.code === currentLocale) || localeSetting[0]
    )

    const handleLocaleChange = (newLocale: typeof localeSetting[0]) => {
        setSelectedLocale(newLocale)
        router.push(`/${newLocale.code}`)
    }
    
    return (
        <>
            <Listbox value={selectedLocale} onChange={handleLocaleChange}>
                <ListboxButton className={`focus:outline-none inline-flex items-center justify-center px-2 py-1 border rounded-md text-sm font-medium cursor-pointer transition-all duration-200 shadow-sm gap-1.5 font-sans hover:shadow-md ${customTheme.localeListBox.listboxButton}`}>
                    {selectedLocale.name}
                </ListboxButton>
                <ListboxOptions 
                    anchor="bottom" 
                    className={`focus:outline-none mt-1 border-gray-600 rounded-md shadow-lg py-1 z-10 w-18 ${customTheme.localeListBox.listboxOptions} `}
                >
                    {localeSetting.map((lang) => (
                        <ListboxOption 
                            key={lang.id} 
                            value={lang} 
                            className={`focus:outline-none px-3 py-2 text-sm font-medium cursor-pointer 
                                    transition-colors duration-150 
                                    ${customTheme.localeListBox.listboxOption}`}
                        >
                            {lang.name}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </>
    )
}

export default LocaleListbox