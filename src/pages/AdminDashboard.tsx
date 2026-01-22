import { useEffect, useState } from "react";
import API from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Trash2, GripVertical, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent } from "@dnd-kit/core";

interface Project {
  _id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  contactDescription?: string;
  images: string[];
  pdfFile?: string;
  videoFile?: string;
  isPrior?: boolean;
  toHomePage?: boolean;
  homePageOrder?: number;
}

interface PreviewFile {
  id: string;
  url: string;
  file?: File;
  filename?: string;
}

const SortableImage = ({ id, src, index, onDelete }: { id: string; src: string; index: number; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
      <img src={src} alt={`preview-${index + 1}`} className="object-contain w-full h-full" />
      <span className="absolute top-1 left-1 bg-white text-gray-800 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shadow">{index + 1}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
        title="Delete Image"
        type="button"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      <div className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1 cursor-grab shadow flex items-center justify-center" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>
    </div>
  );
};

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>({});
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [alertMsg, setAlertMsg] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file, idx) => ({
      id: `${file.name}-${idx}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  };
  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      subCategory: "",
      description: "",
      contactDescription: "",
      isPrior: false,
      toHomePage: false,
      homePageOrder: undefined,
    });

    setPreviewFiles([]);
    setPdfFile(null);
    setVideoFile(null);
    setEditingId(null);

    const imgInput = document.getElementById("imageInput") as HTMLInputElement;
    if (imgInput) imgInput.value = "";

    const videoInput = document.getElementById("videoInput") as HTMLInputElement;
    if (videoInput) videoInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });

    if (form.category !== "video") {
      previewFiles.forEach((p) => {
        if (p.file) {
          formData.append("images", p.file);
        } else if (p.filename) {
          formData.append("existingImages[]", p.filename);
        }
      });

      if (form.category === "Objects" && pdfFile) formData.append("pdfFile", pdfFile);
    }

    if (form.category === "video" && videoFile) {
      formData.append("videoFile", videoFile);
    }

    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setAlertMsg({
        type: "success",
        message: "Project saved successfully!",
      });

      resetForm();

      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
      setAlertMsg({
        type: "error",
        message: "Failed to save project.",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);

    setForm({
      title: project.title,
      category: project.category,
      subCategory: project.subCategory,
      description: project.description,
      contactDescription: project.contactDescription,
      isPrior: project.isPrior,
      toHomePage: project.toHomePage,
      homePageOrder: project.homePageOrder,
    });

    const previews = project.images.map((img, idx) => ({
      id: `${img}-${idx}`,
      url: `${backendUrl}/${img}`,
      filename: img,
    }));

    setPreviewFiles(previews);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePreview = (id: string) => {
    const deleted = previewFiles.find((p) => p.id === id);
    if (!deleted) return;
    if (deleted.url.startsWith("blob:")) URL.revokeObjectURL(deleted.url);
    setPreviewFiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = previewFiles.findIndex((f) => f.id === active.id);
    const newIndex = previewFiles.findIndex((f) => f.id === over.id);

    setPreviewFiles(arrayMove(previewFiles, oldIndex, newIndex));
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await API.delete(`/projects/${id}`);

      setAlertMsg({
        type: "success",
        message: "Project deleted successfully!",
      });

      fetchProjects();
    } catch (err) {
      console.error(err);

      setAlertMsg({
        type: "error",
        message: "Failed to delete project.",
      });
    }
  };

  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Project" : "Create Project"}</h2>
        {alertMsg && (
          <div className="fixed top-6 right-6 z-[9999]">
            <div
              className={`rounded-xl px-6 py-4 shadow-lg border text-sm font-semibold transition-all
        ${alertMsg.type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
            >
              {alertMsg.message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <Select
            value={form.category || ""}
            onValueChange={(value) => {
              setForm({
                ...form,
                category: value,
                subCategory: "",
                isPrior: value === "video" ? false : form.isPrior,
              });

              setPdfFile(null);
              setVideoFile(null);

              const pdfInput = document.getElementById("pdfInput") as HTMLInputElement;
              if (pdfInput) pdfInput.value = "";

              const videoInput = document.getElementById("videoInput") as HTMLInputElement;
              if (videoInput) videoInput.value = "";
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Architecture">Architecture</SelectItem>
              <SelectItem value="Interior">Interior</SelectItem>
              <SelectItem value="Objects">Objects</SelectItem>
              <SelectItem value="Exhibition">Exhibition</SelectItem>
              <SelectItem value="video">media</SelectItem>
            </SelectContent>
          </Select>
          {form.category !== "video" && (
            <Select value={form.subCategory || ""} onValueChange={(value) => setForm({ ...form, subCategory: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select SubCategory" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Lighting">Lighting</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="All">All</SelectItem>
              </SelectContent>
            </Select>
          )}

          {form.category !== "video" && (
            <>
              <Textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Textarea placeholder="Contact Description" value={form.contactDescription || ""} onChange={(e) => setForm({ ...form, contactDescription: e.target.value })} />
            </>
          )}

          {form.category !== "video" && (
            <div className="flex items-center justify-between">
              <label className="font-medium">Key Project</label>
              <Switch checked={!!form.isPrior} onCheckedChange={(checked) => setForm({ ...form, isPrior: checked })} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="font-medium">Show on Home Page</label>
            <Switch checked={!!form.toHomePage} onCheckedChange={(checked) => setForm({ ...form, toHomePage: checked })} />
          </div>

          {form.toHomePage && <Input type="number" placeholder="Home Page Order" value={form.homePageOrder || ""} onChange={(e) => setForm({ ...form, homePageOrder: Number(e.target.value) })} />}

          {form.category === "video" ? (
            <label className="block cursor-pointer">
              <div className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">{videoFile ? videoFile.name : "Upload Image / GIF / Video"}</div>

              <input
                type="file"
                accept="image/*,video/*,.gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (!file) return;

                  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];

                  if (!allowedTypes.includes(file.type)) {
                    setAlertMsg({
                      type: "error",
                      message: "Only Image, GIF, or Video files are allowed",
                    });
                    return;
                  }

                  setVideoFile(file);
                }}
              />
            </label>
          ) : (
            <>
              <label className="block cursor-pointer">
                <div className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">{previewFiles.length > 0 ? `${previewFiles.length} files selected` : "Upload Images"}</div>
                <input id="imageInput" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {form.category === "Objects" && (
                <label className="block cursor-pointer">
                  <div className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">{pdfFile ? pdfFile.name : "Upload PDF"}</div>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </>
          )}

          {form.category !== "video" && previewFiles.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Preview & Reorder Images</h3>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={previewFiles.map((f) => f.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {previewFiles.map((p, idx) => (
                      <SortableImage key={p.id} id={p.id} src={p.url} index={idx} onDelete={handleDeletePreview} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          <Button type="submit" className="w-full">
            {editingId ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <div key={project._id} className="border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-all duration-300">
              {project.category === "video" && project.videoFile ? (
                project.videoFile.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={`${backendUrl}/${project.videoFile}`} controls className="rounded-t-xl w-full h-52 object-cover" />
                ) : (
                  <img src={`${backendUrl}/${project.videoFile}`} alt={project.title} className="rounded-t-xl w-full h-52 object-cover" />
                )
              ) : (
                project.images?.length > 0 && <img src={`${backendUrl}/${project.images[0]}`} alt={project.title} className="rounded-t-xl w-full h-52 object-cover" />
              )}

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                {project.category == "video" ? (
                  <p className="text-sm text-gray-600 mb-2">media</p>
                ) : (
                  <p className="text-sm text-gray-600 mb-2">
                    {project.category} - {project.subCategory}
                  </p>
                )}

                {project.isPrior && <p className="text-sm font-semibold text-blue-600">⭐ Priority</p>}
                {project.toHomePage && <p className="text-sm font-semibold text-green-600">🏠 Home Order: {project.homePageOrder ?? "-"}</p>}

                {project.pdfFile && (
                  <a href={`${backendUrl}/${project.pdfFile}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 bg-black text-white font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition-all w-full">
                    <FileText className="w-5 h-5" />
                    <span>View PDF</span>
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDeleteProject(project._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center flex-wrap gap-2 mt-8">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-4 py-2 rounded-lg border transition-all duration-200 ${currentPage === i + 1 ? "bg-black text-white border-black" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}`}>
                {i + 1}
              </button>
            ))}

            <Button variant="outline" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;
