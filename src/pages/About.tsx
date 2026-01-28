import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import axios from "axios";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

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
  const tabs = useMemo(() => ["studio", "people", "press"], []);
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
  }, [backendUrl]);

  /* ---------------- FETCH TEAM ---------------- */
  useEffect(() => {
    axios.get(`${backendUrl}/api/team`).then((res) => {
      setTeam(res.data);
    });
  }, [backendUrl]);

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
  }, [tabs]);

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
      <div
        className="container mx-auto
    px-3
    md:px-7
    pt-[100px] pb-4
    flex flex-nowrap sm:flex-wrap
    gap-2 sm:gap-4
    justify-start
    max-w-full
    overflow-x-auto"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`
  mt-2
  px-2 sm:px-3 py-1
  font-serifBrand font-normal
  cursor-pointer
  text-lg
  transition-colors
  decoration-[0.5px]
  ${activeTab === tab ? "text-[#0000D3] underline underline-offset-6" : "text-[#0000D3] hover:underline underline-offset-6"}
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
        <div className="w-full md:w-1/2 px-8 md:px-16 py-5 md:pt-13  flex flex-col bg-[#0000D3] space-y-4 ">
          {studio?.description?.split(/\n\s*\n/).map((p, i) => (
            <p className="text-white font-sansBrand text-base md:text-lg leading-relaxed text-justify" key={i}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ================= PEOPLE ================= */}
      <section id="people" className="bg-white py-8 sm:py-15 2xl:max-w-[1400px] 2xl:mx-auto">
        {/* ---------- HEADING ---------- */}
        <div className="text-center mb-5 sm:mb-15 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serifBrand font-normal text-[#0000D3] ">Team</h2>
        </div>

        {/* ---------- TEAM LIST ---------- */}
        <div className="w-full  flex flex-col space-y-14  ">
          {team.map((member) => (
            <div
              className="
    grid grid-cols-1
    md:grid-cols-[280px_auto]
    gap-10
    items-start
    justify-center
        md:translate-x-12 lg:translate-x-25

  "
            >
              {/* IMAGE */}
              <div className="flex justify-center ">
                <img
                  src={member.image ? `${backendUrl}${member.image}` : "https://via.placeholder.com/400x500"}
                  alt={member.name}
                  className="
              mt-2
              aspect-[3/4]
              object-cover
            "
                />
              </div>

              {/* CONTENT */}
              <div className=" md:max-w-md">
                <p className="text-[#0000D3] text-center md:text-left font-serifBrand  text-xl sm:text-2xl font-normal leading-tight">{member.name}</p>

                {member.role && <p className="text-[#0000D3] text-center md:text-left font-serifBrand font-normal text-base sm:text-lg lg:text-xl mb-5">{member.role}</p>}

                <p className="text-[#0000D3] text-justify font-sansBrand font-normal text-sm sm:text-base leading-relaxed px-4 sm:px-0">{member.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRESS ================= */}
      <section id="press" className=" text-center">
        <h2 className="text-3xl font-serifBrand font-normal text-[#0000D3] mb-4">Press</h2>
        <p className="text-[#0000D3] font-sansBrand font-normal text-sm sm:text-base  max-w-xl mx-auto mb-6">Explore our latest mentions and recognitions.</p>
        <a href="/press" className="text-[#0000D3] font-serifBrand font-normal hover:underline">
          <span className="inline-flex items-center gap-1 leading-none">
            View All Press
            <ArrowRight size={20} className="translate-y-[2px]" />
          </span>
        </a>
      </section>
    </div>
  );
};

export default About;
