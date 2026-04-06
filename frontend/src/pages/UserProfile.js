import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { format, setMonth, setYear } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserProfile = ({ user, setProfileComplete, setUserProfile }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.put(`${API}/profile/${user.id}`, {
        name,
        address,
        dob: dob ? format(dob, "MM/dd/yyyy") : "",
        phone,
        email
      });
      setUserProfile({
        name,
        address,
        dob: dob ? format(dob, "MM/dd/yyyy") : "",
        phone,
        email
      });
      setProfileComplete(true);
      navigate("/search");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate years from 1920 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  
  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (year) => {
    const newDate = setYear(calendarMonth, parseInt(year));
    setCalendarMonth(newDate);
  };

  const handleMonthChange = (month) => {
    const newDate = setMonth(calendarMonth, parseInt(month));
    setCalendarMonth(newDate);
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
              USER PROFILE
            </h2>
          </div>

          <div className="border-l-4 border-[#b38600] pl-3 sm:pl-4 mb-4 sm:mb-6 bg-[#faf3d1] py-2 sm:py-3">
            <p className="text-[#1b1b1b] text-sm sm:text-base">
              <span className="font-bold">Instruction:</span> Complete your profile information to proceed with docket search.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your full name"
                required
                data-testid="profile-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your address"
                required
                data-testid="profile-address-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Date of Birth
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal rounded-sm border border-[#1b1b1b] hover:border-[#1a4480] px-3 py-2 bg-white text-base"
                    data-testid="profile-dob-picker"
                  >
                    {dob ? format(dob, "MM/dd/yyyy") : <span className="text-[#71767a]">Select date of birth</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-sm border border-[#dfe1e2]" align="start">
                  {/* Year and Month Selectors */}
                  <div className="p-3 border-b border-[#dfe1e2] bg-[#f5f5f5]">
                    <div className="flex gap-2">
                      <Select 
                        value={calendarMonth.getMonth().toString()} 
                        onValueChange={handleMonthChange}
                      >
                        <SelectTrigger className="flex-1 rounded-sm border-[#1b1b1b] text-sm">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select 
                        value={calendarMonth.getFullYear().toString()} 
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger className="w-[100px] rounded-sm border-[#1b1b1b] text-sm">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={(date) => {
                      setDob(date);
                      setCalendarOpen(false);
                    }}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="rounded-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your phone number"
                required
                data-testid="profile-phone-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#1b1b1b]">
                Email Address
              </Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-sm border border-[#1b1b1b] focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] px-3 py-2 text-base"
                placeholder="Enter your email"
                required
                data-testid="profile-email-input"
              />
            </div>

            {error && (
              <div 
                className="p-3 sm:p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm"
                data-testid="profile-error-message"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-6 text-sm font-bold mt-2 sm:mt-4"
              data-testid="profile-save-button"
            >
              {loading ? "SAVING..." : "SAVE & CONTINUE"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#dfe1e2]">
            <Link to="/">
              <Button
                type="button"
                variant="ghost"
                className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0"
              >
                ← Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default UserProfile;
