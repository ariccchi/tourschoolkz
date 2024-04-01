// src/components/PrivateRoute.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.sub;
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('http://localhost:8888/tourschoolphp/checkUserAdmin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'active' && data.role === 'admin') {
          // User is an admin
          setIsAdmin(true);
        } else {
          // User is not an admin or other error
          setIsAdmin(false);
          console.error('Error in checkUserStatus:', data.error);

          // Redirect to '/courses' if the user is not an admin
          navigate('/courses');
        }
      } catch (error) {
        console.error('An error occurred while checking user status:', error);
      }
    };

    if (token) {
      checkUserStatus(); // Check user status when the component loads
    } else {
      navigate('/'); // If there is no token, navigate to the home page
    }
  }, [token, navigate, id]);

  return isAdmin ? children : null;
};

export default AdminRoute;
