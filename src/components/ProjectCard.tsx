// import { useRef } from "react";
// import type { Project } from "../types/Project";
// import logoWhite from "../assets/linedori logo white.png";
// interface ProjectCardProps {
//   project: Project;
//   onClick: (id: string) => void;
//   layout?: "full" | "half";
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, layout = "full" }) => {
//   const ref = useRef<HTMLDivElement | null>(null);
//   const isVideo = !!project.videoFile;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   let aspectRatio = 1;
//   if (project.images?.[0]) {
//     const fileName = project.images[0].split("/").pop() || "";
//     const parts = fileName.split(".");
//     aspectRatio = parseFloat(`${parts[1]}.${parts[2]}`) || 1;
//   }

//   return (
//     <div
//       ref={ref}
//       className={`
//         relative w-full
//         md:h-screen
//         ${isVideo ? "cursor-default" : "cursor-pointer"}
//       `}
//       onClick={() => {
//         if (!isVideo) onClick(project._id);
//       }}
//     >
//       <div className="relative w-full overflow-hidden md:h-full" style={{ aspectRatio }}>
//         {isVideo ? (
//           <video
//             src={`${backendUrl}/${project.videoFile}`}
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="
//               w-full h-full object-cover
//               md:absolute md:inset-0
//               md:w-full md:h-full md:object-cover
//             "
//           />
//         ) : project.images?.[0] ? (
//           <img
//             src={`${backendUrl}/${project.images[0]}`}
//             alt={project.title}
//             draggable={false}
//             className="
//               w-full h-auto object-contain block
//               md:absolute md:inset-0
//               md:w-full md:h-full md:object-cover
//             "
//           />
//         ) : (
//           <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 text-gray-500">No Preview</div>
//         )}
//       </div>

//       {project.homePageOrder === 1 && (
//         <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
//           <img
//             src={logoWhite}
//             alt="Linedori Logo"
//             className="
//         h-7 sm:h-10 md:h-14 lg:h-20 xl:h-24
//         w-auto
//         cursor-pointer
//         select-none
//         pointer-events-auto
//       "
//             draggable={false}
//             onClick={(e) => {
//               e.stopPropagation();
//               window.location.reload();
//             }}
//           />
//         </div>
//       )}

//       {!isVideo && (
//         <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 md:p-8 text-white">
//           <h1 className="text-md md:text-xl font-semibold">{project.title}</h1>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCard;

import { useRef } from "react";
import type { Project } from "../types/Project";
import logoWhite from "../assets/linedori logo white.png";

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
  layout?: "full" | "half";
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, layout = "full" }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVideo = !!project.videoFile;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div
      ref={ref}
      className={`
        relative w-full h-screen
        ${isVideo ? "cursor-default" : "cursor-pointer"}
      `}
      onClick={() => {
        if (!isVideo) onClick(project._id);
      }}
    >
      {/* ---------- MEDIA ---------- */}
      <div className="relative w-full h-full overflow-hidden">{isVideo ? <video src={`${backendUrl}/${project.videoFile}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" /> : project.images?.[0] ? <img src={`${backendUrl}/${project.images[0]}`} alt={project.title} draggable={false} className="absolute inset-0 w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">No Preview</div>}</div>

      {/* ---------- CENTER LOGO ---------- */}
      {project.homePageOrder === 1 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <img
            src={logoWhite}
            alt="Linedori Logo"
            draggable={false}
            className="
              h-7 sm:h-10 md:h-14 lg:h-20 xl:h-24
              w-auto
              select-none
              pointer-events-auto
              cursor-pointer
            "
            onClick={(e) => {
              e.stopPropagation();
              window.location.reload();
            }}
          />
        </div>
      )}

      {/* ---------- TITLE ---------- */}
      {!isVideo && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 md:p-8 text-white z-10">
          <h1 className="text-md md:text-xl font-semibold">{project.title}</h1>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
