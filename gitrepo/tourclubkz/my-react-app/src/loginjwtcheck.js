import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Loginjwtcheck = ({ children }) => {
  const token = localStorage.getItem('token');
  let decodedToken, id;

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/profile'); // Если нет токена, перенаправляем на /login
    }else{ 
            navigate('/login');
    }
  }, [token]);
  return token ? children : null;

};

export default Loginjwtcheck;
