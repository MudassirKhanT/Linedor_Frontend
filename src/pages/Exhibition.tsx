import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Project } from "../types/Project";
import Header from "@/components/layout/Header";

const Exhibition: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const filteredProjects = projects.filter((p) => p.category?.toLowerCase() === "exhibition" && !p.toHomePage).slice(0, 30);

  return (
    <div className="relative w-full bg-white">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div className="w-full pt-28 pb-12">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {filteredProjects.slice(0, 30).map((project) => (
              <div key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="relative cursor-pointer group">
                <div className="w-full">
                  <img
                    src={`${backendUrl}/${project.images[0]}`}
                    alt={project.title}
                    className="
                w-full h-auto
                sm:max-h-[90vh]
                object-contain
                transition-opacity duration-700 ease-in-out
                opacity-100 group-hover:opacity-0
              "
                  />

                  {project.images[1] && (
                    <img
                      src={`${backendUrl}/${project.images[1]}`}
                      alt={project.title}
                      className="
                  w-full h-auto
                  sm:max-h-[90vh]
                  object-contain
                  absolute top-0 left-0
                  opacity-0 transition-opacity duration-700 ease-in-out
                  group-hover:opacity-100
                "
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
                  <h2 className="text-lg sm:text-xl font-semibold">{project.title}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 animate-pulse">Coming Soon</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md">
              Exciting new designs are on their way in our <span className="font-semibold">Exhibition</span> collection.
            </p>
            <div className="mt-8">
              <div className="w-24 h-1 bg-black mx-auto rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibition;
