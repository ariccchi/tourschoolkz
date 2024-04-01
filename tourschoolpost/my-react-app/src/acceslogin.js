import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Acceslogin = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); // Выводим значение токена в консоль
  let decodedToken, id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Если нет токена, перенаправляем на /login
    }else{ 
      
    }
  }, [token]);
  return token ? children : null;

};

export default Acceslogin;
