import type { Metadata } from "next"
import { Cairo, Cairo_Play } from "next/font/google"
import "./globals.css"

const cairoSans = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"]
})

const cairoPlay = Cairo_Play({
  variable: "--font-cairo-play",
  subsets: ["arabic"]
})

export const metadata: Metadata = {
  title: "El-Masreya | المكتبة المصرية",
  description: "مكتبة إلكترونية شاملة للكتب العربية",
  authors: [{ name: "ITExperts Team", url: "https://ite.from-masr.com" }],
  keywords: ["El-Masreya", "المكتبة المصرية", "كتب عربية", "مكتبة إلكترونية", "كتب PDF", "كتب مجانية", "كتب عربية PDF", "كتب عربية مجانية", "كتب عربية إلكترونية", "كتب عربية للتحميل", "كتب عربية للقراءة", "كتب عربية للتحميل المجاني", "كتب عربية للقراءة المجانية", "كتب عربية للتحميل المباشر", "كتب عربية للقراءة المباشرة", "كتب عربية للتحميل السريع", "كتب عربية للقراءة السريعة"],
  creator: "ITExperts Team"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang='ar' dir="rtl">
      <body
        className={`${cairoSans.variable} ${cairoPlay.variable}`}
      >
        {children}
      </body>
    </html >
  );
}
