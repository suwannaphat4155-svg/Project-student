"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "../components/Toast";

interface Student {
  id: number;
  studentId: string;
  name: string;
  gpa: number;
  image?: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "gpa" | "studentId">("name");
  const [filterBy, setFilterBy] = useState<"all" | "excellent" | "good" | "low">("all");
  const { showToast } = useToast();

  const fetchStudents = () => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) return;

    const result = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (result.ok) {
      showToast("ลบข้อมูลนักศึกษาเรียบร้อยแล้ว", "success");
      fetchStudents();
    } else {
      showToast("ลบข้อมูลไม่สำเร็จ", "error");
    }
  };

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchFilter = (student: Student) => {
      if (filterBy === "excellent") return student.gpa >= 3.5;
      if (filterBy === "good") return student.gpa >= 2.0 && student.gpa < 3.5;
      if (filterBy === "low") return student.gpa < 2.0;
      return true;
    };

    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.studentId.toLowerCase().includes(normalizedSearch);
      return matchesSearch && matchFilter(student);
    });

    return filtered.sort((a, b) => {
      if (sortBy === "gpa") return b.gpa - a.gpa;
      if (sortBy === "studentId") return a.studentId.localeCompare(b.studentId, "th");
      return a.name.localeCompare(b.name, "th");
    });
  }, [students, searchTerm, sortBy, filterBy]);

  const exportToCsv = () => {
    if (!filteredStudents.length) {
      showToast("ไม่มีข้อมูลสำหรับ export", "info");
      return;
    }

    const csv = [
      ["studentId", "name", "gpa"].join(","),
      ...filteredStudents.map((student) => [student.studentId, student.name, student.gpa].map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "students.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("ส่งออก CSV เรียบร้อยแล้ว", "success");
  };

  const totalStudents = filteredStudents.length;
  const averageGPA = totalStudents > 0 ? (filteredStudents.reduce((sum, std) => sum + std.gpa, 0) / totalStudents).toFixed(2) : "0.00";
  const highPerformers = filteredStudents.filter((std) => std.gpa >= 3.5).length;

  if (isLoading) return <div className="mt-20 text-center text-pink-600 font-black animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="mt-4">
      <div className="mb-8 flex flex-col gap-4 border-b border-pink-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Student list</p>
          <h2 className="text-3xl font-black text-pink-700">รายชื่อนักศึกษา</h2>
          <p className="mt-1 font-medium text-pink-600">พบข้อมูลทั้งหมด {filteredStudents.length} รายการ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCsv} className="rounded-full bg-white border border-pink-200 px-4 py-2 font-semibold text-pink-700 hover:bg-pink-50 transition">
            Export CSV
          </button>
          <Link href="/add" className="rounded-full bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600 transition">
            + เพิ่มข้อมูล
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_180px_180px]">
        <input
          type="text"
          placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-pink-200 bg-white/80 p-3 text-pink-700 outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-pink-400"
        />

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as "all" | "excellent" | "good" | "low")}
          className="rounded-2xl border border-pink-200 bg-white/80 p-3 text-pink-700 outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="all">ทั้งหมด</option>
          <option value="excellent">เกรดดีเยี่ยม</option>
          <option value="good">ปานกลาง</option>
          <option value="low">ต้องปรับปรุง</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "gpa" | "studentId")}
          className="rounded-2xl border border-pink-200 bg-white/80 p-3 text-pink-700 outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="name">เรียงตามชื่อ</option>
          <option value="gpa">เรียงตาม GPA</option>
          <option value="studentId">เรียงตามรหัส</option>
        </select>
      </div>

      {totalStudents > 0 && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-3xl p-4 text-center">
            <p className="text-3xl font-black text-pink-700">{totalStudents}</p>
            <p className="text-sm text-pink-600">นักศึกษาทั้งหมด</p>
          </div>
          <div className="glass-card rounded-3xl p-4 text-center">
            <p className="text-3xl font-black text-pink-700">{averageGPA}</p>
            <p className="text-sm text-pink-600">เกรดเฉลี่ยรวม</p>
          </div>
          <div className="glass-card rounded-3xl p-4 text-center">
            <p className="text-3xl font-black text-pink-700">{highPerformers}</p>
            <p className="text-sm text-pink-600">เกรดดีเยี่ยม (≥3.5)</p>
          </div>
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="mt-10 rounded-[32px] border border-pink-200 bg-white/70 p-10 text-center shadow-[0_16px_40px_rgba(236,72,153,0.1)]">
          <p className="mb-4 text-xl font-bold text-pink-700">ยังไม่มีข้อมูลนักศึกษาในระบบ</p>
          <Link href="/add" className="inline-block rounded-full bg-pink-500 px-8 py-3 font-bold text-white hover:bg-pink-600 transition">
            เริ่มเพิ่มข้อมูล
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((std) => (
            <div key={std.id} className="glass-card relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(236,72,153,0.15)]">
              <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-pink-400 to-rose-500" />

              <div className="flex flex-grow flex-col pl-3">
                <div className="mb-4 flex items-center gap-3">
                  {std.image ? (
                    <img src={std.image} alt={std.name} className="h-12 w-12 rounded-full border-2 border-pink-200 object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-sm font-black text-pink-700">
                      {std.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500">รหัส</p>
                    <p className="text-lg font-black text-pink-800">{std.studentId}</p>
                  </div>
                </div>

                <Link href={`/students/${std.id}`} className="mb-3 block text-xl font-black text-pink-800 hover:text-pink-600 transition">
                  {std.name}
                </Link>

                <div className="mt-auto rounded-2xl border border-pink-100 bg-pink-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-600">GPA</span>
                    <span className={`text-xl font-black ${std.gpa >= 3.0 ? "text-emerald-500" : std.gpa >= 2.0 ? "text-amber-500" : "text-red-500"}`}>
                      {std.gpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link href={`/students/${std.id}`} className="flex-1 rounded-xl bg-pink-100 px-3 py-2 text-center text-sm font-bold text-pink-700 hover:bg-pink-200 transition">
                    View
                  </Link>
                  <Link href={`/edit/${std.id}`} className="flex-1 rounded-xl bg-pink-500 px-3 py-2 text-center text-sm font-bold text-white hover:bg-pink-600 transition">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(std.id)} className="flex-1 rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm font-bold text-pink-700 hover:bg-pink-50 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}