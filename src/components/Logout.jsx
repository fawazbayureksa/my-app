import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toaster } from './ui/toaster';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    toaster.create({
      description: 'Logged out successfully',
      type: 'success',
    });
    navigate('/login');
  }, [onLogout, navigate]);

  return null; // This component doesn't render anything
};

export default Logout;