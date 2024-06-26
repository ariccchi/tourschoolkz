import React, { useState, useEffect } from "react";
import Navpanmini from './navpanmini';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import './profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentList from "./studentlist";
import BlockUser from "./redactstudentinfo";
import { BASE_URL } from './config';

function Studprof() {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const { person } = useParams();
    const [datame, setDatame] = useState([]);
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
    const role = decodedToken.role;
    const name = decodedToken.name;
    const surname = decodedToken.surname;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNav, setSelectedNav] = useState('all');
    const [Curatordata, setCuratorData] = useState([]);
 
    const navigate = useNavigate();
    const [Admindata, setAdminData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRightChats, setShowRightChats] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageToDB, setSelectedImageToDB] = useState(null);
    useEffect(() => {
      
        const fetchData = async () => {
            try {
                // Выполняем HTTP запрос к PHP файлу
                const response = await fetch(`${BASE_URL}tourschoolphp/showavatar.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: person }),
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
    }, [person]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}tourschoolphp/myuserinfo.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: person }),
                });

                const data2 = await response.json();
                setData2(data2);
                if(role !== 'admin' && role !== 'curator') {
                  navigate('/profile')
                }
                

                const responseme = await fetch(`${BASE_URL}tourschoolphp/myuserinfo.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: id }),
                });

                const datame = await responseme.json();
                setDatame(datame);
                
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }

            try {
                const response = await fetch(`${BASE_URL}tourschoolphp/myusercourses.php`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ user: person }),
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
    }, [person]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
    console.log(data2);
    const avatarSrc = data.avatar ? `${BASE_URL}tourschoolphp/${data.avatar}` : null;
    
    const roleNames = {
        student: 'Студент',
        curator: 'Куратор',
        admin: 'Администратор'
      };
      
      // Получение русского названия роли
    const russianRole = data2[0]?.role ? roleNames[data2[0].role] : '';
    // Преобразование формата даты
    const birthdate = data[0]?.birthdate ? new Date(data[0].birthdate) : null;
    // Преобразование формата даты
    const formattedBirthdate = birthdate ? `${birthdate.getDate()}.${(birthdate.getMonth() + 1).toString().padStart(2, '0')}.${birthdate.getFullYear()}` : '';
    const isCurator = data2[0]?.role === 'curator';
    const isAdmin = data2[0]?.role === 'admin';
    console.log(data[0]?.role);
    const handleNavClick = (nav) => {
        setSelectedNav(nav);
        setShowRightChats(!showRightChats);
    }
    const handleToggleRightChats = () => {
        setShowRightChats(!showRightChats);
    };

     
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
    
        // Проверка на размер файла (не более 5MB)
        if (file && file.size > 5 * 1024 * 1024) {
          alert('Файл слишком большой. Выберите файл размером менее 5MB.');
          return;
        }
    
        // Создание объекта URL для отображения изображения
        const imageUrl = URL.createObjectURL(file);
    
        // Сохранение изображения в состояние
        setSelectedImage(imageUrl);
        setSelectedImageToDB(file)
        // Дополнительная логика (если нужно)
      };
    const handleSaveImage = async () => {
        try {
          const formData = new FormData();
          formData.append('image', selectedImageToDB);
          formData.append('user_id', person)
      
          const response = await axios.post(
            `${BASE_URL}tourschoolphp/addAvatar.php`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
      
          window.location.reload();
      
        } catch (error) {
          console.error('Error sending message:', error);
        }
      
        handleCloseModal();
      };
      console.log(Admindata);

    return (
        <div className="containerprofile">
            <div className="photoanddannie">
                <div className="avatarphoto">
                    <div className="h3avatar">Фото профиля</div>
                    <img className="avatarprofile" src={avatarSrc} alt="Avatar"></img>
                    <div className="changeavatar" onClick={handleOpenModal}>
                        <img className="changeimg" alt="avatarka" src="/imgavatar.svg"></img>
                        <div className="changetext">Изменить фото профиля</div>
                    </div>
                </div>

                {data2 && data2.length > 0 && (
                    <div className="dannie">
                        <div className="danni">Данные пользователя</div>
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
                        {data2[0].curator_name && (
                        <div className="danicont">
                            <div className="graydani">Куратор</div>
                            <div className="danidb">{data2[0].curator_name} {data2[0].curator_surname}</div>
                        </div>
                        )}
                         <div className="danicont">
                            <div className="graydani">Роль</div>
                            <div className="danidb">{russianRole}</div>
                        </div>
                    </div>
                )}
                 <BlockUser 
                
  value1={person} 
  value2={id} 
  value3={data2} 
  value4={datame}
/>
            </div>
            <div className="coursesandstudents">
                    <div className="coursesprofile">
                        <div className="h3avatar">Курсы пользователя</div>
                        <div className="coursesprofilelist">
                        {Array.isArray(data3) && data3.length > 0 ? (
    data3.map((course, index) => (
        <Link key={course.id || index} to={`/courses/${course.course_name.replace(/\s+/g, '-')}`}>
            <div className='lessonblockprofile'>
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
            </div>
        </Link>
    ))
) : (
    <div>Этот пользователь еще не начал ни одного курса</div>
)}
                        </div>
                    </div>
                    {(isAdmin || isCurator) && (
                             <>
                         <div className="danni2">Ученики пользователя</div>
                    <div className="studentsprofile">
                   
            
                     
        <StudentList complexArray={data2} />
   


                   
                    </div>
               
                    </>
                    )}
                        
            </div>
            <Navpanmini />
            {isModalOpen && (
  <div className="modal-info-overlayava">
    <div className="modal-infoava">
      <span className="close-buttonava" onClick={handleCloseModal}>
        &times;
      </span>
      <input
        type="file"
        className="filediv"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Отображение загруженного изображения */}
      {selectedImage && (
        <img className="imgavatar" src={selectedImage} alt="Uploaded" />
      )}

      {/* Save button */}
      <button className="save-button" onClick={handleSaveImage}>
        Сохранить
      </button>
    </div>
  </div>
)}
        </div>
    );
}

export default Studprof;
