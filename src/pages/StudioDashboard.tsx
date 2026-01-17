// import React, { useEffect, useState, useRef } from "react";
// import API from "../services/api";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2 } from "lucide-react";

// interface Studio {
//   _id: string;
//   title: string;
//   description: string;
//   location: string;
//   contact: string;
//   email: string;
//   image?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const StudioDashboard = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [form, setForm] = useState<Partial<Studio>>({});
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   /* ---------------- ALERT ---------------- */
//   const [alert, setAlert] = useState<{ type: "success" | "error" | ""; message: string }>({
//     type: "",
//     message: "",
//   });

//   /* ---------------- AUTO CLEAR ALERT ---------------- */
//   useEffect(() => {
//     if (alert.message) {
//       const timer = setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [alert]);

//   /* ---------------- FETCH STUDIOS ---------------- */
//   const fetchStudios = async () => {
//     try {
//       const res = await API.get("/studio");

//       // 🔥 latest updated/created first
//       const sorted = res.data.sort((a: Studio, b: Studio) => {
//         const aTime = new Date(a.updatedAt || a.createdAt || "").getTime();
//         const bTime = new Date(b.updatedAt || b.createdAt || "").getTime();
//         return bTime - aTime;
//       });

//       setStudios(sorted);
//     } catch (err) {
//       setAlert({ type: "error", message: "Failed to load studios ❌" });
//     }
//   };

//   useEffect(() => {
//     fetchStudios();
//   }, []);

//   /* ---------------- HANDLE IMAGE ---------------- */
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   /* ---------------- RESET FORM ---------------- */
//   const resetForm = () => {
//     setForm({});
//     setImageFile(null);
//     setPreview(null);
//     setEditingId(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (value) formData.append(key, value as string);
//     });
//     if (imageFile) formData.append("image", imageFile);

//     try {
//       if (editingId) {
//         await API.put(`/studio/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
//         setAlert({ type: "success", message: "Studio updated successfully ✅" });
//       } else {
//         await API.post("/studio", formData, { headers: { "Content-Type": "multipart/form-data" } });
//         setAlert({ type: "success", message: "Studio added successfully 🎉" });
//       }
//       resetForm();
//       fetchStudios();
//     } catch (err: any) {
//       setAlert({ type: "error", message: err.response?.data?.message || "Failed to save studio ❌" });
//     }
//   };

//   /* ---------------- EDIT ---------------- */
//   const handleEdit = (studio: Studio) => {
//     setForm({
//       title: studio.title,
//       description: studio.description,
//       location: studio.location,
//       contact: studio.contact,
//       email: studio.email,
//     });
//     setEditingId(studio._id);
//     setPreview(studio.image ? `${backendUrl}${studio.image}` : null);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   /* ---------------- DELETE ---------------- */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this studio?")) return;
//     try {
//       await API.delete(`/studio/${id}`);
//       setAlert({ type: "success", message: "Studio deleted successfully 🗑️" });
//       fetchStudios();
//     } catch (err) {
//       setAlert({ type: "error", message: "Failed to delete studio ❌" });
//     }
//   };

//   return (
//     <div className="p-4 max-w-6xl mx-auto space-y-10">
//       {/* ---------------- FORM ---------------- */}
//       <div className="bg-white shadow-md rounded-xl p-6">
//         <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Studio" : "Add New Studio"}</h2>

//         {alert.message && (
//           <div
//             className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium border
//               ${alert.type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
//           >
//             {alert.message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
//           <Textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//           <Input placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
//           <Input placeholder="Contact" value={form.contact || ""} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
//           <Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />

//           <div className="w-full">
//             <div onClick={() => fileInputRef.current?.click()} className="border rounded-lg px-4 py-3 bg-white text-gray-500 cursor-pointer hover:border-gray-400 transition">
//               {imageFile ? imageFile.name : "Choose an image (PNG, JPG, JPEG)"}
//             </div>
//             <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
//           </div>

