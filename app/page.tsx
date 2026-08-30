"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [quote, setQuote] = useState("กำลังโหลดคำแนะนำ...");

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((res) => res.json())
      .then((data) => setQuote(data.slip.advice))
      .catch(() => setQuote("Welcome to Student PSU!"));
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-6 text-center md:mt-14 animate-fade-in">
      <div className="hero-glow glass-card w-full max-w-5xl rounded-[40px] p-8 md:p-12">
        <div className="flex flex-col items-center gap-4">
          <span className="pink-pill">Sweet Student Workspace</span>
          <h2 className="text-4xl font-black leading-tight text-pink-700 md:text-6xl animate-bounce-in">ระบบจัดการนักศึกษา</h2>
          <p className="mx-auto max-w-2xl text-lg text-pink-600 animate-slide-up">
            รองรับการเพิ่ม ดู จัดการ และติดตามผลการเรียนแบบสวยและใช้งานง่ายด้วยดีไซน์สีชมพูหวาน
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up-delayed">
          <Link href="/dashboard" className="rounded-2xl bg-pink-100 px-6 py-3 font-bold text-pink-700 transition hover:bg-pink-500 hover:text-white shadow-sm">
            📊 ดูแดชบอร์ด
          </Link>
          <Link href="/students" className="rounded-2xl bg-white px-6 py-3 font-bold text-pink-700 ring-1 ring-pink-200 transition hover:bg-pink-50 shadow-sm">
            รายชื่อนักศึกษา
          </Link>
          <Link href="/add" className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:scale-[1.02]">
            เริ่มเพิ่มข้อมูล
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="soft-card card-lift rounded-3xl p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Manage</p>
            <p className="mt-2 text-xl font-black text-pink-700">จัดการข้อมูล</p>
          </div>
          <div className="soft-card card-lift rounded-3xl p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Track</p>
            <p className="mt-2 text-xl font-black text-pink-700">ติดตามผล</p>
          </div>
          <div className="soft-card card-lift rounded-3xl p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-500">Visual</p>
            <p className="mt-2 text-xl font-black text-pink-700">ดีไซน์สวย</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-[28px] border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 p-6 shadow-[0_20px_40px_rgba(236,72,153,0.08)]">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-pink-500">คำแนะนำประจำวัน</p>
        <p className="text-lg font-medium text-pink-700 italic">“{quote}”</p>
      </div>
    </div>
  );
}