import React, { useState, useEffect} from 'react';
import Navpanmini from './navpanmini.js';
import './courses.css';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LessonListPanel from './lessonlistpanel';
import SumResult from './result.js';
import { Link } from 'react-router-dom';
function LessonsPanel() {
    const [showModal, setShowModal] = useState(false);
    const [selectedNav, setSelectedNav] = useState('all');
    const { title } = useParams();
    const titleWithSpaces = title.replace(/-/g, ' ');
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
    const handleImageClick = () => {
        setShowModal(true);
    }

    const handleNavClick = (nav) => {
        setSelectedNav(nav);
    }

    const closeModal = () => {
        setShowModal(false);
    }
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData2 = async () => {
          try {
            // Выполняем HTTP запрос к PHP файлу
            const response = await fetch('http://localhost:8888/tourschoolphp/Checkadmin.php', {
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
          }
        };
      
        fetchData2();
      }, []); 

    return(
        <>
        
        <div className="header">
            <div className="coursesh">{titleWithSpaces}</div>
            {data.role === 'admin' && (
  <Link className="Addlessonbutton"  to={`/Addlesson/${title}`}>Добавить урок
  </Link>
)}
        
            {showModal && (
                <div className="modal">
                    <button onClick={closeModal}>Закрыть</button>
                    <p>Это ваше модальное окно!</p>
                </div>
            )}
        </div>
        <div className="linewithnav">
         
            <div className={`textnav ${selectedNav === 'all' ? 'active' : ''}`} onClick={() => handleNavClick('all')}>Уроки</div>
            <div className={`textnav ${selectedNav === 'Туризм по направлениям' ? 'active' : ''}`} onClick={() => handleNavClick('Туризм по направлениям')}>Результаты</div>
       
        </div>
        {selectedNav === 'all' && <LessonListPanel/>}
     
        {selectedNav === 'Общий туризм' && navigate('/messages')}
        {selectedNav === 'Туризм по направлениям' && <SumResult/>}
                {/* <LessonListPanel/> */}
        {/* {selectedNav === 'my' && <Mycourselist />}
        {selectedNav && <Courselist selectedNav={selectedNav} />} */}
       
        <Navpanmini />
      </>
    )
    
}
export default LessonsPanel;