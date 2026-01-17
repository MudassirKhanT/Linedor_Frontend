import React, { useEffect, useState, useRef } from "react";
import axios from "../services/api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface PressItem {
  _id?: string;
  title: string;
  date: string;
  image: string;
  description: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

const PressDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [press, setPress] = useState<PressItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    title: "",
    date: "",
    image: null,
    description: "",
    link: "",
  });

  /* ---------------- ALERT ---------------- */
  const [alert, setAlert] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- PAGINATION ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const pressPerPage = 9;
  const indexOfLast = currentPage * pressPerPage;
  const indexOfFirst = indexOfLast - pressPerPage;
  const currentPress = press.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(press.length / pressPerPage);

  /* ---------------- AUTO CLEAR ALERT ---------------- */
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  /* ---------------- FETCH PRESS ---------------- */
  const fetchPress = async () => {
    try {
      const res = await axios.get("/press");

      // 🔥 Latest updated / added first
      const sorted = res.data.sort((a: PressItem, b: PressItem) => {
        const aTime = new Date(a.updatedAt || a.createdAt || "").getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || "").getTime();
        return bTime - aTime;
      });

      setPress(sorted);
      setCurrentPage(1);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load press ❌" });
    }
  };

  useEffect(() => {
    fetchPress();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("date", form.date);
      data.append("description", form.description);
      data.append("link", form.link);
      if (form.image) data.append("image", form.image);

      if (editId) {
        await axios.put(`/press/${editId}`, data);
        setAlert({ type: "success", message: "Press updated successfully ✅" });
      } else {
        await axios.post("/press", data);
        setAlert({ type: "success", message: "Press added successfully 🎉" });
      }

      setForm({ title: "", date: "", image: null, description: "", link: "" });
      setEditId(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchPress();
    } catch (err: any) {
      setAlert({ type: "error", message: err.response?.data?.message || "Something went wrong ❌" });
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (item: PressItem) => {
    setForm({
      title: item.title,
      date: item.date,
      image: null,
      description: item.description,
      link: item.link,
    });
    setEditId(item._id || null);
    setPreview(`${backendUrl}${item.image}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this press?")) return;

    try {
      await axios.delete(`/press/${id}`);
      setAlert({ type: "success", message: "Press deleted successfully 🗑️" });
      fetchPress();
    } catch {
      setAlert({ type: "error", message: "Failed to delete press ❌" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* ---------------- TOAST ALERT ---------------- */}
      {alert.message && (
        <div
          className={`fixed top-6 right-6 z-50 animate-slideIn rounded-lg px-5 py-3 shadow-lg border font-medium text-sm
          ${alert.type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
        >
          {alert.message}
        </div>
      )}

      {/* ---------------- FORM ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">{editId ? "Edit Press" : "Add New Press"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" className="w-full border p-2 rounded" value={form.title} onChange={handleChange} required />
          <input type="date" name="date" className="w-full border p-2 rounded" value={form.date} onChange={handleChange} required />

          <div className="w-full">
            <div onClick={() => fileInputRef.current?.click()} className="border rounded-lg px-4 py-3 bg-white text-gray-500 cursor-pointer hover:border-gray-400 transition">
              {form.image ? form.image.name : "Choose an image (PNG, JPG, JPEG)"}
            </div>
            <input type="file" name="image" accept="image/*" onChange={handleChange} ref={fileInputRef} className="hidden" />
          </div>

          {preview && <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded border" />}

          <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={handleChange} />
          <input type="text" name="link" placeholder="Press Link" className="w-full border p-2 rounded" value={form.link} onChange={handleChange} />

          <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            {editId ? "Update Press" : "Add Press"}
          </button>
        </form>
      </div>

      {/* ---------------- PRESS LIST ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Press</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPress.map((p) => (
            <div key={p._id} className="border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-all">
              {p.image && <img src={`${backendUrl}${p.image}`} alt={p.title} className="rounded-t-xl w-full h-52 object-cover" />}

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.date}</p>

                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="block w-full bg-black text-white px-4 py-2 rounded text-center hover:bg-gray-800">
                    View Press
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleEdit(p)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDelete(p._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- PAGINATION ---------------- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded border ${currentPage === i + 1 ? "bg-black text-white" : "bg-white"}`}>
                {i + 1}
              </button>
            ))}

            <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>

      {/* ---------------- TOAST ANIMATION ---------------- */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default PressDashboard;
