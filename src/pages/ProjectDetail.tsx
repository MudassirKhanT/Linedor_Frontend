import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Project } from "../types/Project";
import Header from "@/components/layout/Header";
import { X, ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react";
import ObjectsContact from "./ObjectsContact";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const zoomRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0); // ✅

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));

  /* ---------------- FETCH PROJECT ---------------- */
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(console.error);
  }, [id, backendUrl]);

  /* ---------------- SCROLL TO TOP ON PROJECT CHANGE ---------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  /* ---------------- HEADER SHOW / HIDE ---------------- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 50) setHeaderVisible(false);
      else setHeaderVisible(true);
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [selectedIndex]);

  /* ---------------- MODAL CLOSE (FIXED) ---------------- */
  const closeModal = () => {
    setSelectedIndex(null);
    setZoom(1);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "auto",
      });
    });
  };

  /* ---------------- TOUCH CONTROLS ---------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!project || selectedIndex === null) return;

    const diff = (touchStartX ?? 0) - (touchEndX ?? 0);
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedIndex < project.images.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else if (diff < 0 && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!project)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0000D3]/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#0000D3] border-t-transparent animate-spin"></div>
        </div>
      </div>
    );

  const totalImages = project.images.length;

  const goPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? totalImages - 1 : prev! - 1));
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev === totalImages - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="w-full overflow-x-hidden">
      <Header visible={headerVisible} />

      {/* ---------------- COVER IMAGE ---------------- */}
      <div
        className="
        relative w-full
        overflow-hidden
        cursor-pointer
        md:h-screen
      "
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("header") || target.closest(".header-modal")) return;
          setSelectedIndex(0);
        }}
      >
        <img
          src={`${backendUrl}/${project.images[0]}`}
          alt={project.title}
          draggable={false}
          className="
          w-full h-auto
          object-contain
          block

          md:absolute md:inset-0
          md:w-full md:h-full
          md:object-cover md:object-center
        "
        />
      </div>

      {/* ---------------- INFO SECTION ---------------- */}
      <div className="container px-6 md:px-10 py-14">
        <div className="grid md:grid-cols-2 items-center">
          <div className="md:text-center flex flex-col">
            <h2 className="text-xl sm:text-left md:text-center md:text-2xl font-serifBrand font-medium mb-3 text-[#0000D3]">{project.title}</h2>

            {project.contactDescription && (
              <ul className="text-[#0000D3] sm:text-left md:text-center font-sansBrand font-normal text-lg">
                {project.contactDescription
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            )}

            {/* ---------------- SPECS & CONTACT ---------------- */}
            <div className="flex flex-col md:flex-row md:justify-center gap-4 mt-1">
              {/* Specs PDF */}
              {project.pdfFile && (
                <a
                  href={`${backendUrl}/${project.pdfFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
        inline-flex
        items-center
        justify-center
        gap-2
        px-4
        py-2
        text-base
        font-serifBrand
        font-medium
        text-[#0000D3]
        border
        border-[#0000D3]
        rounded-md
        cursor-pointer
        transition
        hover:bg-[#0000D3]
        hover:text-white
        active:scale-95
        w-fit
      "
                >
                  Specs
                </a>
              )}

              {/* Objects Contact */}
              {project.category === "Objects" && (
                <div className="mb-2 md:mb-0">
                  <ObjectsContact projectTitle={project.title} />
                </div>
              )}
            </div>
          </div>

          <div className="text-[#0000D3] font-sansBrand space-y-4 font-normal text-lg">
            {project.description?.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- IMAGE GRID (UNCHANGED) ---------------- */}
      <div className="w-full bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 sm:gap-3 md:gap-4">
          {project.images.slice(1, 31).map((img, idx) => {
            const fileName = img.split("/").pop() || "";
            const parts = fileName.split(".");
            const ratio = parseFloat(`${parts[1]}.${parts[2]}`) || 1;
            const isLandscape = ratio > 1;

            return (
              <div
                key={idx}
                onClick={() => {
                  scrollPositionRef.current = window.scrollY;
                  setSelectedIndex(idx + 1);
                }}
                className={`
                overflow-hidden cursor-pointer bg-gray-50
                ${isLandscape ? "md:col-span-2" : "md:col-span-1"}
                md:h-[550px] sm:h-[320px]
              `}
              >
                <img
                  src={`${backendUrl}/${img}`}
                  alt={`${project.title} ${idx}`}
                  className="
                  w-full
                  h-auto
                  object-contain
                  md:h-full md:object-fill
                "
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- FULLSCREEN MODAL ---------------- */}
      {project && selectedIndex !== null && (
        <div
          ref={zoomRef}
          className="fixed inset-0 z-[99999] bg-[#ffff] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* IMAGE */}
            <img src={`${backendUrl}/${project.images[selectedIndex]}`} className="object-contain max-w-full max-h-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }} draggable={false} />

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 md:left-8 text-black p-3 rounded-full bg-grey/40 hover:bg-grey/60 cursor-pointer"
            >
              <ArrowLeft size={34} />
            </button>

            {/* NEXT */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 md:right-8 text-black p-3 rounded-full bg-grey/40 hover:bg-grey/60 cursor-pointer"
            >
              <ArrowRight size={34} />
            </button>

            {/* ZOOM CONTROLS */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 px-4 py-2 rounded-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  zoomOut();
                }}
                className="text-white text-2xl cursor-pointer hover:opacity-80"
              >
                <Minus size={17} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  zoomIn();
                }}
                className="text-white text-2xl cursor-pointer hover:opacity-80"
              >
                <Plus size={17} />
              </button>
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-6 right-8 text-black cursor-pointer hover:opacity-80"
            >
              <X size={34} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
