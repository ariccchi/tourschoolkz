import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import './sumresult.css';

function SumResult() {
  const { title } = useParams();
  const titleWithSpaces = title.replace(/-/g, ' '); 
  const token = localStorage.getItem('token');
  let decoded = jwtDecode(token);
  let user_id = decoded.sub;

  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    const checkResultAndShowVideo = async () => {
      try {
        const checkResultResponse = await axios.post('http://localhost:8888/tourschoolphp/resultpage.php', {
          user_id: user_id,
          title: titleWithSpaces,
        });
  
        const responseData = checkResultResponse.data || [];
        console.log('Received data:', responseData);
  
        setResultData(responseData);
      } catch (error) {
        console.error('Error checking result and showing video:', error);
      }
    };
  
    checkResultAndShowVideo();
  }, [user_id, titleWithSpaces]);

  // Вычисление среднего процента
  const calculateAveragePercentage = () => {
    if (!Array.isArray(resultData) || resultData.length === 0) {
      return 0;
    }
  
    const totalPercentage = resultData.reduce((sum, result) => {
      const resultValue = parseInt(result.result);
      return isNaN(resultValue) ? sum : sum + resultValue;
    }, 0);
  
    const average = totalPercentage / resultData.length;
  
    return average.toFixed(2);
  };
  
  
  const averagePercentage = calculateAveragePercentage();
  
  return (
    <div className='fullpage2'>
   {(!Array.isArray(resultData) || resultData.length === 0 || resultData.error) ? (
  <div className='no-results-message'>Вы не прошли ни одного урока</div>
) : (
  <>  
          <div className='ResultsFull'>
            {resultData.map((result) => (
              <div key={result.id} className='lessonblock2'>
                <div className='LessonTitle2'>{result.title}</div>
                <div className='lessonfinres'>{result.result}%</div>
              </div>
            ))}
          </div>
          <div className="roundsummary2">
            <div className="roundprocent2">{averagePercentage}%</div>
            <div className="roundprocenth2">Ваш средний процент </div>
          </div>
     </>
      )}
    </div>
  );
}

export default SumResult;
