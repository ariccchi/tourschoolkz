import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Startnewcourse from './Startnewcourse';
import axios from "axios";
import LessonsPanel from './LessonsPanel';
import { BASE_URL } from './config';
function LessonListPage() {
  const [hasAccess, setHasAccess] = useState(true);
  const { title } = useParams();
  const navigate = useNavigate();
  const titleWithSpaces = title.replace(/-/g, ' ');
  const [responseData, setResponseData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.sub;
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_URL}tourschoolphp/lessonlist.php`, {
        title: titleWithSpaces,
      });
      
      if (!response.data) {
        throw new Error('Пустой ответ от сервера');
      }
      
      setResponseData(response.data);
      
    } catch (error) {
      console.error('Ошибка при запросе данных:', error);
    }
  }, [titleWithSpaces]);

  useEffect(() => {
    const checkCourseAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = token ? jwtDecode(token).sub : null;

        const response = await axios.post(`${BASE_URL}tourschoolphp/checkCourseAccess.php`, {
          user_id: userId,
          course_name: titleWithSpaces,
        });

        if (!response.data || response.data.length === 0) {
         
          setHasAccess(false);
          return;
        }

        fetchData();
      } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
      }
    };

    checkCourseAccess();
  }, [titleWithSpaces, fetchData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserRole(jwtDecode(token).role);
    }
  }, [fetchData]);

  

  return (
    <div className='connews'>
      {hasAccess ? (
        responseData ? (
          <LessonsPanel />
        ) : (
          <p>Проверка доступа...</p>
        )
      ) : (
        <Startnewcourse />
      )}
    </div>
  );
}

export default LessonListPage;
