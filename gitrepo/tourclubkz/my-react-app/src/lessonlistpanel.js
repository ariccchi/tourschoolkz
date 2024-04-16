import React, { useState, useEffect, useCallback } from 'react';
import './lessonlistpanel.css'
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
function LessonListPanel() {
  const { title } = useParams();
  const titleWithSpaces = title.replace(/-/g, ' ');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  let decoded = jwtDecode(token);
  let user_id = decoded.sub;
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_URL}tourschoolphp/lessonlist.php`, {
        title: titleWithSpaces,
        user_id: user_id,
      });

      if (!response.data) {
        throw new Error('Пустой ответ от сервера');
      }

      setResponseData(response.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Ошибка при запросе данных:', error);
      setLoading(false); // Set loading to false in case of an error
    }
  
  }, [titleWithSpaces, user_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLessonClick = useCallback(async (item) => {
    try {
      const checkResponse = await axios.post(`${BASE_URL}tourschoolphp/checkUserLesson.php`, {
        user_id: user_id,
        lesson_id: item.lesson_id,
      });
  
      if (!checkResponse.data.exists) {
        // If user_id and lesson_id not found, redirect to the lesson
        const lessonLink = item.lesson_type === 'textlesson'
          ? `/courses/${title}/lesson/${item.lesson_title.replace(/ /g, '-')}`
          : `/courses/${title}/${item.lesson_title.replace(/ /g, '-')}`;
  
        navigate(lessonLink);
      } else {
        // If user_id and lesson_id found, redirect to the summary page
        const summaryPageLink = `/courses/${title}/${item.lesson_title.replace(/ /g, '-')}/summary-page`;
        navigate(summaryPageLink);
      }
    } catch (error) {
      console.error('Ошибка при запросе данных:', error);
    }
  }, [user_id, title, navigate]);
  

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or message
  }

  // Получение текущего времени клиента
  const currentTime = new Date().getTime();
  return (
    <div className="Container">
    {responseData && responseData.length > 0 ? (
  responseData.map((item, index) => {
    const isCompleted = item.is_completed === 1;
    const isPreviousLessonCompleted =
      index === 0 || responseData[index - 1].is_completed === 1;
    const previousLessonAvailableAt =
      index === 0 ? null : new Date(responseData[index - 1].available_at + "Z").getTime();
    
    // Конвертация времени сервера в объект Date и применение смещения
    const formattedCompletedAt = isCompleted
      ? new Date(item.completed_at + "Z").toLocaleString()
      : null;

    // Конвертация времени сервера в объект Date и применение смещения
    const formattedAvailableAt = previousLessonAvailableAt
      ? new Date(responseData[index - 1].available_at + "Z").toLocaleString()
      : null;

    // Разрешить перейти, если урок завершен или текущее время >= времени "будет доступен"
    const allowToProceed = isCompleted || currentTime >= previousLessonAvailableAt || index === 0;

    // Формирование ссылки в зависимости от типа урока
    const lessonLink = item.lesson_type === 'textlesson'
      ? `/courses/${title}/lesson/${item.lesson_title.replace(/ /g, '-')}`
      : `/courses/${title}/${item.lesson_title.replace(/ /g, '-')}`;

    return (
      <div key={index}>
        {allowToProceed ? (
          <Link
            to={lessonLink}
            state={{ courseTitle: title, lessonId: item.lesson_id }}
            onClick={() => handleLessonClick(item)}
          >
                <div className='lessonblock'>
                  <div className='lessonRightblock'>
                    <div className='LessonTitle'>{item.lesson_title}</div>
                    <div className='statusinfo'>
                      <div className='lessonstatus'>Cтатус:</div>
                      <div className='lessonstatus2'>
                        {currentTime >= previousLessonAvailableAt ? 'Доступен' : `Будет доступен: ${formattedAvailableAt || 'Нет данных'}`}
                      </div>
                    </div>
                  </div>
                  <div className='leftblock'>
                    {isCompleted && <div className='lessonresult'>Результат {item.result}%</div>}
                  </div>
                </div>
              </Link>
            ) : (
              <div className='lessonblock'>
                <div className='lessonRightblock'>
                  <div className='LessonTitle'>{item.lesson_title}</div>
                  <div className='statusinfo'>
                    <div className='lessonstatus'>Cтатус:</div>
                    <div className='lessonstatus2'>
                      {`Будет доступен: ${formattedAvailableAt || 'Пройдите предыдущий урок'}`}
                    </div>
                  </div>
                </div>
                <div className='leftblock'>
                  {/* Добавьте здесь необходимые элементы, если ссылка недоступна */}
                </div>
              </div>
            )}
            <p>{item.someProperty}</p>
          </div>
        );
      })
    ) : (
      <p>Нет доступных уроков</p>
    )}
  </div>
);
}

export default LessonListPanel;
