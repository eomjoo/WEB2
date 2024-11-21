// hooks/useAuth.js
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();

  const checkAuth = () => {
    // Your auth check logic here
    return true; // or false
  };

  const signOut = () => {
    // Your signout logic here
    navigate('/signin');
  };

  return { checkAuth, signOut };
}