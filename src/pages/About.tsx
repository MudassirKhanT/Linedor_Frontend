import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import axios from "axios";
import { useMemo } from "react";

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
              ${activeTab === tab ? "text-[#0000B5] underline underline-offset-6" : "text-[#0000B5] hover:underline underline-offset-6"}
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
