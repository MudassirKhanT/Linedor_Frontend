import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types/Project";
import ProjectCard from "../components/ProjectCard";

interface Props {
  category: "Architecture" | "Interior" | "Objects" | "Exhibition";
}

const CategoryPage: React.FC<Props> = ({ category }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendUrl}/api/projects`).then((res) => {
      setProjects(res.data.filter((p: Project) => p.category === category));
    });
  }, [category, backendUrl]);

  return (
    <div className="pt-20 container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">{category} Projects</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} onClick={(id) => navigate(`/projects/${id}`)} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
