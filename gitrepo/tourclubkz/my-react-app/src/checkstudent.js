import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Checkstud = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); 
  const decodedToken = jwtDecode(token);
  const id = decodedToken.sub;
  const role = decodedToken.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (role =='student') {
      navigate('/profile');
    }
  }, [token]);
  return token ? children : null;

};

export default Checkstud;
