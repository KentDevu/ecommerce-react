import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

const TokenService = () => {
  const navigate = useNavigate();

  const setAuthorization = (token, userId) => {
    Cookies.set(TOKEN_KEY, token);
    Cookies.set(USER_ID_KEY, userId);
  };

  const storeToken = (token) => {
    Cookies.set(TOKEN_KEY, token);
  };

  const storeUserId = (userId) => {
    Cookies.set(USER_ID_KEY, userId);
  };

  const getAuth = () => {
    const token = Cookies.get(TOKEN_KEY);
    const userId = Cookies.get(USER_ID_KEY);

    if (token && userId) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      return [token, userId, headers];
    }
    return null;
  };

  const clearAuth = (retryCount = 3) => {
    let attempts = 0;

    const attemptDelete = () => {
      try {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(USER_ID_KEY);

        const token = Cookies.get(TOKEN_KEY);
        const userId = Cookies.get(USER_ID_KEY);

        if (!token && !userId) {
          window.location.reload();
          navigate('/product-list');
        } else {
          throw new Error('Failed to clear auth');
        }
      } catch (error) {
        if (attempts < retryCount) {
          attempts++;
          console.error(`Retrying to clear auth (${attempts}/${retryCount})...`);
          attemptDelete();
        } else {
          console.error('Error clearing auth after multiple attempts:', error);
        }
      }
    };

    attemptDelete();
  };

  const getUserId = () => {
    return Cookies.get(USER_ID_KEY);
  };

  const getToken = () => {
    return Cookies.get(TOKEN_KEY);
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    setAuthorization,
    storeToken,
    storeUserId,
    getAuth,
    clearAuth,
    getUserId,
    getToken,
    isAuthenticated,
  };
};

export default TokenService;
