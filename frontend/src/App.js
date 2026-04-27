import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import SearchPage from './pages/Search';
import LoadingPage from './pages/Loading';
import ResultsPage from './pages/Results';
import CoursesOfActionPage from './pages/CoursesOfAction';
import SelfSurrenderPage from './pages/SelfSurrender';
import PaymentMethodsPage from './pages/PaymentMethods';
import PaymentFormPage from './pages/PaymentForm';
import FederalKioskPage from './pages/FederalKiosk';
import { ProtectedRoute } from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/federal-kiosk" element={<FederalKioskPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loading"
          element={
            <ProtectedRoute>
              <LoadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses-of-action"
          element={
            <ProtectedRoute>
              <CoursesOfActionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/self-surrender"
          element={
            <ProtectedRoute>
              <SelfSurrenderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-methods"
          element={
            <ProtectedRoute>
              <PaymentMethodsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-form"
          element={
            <ProtectedRoute>
              <PaymentFormPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
