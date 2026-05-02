import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

// HOC to protect routes - redirects to login if not authenticated
export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const authed = isLoggedIn();

  useEffect(() => {
    if (!authed) navigate('/', { replace: true });
  }, [authed, navigate]);

  if (!authed) return null;
  return children;
}
