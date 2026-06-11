import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { setAuth, logout: storeLogout, user, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.user, data.token);
    toast.success(`Welcome back, ${data.user.name}!`);
    navigate('/discover');
  }, [setAuth, navigate]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setAuth(data.user, data.token);
    toast.success(`Welcome to SkillShare, ${data.user.name}!`);
    navigate('/edit-profile');
  }, [setAuth, navigate]);

  const logout = useCallback(() => {
    storeLogout();
    navigate('/login');
    toast.success('Logged out');
  }, [storeLogout, navigate]);

  return { login, register, logout, user, token, isAuthenticated };
};
