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

          const sorted = filtered.sort((a: Project, b: Project) => {
            const aOrder = a.homePageOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.homePageOrder ?? Number.MAX_SAFE_INTEGER;

            if (aOrder !== bOrder) return aOrder - bOrder;
            if (a.isPrior && !b.isPrior) return -1;
            if (!a.isPrior && b.isPrior) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setProjects(sorted);
        }
      } catch {
        console.error("Error fetching projects");
      }
    };

    fetchProjects();
  }, [backendUrl]);

  /* ---------------- FETCH STUDIO ---------------- */
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/studio`);
        if (res.data?.length) setStudio(res.data[0]);
      } catch {
        console.error("Error fetching studio");
      }
    };

    fetchStudio();
  }, [backendUrl]);

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
      { threshold: [0.6] },
    );

    if (firstSectionRef.current) observer.observe(firstSectionRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  /* ---------------- DESKTOP LAYOUT PATTERN ---------------- */
  const layoutPattern = [1, 1, 2, 1, 1, 2, 2, 1, 1];

  const generateLayoutGroups = (items: Project[]): Project[][] => {
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
  const limitWords = (text: string, limit = 130) => {
    if (!text) return "";

    const words = text.trim().split(/\s+/);
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };
  const getWordLimit = (width: number) => {
    if (width < 640) return 60; // mobile
    if (width < 850) return 80; // sm
    if (width < 1024) return 90; // md
    if (width < 1536) return 100; // lg
    return 130; // 2xl
  };
  const useScreenWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
  };
  const screenWidth = useScreenWidth();
  const wordLimit = getWordLimit(screenWidth);

  return (
    <section className="w-full min-h-screen bg-white overflow-hidden">
      <Header visible={headerVisible} />

      <div className="flex flex-col w-full">
        {groups.map((group, gi) => {
          /* -------- STUDIO + PROJECT SECTION -------- */
          if (gi === 6 && studio) {
            const projectForRight = group[0];

            return (
              <div key="studio-section">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* LEFT : STUDIO */}
                  <div className="flex flex-col justify-start p-5 sm:p-8 md:p-16 lg:p-20 md:h-screen bg-[#0000D3] text-white">
                    <p
                      className="
      font-sansBrand font-normal leading-relaxed
      text-md
      lg:text-lg
      2xl:text-xl
      3xl:text-2xl
    "
                    >
                      {limitWords(studio.description, wordLimit)}
                    </p>

                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => {
                          navigate("/about");
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                        className="
        font-serifBrand font-medium
        text-sm
        sm:text-base
        lg:text-lg
        xl:text-xl
        hover:underline
      "
                      >
                        Read More →
                      </button>
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
