import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  description: string;
  location?: string;
  contact?: string;
  email?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- HELPERS ---------- */
const isVideoUrl = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
const isVideoFile = (file: File) => file.type.startsWith("video/");

const StudioDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [form, setForm] = useState<Partial<Studio>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- ALERT ---------- */
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  /* ---------- AUTO CLEAR ALERT ---------- */
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  /* ---------- FETCH ---------- */
  const fetchStudios = async () => {
    try {
      const res = await API.get("/studio");
      const sorted = res.data.sort((a: Studio, b: Studio) => {
        const aTime = new Date(a.updatedAt || a.createdAt || "").getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || "").getTime();
        return bTime - aTime;
      });
      setStudios(sorted);
    } catch {
      setAlert({ type: "error", message: "Failed to load studios ❌" });
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  /* ---------- FILE CHANGE ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v as string);
    });
    if (file) data.append("image", file);

    try {
      if (editingId) {
        await API.put(`/studio/${editingId}`, data);
        setAlert({ type: "success", message: "Studio updated successfully ✅" });
      } else {
        await API.post("/studio", data);
        setAlert({ type: "success", message: "Studio created successfully 🎉" });
      }

      setForm({});
      setFile(null);
      setPreview(null);
      setEditingId(null);
      if (fileRef.current) fileRef.current.value = "";

      fetchStudios();
    } catch {
      setAlert({ type: "error", message: "Failed to save studio ❌" });
    }
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (s: Studio) => {
    setForm({
      title: s.title,
      description: s.description,
      location: s.location,
      contact: s.contact,
      email: s.email,
    });
    setEditingId(s._id);
    setFile(null);
    setPreview(s.image ? backendUrl + s.image : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete studio?")) return;

    try {
      await API.delete(`/studio/${id}`);
      setAlert({ type: "success", message: "Studio deleted successfully 🗑️" });
      fetchStudios();
    } catch {
      setAlert({ type: "error", message: "Failed to delete studio ❌" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      {/* ---------- TOAST ALERT ---------- */}
      {alert.message && (
        <div
          className={`fixed top-6 right-6 z-50 animate-slideIn rounded-lg px-5 py-3 shadow-lg border font-medium text-sm
            ${alert.type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
        >
          {alert.message}
        </div>
      )}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

        <Textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

        {/* FILE PICKER */}
        <div onClick={() => fileRef.current?.click()} className="border p-3 rounded cursor-pointer text-gray-600">
          {file ? file.name : "Select image / video / gif"}
        </div>

        <input type="file" ref={fileRef} hidden accept="image/*,video/*" onChange={handleFileChange} />

        {/* PREVIEW */}
        {preview && (file ? isVideoFile(file) ? <video src={preview} controls className="h-48 w-full object-cover rounded" /> : <img src={preview} className="h-48 w-full object-cover rounded" /> : isVideoUrl(preview) ? <video src={preview} controls className="h-48 w-full object-cover rounded" /> : <img src={preview} className="h-48 w-full object-cover rounded" />)}

        <Button className="w-full">{editingId ? "Update Studio" : "Create Studio"}</Button>
      </form>

      {/* ================= GALLERY ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {studios.map((s) => (
          <div key={s._id} className="bg-gray-50 rounded-xl shadow overflow-hidden">
            {s.image && (isVideoUrl(s.image) ? <video src={backendUrl + s.image} className="h-48 w-full object-cover" muted controls /> : <img src={backendUrl + s.image} className="h-48 w-full object-cover" />)}

            <div className="p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{s.title}</h3>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(s)}>
                  <Edit size={16} />
                </Button>

                <Button variant="destructive" size="icon" onClick={() => handleDelete(s._id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- ALERT ANIMATION ---------- */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudioDashboard;
