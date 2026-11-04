import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-noto-sans",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
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
      <body className={`antialiased ${notoSans.variable} ${beVietnamPro.variable} ${notoSans.className}`}>
        {children}
      </body>
    </html>
  );
}
