import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navpanmini from './navpanmini';
import { jwtDecode } from 'jwt-decode';
//CSS lessonlistpanel.css
function Lessonpdf() {
    
    const navigate = useNavigate(); // Используйте useNavigate
    const { title } = useParams();
    const titleWithSpaces = title.replace(/-/g, ' ');
    const { lesson } = useParams();
    const lessonWithSpaces = lesson.replace(/-/g, ' ');
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');


let decoded = jwtDecode(token);

let user_id = decoded.sub;
    useEffect(() => {
        const checkResultAndShowVideo = async () => {
          console.log(user_id);
      
          try {
            const checkResultResponse = await fetch('http://localhost:8888/tourschoolphp/Checkresulttoshowvideo.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user_id,
                title: lessonWithSpaces,
                course: titleWithSpaces,
              }),
            });
      
            if (!checkResultResponse.ok) {
              throw new Error('Ошибка при проверке результата для отображения видео');
            }
      
            const checkResultData = await checkResultResponse.json();
      
            // Check if checkResultData is an array before accessing its elements
            if (Array.isArray(checkResultData) && checkResultData.length > 0) {
              // Вывод данных из PHP-скрипта в консоль
              console.log('Response from PHP script:', checkResultData);
      
              // Извлекаем значение available_at из первого элемента массива
              const availableAt = checkResultData[0].available_at;
              console.log('available_at:', availableAt);
      
              // Получаем текущее время клиента
              const clientTime = new Date();
      
              // Получаем время с сервера и преобразуем его в объект Date (время сервера считаем в UTC)
              const serverTimeUTC = new Date(availableAt);
      
              // Получаем смещение временной зоны клиента
              const clientTimezoneOffset = clientTime.getTimezoneOffset();
      
              // Корректируем время сервера на смещение временной зоны клиента
              const serverTime = new Date(serverTimeUTC.getTime() - clientTimezoneOffset * 60000);
              console.log(serverTimeUTC);
      
              // Сравниваем время с сервера и времени клиента
              if (serverTime > clientTime) {
                // Если время на сервере больше времени клиента, выполняем перенаправление
                navigate('/courses');
              } else {
           
              }
            } 
          } catch (error) {
            // console.error('Ошибка при проверке результата для отображения видео:', error);
          }
        };
      
        checkResultAndShowVideo();
      }, [user_id, lessonWithSpaces, titleWithSpaces]);
      
   useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8888/tourschoolphp/lessonvideo.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ lesson: lessonWithSpaces, course: titleWithSpaces }),
            });
      
            if (!response.ok) {
              throw new Error('Ошибка при запросе данных');
            }
      
            const responseBody = await response.text();
            const data = JSON.parse(responseBody);
            setResponseData(data);
          } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
          } finally {
            // Устанавливаем статус загрузки в false после завершения запроса
            setLoading(false);
        }
    };
    fetchData();
}, [titleWithSpaces]);
console.log(responseData);
 return (

<div className="containerfortextlesson">
<img className='form7' src='/form7.svg'></img>
<div className="titlefortextlesson">{lessonWithSpaces}</div>
<div className="fileinfo">Изучите файл, выпишите самое главное</div>
<div className="fileinfo">Затем пройдите тест</div>

    <a className='filetext' href={`http://localhost:8888/tourschoolphp/${responseData}`} download>Скачать файл</a>



<Link to={`/courses/${title}/${lesson}/finaltest`}>
<div className="filetest">Пройти тест</div>
</Link>
<Navpanmini/>
</div>
    
 )   
}
export default Lessonpdf;