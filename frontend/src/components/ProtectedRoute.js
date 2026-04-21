import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

// HOC to protect routes - redirects to login if not authenticated
export function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  if (!isLoggedIn()) {
    return null;
  }

  return children;
}
