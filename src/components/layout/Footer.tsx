import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#0000D3] font-serifBrand font-medium  mt-10 sm:py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap justify-start gap-12 text-center md:text-left">
        {/* <div className="max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap justify-start gap-12 text-left sm:text-center md:text-left"> */}
        {/* -------- BRAND -------- */}
        <div className="md:mx-auto flex flex-col gap-3">
          <h2 className="font-serifBrand font-medium mb-3 uppercase">LİNEDORİ</h2>
          <p>101 Dr. D. N. Road,</p>
          <p>1st Floor, Ravi Building,</p>
          <p>Fort, Mumbai 400026</p>

          <p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Google Maps
            </a>
          </p>

          <p>COA Number</p>
        </div>

        {/* -------- CONTACT -------- */}
        <div className="md:mx-auto flex flex-col gap-3">
          <h2 className="font-serifBrand font-medium mb-3 uppercase">Contact</h2>

          <a href="mailto:hello@finedori.xyz" className="block hover:underline">
            hello@finedori.xyz
          </a>

          <div className="space-y-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Instagram
            </a>
          </div>
        </div>

        {/* -------- QUICK LINKS -------- */}
        <div className="md:mx-auto flex flex-col gap-3">
          <h2 className="font-serifBrand font-medium mb-3 uppercase">Quick Links</h2>

          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
            LinkedIn
          </a>
          <a href="/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Terms & Conditions
          </a>
        </div>
      </div>

      {/* -------- BOTTOM BAR -------- */}
      <div className="mt-12 pt-6 text-center text-sm space-y-2 ">
        <div>© 2026 Linedori. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
