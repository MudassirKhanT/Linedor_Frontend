import { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

interface Props {
  projectTitle: string;
}

const ObjectsContact: React.FC<Props> = ({ projectTitle }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setLoading(true);
      setErrorMsg("");
      const response = await axios.post(`${backendUrl}/api/contact`, {
        ...data,
        project: projectTitle,
      });

      if (response.status === 200) {
        setSuccess(true);
        e.currentTarget.reset();
        setTimeout(() => {
          setModalOpen(false);
          setSuccess(false);
        }, 2500);
      } else {
        setErrorMsg("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)} className="flex items-center cursor-pointer gap-2 text-[#0000B5] hover:underline transition text-base font-semibold underline-offset-4 ">
        <Mail className="w-4 h-4" />
        contact
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl relative animate-fadeIn">
            <button className="absolute cursor-pointer top-3 right-4 text-gray-600 hover:text-black text-3xl leading-none transition" onClick={() => setModalOpen(false)}>
              &times;
            </button>

            {!success ? (
              <>
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-2xl font-semibold text-[#0000B5] text-center">Connect</h2>
                  <p className="text-center text-[#0000B5] text-sm mt-2">
                    Interested in <span className="font-semibold">{projectTitle}</span>? Fill out the form below — we’ll reach out soon.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                  <input type="text" name="name" placeholder="Your Name" required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
                  <input type="email" name="email" placeholder="Your Email" required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
                  <input type="text" name="subject" placeholder="Subject" required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
                  <textarea name="message" placeholder="Message" rows={4} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none"></textarea>

                  <button type="submit" disabled={loading} className="w-full cursor-pointer bg-[#0000B5] text-white py-2 text-sm hover:bg-gray-900 transition">
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                  {errorMsg && <p className="text-red-500 text-center text-sm mt-2">{errorMsg}</p>}
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600 text-sm text-center">Your message has been sent successfully. We’ll get back to you soon!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ObjectsContact;
