import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";

interface Press {
  _id: string;
  title: string;
  date: string;
  description: string;
  link?: string;
  image?: string; // can be image/video/gif
}

/* ---------- HELPERS ---------- */
const isVideoUrl = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
const isGifUrl = (url: string) => /\.gif$/i.test(url);

const PressPage = () => {
  const [press, setPress] = useState<Press[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPress = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/press`);
        setPress(res.data);
      } catch {
        console.error("Failed to fetch press");
      }
    };
    fetchPress();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#ffffff]">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div className="pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {press.map((p) => (
            <div key={p._id} className="flex flex-col w-full">
              <div className="h-[80vh] sm:h-[90vh] lg:h-screen bg-gray-100">{p.image ? isVideoUrl(p.image) ? <video src={`${backendUrl}${p.image}`} className="w-full h-full object-cover" controls muted /> : isGifUrl(p.image) ? <img src={`${backendUrl}${p.image}`} alt={p.title} className="w-full h-full object-cover" /> : <img src={`${backendUrl}${p.image}`} alt={p.title} className="w-full h-full object-cover" /> : null}</div>

              <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#ffffff]">
                <h3 className="text-xl font-serifBrand font-medium text-[#0000B5] mb-1">{p.title}</h3>
                <p className="text-sm font-sansBrand font-normal text-[#0000B5] mb-2">{p.date}</p>
                <p className="text-[#0000B5] font-sansBrand font-normal text-sm sm:text-base mb-3 leading-relaxed max-w-[90%]">{p.description}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[#0000B5] hover:underline">
                    View Press
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressPage;
