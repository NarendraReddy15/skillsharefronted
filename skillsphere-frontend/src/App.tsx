import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import GoogleAuth from '@/pages/GoogleAuth';
import Discover from '@/pages/Discover';
import Matches from '@/pages/Matches';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import Friends from '@/pages/Friends';
import Notifications from '@/pages/Notifications';

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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login"    element={isAuthenticated ? <Navigate to="/discover" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/discover" /> : <Register />} />
          <Route path="/auth/google" element={<GoogleAuth />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
