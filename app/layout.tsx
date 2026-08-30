import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { ToastProvider } from "./components/Toast";

const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"] });

export const metadata: Metadata = { title: "Student PSU" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} bg-[radial-gradient(circle_at_top,_#fff7fb,_#fce7f3_30%,_#fdf2f8_100%)] text-[#4a1d3d] flex flex-col min-h-screen`}>
        <ThemeProvider>
          <ToastProvider>
            <header className="bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#f9a8d4] text-white shadow-[0_18px_36px_rgba(236,72,153,0.28)]">
              <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link href="/" className="text-2xl font-black tracking-tight hover:text-pink-100 transition-colors flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-base shadow-inner">✦</span>
                  Student PSU
                </Link>
                <div className="flex items-center gap-4">
                  <nav className="flex gap-4 flex-wrap items-center text-sm md:text-base">
                    <Link href="/" className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-pink-100">หน้าแรก</Link>
                    <Link href="/dashboard" className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-pink-100">📊 แดชบอร์ด</Link>
                    <Link href="/students" className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-pink-100">รายชื่อนักศึกษา</Link>
                    <Link href="/add" className="hover:text-white transition-colors bg-white/20 px-4 py-2 rounded-full border border-white/30 shadow-sm">เพิ่มข้อมูล</Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
              {children}
            </main>

            <footer className="bg-gradient-to-r from-[#be185d] to-[#db2777] text-white text-center p-4 mt-auto text-sm">
              <p>&copy; 2026 Student PSU Project. All rights reserved.</p>
            </footer>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}