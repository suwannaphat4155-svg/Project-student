"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-toast-in">
          <div
            className={`toast-shadow flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              toast.type === "success"
                ? "border-pink-200 bg-rose-100 text-rose-700"
                : toast.type === "error"
                  ? "border-red-200 bg-red-100 text-red-700"
                  : "border-pink-200 bg-white text-pink-700"
            }`}
          >
            <span className="text-lg">{toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "ℹ"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
