import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#0000D3] md:text-xl  mt-10 sm:py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap justify-start gap-12 text-center md:text-left">
        {/* <div className="max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap justify-start gap-12 text-left sm:text-center md:text-left"> */}
        {/* -------- BRAND -------- */}
        <div className="md:mx-auto flex flex-col">
          <div className="font-sansBrand font-normal mb-3">LİNEDORİ</div>
          <p className="font-serifBrand font-medium">191 Dr. D. N. Road,</p>
          <p className="font-serifBrand font-medium">1st Floor, Ravi Building,</p>
          <p className="mb-3 font-serifBrand font-medium">Fort, Mumbai 400026</p>

          <p className="mb-3 font-serifBrand font-medium">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Google Maps
            </a>
          </p>

          <p className="font-serifBrand font-medium">COA Registration Number</p>
          <p className="font-serifBrand font-medium">CA/2025/188024</p>
        </div>

        {/* -------- CONTACT -------- */}
        <div className="md:mx-auto flex flex-col">
          <div className="font-sansBrand font-normal mb-3">CONTACT</div>

          <a href="mailto:hello@finedori.xyz" className="block hover:underline font-serifBrand font-medium">
            hello@finedori.xyz
          </a>
        </div>

        {/* -------- QUICK LINKS -------- */}
        <div className="md:mx-auto flex flex-col">
          <div className="font-sansBrand font-normal mb-3">QUICK LINKS</div>

          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block hover:underline font-serifBrand font-medium">
            LinkedIn
          </a>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:underline font-serifBrand font-medium">
            Instagram
          </a>

          <a href="/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer" className="hover:underline font-serifBrand font-medium">
            Resources
          </a>
        </div>
      </div>

      {/* -------- BOTTOM BAR -------- */}
      <div className="mt-12 pt-6 text-center text-sm space-y-2 font-sansBrand font-normal">
        <div>© 2026 Linedori. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
