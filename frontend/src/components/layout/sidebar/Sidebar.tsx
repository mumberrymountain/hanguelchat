import { useCustomTheme } from '@/hooks/useCustomTheme';
import Header from './Header';
import List from './List';
import ApiKeyInput from './ApiKeyInput';

const Sidebar = () => {
  const customTheme = useCustomTheme();

  return (
    <div className={`w-[378px] h-full flex flex-col border p-[10px] border-r-0 ${customTheme.sideBar.sideBarContainer} ${customTheme.sideBar.sideBarBorder}`}>
      <div className="flex-shrink-0">
        <ApiKeyInput/>
        <Header/>
      </div>
      
      <List/>
    </div>
  )
}

export default Sidebar