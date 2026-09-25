import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Đọc Hiểu Tiếng Việt | Nền tảng học đọc 5 bước cho con lớp 7",
  description:
    "Nền tảng luyện đọc hiểu Tiếng Việt 5 bước dành cho con cấp THCS. Tích hợp Từ điển Hán-Việt, chế độ Đồng hành Cha - Mẹ và bản in A4.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
      </head>
      <body className={`antialiased ${notoSans.variable}`}>{children}</body>
    </html>
  );
}
