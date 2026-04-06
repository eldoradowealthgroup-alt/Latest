import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const PaymentForm = ({ userProfile }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOnCard: userProfile?.name || "",
    cardNumber: "",
    cvv: "",
    expDate: "",
    address: userProfile?.address?.split(',')[0] || "",
    city: "",
    state: "",
    zip: ""
  });
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authorized) {
      alert("Please confirm you are the owner of this payment method.");
      return;
    }
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      alert("Payment submitted successfully.");
      navigate("/payment-methods");
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/payment-methods")}
          variant="ghost"
          className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0 mb-4"
        >
          ← Home
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a4480] mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
          Online Payment
        </h1>

        {/* Account Summary */}
        <div className="mb-4">
          <p className="text-[#d97706] font-bold italic text-sm">ACCOUNT SUMMARY</p>
          <p className="text-[#1b1b1b] text-sm">Last Update: {getCurrentDate()}</p>
          <p className="text-[#1b1b1b] text-sm">Offender: {userProfile?.name || "Loading..."}</p>
        </div>

        {/* Session Warning */}
        <div className="bg-[#f5f5f5] border border-[#dfe1e2] p-4 mb-6 text-sm text-[#1b1b1b]">
          Session expired or user not found. Please return to the registration page.
        </div>

        {/* Payment Form */}
        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1b1b1b] mb-4">Payment</h2>
          
          {/* Accepted Cards */}
          <div className="mb-4">
            <p className="text-sm text-[#71767a] mb-2">Accepted Cards</p>
            <div className="flex gap-2">
              <div className="bg-[#1a4480] text-white text-xs font-bold px-2 py-1 rounded">VISA</div>
              <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">MasterCard</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-[#1b1b1b]">Name on Card</Label>
              <Input
                type="text"
                value={formData.nameOnCard}
                onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                placeholder="John H. Doe"
                className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-[#1b1b1b]">Card Number</Label>
              <Input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                maxLength={19}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-[#1b1b1b]">CVV</Label>
              <Input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                className="rounded-sm border border-[#1b1b1b] px-3 py-2 w-24"
                maxLength={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-[#1b1b1b]">Expiration Date</Label>
              <Input
                type="text"
                value={formData.expDate}
                onChange={(e) => handleInputChange('expDate', e.target.value)}
                placeholder="MM/YY"
                className="rounded-sm border border-[#1b1b1b] px-3 py-2 w-32"
                maxLength={5}
                required
              />
            </div>

            {/* Billing Address */}
            <div className="pt-4 border-t border-[#dfe1e2]">
              <p className="text-sm text-[#71767a] mb-3">Billing Address</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#1b1b1b]">Address</Label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="542 W. 15th Street"
                    className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#1b1b1b]">City</Label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-[#1b1b1b]">State</Label>
                    <Input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="NY"
                      className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-[#1b1b1b]">Zip</Label>
                    <Input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      placeholder="10001"
                      className="rounded-sm border border-[#1b1b1b] px-3 py-2"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Authorization Checkbox */}
            <div className="flex items-start gap-3 pt-4">
              <Checkbox
                id="authorize"
                checked={authorized}
                onCheckedChange={setAuthorized}
                className="mt-1"
              />
              <Label htmlFor="authorize" className="text-sm text-[#1b1b1b] leading-relaxed cursor-pointer">
                I am the owner of this payment method and authorize it's use in payments and/or posts.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-[#2e8540] hover:bg-[#236b34] text-white py-3 px-8 text-base font-bold"
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </form>
        </div>

        {/* Financial Hardship Section */}
        <div className="bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1b1b1b] mb-4">Financial Hardship</h2>
          
          <p className="text-sm text-[#1b1b1b] mb-4 leading-relaxed">
            If you cannot afford the bond or associated fees, you may qualify for a <strong>financial hardship</strong> arrangement. This can offer temporary relief, such as reduced payments, extended deadlines, or waived court costs, depending on your situation. You will usually need to provide clear evidence of your financial status to demonstrate that you cannot meet the required amount.
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
            If you have additional questions about surety bonds, financial hardship programs, or specific forms required in your area, reach out to the clerk's office or a legal aid organization. Staying informed and proactive can help prevent defaults, violations, or other penalties related to your case.
          </p>

          <h3 className="text-base font-bold text-[#1b1b1b] mb-2">Important Points to Remember:</h3>
          <ul className="text-sm text-[#1b1b1b] space-y-2 list-disc list-inside">
            <li>Always keep track of all due dates, deadlines, or payment schedules related to the bond.</li>
            <li>Promptly report changes in employment, address, or other relevant details.</li>
            <li>Non-compliance can lead to bond revocation, legal consequences, or additional financial penalties.</li>
          </ul>
        </div>

        {/* Return to top button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={scrollToTop}
            variant="outline"
            className="rounded-full border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-2 px-6 text-sm font-semibold"
          >
            Return to top ↑
          </Button>
        </div>

        {/* Footer Links */}
        <div className="border-t border-[#dfe1e2] pt-6 space-y-3">
          <a href="#" className="block text-[#1a4480] hover:underline text-sm">Glossary of Legal Terms</a>
          <a href="#" className="block text-[#1a4480] hover:underline text-sm">Careers</a>
          <a href="#" className="block text-[#1a4480] hover:underline text-sm">FAQs</a>
          <a href="#" className="block text-[#1a4480] hover:underline text-sm">Contact Us</a>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default PaymentForm;
