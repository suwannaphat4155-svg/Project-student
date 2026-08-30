"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Student {
  id: number;
  studentId: string;
  name: string;
  gpa: number;
  image?: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStudent(null);
        } else {
          setStudent(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mt-20 text-center font-bold text-pink-600 animate-pulse">กำลังโหลดข้อมูลนักศึกษา...</div>;
  }

  if (!student) {
    return (
      <div className="mt-20 text-center glass-card rounded-3xl p-8">
        <p className="text-xl font-bold text-pink-700">ไม่พบข้อมูลนักศึกษา</p>
        <Link href="/students" className="mt-4 inline-block rounded-full bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600">
          กลับไปรายชื่อนักศึกษา
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="glass-card rounded-[32px] p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Student Profile</p>
            <h2 className="mt-2 text-3xl font-black text-pink-700">ข้อมูลนักศึกษา</h2>
          </div>
          <Link href="/students" className="rounded-full border border-pink-200 bg-white px-4 py-2 font-semibold text-pink-700 transition hover:bg-pink-50">
            ← กลับ
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex justify-center md:justify-start">
            {student.image ? (
              <img src={student.image} alt={student.name} className="h-52 w-52 rounded-full border-4 border-pink-200 object-cover shadow-xl" />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center rounded-full border-4 border-pink-200 bg-pink-100 text-5xl font-black text-pink-700">
                {student.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-pink-50 p-4 border border-pink-100">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">ชื่อ-นามสกุล</p>
                <p className="mt-2 text-2xl font-black text-pink-800">{student.name}</p>
              </div>
              <div className="rounded-2xl bg-pink-50 p-4 border border-pink-100">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">รหัสนักศึกษา</p>
                <p className="mt-2 text-2xl font-black text-pink-800">{student.studentId}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 p-5 border border-pink-100">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">GPA</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-black text-pink-700">{student.gpa.toFixed(2)}</span>
                <span
                  className={`mb-2 rounded-full px-3 py-1 text-xs font-bold ${
                    student.gpa >= 3.5
                      ? "bg-emerald-100 text-emerald-700"
                      : student.gpa >= 2.0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.gpa >= 3.5 ? "เกรดดีเยี่ยม" : student.gpa >= 2.0 ? "ปานกลาง" : "ต้องปรับปรุง"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/edit/${student.id}`} className="rounded-full bg-pink-500 px-5 py-3 font-bold text-white transition hover:bg-pink-600">
                แก้ไขข้อมูล
              </Link>
              <Link href="/students" className="rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-pink-700 transition hover:bg-pink-50">
                ดูรายชื่อนักศึกษา
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
