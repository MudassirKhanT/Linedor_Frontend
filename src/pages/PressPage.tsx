import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";

interface Press {
  _id: string;
  title: string;
  date: string;
  description: string;
  link?: string;
  image?: string;
}

const PressPage = () => {
  const [press, setPress] = useState<Press[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPress = async () => {
      const res = await axios.get(`${backendUrl}/api/press`);
      setPress(res.data);
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
              <div className="h-[80vh] sm:h-[90vh] lg:h-screen">{p.image ? <img src={`${backendUrl}${p.image}`} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}</div>

              <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#ffffff]">
                <h3 className="text-xl font-semibold text-[#0000B5] mb-1">{p.title}</h3>
                <p className="text-sm text-[#0000B5] mb-2">{p.date}</p>
                <p className="text-[#0000B5] text-sm sm:text-base mb-3 leading-relaxed max-w-[90%]">{p.description}</p>
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
