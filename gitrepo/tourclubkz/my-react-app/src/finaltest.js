import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navpanmini from "./navpanmini";
import './fintest.css';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
function Finaltest() {
  const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [tries, setTries] = useState(0);
    const [currentQuestionTries, setCurrentQuestionTries] = useState(0); // Новое состояние
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [progress, setProgress] = useState(0);
    const { title, lesson } = useParams();
    const titleWithSpaces = lesson.replace(/-/g, ' ');
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
const [testCompleted, setTestCompleted] = useState(false);
const navigate = useNavigate();

    const token = localStorage.getItem('token');

          
    let decoded = jwtDecode(token);
    
    let user_id = decoded.sub;
    const date = new Date(); // текущая дата и время
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль, если месяц меньше 10
    const day = String(date.getDate()).padStart(2, '0'); // добавляем ведущий ноль, если день меньше 10
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${BASE_URL}tourschoolphp/fintestlesson.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lesson: titleWithSpaces }),
          });
  
          if (!response.ok) {
            throw new Error('Ошибка при запросе данных');
          }
  
          const data = await response.json();
  
          // Преобразовать данные в ожидаемый формат
          const formattedQuestions = data.map((question) => ({
            ...question,
            options: shuffleArray([
              question.incorrect_answer1,
              question.incorrect_answer2,
              question.incorrect_answer3,
              question.correct_answer,
            ]),
          }));
  
          setQuestions(formattedQuestions);
        } catch (error) {
          console.error('Ошибка при отправке запроса:', error);
        }
      };
  
      fetchData();
    }, [titleWithSpaces]);
    const sendTestData = async () => {
      try {
        const response = await fetch(`${BASE_URL}tourschoolphp/fintestresult.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user_id,
            testid: questions[currentQuestionIndex]?.id,  // использование question_id
            tries: tries,
            total: questions.length,
            timestamp: formattedTimestamp,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Ошибка при отправке данных на сервер');
        }
    
        const data = await response.json();
        console.log('Данные успешно отправлены на сервер:', data);
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error);
      }
    };
       const handleOptionClick = (option) => {
        if (answeredCorrectly) {
            // Если уже был дан правильный ответ, не обрабатываем клик
            return;
        }
 


        const isAnswerCorrect = option === questions[currentQuestionIndex].correct_answer;
        setTries(tries + 1);
  if (!isAnswerCorrect) {
   
    setCurrentQuestionTries(currentQuestionTries + 1);
    setIncorrectAnswers([...incorrectAnswers, option]);
  } else {
    setCorrectAnswers([...correctAnswers, option]);
    setShowContinueButton(true);
    setCurrentQuestionTries(0);
    setAnsweredCorrectly(true); // Устанавливаем флаг, что был дан правильный ответ
    console.log("Current Question ID:", questions[currentQuestionIndex]?.id);
    sendTestData();

  
  }
};




const handleContinueClick = () => {
  const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  if (nextQuestionIndex === 0) {
      // Если это последний вопрос, то тест завершен
      setTestCompleted(true);
      navigate(`/courses/${title}/${lesson}/summary-page`);
  } else {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTries(0);
      setIncorrectAnswers([]);
      setShowContinueButton(false);
      setProgress((currentQuestionIndex + 1) / questions.length * 100);
      setCurrentQuestionTries(0);
      setAnsweredCorrectly(false);
  }
};



    console.log(tries);
    return(
        <>
   <img className="form7" src='/form7.svg'></img>
  
        {testCompleted ? (
            <div>
                <p>Тест завершен! Спасибо за участие.</p>
                <a href="/your-link-here">Ваша ссылка</a>
            </div>
        ) : (
            <div className='full-pagetest'>
            <div className='containertest'>
                <div className='progress-barnorm'>
        <div className='progress-bartest' style={{ width: `${progress}%` }}></div>
        </div>
        <div className='questionfin'>
  {questions[currentQuestionIndex]?.question}
  
</div>
        <div className='answersvar'>
        {questions[currentQuestionIndex]?.options.map((option, index) => (
        <button key={index} onClick={() => handleOptionClick(option)} disabled={incorrectAnswers.includes(option) || correctAnswers.includes(option)} className={incorrectAnswers.includes(option) ? 'incorrect' : correctAnswers.includes(option) ? 'correct' : ''}>
          {incorrectAnswers.includes(option) ? `X ${option}` : correctAnswers.includes(option) ? `✓ ${option}` : option}
        </button>
      ))}
        </div>
        <div className='buttoncontin'>
        {showContinueButton && 
          <button onClick={handleContinueClick}>
            {currentQuestionIndex === questions.length - 1 ? 'Завершить тест' : 'Продолжить ->'}
          </button>
        } 
        </div>
        </div>
        
        </div>
     )}
     
     <Navpanmini />
  
    </>
    )
}
export default Finaltest; 
