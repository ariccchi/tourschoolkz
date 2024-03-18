import React, { useState, useEffect } from "react";
import Navpanmini from './navpanmini';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import './profile.css';

function Profile() {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
    const role = decodedToken.role;
    const name = decodedToken.name;
    const surname = decodedToken.surname;
    const [selectedNav, setSelectedNav] = useState('all');
    const [Curatordata, setCuratorData] = useState([]);
    const [Admindata, setAdminData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRightChats, setShowRightChats] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Выполняем HTTP запрос к PHP файлу
                const response = await fetch('http://localhost:8888/tourschoolphp/showavatar.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: id }),
                });

                const data = await response.json();
                setData(data);

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                // Устанавливаем статус загрузки в false после завершения запроса
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8888/tourschoolphp/myuserinfo.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: id }),
                });

                const data2 = await response.json();
                setData2(data2);

                if (data2 && data2.length > 0) {
                    if (data2[0].role === 'curator') {
                        const curatorResponse = await fetch('http://localhost:8888/tourschoolphp/curatorlist.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user: id }),
                        });

                        const curatorData = await curatorResponse.json();
                        setCuratorData(curatorData);
                    } else if (data2[0].role === 'admin') {
                        const adminResponse = await fetch('http://localhost:8888/tourschoolphp/adminlist.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user: id }),
                        });

                        const adminData = await adminResponse.json();
                        setAdminData(adminData);
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }

            try {
                const response = await fetch('http://localhost:8888/tourschoolphp/myusercourses.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ user: id }),
                });
        
                const data3 = await response.json();
                setData3(data3);
        
              } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
              } finally {
                setLoading(false);
              }
        }

        fetchData();
    }, [id]);

    console.log(data2);
    const avatarSrc = data.avatar ? `http://localhost:8888/tourschoolphp/${data.avatar}` : null;

    console.log(avatarSrc);
    const handleNavClick = (nav) => {
        setSelectedNav(nav);
        setShowRightChats(!showRightChats);
    }
    const handleToggleRightChats = () => {
        setShowRightChats(!showRightChats);
    };
    console.log(data3);
    return (
        <div className="containerprofile">
            <div className="photoanddannie">
                <div className="avatarphoto">
                    <div className="h3avatar">Фото профиля</div>
                    <img className="avatarprofile" src={avatarSrc} alt="Avatar"></img>
                    <div className="changeavatar">
                        <img className="changeimg" alt="avatarka" src="/imgavatar.svg"></img>
                        <div className="changetext">Изменить фото профиля</div>
                    </div>
                </div>

                {data2 && data2.length > 0 && (
                    <div className="dannie">
                        <div className="danni">Ваши данные</div>
                        <div className="danicont">
                            <div className="graydani">Имя</div>
                            <div className="danidb">{data2[0].name}</div>
                        </div>
                        <div className="danicont">
                            <div className="graydani">Фамилия</div>
                            <div className="danidb">{data2[0].surname}</div>
                        </div>
                        <div className="danicont">
                            <div className="graydani">Email</div>
                            <div className="danidb">{data2[0].email}</div>
                        </div>
                        <div className="danicont">
                            <div className="graydani">Куратор</div>
                            <div className="danidb">{data2[0].curator_name} {data2[0].curator_surname}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="coursesandstudents">
                    <div className="coursesprofile">
                        <div className="h3coursesprofile">Мои курсы</div>
                        <div className="coursesprofilelist">
                        {data3.map((course, index) => (
  <Link key={course.id || index} to={`/courses/${course.course_name.replace(/\s+/g, '-')}`}>
    <div className='lessonblock'>
      <div className='lessonRightblock'>
        <div className='LessonTitle'>{course.course_name}</div>
        <div className='statusinfo'>
          <div className='lessonstatus'>Прогресс:</div>
          <div className='lessonstatus2'>
            {course.lesson_count > 0 ?
              `${course.completed_lesson_count}/${course.lesson_count} (${Math.round((course.completed_lesson_count / course.lesson_count) * 100)}%)` :
              `0/0 (0%)`
            }
          </div>
        </div>
      </div>
      <div className='leftblock'>
        {/* {isCompleted && <div className='lessonresult'>Результат %</div>} */}
      </div>
    </div>
  </Link>
))}
                        </div>
                    </div>
            </div>
            <Navpanmini />
        </div>
    );
}

export default Profile;
