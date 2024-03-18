import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Mycourselist = () => {
    const [data, setData] = useState([]);
    const [selectedNav, setSelectedNav] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            // Ваш JWT токен
            const token = localStorage.getItem('token');

            // Декодируем JWT токен
           // Декодируем JWT токен
let decoded = jwtDecode(token);

// Получаем user_id из декодированного токена
let user_id = decoded.sub;

            // Выполняем HTTP запрос к PHP файлу
            const response = await fetch('http://localhost:8888/tourschoolphp/mycourselist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_id: user_id}),
            });

            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, [selectedNav]);



    const items = data.map((item, index) => {
        const link = item.course_name.replace(/\s/g, '-');
        return (
          <div key={index} className='courselink'>
            <Link to={link}>      
                <div className="courseimg">
                <img src={`http://localhost:8888/tourschoolphp/${item.image_url}`} alt="Tour Image" />
                </div>
                <div className="coursetype">{item.type}</div>
                <div className="coursename">{item.course_name}</div>
                <div className="coursesinfo">
                    <div className="courseslessons">
                        <div className="infocont">
                            <div className="imageles">
                                <img src="../layer.svg"></img>
                            </div>
                            <div className="infoles"> Количество уроков: {item.lesson_count}</div>
                        </div>
                     
                    </div>
                </div>
            </Link>
          </div>
        );
    });
    
    return <div className='courseslist'>{items}
    
    </div>;
};

export default Mycourselist;
