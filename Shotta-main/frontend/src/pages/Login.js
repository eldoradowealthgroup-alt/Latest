import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = ({ setUser, setIsAdmin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      
      if (response.data.is_admin) {
        setIsAdmin(true);
        navigate("/admin");
      } else {
        setUser(response.data);
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#1a4480]" />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1b1b1b] mb-6 sm:mb-8">
          Electronic Docket Registry
        </h1>

        <div className="bg-white border border-[#dfe1e2] rounded-sm p-4 sm:p-6 shadow-sm">
          <div className="border-b border-[#dfe1e2] pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-[#1b1b1b]">
              SIGN IN TO YOUR ACCOUNT
            </h2>
          </div>

          <div className="border-l-4 border-[#1a4480] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#e8f0f8] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Notice:</span> Enter your credentials to access your docket records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]"
              >
                Email / Username
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your email or username"
                required
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your password"
                required
                data-testid="login-password-input"
              />
            </div>

            {error && (
              <div 
                className="p-3 sm:p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm"
                data-testid="login-error-message"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold"
              data-testid="login-submit-button"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <p className="text-sm text-[#1b1b1b] mb-3">
              Don't have an account?
            </p>
            <Link to="/create-account">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-sm border-[#1a4480] text-[#1a4480] hover:bg-[#1a4480] hover:text-white py-3 px-6 text-sm font-bold"
                data-testid="create-account-link"
              >
                CREATE NEW ACCOUNT
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default Login;
