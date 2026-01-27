import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AxiosError } from "axios";

/* ---------------- TYPES ---------------- */
interface Member {
  _id: string;
  name: string;
  role: string;
  description?: string;
  image?: string;
}

interface FormDataType {
  name: string;
  role: string;
  description: string;
  image: File | null;
}

interface AlertType {
  type: "success" | "error" | "";
  message: string;
}

const PeopleDashboard: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [team, setTeam] = useState<Member[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    role: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [alert, setAlert] = useState<AlertType>({ type: "", message: "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- AUTO CLEAR ALERT ---------------- */
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || fallback;
    }
    return fallback;
  };

  /* ---------------- FETCH TEAM ---------------- */
  const fetchTeam = async () => {
    try {
      const res = await axios.get<Member[]>("/team");
      setTeam(res.data);
    } catch (error: unknown) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Failed to load team members ❌"),
      });
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await axios.put(`/team/${editId}`, data);
        setAlert({ type: "success", message: "Team member updated successfully ✅" });
      } else {
        await axios.post("/team", data);
        setAlert({ type: "success", message: "Team member added successfully 🎉" });
      }

      resetForm();
      fetchTeam();
    } catch (error: unknown) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Something went wrong ❌"),
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", role: "", description: "", image: null });
    setPreview(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      image: null,
    });
    setPreview(member.image ? `${backendUrl}${member.image}` : null);
    setEditId(member._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`/team/${id}`);
      setAlert({ type: "success", message: "Team member deleted successfully 🗑️" });
      fetchTeam();
    } catch (error: unknown) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Failed to delete team member ❌"),
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* ---------------- TOAST ALERT ---------------- */}
      {alert.message && (
        <div
          className={`fixed top-6 right-6 z-50 animate-slideIn rounded-lg px-5 py-3 shadow-lg border font-normal text-sm
          ${alert.type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
        >
          {alert.message}
        </div>
      )}

      {/* ---------------- FORM ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">{editId ? "Edit Team Member" : "Add Team Member"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm mb-12">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" required />
          <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} className="border p-2 w-full rounded" required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded" />

          <div className="w-full">
            <div onClick={() => fileInputRef.current?.click()} className="border rounded-lg px-4 py-3 bg-white text-gray-500 cursor-pointer hover:border-gray-400 transition">
              {formData.image ? formData.image.name : "Choose an image (PNG, JPG, JPEG, WEBP)"}
            </div>
            <input type="file" name="image" accept="image/*,.webp" onChange={handleChange} ref={fileInputRef} className="hidden" />
          </div>

          {preview && <img src={preview} alt="Preview" className="h-48 w-48 object-contain rounded-lg border shadow-sm bg-white mt-3" />}

          <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            {editId ? "Update Member" : "Add Member"}
          </button>
        </form>
      </div>

      {/* ---------------- TEAM LIST ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">People</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member._id} className="border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-all duration-300">
              {member.image && <img src={`${backendUrl}${member.image}`} alt={member.name} className="rounded-t-xl w-full h-72 object-cover" />}

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleEdit(member)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>

                  <Button variant="destructive" className="flex-1" onClick={() => handleDelete(member._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default PeopleDashboard;
