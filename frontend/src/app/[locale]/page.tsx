
"use client"
import { useState } from "react";
import Logo from "@/components/ui/Icon/Logo";
import DropButton from "@/components/layout/header/DropButton";
import LocaleListbox from "@/components/ui/Listbox/LocaleListbox";
import { PanelLeft } from 'lucide-react';
import Sidebar from "@/components/layout/sidebar/Sidebar";
import ChatArea from "@/components/layout/chatarea/ChatArea"
import ThemeSwitch from "@/components/ui/Switch/ThemeSwitch";
import AuthButton from "@/components/ui/Auth/AuthButton";
import { useCustomTheme } from "@/hooks/useCustomTheme";

export default function Home() {

  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  const customTheme = useCustomTheme();

  return (
    <div className="h-screen flex flex-col">
      <div className={`w-full h-12 ${customTheme.page.headerContainer} flex items-center justify-between px-[12px]`}>
          <div className='flex items-center'>
              <Logo/>
              <PanelLeft className={`ml-4 ${customTheme.page.panelLeft} w-5 h-5 cursor-pointer`} onClick={toggleSidebar}/>
              <DropButton setIsLoading={setIsLoading}/>
          </div>
          
          <div className='flex items-center gap-2'>
              <ThemeSwitch/>
              <LocaleListbox/>
              <AuthButton/>
          </div>
      </div>

      <div className="w-full flex-1 flex overflow-hidden">
          {showSidebar && <Sidebar />}
          <ChatArea isLoading={isLoading} setIsLoading={setIsLoading}/>
      </div>
    </div>
  );
}
