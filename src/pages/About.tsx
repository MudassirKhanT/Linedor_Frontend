// import { useEffect, useState } from "react";
// import Header from "@/components/layout/Header";
// import axios from "axios";

// interface Studio {
//   _id: string;
//   title: string;
//   description: string;
//   image?: string;
//   location?: string;
//   contact?: string;
//   email?: string;
// }

// interface TeamMember {
//   _id: string;
//   name: string;
//   role: string;
//   description: string;
//   image?: string;
// }

// const About = () => {
//   const tabs = ["studio", "people", "press"];
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [team, setTeam] = useState<TeamMember[]>([]);
//   const [activeTab, setActiveTab] = useState("studio");
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const fetchStudio = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/studio`);
//         if (res.data && res.data.length > 0) setStudio(res.data[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchStudio();
//   }, []);

//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/team`);
//         setTeam(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchTeam();
//   }, []);

//   const handleTabClick = (tab: string) => {
//     setActiveTab(tab);
//     const section = document.getElementById(tab);
//     if (section) section.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="relative bg-white text-black overflow-x-hidden">
//       <div className="absolute top-0 left-0 w-full z-20">
//         <Header />
//       </div>

//       <div
//         className="
//     container mx-auto
//     px-4
//     pt-[100px] pb-4
//     flex flex-nowrap sm:flex-wrap
//     gap-2 sm:gap-4
//     justify-start
//     max-w-full
//     overflow-x-auto
//   "
//       >
//         {tabs.map((tab) => {
//           const isActive = activeTab === tab;
//           return (
//             <button
//               key={tab}
//               onClick={() => handleTabClick(tab)}
//               className={`
//           px-2 sm:px-3
//           py-1
//           font-serifBrand
//           font-medium
//           text-md sm:text-base
//           whitespace-nowrap
//           cursor-pointer
//           transition-colors duration-300
//           ${isActive ? "text-[#0000B5]" : "text-gray-500 hover:text-[#0000B5]"}
//         `}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           );
//         })}
//       </div>

//       <section id="studio" className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white 2xl:px-5">
//         <div className="w-full md:w-1/2 h-[40vh] md:h-screen">{studio?.image ? <img src={`${backendUrl}${studio.image}`} alt={studio.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image Available</div>}</div>

//         <div className="w-full md:w-1/2 p-8 md:p-16 text-center md:text-left">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serifBrand text-[#0000B5]">{studio?.title || "Our Studio"}</h2>
//           <p className="text-base md:text-lg mb-6 leading-relaxed font-sansBrand font-normal text-[#0000B5]">{studio?.description || "Welcome to our creative studio where design and innovation meet timeless architecture."}</p>
//           <div className="font-sansBrand  font-normal space-y-2 text-gray-700 text-sm md:text-base">
//             <p className="text-[#0000B5]">📍 {studio?.location || "Location not provided"}</p>
//             <p className="text-[#0000B5]">📞 {studio?.contact || "Contact unavailable"}</p>
//             <p className="text-[#0000B5]">✉️ {studio?.email || "Email not available"}</p>
//           </div>
//         </div>
//       </section>

//       <section id="people" className="bg-white py-16 sm:py-20 2xl:max-w-[1400px] 2xl:mx-auto">
//         {/* ---------- HEADING ---------- */}
//         <div className="text-center mb-14 sm:mb-20 px-4 sm:px-6">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-serifBrand font-medium text-[#0000B5] mb-3 sm:mb-4">Our Team</h2>
//           <p className="text-[#0000B5] font-sansBrand font-normal max-w-2xl mx-auto text-sm sm:text-base md:text-lg">Meet our creative professionals driving innovation every day.</p>
//         </div>

//         {/* ---------- TEAM LIST ---------- */}
//         <div className="max-w-6xl mx-auto flex flex-col space-y-14 px-4 sm:px-6 md:px-12">
//           {team.map((member) => (
//             <div
//               key={member._id}
//               className="
//           grid grid-cols-1
//           md:grid-cols-[260px_auto]
//           gap-10
//           items-center
//           justify-center
//         "
//             >
//               {/* IMAGE */}
//               <div className="flex justify-center">
//                 <img
//                   src={member.image ? `${backendUrl}${member.image}` : "https://via.placeholder.com/400x500"}
//                   alt={member.name}
//                   className="
//               w-[220px] sm:w-[240px]
//               h-[280px] sm:h-[320px]
//               object-cover
//             "
//                 />
//               </div>

//               {/* CONTENT */}
//               <div className="text-center md:text-left md:max-w-md">
//                 <h3 className="text-[#0000B5] font-serifBrand  text-xl sm:text-2xl font-medium leading-tight mb-1">{member.name}</h3>

//                 {member.role && <p className="text-[#0000B5] font-sansBrand font-normal text-base sm:text-lg mb-3">{member.role}</p>}

