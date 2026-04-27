import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { GovHeader, GovFooter } from '../components/Layout';

export default function SelfSurrenderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#d83933]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="bg-[#fdf0f0] border-2 border-[#d83933] rounded-sm p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d83933] flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#d83933] mb-4">
            SELF-SURRENDER INITIATED
          </h1>

          <div className="bg-white border border-[#d83933] rounded-sm p-4 sm:p-6 mb-6 text-left">
            <p className="text-[#1b1b1b] text-base sm:text-lg leading-relaxed mb-4">
              You have elected to self-surrender. You are hereby directed to:
            </p>

            <div className="bg-[#faf3d1] border-l-4 border-[#b38600] p-4 mb-4">
              <p className="text-[#1b1b1b] text-lg sm:text-xl font-bold">
                Make your way to the nearest law enforcement office IMMEDIATELY.
              </p>
            </div>

            <div className="bg-[#fdf0f0] border-l-4 border-[#d83933] p-4">
              <p className="text-[#d83933] text-base sm:text-lg font-bold">
                WARNING: Failure to do so will result in an IMMEDIATE BENCH WARRANT being issued for your arrest.
              </p>
            </div>
          </div>

          <div className="text-left space-y-3 text-sm sm:text-base text-[#1b1b1b] mb-6">
            <p><strong>What to bring:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Valid government-issued identification</li>
              <li>This case reference number</li>
              <li>Any relevant court documentation</li>
            </ul>
          </div>

          <p className="text-xs sm:text-sm text-[#71767a] mb-6">
            Your cooperation is noted in your case file. Present this confirmation to the processing officer upon arrival.
          </p>

          <button
            onClick={() => navigate('/courses-of-action')}
            className="rounded-sm border border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-2 px-4 text-sm font-bold"
          >
            ← Back to Courses of Action
          </button>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
