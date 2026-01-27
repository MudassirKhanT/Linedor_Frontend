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
  }, [backendUrl]);
  const formatDateToMonthYear = (dateStr: string) => {
    if (!dateStr) return "";

    const [dayStr, monthStr, yearStr] = dateStr.split("-");

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1; // JS months are 0-based
    const year = parseInt(yearStr, 10);

    const date = new Date(day, month, year);

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#ffffff]">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div className="pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {press.map((p) => (
            <div key={p._id} className="flex flex-col w-full">
              {/* Media */}
              <div className="h-[80vh] sm:h-[90vh] lg:h-[85vh] bg-gray-100">{p.image ? isVideoUrl(p.image) ? <video src={`${backendUrl}${p.image}`} className="w-full h-full object-cover" controls muted /> : <img src={`${backendUrl}${p.image}`} alt={p.title} className="w-full h-full object-cover" /> : null}</div>

              {/* Content */}
              <div className="bg-white py-6 px-6">
                {/* Title + View Press */}
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-serifBrand font-normal text-[#0000D3]">{p.title}</h3>

                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-md font-serifBrand font-normal text-[#0000D3] hover:underline underline-offset-4 whitespace-nowrap">
                      View Press
                    </a>
                  )}
                </div>

                {/* Date */}
                <p className="text-sm font-serifBrand font-normal text-[#0000D3]">{formatDateToMonthYear(p.date)}</p>

                {/* Description */}
                <p className="text-[#0000D3] font-sansBrand font-normal text-sm  leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressPage;
