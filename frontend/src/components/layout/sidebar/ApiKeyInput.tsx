import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { useTranslations } from 'next-intl';
import { useCustomTheme } from '@/hooks/useCustomTheme';

const SidebarApiKeyInput = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { apiKey, setApiKey } = useApiKeyStore();
  const locale = useTranslations('SidebarApiKeyInput');
  const customTheme = useCustomTheme();
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
  };

  return (
    <div className={`mb-5 p-3.5 rounded-lg border shadow-sm ${customTheme.sideBarApiKeyInput.container}`}>
        <div className="mb-3 relative">
          <input 
            type={showApiKey ? "text" : "password"}
            placeholder={locale('apiKeyInputPlaceholder')}
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 ${customTheme.sideBarApiKeyInput.input}`}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors duration-200 rounded ${customTheme.sideBarApiKeyInput.toggleButton}`}
            aria-label={showApiKey ? locale('hideApiKey') : locale('showApiKey')}
          >
            {showApiKey ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p 
          className={`text-xs leading-relaxed ${customTheme.sideBarApiKeyInput.description}`}
          dangerouslySetInnerHTML={{ __html: locale('apiKeyDescription') }}
        />
    </div>
  )
}

export default SidebarApiKeyInput