import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Project } from "../types/Project";
import Header from "@/components/layout/Header";

const Objects: React.FC = () => {
  const { subcategory } = useParams<{ subcategory?: string }>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- REDIRECT IF NO SUBCATEGORY ---------------- */
  useEffect(() => {
    if (!subcategory) {
      navigate("/objects/all", { replace: true });
    }
  }, [subcategory, navigate]);

  /* ---------------- FETCH PROJECTS ---------------- */
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${backendUrl}/api/projects`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [backendUrl]);

  /* ---------------- FILTER PROJECTS ---------------- */
  const filteredProjects = projects.filter((p) => {
    const category = p.category?.toLowerCase() || "";
    const subCat = p.subCategory?.toLowerCase() || "";

    if (category !== "objects") return false;
    if (!subcategory || subcategory.toLowerCase() === "all") return true;

    return subCat === subcategory.toLowerCase();
  });

  /* ---------------- TABS ---------------- */
  const tabs = ["all", "furniture", "lighting"];
  const activeTab = (subcategory || "all").toLowerCase();

  /* ===================== RENDER ===================== */
  return (
    <div className="w-full relative bg-white min-h-screen">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* ---------------- TABS ---------------- */}
      <div
        className="
          container mx-auto
          px-3
    md:px-7
          pt-[100px] pb-4
          flex flex-nowrap sm:flex-wrap
          gap-2 sm:gap-4
          justify-start
          max-w-full
          overflow-x-auto
        "
      >
        {tabs.map((sub) => {
          const isActive = activeTab === sub;
          return (
            <Link
              key={sub}
              to={`/objects/${sub}`}
              className={`
  mt-2
  px-2 sm:px-3
  py-1
  font-serifBrand
  font-normal
  text-lg
  whitespace-nowrap
  transition-colors duration-300
  decoration-[0.5px]
  ${isActive ? "text-[#0000D3] underline underline-offset-6" : "text-[#0000D3] hover:underline underline-offset-6"}
`}
            >
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </Link>
          );
        })}
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="w-full">
        {/* 🔄 LOADING */}
        {loading && (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#0000D3]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#0000D3] border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {/* ✅ PROJECT GRID */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {filteredProjects.slice(0, 30).map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="
                  relative cursor-pointer group overflow-hidden
                  aspect-[4/3]
                  w-full
                "
              >
                <div className="absolute inset-0 h-full w-full">
                  <img
                    src={`${backendUrl}/${project.images?.[0]}`}
                    alt={project.title}
                    className="
                      w-full h-full
                      object-cover
                      transition-opacity duration-700
                      group-hover:opacity-0
                    "
                  />

                  {project.images?.[1] && (
                    <img
                      src={`${backendUrl}/${project.images[1]}`}
                      alt={project.title}
                      className="
                        absolute inset-0
                        w-full h-full
                        object-cover
                        opacity-0 transition-opacity duration-700
                        group-hover:opacity-100
                      "
                    />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 md:p-5 text-white pointer-events-none">
                  <h2 className="text-md md:text-lg font-serifBrand font-normal">{project.title}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🚧 EMPTY STATE */}
        {!loading && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-4xl sm:text-5xl text-[#0000D3] font-serifBrand font-normal  mb-4 animate-pulse">Coming Soon</h2>
            <p className="text-base sm:text-lg text-[#0000D3] font-sansBrand font-normal  max-w-md">Exciting new designs are on their way in our collection.</p>
            <div className="mt-8">
              <div className="w-24 h-1 bg-[#0000D3] mx-auto rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Objects;
