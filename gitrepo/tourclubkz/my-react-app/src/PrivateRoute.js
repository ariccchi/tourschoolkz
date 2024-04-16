// src/components/PrivateRoute.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
const PrivateRoute = ({ children }) => {
  
  const [isBlocked, setIsBlocked] = useState(false);
  const token = localStorage.getItem('token');
    
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}tourschoolphp/checkUserStatus.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id:id}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'blocked') {
          setIsBlocked(true);
      
          localStorage.removeItem('token'); // Удаляем токен из LocalStorage
          window.location.reload();
          navigate('/'); // Перенаправляем на главную страницу
        }
      } catch (error) {
        console.error('An error occurred while checking user status:', error);
      }
    };

    if (token) {
      checkUserStatus(); // Проверяем статус пользователя при загрузке компонента
    } else {
      navigate('/'); // Если нет токена, перенаправляем на главную страницу
    }
  }, [token, navigate]);

  return isBlocked ? null : children;
};

export default PrivateRoute;
