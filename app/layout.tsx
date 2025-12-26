import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google"; 
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | AfterTrip',
    default: 'AfterTrip - 여행 후 남은 외화 재환전 계산기',
  },
  description: '여행 후 남은 외화, 환율 타임머신으로 진단하세요. 환전 시점부터 현재까지의 가치 추이를 비교해 최적의 재환전 타이밍을 알려드립니다.',
  keywords: ['환율 계산기', '환율 타임머신', '재환전', '여행 잔돈', '엔화 투자', '달러 투자', '환차익', 'AfterTrip'],
  metadataBase: new URL('https://www.aftertrip.kr'),
  openGraph: {
    title: 'AfterTrip - 여행 후 남은 돈 계산기',
    description: '여행 후 남은 동전, 처치 곤란이라면? 지금 바로 원화 가치를 확인하세요.',
    url: 'https://www.aftertrip.kr',
    siteName: 'AfterTrip',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        
        {/* Vercel에서 제공하는 기본 분석 도구 */}
        <Analytics />
        
        {/* 구글 애널리틱스  */}
        <GoogleAnalytics gaId="G-ZQ58DH6L78" />
      </body>
    </html>
  );
}