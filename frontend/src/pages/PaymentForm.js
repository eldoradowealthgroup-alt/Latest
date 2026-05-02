import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GovHeader, GovFooter } from '../components/Layout';
import { getProfile } from '../utils/auth';

export default function PaymentFormPage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [formData, setFormData] = useState({
    nameOnCard: profile?.name || '',
    cardNumber: '',
    cvv: '',
    expDate: '',
    address: profile?.address?.split(',')[0] || '',
    city: '',
    state: '',
    zip: '',
  });
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCurrentDate = () =>
    new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authorized) {
      alert('Please confirm you are the owner of this payment method.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <button
          onClick={() => navigate('/payment-methods')}
          className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold mb-4"
        >
          ← Home
        </button>

        <h1
          className="text-3xl sm:text-4xl font-bold text-[#1a4480] mb-2"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Online Payment
        </h1>

        <div className="mb-4">
          <p className="text-[#d97706] font-bold italic text-sm">ACCOUNT SUMMARY</p>
          <p className="text-[#1b1b1b] text-sm">Last Update: {getCurrentDate()}</p>
          <p className="text-[#1b1b1b] text-sm" data-testid="payment-offender-name">
            Offender: {profile?.name || 'Loading...'}
          </p>
        </div>

        {success && (
          <div
            className="bg-[#e7f4e9] border border-[#2e8540] text-[#2e8540] p-4 mb-6 text-sm font-semibold"
            data-testid="payment-success-message"
          >
            Payment submitted successfully.
          </div>
        )}

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1b1b1b] mb-4">Payment</h2>

          <div className="mb-4">
            <p className="text-sm text-[#71767a] mb-2">Accepted Cards</p>
            <div className="flex gap-2">
              <div className="bg-[#1a4480] text-white text-xs font-bold px-2 py-1 rounded">
                VISA
              </div>
              <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                MasterCard
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PField label="Name on Card" value={formData.nameOnCard} onChange={(v) => handleInputChange('nameOnCard', v)} placeholder="John H. Doe" testId="payment-name-input" />
            <PField label="Card Number" value={formData.cardNumber} onChange={(v) => handleInputChange('cardNumber', v)} placeholder="1234 5678 9012 3456" maxLength={19} testId="payment-card-input" />
            <PField label="CVV" value={formData.cvv} onChange={(v) => handleInputChange('cvv', v)} placeholder="123" maxLength={4} className="w-24" testId="payment-cvv-input" />
            <PField label="Expiration Date" value={formData.expDate} onChange={(v) => handleInputChange('expDate', v)} placeholder="MM/YY" maxLength={5} className="w-32" testId="payment-exp-input" />

            <div className="pt-4 border-t border-[#dfe1e2]">
              <p className="text-sm text-[#71767a] mb-3">Billing Address</p>
              <div className="space-y-4">
                <PField label="Address" value={formData.address} onChange={(v) => handleInputChange('address', v)} placeholder="542 W. 15th Street" testId="payment-billing-address-input" />
                <PField label="City" value={formData.city} onChange={(v) => handleInputChange('city', v)} placeholder="New York" testId="payment-city-input" />
                <div className="grid grid-cols-2 gap-4">
                  <PField label="State" value={formData.state} onChange={(v) => handleInputChange('state', v)} placeholder="NY" maxLength={2} testId="payment-state-input" />
                  <PField label="Zip" value={formData.zip} onChange={(v) => handleInputChange('zip', v)} placeholder="10001" maxLength={10} testId="payment-zip-input" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4">
              <input
                id="authorize"
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className="mt-1 h-4 w-4"
                data-testid="payment-authorize-checkbox"
              />
              <label htmlFor="authorize" className="text-sm text-[#1b1b1b] leading-relaxed cursor-pointer">
                I am the owner of this payment method and authorize it's use in payments and/or posts.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-[#2e8540] hover:bg-[#236b34] text-white py-3 px-8 text-base font-bold disabled:opacity-50"
              data-testid="payment-submit-button"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </div>

        <div className="bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1b1b1b] mb-4">Financial Hardship</h2>
          <p className="text-sm text-[#1b1b1b] mb-4 leading-relaxed">
            If you cannot afford the bond or associated fees, you may qualify for a{' '}
            <strong>financial hardship</strong> arrangement. This can offer temporary relief, such
            as reduced payments, extended deadlines, or waived court costs, depending on your
            situation. You will usually need to provide clear evidence of your financial status to
            demonstrate that you cannot meet the required amount.
          </p>

          <h3 className="text-base font-bold text-[#1b1b1b] mb-2">Steps to File for Financial Hardship:</h3>
          <ul className="text-sm text-[#1b1b1b] space-y-2 mb-4 list-disc list-inside">
            <li>Obtain a financial hardship or indigency form from the court or designated office.</li>
            <li>Complete the form thoroughly, listing all income, debts, and living expenses.</li>
            <li>Include supporting documents (pay stubs, bank statements, tax returns) to verify your financial need.</li>
            <li>Submit the completed form and documents by the given deadline and follow up to confirm receipt.</li>
            <li>Await the court or agency's decision, which may involve a hearing or review process.</li>
          </ul>

          <p className="text-sm text-[#1b1b1b] mb-4 leading-relaxed">
            If you have additional questions about surety bonds, financial hardship programs, or
            specific forms required in your area, reach out to the clerk's office or a legal aid
            organization. Staying informed and proactive can help prevent defaults, violations, or
            other penalties related to your case.
          </p>

          <h3 className="text-base font-bold text-[#1b1b1b] mb-2">Important Points to Remember:</h3>
          <ul className="text-sm text-[#1b1b1b] space-y-2 list-disc list-inside">
            <li>Always keep track of all due dates, deadlines, or payment schedules related to the bond.</li>
            <li>Promptly report changes in employment, address, or other relevant details.</li>
            <li>Non-compliance can lead to bond revocation, legal consequences, or additional financial penalties.</li>
          </ul>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={scrollToTop}
            className="rounded-full border border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-2 px-6 text-sm font-semibold transition-colors"
          >
            Return to top ↑
          </button>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}

function PField({ label, value, onChange, placeholder, maxLength, className, testId }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#1b1b1b]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`rounded-sm border border-[#1b1b1b] px-3 py-2 outline-none focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] ${className || 'w-full'}`}
        required
        data-testid={testId}
      />
    </div>
  );
}
