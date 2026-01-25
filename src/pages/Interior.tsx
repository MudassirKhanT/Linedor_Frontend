import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Project } from "../types/Project";
import Header from "@/components/layout/Header";

const Interior: React.FC = () => {
  const { subcategory } = useParams<{ subcategory?: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subcategory) navigate("/interior/all", { replace: true });
  }, [subcategory, navigate]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/projects`)
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      })
      .finally(() => {
        setLoading(false); // 👈 THIS IS THE KEY
      });
  }, [backendUrl]);

  const filteredProjects = projects.filter((p) => {
    const category = p.category?.toLowerCase() || "";
    const subCat = p.subCategory?.toLowerCase() || "";

    if (category !== "interior") return false;
    if (!subcategory || subcategory.toLowerCase() === "all") return true;
    return subCat === subcategory.toLowerCase();
  });

  const tabs = ["all", "residential", "commercial"];
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
              to={`/interior/${sub}`}
              className={`
          px-2 sm:px-3
          py-1
          font-serifBrand
          font-medium
          text-lg 
          whitespace-nowrap
          transition-colors duration-300
              ${isActive ? "text-[#0000D3] underline underline-offset-6" : "text-[#0000D3] hover:underline underline-offset-6"}
        `}
            >
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </Link>
          );
        })}
      </div>

      <div className="w-full">
        {loading ? (
          /* 🔵 BLUE LOADER */
          <div className="flex items-center justify-center h-[60vh]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#0000D3]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#0000D3] border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {filteredProjects.slice(0, 30).map((project) => (
              <div key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="relative cursor-pointer group overflow-hidden aspect-[4/3]">
                <div className="relative w-full h-full">
                  <img
                    src={`${backendUrl}/${project.images[0]}`}
                    alt={project.title}
                    className="
                w-full h-full
                transition-opacity duration-700 ease-in-out
                opacity-100 group-hover:opacity-0
              "
                  />

                  {project.images[1] && (
                    <img
                      src={`${backendUrl}/${project.images[1]}`}
                      alt={project.title}
                      // onLoad={(e) => {
                      //   const img = e.currentTarget;
                      //   img.style.objectFit = img.naturalHeight > img.naturalWidth ? "contain" : "cover";
                      // }}
                      className="
                  absolute top-0 left-0
                  w-full h-full
                  opacity-0 transition-opacity duration-700 ease-in-out
                  group-hover:opacity-100
                "
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white pointer-events-none">
                  <h2 className="text-lg sm:text-xl font-serifBrand font-medium ">{project.title}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            {/* Loader */}
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-2 border-[#0000D3]/30 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-[#0000D3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interior;
