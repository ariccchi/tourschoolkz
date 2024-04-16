import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navpanmini from "./navpanmini";
import { jwtDecode } from 'jwt-decode';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './summary.css';
import { BASE_URL } from './config';

function SummaryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { title, lesson } = useParams();
  const token = localStorage.getItem('token');
  const titleWithSpaces = lesson.replace(/-/g, ' ');
  const courseWithSpaces = title.replace(/-/g, ' ');
  const decoded = jwtDecode(token);
  const user_id = decoded.sub;
  const [responseData1, setResponseData1] = useState([]);
  const [responseData2, setResponseData2] = useState([]);
  const [responseData3, setResponseData3] = useState([]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const response1 = await axios.post(`${BASE_URL}tourschoolphp/resultoflesson.php`, {
        title: titleWithSpaces,
        user_id: user_id,
      });

      if (!response1.data) {
        throw new Error('Пустой ответ от сервера');
      }

      setResponseData1(response1.data);
 
      const response3 = await axios.post(`${BASE_URL}tourschoolphp/checkfulltest.php`, {
        title: titleWithSpaces,
        user_id: user_id,
        course: courseWithSpaces,
      });

      if (!response3.data) {
        throw new Error('Пустой ответ от сервера');
      }

      setResponseData3(response3.data);

      const response2 = await axios.post(`${BASE_URL}tourschoolphp/resultoffinaltestlesson.php`, {
        title: titleWithSpaces,
        user_id: user_id,
   
      });

      if (Array.isArray(response2.data)) {
        setResponseData2(response2.data);
      } else {
        console.log('response2.data не является массивом');
      }

      setIsLoading(false); // Установка isLoading в false после завершения загрузки данных
    } catch (error) {
      console.error('Ошибка при запросе данных:', error);
      setIsLoading(false); // Установка isLoading в false в случае ошибки
    }
  }, [titleWithSpaces, user_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const responseDataArray = Array.isArray(responseData1) ? responseData1 : [];
const responseDataLength = responseDataArray.length;
const countTriesOne = responseDataArray.filter(item => item.tries === 1).length;
const countTriesTwo = responseDataArray.filter(item => item.tries === 2).length;

  const totalScore = countTriesOne * 100 + countTriesTwo * 50;
  const averageScore = responseDataLength > 0 ? Math.round(totalScore / responseDataLength) : 0;
  const responseDataLength2 = responseData2.length;
  const responseDataLength3 = responseData3.length;
  const countTriesOne2 = responseData2.filter(item => item.tries === 0).length;
  const countTriesTwo2 = responseData2.filter(item => item.tries === 1).length;
  const totalScore2 = countTriesOne2 * 100 + countTriesTwo2 * 50;
  const averageScore2 = responseDataLength2 > 0 ? Math.round(totalScore2 / responseDataLength3) : 0;

  const fulltestandlesson = responseDataLength > 0
  ? (averageScore + averageScore2) / 2
  : averageScore2;

  console.log(fulltestandlesson);

  const handleSaveResults = async () => {
    try {
      console.log('Отправляемые данные:', {
        user_id: user_id,
        lesson_id: titleWithSpaces,
        is_completed: true,
        result: fulltestandlesson,
      });
  
      const response = await axios.post(`${BASE_URL}tourschoolphp/saveResults.php`, {
        user_id: user_id,
        lesson_id: titleWithSpaces,
        is_completed: true,
        result: fulltestandlesson,
      });
  
      console.log('Ответ от сервера:', response.data);
  
      if (response.data.success) {
        console.log('Результаты сохранены успешно!');
      } else {
        console.log('Сервер вернул ошибку:', response.data.error);
      }
    } catch (error) {
      console.error('Ошибка при сохранении результатов:', error);
    }
  };
  

  useEffect(() => {
    const fetchDataAndSaveResults = async () => {
      try {
        await fetchData(); // Ждем завершения запросов данных
  
        // Вызываем handleSaveResults, если responseData2.length === responseData3.length
        if (responseData2.length === responseData3.length) {

          await handleSaveResults(); // Ждем завершения сохранения результатов
        }
      } catch (error) {
        console.error('Ошибка при запросе данных:', error);
      }
    };
  
    if (!isLoading) {
      fetchDataAndSaveResults();
    }
  }, [fetchData, responseData2.length, responseData3.length, isLoading]);
  
  return (
    <>
      {isLoading ? (
        <p>Загрузка данных...</p>
      ) : (
        <div className="fullpage">
          <div className="left-side">
            <div className="textcong">
              <h1>Так держать!</h1>
              {responseDataLength > 0 && (
  <>
    <h2>Вы ответили на {countTriesOne} из {responseDataLength} вопросов с первой попытки!</h2>
    <h3>И на {countTriesTwo} из {responseDataLength} вопросов урока со второй попытки!</h3>
  </>
)}

              {responseData2.length !== responseData3.length && (
                <h4>Вы прошли тест не до конца. Пожалуйста, повторите попытку</h4>
              )}

              <div className="roundsummary">
              <div className="roundprocent">{totalScore2 === 0 ? `${averageScore}%` : totalScore === 0 ? `${averageScore2}%` : `${fulltestandlesson}%`}</div>
                <div className="roundprocenth">Ваш процент за урок </div>
              </div>
            </div>
            <div className="downcont">
              <div className="buttonssum">
                {responseData2.length === 0 || responseData2.length !== responseData3.length ? (
                  <Link to={`/courses/${title}/${lesson}/finaltest/`}>
                    <button>тест</button>
                  </Link>
                ) : (
                  <button onClick={() => handleModalOpen()}>Мои результаты</button>
                )}
                <Link to={responseDataLength > 0 ? `/courses/${title}/${lesson}` : `/courses/${title}/lesson/${lesson}`}>
      <button>Пересмотреть урок</button>
    </Link>
                <Link to={`/messages`}>
                  <button>Сообщить куратору об ошибке</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button2" onClick={handleModalClose}>
              ×
            </span>
            <h2>Вы ответили на {countTriesOne2} из {responseDataLength2} вопросов теста с первой попытки! </h2>
            <h3>И на {countTriesTwo2} из {responseDataLength2} вопросов со второй попытки! </h3>
            <h3> Процент прохождения теста: {averageScore2}% </h3>
            <Link to={`/courses/${title}/${lesson}/finaltest/`}>
              <button>Перепройти тест</button>
            </Link>
          </div>
        </div>
      )}

      <Navpanmini />
    </>
  );
}

export default SummaryPage;
