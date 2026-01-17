import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types/Project";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/layout/Header";

interface Studio {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  contact?: string;
  email?: string;
}

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const firstSectionRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- FETCH PROJECTS ---------------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/projects/homepage/list`);

        if (Array.isArray(res.data)) {
          const filtered = res.data.filter((p: Project) => p.toHomePage || p.isPrior);

          const sorted = filtered.sort((a: any, b: any) => {
            const aOrder = a.homePageOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.homePageOrder ?? Number.MAX_SAFE_INTEGER;
            if (aOrder !== bOrder) return aOrder - bOrder;
            if (a.isPrior && !b.isPrior) return -1;
            if (!a.isPrior && b.isPrior) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setProjects(sorted);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  /* ---------------- FETCH STUDIO ---------------- */
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/studio`);
        if (res.data && res.data.length > 0) setStudio(res.data[0]);
      } catch (err) {
        console.error("Error fetching studio:", err);
      }
    };

    fetchStudio();
  }, []);

  /* ---------------- HEADER VISIBILITY ---------------- */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHeaderVisible(!(currentY > lastScrollY.current && currentY > 50));
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) {
            setHeaderVisible(false);
          }
        });
      },
      { threshold: [0.6] }
    );

    if (firstSectionRef.current) observer.observe(firstSectionRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  /* ---------------- DESKTOP LAYOUT PATTERN ---------------- */
  const layoutPattern = [1, 1, 2, 1, 1, 2, 2, 1, 1];

  const generateLayoutGroups = (items: Project[]) => {
    const groups: Project[][] = [];
    let i = 0;
    let patternIndex = 0;

    while (i < items.length) {
      const size = layoutPattern[patternIndex % layoutPattern.length];
      groups.push(items.slice(i, i + size));
      i += size;
      patternIndex++;
    }
    return groups;
  };

  const groups = generateLayoutGroups(projects);

  return (
    <section className="w-full min-h-screen bg-white overflow-hidden">
      <Header visible={headerVisible} />

      {/* ================= PROJECT SECTIONS ================= */}
      <div className="flex flex-col w-full">
        {groups.map((group, gi) => {
          /* -------- STUDIO + PROJECT SECTION -------- */
          if (gi === 6 && studio) {
            const projectForRight = group[0];

            return (
              <div key="studio-section">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* LEFT : STUDIO */}
                  <div
                    className="
    flex flex-col justify-center
    p-5 sm:p-8 md:p-16 lg:p-20
    md:h-screen
    bg-[#0000B5]
  "
                  >
                    <div className="mx-auto text-left">
                      <p
                        className="
        font-['Times_New_Roman']
        text-white
        leading-relaxed
        mb-4 sm:mb-5 md:mb-6
        sm:text-md
        lg:text-xl
        4xl:text-4xl
      "
                      >
                        {studio.description}
                      </p>

                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            navigate("/about");
                            window.scrollTo({ top: 0, behavior: "instant" });
                          }}
                          className="
          text-sm sm:text-base
          text-white
          hover:underline
          underline-offset-4
          cursor-pointer
          xl:text-lg 3xl:text-2xl
        "
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT : PROJECT */}
                  <div className="relative w-full">{projectForRight && <ProjectCard project={projectForRight} onClick={(id) => navigate(`/projects/${id}`)} layout="half" />}</div>
                </div>

                {/* REMAINING PROJECTS */}
                {group.slice(1).map((proj) => (
                  <div key={proj._id} className="w-full">
                    <ProjectCard project={proj} onClick={(id) => navigate(`/projects/${id}`)} layout="full" />
                  </div>
                ))}
              </div>
            );
          }

          /* -------- SINGLE PROJECT -------- */
          if (group.length === 1) {
            const proj = group[0];
            return (
              <div key={proj._id} ref={gi === 0 ? firstSectionRef : undefined} className="w-full md:h-screen">
                <ProjectCard project={proj} onClick={(id) => navigate(`/projects/${id}`)} layout="full" />
              </div>
            );
          }

          /* -------- MULTI PROJECT GROUP -------- */
          return (
            <div key={`group-${gi}`} className="grid grid-cols-1 md:grid-cols-2 w-full md:h-screen">
              {group.map((proj) => (
                <div key={proj._id} className="w-full">
                  <ProjectCard project={proj} onClick={(id) => navigate(`/projects/${id}`)} layout="half" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Home;
