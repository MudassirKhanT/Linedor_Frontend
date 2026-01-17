import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#0000B5] font-semibold py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* -------- BRAND -------- */}
        <div className="md:mx-auto">
          <h2 className="font-semibold mb-3 uppercase">LİNEDORİ</h2>
          <p>101 Dr. D. N. Road,</p>
          <p>1st Floor, Ravi Building,</p>
          <p>Fort, Mumbai 400026</p>

          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="block mt-3 hover:underline">
            Google Maps
          </a>

          <p className="mt-3">COA Number</p>
        </div>

        {/* -------- CONTACT -------- */}
        <div className="md:mx-auto">
          <h2 className="font-semibold mb-3 uppercase">Contact</h2>

          <a href="mailto:hello@finedori.xyz" className="block hover:underline">
            email – hello@finedori.xyz
          </a>

          <div className="mt-4 space-y-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
              instagram – link
            </a>
          </div>
        </div>

        {/* -------- QUICK LINKS -------- */}
        <div className="md:mx-auto">
          <h2 className="font-semibold mb-3 uppercase">Quick Links</h2>

          <div className="space-y-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* -------- BOTTOM BAR -------- */}
      <div className="mt-12 pt-6 text-center text-sm space-y-2 ">
        <a href="/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Terms & Conditions
        </a>

        <div>© 2025 Linedori. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
