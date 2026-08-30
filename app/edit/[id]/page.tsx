"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { studentSchema } from "@/lib/studentSchema";
import { useToast } from "../../components/Toast";

export default function EditStudent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ studentId: "", name: "", gpa: "", image: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setFormData({
            studentId: data.studentId,
            name: data.name,
            gpa: data.gpa.toString(),
            image: data.image || "",
          });
          setImagePreview(data.image || null);
        }
        setIsFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = studentSchema.safeParse({
      ...formData,
      gpa: formData.gpa,
      image: formData.image || undefined,
    });

    if (!result.success) {
      const message = result.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง";
      setError(message);
      showToast(message, "error");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("แก้ไขข้อมูลสำเร็จ", "success");
        router.push("/students");
      } else {
        const message = data.error || "เกิดข้อผิดพลาด";
        setError(message);
        showToast(message, "error");
      }
    } catch (err) {
      const message = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="mt-20 text-center font-black text-pink-600 animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-[32px] border border-pink-200 bg-white/70 p-8 shadow-[0_24px_60px_rgba(236,72,153,0.12)] backdrop-blur-sm animate-fade-in">
      <h2 className="mb-8 text-center text-3xl font-black text-pink-700">แก้ไขข้อมูล</h2>

      {error && (
        <div className="mb-6 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-center text-sm font-bold text-pink-700">
          * {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="ml-2 text-sm font-bold text-pink-600">รหัสนักศึกษา (10 หลัก)</label>
          <input
            type="text"
            maxLength={10}
            className="mt-1 w-full rounded-2xl border border-pink-200 bg-white p-4 text-pink-700 outline-none transition focus:ring-2 focus:ring-pink-300"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value.replace(/\D/g, "") })}
          />
        </div>

        <div>
          <label className="ml-2 text-sm font-bold text-pink-600">ชื่อ-นามสกุล</label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-pink-200 bg-white p-4 text-pink-700 outline-none transition focus:ring-2 focus:ring-pink-300"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="ml-2 text-sm font-bold text-pink-600">เกรดเฉลี่ย (GPA)</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-2xl border border-pink-200 bg-white p-4 text-pink-700 outline-none transition focus:ring-2 focus:ring-pink-300"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
          />
        </div>

        <div>
          <label className="ml-2 text-sm font-bold text-pink-600">รูปโปรไฟล์ (ไม่บังคับ)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 w-full rounded-2xl border border-pink-200 bg-white p-4 text-pink-700 outline-none transition focus:ring-2 focus:ring-pink-300"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-20 w-20 rounded-full border-2 border-pink-300 object-cover" />}
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => router.push("/students")} className="flex-1 rounded-2xl border border-pink-200 bg-pink-50 py-4 font-bold text-pink-700 transition hover:bg-pink-100">
            ยกเลิก
          </button>
          <button type="submit" disabled={isLoading} className={`flex-1 rounded-2xl py-4 font-bold text-white shadow-lg transition ${isLoading ? "bg-pink-400" : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"}`}>
            {isLoading ? "กำลังบันทึก..." : "อัปเดตข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
}