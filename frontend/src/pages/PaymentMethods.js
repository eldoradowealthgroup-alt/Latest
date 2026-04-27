import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="border-b border-[#dfe1e2] px-3 sm:px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <span className="text-[#1a4480]">🌐 Select language ▾</span>
          <span className="text-[#1a4480]">📍 Find a Federal Court</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1a4480] text-center mb-8 italic">
          Accepted Payment Methods
        </h1>

        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a4480] italic mb-4">
            Debit/Credit Cards
          </h2>
          <ul className="text-[#1b1b1b] space-y-1 mb-4">
            <li>• Visa, MasterCard, Amex</li>
            <li>• Secure & Encrypted</li>
            <li>• No Additional Fees</li>
          </ul>
          <button
            onClick={() => navigate('/payment-form')}
            className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-8 text-base font-bold"
            data-testid="pay-here-btn"
          >
            Pay Here
          </button>
        </div>

        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center">
          <div className="flex items-start justify-center gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1a4480] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current">
                <path d="M12 2L2 8v2h20V8L12 2zm0 2.5L18 8H6l6-3.5zM4 12v8h3v-6h2v6h2v-6h2v6h2v-6h2v6h3v-8H4z" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a4480] italic">
                Federal Bonding Kiosk
              </h2>
              <ul className="text-[#1b1b1b] space-y-1 mt-2">
                <li>• Available Nationwide</li>
                <li>• Syncs with Database</li>
                <li>• No Personal Info Required</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => navigate('/federal-kiosk')}
            className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-8 text-base font-bold"
            data-testid="kiosk-learn-more-btn"
          >
            Learn More
          </button>
        </div>

        <div className="bg-[#f5f5f5] rounded-sm p-6 sm:p-8 mb-6 text-center opacity-70">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1b1b1b] italic mb-4">
            Federal Direct Transfer
          </h2>
          <ul className="text-[#1b1b1b] space-y-1 mb-4">
            <li>• Secure Government Processing</li>
            <li>• Immediate Account Funding</li>
            <li>• Federally Authorized Transfer</li>
          </ul>
          <button
            disabled
            className="rounded-sm bg-gray-400 text-white py-3 px-8 text-base font-bold cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={scrollToTop}
            className="rounded-full border border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-2 px-6 text-sm font-semibold transition-colors"
          >
            Return to top ↑
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate('/courses-of-action')}
            className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold"
          >
            ← Back to Courses of Action
          </button>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
