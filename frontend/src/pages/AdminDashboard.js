import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ setIsAdmin }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API}/admin/submissions`);
      setSubmissions(response.data);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#d83933]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">
              Admin Dashboard
            </h1>
            <p className="text-[#71767a] text-sm mt-1">
              All user submissions and data
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-sm border-[#d83933] text-[#d83933] hover:bg-[#d83933] hover:text-white py-2 px-4 text-sm font-bold"
          >
            LOGOUT
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#71767a]">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm">
            <p className="text-[#71767a]">No submissions yet</p>
          </div>
        ) : (
          <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#dfe1e2] bg-[#1a4480]">
              <h2 className="text-lg font-bold text-white">
                USER SUBMISSIONS ({submissions.length})
              </h2>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f0f0f0] border-b border-[#dfe1e2]">
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Email</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">DOB</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Phone</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Address</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Citation #</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Zip Code</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Action</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub, index) => (
                    <TableRow key={sub.id || index} className="border-b border-[#dfe1e2] hover:bg-[#f9f9f9]">
                      <TableCell className="text-sm py-3">{sub.email || '-'}</TableCell>
                      <TableCell className="text-sm py-3 font-semibold">{sub.name || '-'}</TableCell>
                      <TableCell className="text-sm py-3 font-mono">{sub.dob || '-'}</TableCell>
                      <TableCell className="text-sm py-3 font-mono">{sub.phone || '-'}</TableCell>
                      <TableCell className="text-sm py-3 max-w-[150px] truncate">{sub.address || '-'}</TableCell>
                      <TableCell className="text-sm py-3 font-mono text-[#1a4480]">{sub.citation_searched || '-'}</TableCell>
                      <TableCell className="text-sm py-3 font-mono">{sub.zip_code || '-'}</TableCell>
                      <TableCell className="text-sm py-3">
                        {sub.action_taken ? (
                          <span className={sub.action_taken === 'self-surrender' ? 'text-[#d83933] font-semibold' : 'text-[#2e8540] font-semibold'}>
                            {sub.action_taken}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-xs py-3 text-[#71767a]">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {submissions.map((sub, index) => (
                <div key={sub.id || index} className="p-4 border-b border-[#dfe1e2] last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#1b1b1b]">{sub.name || 'No Name'}</span>
                    <span className="text-xs text-[#71767a]">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-[#71767a]">Email:</span> {sub.email || '-'}</p>
                    <p><span className="text-[#71767a]">DOB:</span> {sub.dob || '-'}</p>
                    <p><span className="text-[#71767a]">Phone:</span> {sub.phone || '-'}</p>
                    <p><span className="text-[#71767a]">Address:</span> {sub.address || '-'}</p>
                    <p><span className="text-[#71767a]">Citation:</span> <span className="font-mono text-[#1a4480]">{sub.citation_searched || '-'}</span></p>
                    <p><span className="text-[#71767a]">Zip:</span> {sub.zip_code || '-'}</p>
                    {sub.action_taken && (
                      <p>
                        <span className="text-[#71767a]">Action:</span>{' '}
                        <span className={sub.action_taken === 'self-surrender' ? 'text-[#d83933] font-semibold' : 'text-[#2e8540] font-semibold'}>
                          {sub.action_taken}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <GovFooter />
    </div>
  );
};

export default AdminDashboard;
