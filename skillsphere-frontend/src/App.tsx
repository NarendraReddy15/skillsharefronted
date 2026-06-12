import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Landing       = lazy(() => import('@/pages/Landing'));
const Login         = lazy(() => import('@/pages/Login'));
const Register      = lazy(() => import('@/pages/Register'));
const GoogleAuth    = lazy(() => import('@/pages/GoogleAuth'));
const Discover      = lazy(() => import('@/pages/Discover'));
const Matches       = lazy(() => import('@/pages/Matches'));
const Chat          = lazy(() => import('@/pages/Chat'));
const Profile       = lazy(() => import('@/pages/Profile'));
const EditProfile   = lazy(() => import('@/pages/EditProfile'));
const Friends       = lazy(() => import('@/pages/Friends'));
const Notifications = lazy(() => import('@/pages/Notifications'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/discover" />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  useSocket();
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#111118',
              color: '#f1f5f9',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '14px',
              fontSize: '13.5px',
              fontWeight: 500,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login"    element={isAuthenticated ? <Navigate to="/discover" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/discover" /> : <Register />} />
            <Route path="/auth/google" element={<GoogleAuth />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
