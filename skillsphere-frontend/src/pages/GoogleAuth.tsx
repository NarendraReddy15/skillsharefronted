import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';

const GoogleAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return navigate('/login');

    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setAuth(data, token);
        navigate('/discover');
      })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-400">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default GoogleAuth;
