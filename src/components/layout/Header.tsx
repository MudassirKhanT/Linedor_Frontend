import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUp } from "lucide-react";
import logoBlue from "../../assets/linedori logo blue.png";
import logoWhite from "../../assets/linedori logo white.png";

interface HeaderProps {
  visible?: boolean;
}

interface NavItem {
  label: string;
  path: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  /* ---------------- ROUTE FLAGS ---------------- */
  const isOverlayRoute = location.pathname === "/" || location.pathname.startsWith("/project");

  /* ---------------- NAV ITEMS ---------------- */
  const navItems: NavItem[] = [
    { label: "Architecture", path: "/architecture/all" },
    { label: "Interior", path: "/interior/all" },
    { label: "Objects", path: "/objects/all" },
    { label: "Exhibition", path: "/exhibition/all" },
    { label: "About", path: "/about" },
  ];

  /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  /* ---------------- SCROLL TO TOP BUTTON ---------------- */
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- CLOSE MOBILE MENU ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ---------------- STYLES ---------------- */
  const textColor = isOverlayRoute ? "text-white" : "text-[#0000D3]";
  const underlineColor = isOverlayRoute ? "after:bg-white" : "after:bg-[#0000D3]";
  const logoSrc = isOverlayRoute ? logoWhite : logoBlue;

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className={`${isOverlayRoute ? "absolute" : "relative"} top-0 left-0 w-full z-40 transition-all duration-300`}>
        {/* -------- DESKTOP -------- */}
        <div className="hidden md:flex justify-between items-center h-16 px-8 bg-transparent mx-2">
          <Link to="/" onClick={handleLinkClick}>
            <img src={logoSrc} alt="Linedori Logo" className="h-7 md:h-8 w-auto object-contain mt-3" draggable={false} />
          </Link>

          <nav className="flex space-x-10 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`relative ${textColor} text-lg font-serifBrand font-normal
                  after:content-[''] after:absolute after:left-0 after:-bottom-1
                  after:h-[0.5px] after:w-full ${underlineColor}
                  after:hidden hover:after:block`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* -------- MOBILE -------- */}
        <div className="md:hidden relative h-16 bg-transparent">
          {!isHomePage && (
            <div className="absolute top-5 left-5">
              <Link to="/" onClick={handleLinkClick}>
                <img src={logoSrc} alt="Linedori Logo" className="h-5 w-auto object-contain" draggable={false} />
              </Link>
            </div>
          )}

          {/* Menu Button (Right) */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <button className={`${textColor} cursor-pointer`} onClick={() => setMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* -------- MOBILE MENU -------- */}
        {menuOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-white z-[999] flex flex-col justify-between animate-slideDown">
            <button className="absolute top-6 right-6 text-black hover:opacity-70" onClick={() => setMenuOpen(false)}>
              <X size={36} />
            </button>

            <button className="absolute top-8 left-8" onClick={() => navigate("/")}>
              <img src={logoBlue} alt="Linedori Logo" className="h-5 w-auto object-contain" draggable={false} />
            </button>

            <nav className="flex flex-col space-y-6 text-lg text-[#0000D3] font-serifBrand font-normal px-8 mt-20">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={handleLinkClick} className="hover:opacity-70">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <style>{`
          @keyframes slideDown {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slideDown {
            animation: slideDown 0.5s ease forwards;
          }
        `}</style>
      </header>

      {/* -------- SCROLL TO TOP -------- */}
      {showTopBtn && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-[9999] p-2.5 rounded-full bg-[#0000D3] text-white hover:bg-[#0000D3]/80 transition-all cursor-pointer">
          <ArrowUp size={18} strokeWidth={2.2} />
        </button>
      )}
    </>
  );
};

export default Header;
