import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './startcourse.css';
import Navpanmini from './navpanmini.js';
import { jwtDecode } from 'jwt-decode'; 
import axios from "axios";
import LessonListPage from './Lessonlist.js';

function Startnewcourse() {
    const { title } = useParams();
    const titleWithSpaces = title.replace(/-/g, ' ');
    const [responseData, setResponseData] = useState(null); 
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Декодируем JWT токен
    const decoded = jwtDecode(token);
    const user_id = decoded.sub;

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:8888/tourschoolphp/startcourseinfo.php', {
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
        fetchData();
    }, [fetchData]);
    const handleButtonClick = async (courseId) => {
        try {
          const response = await axios.post('http://localhost:8888/tourschoolphp/startcourse.php', {
            course_id: courseId,
            user_id: user_id,
          });
      
          if (!response.data) {
            throw new Error('Пустой ответ от сервера');
          }
      
          // Перенаправляем пользователя на страницу списка уроков
          window.location.reload();
        } catch (error) {
          console.error('Ошибка при запросе данных:', error);
        }
      };
      

    return (
        <>
        <Navpanmini />
        {responseData && responseData.map((course, index) => (
            <div className='containerstartcourse' key={index}>
        <div className='titlecourse'>{titleWithSpaces}</div>

        <div className='containersta'>
            <div className='conttop'>
        <img src = {`http://localhost:8888/tourschoolphp/${course.image_url}`}className='imagecourse'>
        </img>
        <div className='rightcont'>
        <div className='courseinfo'>
            <div className='titlecoursemini'>{course.course_name}</div>
            
            <div className='coursetype'>{course.type}</div>
            <div className='lessandtime'>
                <div className='imgandless'>
                    <div className='lessimg'></div>
                   

                </div>
                <div className='imgandtime'>
                 
                 
                </div>
            </div>
        </div>
        
        <div className='buttontostart' onClick={() => handleButtonClick(course.id)}>Начать изучение курса</div>


        </div>
        </div>
        <div className='description'>{course.course_description}</div>
        </div>
        </div>
        ))}

        </>
    )
}

export default Startnewcourse;