import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "next-themes";
import type { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    ko: '한글챗',
    en: 'HangulChat',
    ja: 'ハングルチャット',
    zh: '韩文聊天',
    ar: 'هانغول شات'
  };

  const descriptions: Record<string, string> = {
    ko: '한글 기반 AI 채팅 서비스',
    en: 'Korean-based AI Chat Service',
    ja: 'ハングルベースのAIチャットサービス',
    zh: '基于韩文的AI聊天服务',
    ar: 'خدمة الدردشة بالذكاء الاصطناعي باللغة الكورية'
  };
  
  return {
    title: {
      default: titles[locale] || titles.ko,
      template: `%s | ${titles[locale] || titles.ko}`
    },
    description: descriptions[locale] || descriptions.ko,
    icons: {
      icon: '/logo.svg',
    }
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html 
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
