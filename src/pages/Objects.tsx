import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Project } from "../types/Project";
import Header from "@/components/layout/Header";

const Objects: React.FC = () => {
  const { subcategory } = useParams<{ subcategory?: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!subcategory) navigate("/objects/all", { replace: true });
  }, [subcategory, navigate]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/projects`).then((res) => setProjects(res.data));
  }, [backendUrl]);

  const filteredProjects = projects.filter((p) => {
    const category = p.category?.toLowerCase() || "";
    const subCat = p.subCategory?.toLowerCase() || "";

    if (category !== "objects" || p.toHomePage) return false;
    if (!subcategory || subcategory.toLowerCase() === "all") return true;
    return subCat === subcategory.toLowerCase();
  });

  const tabs = ["all", "furniture", "lighting"];
  const activeTab = (subcategory || "all").toLowerCase();

  return (
    <div className="w-full relative bg-white">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div
        className="
    container mx-auto
    px-4
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
          px-2 sm:px-3
          py-1
          font-serifBrand
          font-medium
          text-md sm:text-base
          whitespace-nowrap
          transition-colors duration-300
              ${isActive ? "text-[#0000B5] underline underline-offset-6" : "text-[#0000B5] hover:underline underline-offset-6"}
        `}
            >
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </Link>
          );
        })}
      </div>

      <div className="w-full">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {filteredProjects.slice(0, 30).map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="
            relative cursor-pointer group overflow-hidden
            aspect-[4/3]   /* 🔥 FIXED HEIGHT */
            w-full
          "
              >
                <div className="absolute inset-0">
                  <img
                    src={`${backendUrl}/${project.images[0]}`}
                    alt={project.title}
                    className="
                w-full h-full
                object-cover
                transition-opacity duration-700
                group-hover:opacity-0
              "
                  />

                  {project.images[1] && (
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
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white pointer-events-none">
                  <h2 className="text-lg sm:text-xl font-semibold">{project.title}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-4xl sm:text-5xl text-[#0000B5] font-serifBrand font-medium mb-4 animate-pulse">Coming Soon</h2>
            <p className="text-base sm:text-lg text-[#0000B5] font-sansBrand font-normal max-w-md">
              Exciting new designs are on their way in our <span className="font-semibold">{subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : "Objects"}</span> collection.
            </p>
            <div className="mt-8">
              <div className="w-24 h-1 bg-[#0000B5] mx-auto rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Objects;