//                 <p className="text-[#0000B5] font-sansBrand font-normal text-sm sm:text-base leading-relaxed">{member.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section id="press" className="bg-white py-3 px-1 text-center 2xl:max-w-[1400px] 2xl:mx-auto">
//         <h2 className="text-3xl md:text-4xl font-medium mb-4 font-sansBrand  text-[#0000B5]">Press & Media</h2>
//         <p className="text-[#0000B5] font-sansBrand font-normal max-w-2xl mx-auto mb-8 text-base md:text-lg">Explore our latest mentions, collaborations, and design recognitions.</p>
//         <a href="/press" className="inline-block font-sansBrand font-normal text-[#0000B5] hover:text-[#0000B7] transition-all duration-300">
//           View Presses →
//         </a>
//       </section>
//     </div>
//   );
// };

// export default About;

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import axios from "axios";

interface Studio {
  _id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  contact?: string;
  email?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
}

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

const About = () => {
  const tabs = ["studio", "people", "press"];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState("studio");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* ---------------- FETCH STUDIO ---------------- */
  useEffect(() => {
    axios.get(`${backendUrl}/api/studio`).then((res) => {
      if (res.data?.length) setStudio(res.data[0]);
    });
  }, []);

  /* ---------------- FETCH TEAM ---------------- */
  useEffect(() => {
    axios.get(`${backendUrl}/api/team`).then((res) => {
      setTeam(res.data);
    });
  }, []);

  /* ---------------- TAB SCROLL SYNC (FIX BUG) ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    tabs.forEach((tab) => {
      const el = document.getElementById(tab);
      sectionRefs.current[tab] = el;
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (tab: string) => {
    const section = sectionRefs.current[tab];
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-white text-black overflow-x-hidden">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* ---------------- TABS ---------------- */}
      <div className="container mx-auto px-4 pt-[100px] pb-4 flex gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`
              px-3 py-1
              font-serifBrand font-medium
              cursor-pointer
              text-base
              transition-colors
              ${activeTab === tab ? "text-[#0000B5] hover:underline underline-offset-6" : "text-[#0000B5] hover:underline underline-offset-6"}
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <section id="studio" className="flex flex-col md:flex-row min-h-screen">
        {/* MEDIA */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-screen">{studio?.image ? isVideo(studio.image) ? <video src={`${backendUrl}${studio.image}`} autoPlay muted loop playsInline className="w-full h-full object-cover outline-none" /> : <img src={`${backendUrl}${studio.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Media</div>}</div>

        {/* CONTENT — NO TOP GAP */}
        <div className="w-full md:w-1/2 px-8 md:px-16 pt-0 pb-8 flex flex-col">
          <p className="text-[#0000B5] font-sansBrand text-base md:text-lg leading-relaxed">{studio?.description}</p>

          <div className="mt-6 space-y-2 font-sansBrand text-[#0000B5]">
            {studio?.location && <p>📍 {studio.location}</p>}
            {studio?.contact && <p>📞 {studio.contact}</p>}
            {studio?.email && <p>✉️ {studio.email}</p>}
          </div>
        </div>
      </section>

      {/* ================= PEOPLE ================= */}
      <section id="people" className="bg-white py-16 sm:py-20 2xl:max-w-[1400px] 2xl:mx-auto">
        {/* ---------- HEADING ---------- */}
        <div className="text-center mb-14 sm:mb-20 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serifBrand font-medium text-[#0000B5] mb-3 sm:mb-4">Our Team</h2>
          <p className="text-[#0000B5] font-sansBrand font-normal max-w-2xl mx-auto text-sm sm:text-base md:text-lg">Meet our creative professionals driving innovation every day.</p>
        </div>

        {/* ---------- TEAM LIST ---------- */}
        <div className="max-w-6xl mx-auto flex flex-col space-y-14 px-4 sm:px-6 md:px-12">
          {team.map((member) => (
            <div
              key={member._id}
              className="
          grid grid-cols-1
          md:grid-cols-[260px_auto]
          gap-10
          items-center
          justify-center
        "
            >
              {/* IMAGE */}
              <div className="flex justify-center">
                <img
                  src={member.image ? `${backendUrl}${member.image}` : "https://via.placeholder.com/400x500"}
                  alt={member.name}
                  className="
              w-[220px] sm:w-[240px]
              h-[280px] sm:h-[340px]
              object-cover
            "
                />
              </div>

              {/* CONTENT */}
              <div className="text-center md:text-left md:max-w-md">
                <h3 className="text-[#0000B5] font-serifBrand  text-xl sm:text-2xl font-medium leading-tight mb-1">{member.name}</h3>

                {member.role && <p className="text-[#0000B5] font-sansBrand font-normal text-base sm:text-lg mb-3">{member.role}</p>}

                <p className="text-[#0000B5] font-sansBrand font-normal text-sm sm:text-base leading-relaxed">{member.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRESS ================= */}
      <section id="press" className="py-20 text-center">
        <h2 className="text-3xl font-sansBrand text-[#0000B5] mb-4">Press & Media</h2>
        <p className="text-[#0000B5] max-w-xl mx-auto mb-6">Explore our latest mentions and recognitions.</p>
        <a href="/press" className="text-[#0000B5] hover:underline">
          View Press →
        </a>
      </section>
    </div>
  );
};

export default About;
