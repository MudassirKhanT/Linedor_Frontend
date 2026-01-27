import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types/Project";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/layout/Header";
import { ArrowRight } from "lucide-react";

/* ===================== TYPES ===================== */
interface Studio {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  contact?: string;
  email?: string;
}

interface StudioMarker {
  _id: "__STUDIO__";
  isStudio: true;
}

type HomeItem = Project | StudioMarker;

/* ===================== CONSTANT ===================== */
const RESERVED_HOME_ORDER = 7;

/* ===================== TYPE GUARD ===================== */
const isStudioMarker = (item: HomeItem): item is StudioMarker => "isStudio" in item;

/* ===================== COMPONENT ===================== */
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

        if (!Array.isArray(res.data)) return;

        const filtered = res.data
          .filter((p: Project) => p.toHomePage && p.homePageOrder !== RESERVED_HOME_ORDER)
          .sort((a: Project, b: Project) => {
            const aOrder = a.homePageOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.homePageOrder ?? Number.MAX_SAFE_INTEGER;

            if (aOrder !== bOrder) return aOrder - bOrder;
            if (a.isPrior && !b.isPrior) return -1;
            if (!a.isPrior && b.isPrior) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

        setProjects(filtered);
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    };

    fetchProjects();
  }, [backendUrl]);

  /* ---------------- FETCH STUDIO ---------------- */
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/studio`);
        if (Array.isArray(res.data) && res.data.length) {
          setStudio(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching studio", err);
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

  /* ---------------- LAYOUT ---------------- */
  const layoutPattern = [1, 1, 2, 1, 1, 2, 2, 1, 1];

  const generateLayoutGroups = (items: HomeItem[]): HomeItem[][] => {
    const groups: HomeItem[][] = [];
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

  /* ---------------- INSERT STUDIO ---------------- */
  const insertStudioSlot = (projects: Project[], studio: Studio | null): HomeItem[] => {
    if (!studio) return projects;

    // Count homepage projects (excluding reserved)
    const totalProjects = projects.length;

    // 🟢 If fewer than 7 projects → place studio at END
    if (totalProjects < RESERVED_HOME_ORDER) {
      return [...projects, { _id: "__STUDIO__", isStudio: true }];
    }

    // 🔵 Otherwise → place studio at reserved slot (7)
    const before = projects.slice(0, RESERVED_HOME_ORDER - 1);
    const after = projects.slice(RESERVED_HOME_ORDER - 1);

    return [...before, { _id: "__STUDIO__", isStudio: true }, ...after];
  };

  const itemsWithStudio = insertStudioSlot(projects, studio);
  const groups = generateLayoutGroups(itemsWithStudio);

  /* ---------------- TEXT UTILS ---------------- */
  const limitWords = (text: string, limit = 130) => {
    const words = text.trim().split(/\s+/);
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
  };

  const getWordLimit = (width: number) => {
    if (width < 640) return 60;
    if (width < 850) return 80;
    if (width < 1024) return 90;
    if (width < 1536) return 100;
    return 75;
  };

  const useScreenWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
    return width;
  };

  const wordLimit = getWordLimit(useScreenWidth());

  /* ===================== RENDER ===================== */
  return (
    <section className="w-full min-h-screen bg-white overflow-hidden">
      <Header visible={headerVisible} />

      <div className="flex flex-col w-full">
        {groups.map((group, gi) => {
          /* ---------- STUDIO SECTION ---------- */
          if (group.some(isStudioMarker) && studio) {
            const projectForRight = group.find((item): item is Project => !isStudioMarker(item));

            return (
              <div key="studio-section">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="flex flex-col justify-start p-5 sm:p-8 md:p-16 lg:p-20 md:h-screen bg-[#0000D3] text-white">
                    <p className="font-sansBrand font-normal text-md lg:text-lg 2xl:text-3xl 3xl:text-2xl text-justify">{limitWords(studio.description, wordLimit)}</p>

                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => {
                          navigate("/about");
                          window.scrollTo({ top: 0 });
                        }}
                        className="font-serifBrand text-sm sm:text-base lg:text-lg xl:text-xl hover:underline"
                      >
                        <span className="flex items-center gap-1 leading-none">
                          Read More
                          <ArrowRight size={20} className="translate-y-[2px]" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full">{projectForRight && <ProjectCard project={projectForRight} onClick={(id) => navigate(`/projects/${id}`)} layout="half" />}</div>
                </div>
              </div>
            );
          }

          /* ---------- SINGLE PROJECT ---------- */
          if (group.length === 1) {
            const item = group[0];
            if (isStudioMarker(item)) return null;

            return (
              <div key={item._id} ref={gi === 0 ? firstSectionRef : undefined} className="w-full md:h-screen">
                <ProjectCard project={item} onClick={(id) => navigate(`/projects/${id}`)} layout="full" />
              </div>
            );
          }

          /* ---------- MULTI PROJECT ---------- */
          return (
            <div key={`group-${gi}`} className="grid grid-cols-1 md:grid-cols-2 w-full md:h-screen">
              {group
                .filter((item): item is Project => !isStudioMarker(item))
                .map((proj) => (
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