//           {preview && <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-lg shadow-md mt-2" />}

//           <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
//             {editingId ? "Update Studio" : "Add Studio"}
//           </Button>
//         </form>
//       </div>

//       {/* ---------------- STUDIO LIST ---------------- */}
//       <div className="bg-white shadow-md rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-6">Studios</h2>

//         {studios.length === 0 ? (
//           <p className="text-gray-500">No studio entries yet.</p>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {studios.map((studio) => (
//               <div key={studio._id} className="border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-all">
//                 {studio.image && <img src={`${backendUrl}${studio.image}`} alt={studio.title} className="rounded-t-xl w-full h-48 object-cover" />}
//                 <div className="p-4">
//                   <h3 className="font-bold text-lg mb-1">{studio.title}</h3>
//                   <p className="text-sm text-gray-600">{studio.location}</p>
//                   <p className="mt-2 text-gray-700 line-clamp-3">{studio.description}</p>

//                   <div className="flex gap-2 mt-4">
//                     <Button variant="outline" className="flex-1" onClick={() => handleEdit(studio)}>
//                       <Edit className="w-4 h-4 mr-1" /> Edit
//                     </Button>
//                     <Button variant="destructive" className="flex-1" onClick={() => handleDelete(studio._id)}>
//                       <Trash2 className="w-4 h-4 mr-1" /> Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudioDashboard;

import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  description: string;
  location: string;
  contact: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const StudioDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [form, setForm] = useState<Partial<Studio>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- ALERT ---------------- */
  const [alert, setAlert] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });

  /* ---------------- AUTO CLEAR ALERT ---------------- */
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  /* ---------------- FETCH STUDIOS ---------------- */
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

  /* ---------------- HANDLE IMAGE ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setForm({});
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await API.put(`/studio/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        setAlert({ type: "success", message: "Studio updated successfully ✅" });
      } else {
        await API.post("/studio", formData, { headers: { "Content-Type": "multipart/form-data" } });
        setAlert({ type: "success", message: "Studio added successfully 🎉" });
      }
      resetForm();
      fetchStudios();
    } catch (err: any) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to save studio ❌" });
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (studio: Studio) => {
    setForm({
      title: studio.title,
      description: studio.description,
      location: studio.location,
      contact: studio.contact,
      email: studio.email,
    });
    setEditingId(studio._id);
    setPreview(studio.image ? `${backendUrl}${studio.image}` : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this studio?")) return;
    try {
      await API.delete(`/studio/${id}`);
      setAlert({ type: "success", message: "Studio deleted successfully 🗑️" });
      fetchStudios();
    } catch {
      setAlert({ type: "error", message: "Failed to delete studio ❌" });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-10">
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
        <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Studio" : "Add New Studio"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input placeholder="Contact" value={form.contact || ""} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <div className="w-full">
            <div onClick={() => fileInputRef.current?.click()} className="border rounded-lg px-4 py-3 bg-white text-gray-500 cursor-pointer hover:border-gray-400 transition">
              {imageFile ? imageFile.name : "Choose an image (PNG, JPG, JPEG)"}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
          </div>

          {preview && <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-lg shadow-md mt-2" />}

          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
            {editingId ? "Update Studio" : "Add Studio"}
          </Button>
        </form>
      </div>

      {/* ---------------- STUDIO LIST ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Studios</h2>

        {studios.length === 0 ? (
          <p className="text-gray-500">No studio entries yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div key={studio._id} className="border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-all">
                {studio.image && <img src={`${backendUrl}${studio.image}`} alt={studio.title} className="rounded-t-xl w-full h-48 object-cover" />}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{studio.title}</h3>
                  <p className="text-sm text-gray-600">{studio.location}</p>
                  <p className="mt-2 text-gray-700 line-clamp-3">{studio.description}</p>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => handleEdit(studio)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleDelete(studio._id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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

export default StudioDashboard;
