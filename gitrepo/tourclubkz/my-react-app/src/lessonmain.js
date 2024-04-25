import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Navpanmini from './navpanmini';
import './lessonmain.css';
import { BASE_URL } from './config';
import { useNavigate } from "react-router-dom"; // Импортируйте useNavigate
import YouTube from 'react-youtube';
const LessonListPage = () => {
  const navigate = useNavigate(); // Используйте useNavigate
  const [autoSelectedNav, setAutoSelectedNav] = useState(null);
  const [isManualNav, setIsManualNav] = useState(false);
const { title, lesson } = useParams();
const titleWithSpaces = lesson.replace(/-/g, ' ');
const courseWithSpaces = title.replace(/-/g, ' ');
const [responseData, setResponseData] = useState(null);
const [loading, setLoading] = useState(true);
const [videoEnding, setVideoEnding] = useState(false);
const [secondsBeforeEndToShowButton, setSecondsBeforeEndToShowButton] = useState(30);
const [videoEnded, setVideoEnded] = useState(false);
const [allTestsPassed, setAllTestsPassed] = useState(false);
const [intervalId, setIntervalId] = useState(null);

const [containers, setContainers] = useState([]);
const videoRef = useRef(null);
const [selectedNav, setSelectedNav] = useState('Информация');
const [isNavChangedManually, setIsNavChangedManually] = useState(false);
const [currentContainerIndex, setCurrentContainerIndex] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 4; // Change this to the number of items you want per page
const [successfulTries, setSuccessfulTries] = useState({});
const [unsuccessfulTries, setUnsuccessfulTries] = useState({});
const [lastContainerIndex, setLastContainerIndex] = useState(null);
const [lastUpdatedNav, setLastUpdatedNav] = useState(null); // Add this state
 // Calculate the total number of pages
 const totalPages = Math.ceil(containers.length / itemsPerPage);
 const [shouldAutoSelectNav, setShouldAutoSelectNav] = useState(true);
 const [hasIncreased, setHasIncreased] = useState(false);
 const currentItems = containers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
 const [questionTries, setQuestionTries] = useState({});
// Добавьте новое состояние
const [wasNavChangedManually, setWasNavChangedManually] = useState(false);
const [autoSelectedContainers, setAutoSelectedContainers] = useState({})
const [buttonClass, setButtonClass] = useState({});
const token = localStorage.getItem('token');
console.log = () => {};

let decoded = jwtDecode(token);

let user_id = decoded.sub;
const date = new Date(); // текущая дата и время
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль, если месяц меньше 10
const day = String(date.getDate()).padStart(2, '0'); // добавляем ведущий ноль, если день меньше 10
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');
const [duration, setDuration] = useState(0);
const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// ВОПРОСЫ
const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
const [questions, setQuestions] = useState([]);
const [incorrectMessages, setIncorrectMessages] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tries, setTries] = useState(0);
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const [currentTime, setCurrentTime] = useState(0);

//ТЕРМИНЫ
const [termins, setTermins] = useState([]);

const [answerCorrectness, setAnswerCorrectness] = useState({});
//Doplinks
const [doplinks, setDoplinks] = useState([]);

const openModal = (imageURL) => {
  setSelectedImage(imageURL);
  setModalOpen(true);
};

const closeModal = () => {
  setSelectedImage('');
  setModalOpen(false);
};


const onStateChange = (event) => {
  
  if(videoRef.current) {
  if (event.data === YouTube.PlayerState.PLAYING) {
    const id = setInterval(() => {
      videoRef.current.internalPlayer.getCurrentTime().then((time) => {
        console.log(`Время воспроизведения: ${Math.floor(time)} секунд`);
        // handleTimeUpdate(time);
      });
    }, 1000);
    setIntervalId(id);
  } else {
    clearInterval(intervalId);
  }

  const interval = setInterval(() => {
    if (videoRef.current && videoRef.current.internalPlayer.getCurrentTime) {
      // handleTimeUpdate(currentTime);
    }
  }, 1000); // Проверка каждую секунду

  return () => {
    clearInterval(interval);
  };
}
};
useEffect(() => {
  handleTimeUpdate(currentTime); // someValue - это нужное вам значение, которое передается в handleTimeUpdate
}, [currentPage, currentTime]);
useEffect(() => {
  const checkResultAndShowVideo = async () => {
    console.log(user_id);

    try {
      const checkResultResponse = await fetch(`${BASE_URL}tourschoolphp/Checkresulttoshowvideo.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          title: titleWithSpaces,
          course: courseWithSpaces,
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
}, [user_id, titleWithSpaces, courseWithSpaces]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}tourschoolphp/testlesson.php`, {
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

      // Check if data is an array before mapping over it
      if (Array.isArray(data)) {
        // Преобразовать данные в ожидаемый формат и перемешать варианты ответов
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
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  fetchData();
}, [titleWithSpaces]);


 
  


  
// Измените handleNavClick, чтобы устанавливать wasNavChangedManually в true
const handleNavClick = (navType) => {
  setIsNavChangedManually(true);
  setWasNavChangedManually(true);
  setSelectedNav(navType);
};
useEffect(() => {
  console.log(`Current Page: ${currentPage}, Selected Nav: ${selectedNav}`);
  console.log(videoRef.current);
 
}, [currentPage, selectedNav]);

// Измените handleTimeUpdate, чтобы проверять wasNavChangedManually, а не isNavChangedManually
const handleTimeUpdate = (aaa, curcur) => {
 

    const timeToEnd = duration - aaa;

    // Показать кнопку за N секунд до окончания видео
    if (timeToEnd <= secondsBeforeEndToShowButton && !videoEnding) {
      setVideoEnding(true);
    }
    setQuestions((questions) => {
      let newSelectedNav = selectedNav;
      let newcurrentQuestionIndex = currentQuestionIndex;
  
      const updatedQuestions = questions.map((question, index) => {
        if (!question.isShuffled) {
          question.options = shuffleArray(question.options);
          question.isShuffled = true;
        }
        if (question.isVisible) {
          setSelectedNav(question.type);
          videoRef.current.internalPlayer.pauseVideo();
        
        }
  
    
        const timeIn = timeToSeconds(question.time_in);
        const isVisible = aaa >= timeIn;
  
       
  if (isVisible && !question.isVisible)  {
          // Check if the question type is already auto-selected
          if (!autoSelectedContainers[question.id]) {
            newSelectedNav = question.type;
            // Update autoSelectedContainers
            setAutoSelectedContainers((autoSelectedContainers) => ({
              ...autoSelectedContainers,
              [question.id]: true,
            }));
          }
          newcurrentQuestionIndex = index;
        }
        if (newSelectedNav !== selectedNav) {
          setSelectedNav(newSelectedNav);
        }
        return { ...question, isVisible };
      });
    
      return updatedQuestions;
    })
    setContainers((containers) => {
      let newSelectedNav = selectedNav;
      let newCurrentContainerIndex = currentContainerIndex;
  
      const updatedContainers = containers.map((container, index) => {
      
        const timeIn = timeToSeconds(container.time_in);
        const isVisible = aaa >= timeIn;
  
        if (isVisible && !container.isVisible) {
          if (index !== newCurrentContainerIndex) {
            // Проверьте, был ли контейнер уже автоматически выбран
            if (!autoSelectedContainers[container.id]) {
              newSelectedNav = container.type;
              // Обновите autoSelectedContainers
              setAutoSelectedContainers((autoSelectedContainers) => ({
                ...autoSelectedContainers,
                [container.id]: true,
              }));
            }
            newCurrentContainerIndex = index;
          }
        }
       
        return { ...container, isVisible };
  
        
      });
  
      if (newSelectedNav !== selectedNav) {
        setSelectedNav(newSelectedNav);
      }
    
      setCurrentContainerIndex(newCurrentContainerIndex);
      if (newCurrentContainerIndex !== lastContainerIndex) {
        setCurrentContainerIndex(newCurrentContainerIndex);
        setLastContainerIndex(newCurrentContainerIndex);
      }
      
      if (newCurrentContainerIndex + 1 > currentPage * itemsPerPage) {
        setCurrentPage((prevPage) => prevPage + 0.5);
      }
      
      if (videoRef.current) {
        console.log(newCurrentContainerIndex, 'time', aaa, "item", itemsPerPage, "currentPage", currentPage);
      }
  
      setLastContainerIndex(newCurrentContainerIndex);
  
      return updatedContainers;
    });
  setTermins((termins) => {
    let newSelectedNav = selectedNav;
    let newCurrentContainerIndex = currentContainerIndex;

    const updatedContainers = termins.map((termin, index) => {
    
      const timeIn = timeToSeconds(termin.time_in);
      const isVisible = currentTime >= timeIn;

      if (isVisible && !termin.isVisible) {
        if (index !== newCurrentContainerIndex) {
          // Проверьте, был ли контейнер уже автоматически выбран
          if (!autoSelectedContainers[termin.id]) {
            newSelectedNav = termin.type;
            // Обновите autoSelectedContainers
            setAutoSelectedContainers((autoSelectedContainers) => ({
              ...autoSelectedContainers,
              [termin.id]: true,
            }));
          }
          newCurrentContainerIndex = index;
        }
      }
   
     
      return { ...termin, isVisible };

      
    });

    if (newSelectedNav !== selectedNav) {
      setSelectedNav(newSelectedNav);
    }
  
    setCurrentContainerIndex(newCurrentContainerIndex);
    if (newCurrentContainerIndex !== lastContainerIndex) {
      setCurrentContainerIndex(newCurrentContainerIndex);
      setLastContainerIndex(newCurrentContainerIndex);
    }
    
    if (newCurrentContainerIndex + 1 > currentPage * itemsPerPage) {
      setCurrentPage((currentPage) => currentPage + 0.5);
    }
    

    setLastContainerIndex(newCurrentContainerIndex);

    return updatedContainers;
  });

};

const handleVideoEnd = () => {
  setVideoEnded(true);
  setVideoEnding(false); // Сбросить состояние, чтобы не показывать кнопку после окончания видео
};

// Измените useEffect, чтобы сбрасывать wasNavChangedManually обратно в false, когда видео достигает конца
useEffect(() => {
  if (videoRef.current) {
    const currentTimePromise = videoRef.current.internalPlayer.getCurrentTime();

    currentTimePromise.then((currentTime) => {
      if (videoRef.current && currentTime >= duration) {
        setWasNavChangedManually(false);
      }
    })
  }
}, [videoRef.current]);

useEffect(() => {

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}tourschoolphp/lessonvideo.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson: titleWithSpaces, course: courseWithSpaces }),
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

    try {
      const response = await fetch(`${BASE_URL}tourschoolphp/containersmodel.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson: titleWithSpaces }),
      });
  
        if (!response.ok) {
          throw new Error('Ошибка при запросе данных');
        }

        const responseBody = await response.text();
        const data = JSON.parse(responseBody);
        setContainers(data.map((container) => ({ ...container, key: container.id })));
      } catch (error) {
        // console.error('Ошибка при отправке запроса:', error);
      }

      try {
        const response = await fetch(`${BASE_URL}tourschoolphp/termins.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson: titleWithSpaces }),
      });
  
        if (!response.ok) {
          throw new Error('Ошибка при запросе данных');
        }

        const responseBody = await response.text();
        const data = JSON.parse(responseBody);
        setTermins(data.map((termin) => ({ ...termin, key: termin.id })));
      } catch (error) {
        
      }

      try {
        const response = await fetch(`${BASE_URL}tourschoolphp/doplink.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson: titleWithSpaces }),
      });
  
        if (!response.ok) {
          throw new Error('Ошибка при запросе данных');
        }

        const responseBody = await response.text();
        const data = JSON.parse(responseBody);
        if (Array.isArray(data)) {
          setDoplinks(data.map((doplink) => ({ ...doplink, key: doplink.id })));
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }

    };
    fetchData();

    // function onPlayerReady(event) {
    //   const intervalId = setInterval(updateTime, 1000); // обновляйте время каждую секунду
  
    //   // Очистите интервал при размонтировании
    //   return () => {
    //     clearInterval(intervalId);
    //   };
    // }
  
    // // Обновите время воспроизведения
    // function updateTime() {
    //   const currentTime = videoRef.getCurrentTime();
    //   handleTimeUpdate(currentTime); // здесь ваша функция handleTimeUpdate
    // }
  
  

    }, [titleWithSpaces]);
  

    
  const timeToSeconds = (time) => {
    let parts = time.split(':');
    return (+parts[0]) * 60 * 60 + (+parts[1]) * 60 + (+parts[2]);
  }

  
  const handleOptionClick = (option, questionId, index) => {
    const currentQuestion = questions.find((q) => q.id === questionId);
    const isAnswerCorrect = option === currentQuestion.correct_answer;
    setAnswerCorrectness(prevState => ({
      ...prevState,
      [`${questionId}-${index}`]: isAnswerCorrect,
  }));
  setButtonClass(prevButtonClass => ({
      ...prevButtonClass,
      [`${questionId}-${index}`]: isAnswerCorrect ? 'buttonindex-correct' : 'buttonindex-incorrect',
  }));

    // Update the class name for the clicked button based on the correctness of the answer
    const updatedOptions = [...questions[currentQuestionIndex].options];
  
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        options: updatedOptions,
      };
      return updatedQuestions;
    });
  
    // Rest of your code remains unchanged
    setQuestionTries((prevTries) => {
      const currentTries = prevTries[questionId] || { total: 0, lastAttempt: 0 };
  
      const updatedTries = {
        ...prevTries,
        [questionId]: {
          total: currentTries.total + 1,
          lastAttempt: isAnswerCorrect ? currentTries.lastAttempt + 1 : currentTries.lastAttempt,
        },
      };
  
      if (!isAnswerCorrect && currentTries.total >= 2) {
        setIncorrectMessages((prevMessages) => ({
          ...prevMessages,
          [questionId]: `Неправильный ответ. Правильный ответ: ${currentQuestion.correct_answer}`,
        }));
  
        // Do not reset the total count here
        updatedTries[questionId] = { total: currentTries.total, lastAttempt: 0 };
      } else {
        setIncorrectMessages((prevMessages) => ({
          ...prevMessages,
          [questionId]: isAnswerCorrect ? '' : 'Неправильный ответ. Попробуйте еще раз',
        }));
  
        if (isAnswerCorrect) {
          setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== currentQuestion.id));
          setCurrentQuestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex < questions.length ? nextIndex : 0;
          });
          videoRef.current.internalPlayer.playVideo();
  
          // Send data to the server only for correct answers
          fetch(`${BASE_URL}tourschoolphp/testresult.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user_id,
              testid: currentQuestion.id,
              tries: updatedTries[questionId]?.total || 0,
              timestamp: formattedTimestamp,
            }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Ошибка при сохранении ответа на сервере');
              }
              return response.text();
            })
            .then(data => {
              console.log('Server response:', data);
              return JSON.parse(data);
            })
            .catch(error => {
              console.error('Ошибка при отправке запроса:', error);
            });
        }
      }
  
      return updatedTries;
    });
  
  
    if (isAnswerCorrect) {
      setSuccessfulTries((prev) => ({ ...prev, [questionId]: (prev[questionId] || 0) + 1 }));
    } else {
      setUnsuccessfulTries((prev) => ({ ...prev, [questionId]: (prev[questionId] || 0) + 1 }));
    };

    if (questions.length === 1) {
      // If there are no more questions, set allTestsPassed to true
      setAllTestsPassed(true);
    }
  };

  useEffect(() => {
    let maxTimeOut = 0;
    let newSelectedNav = selectedNav; // Keep track of the selected navigation
    if(videoRef.current) {
    const currentTimePromise = videoRef.current.internalPlayer.getCurrentTime();

  currentTimePromise.then((currentTime) => {
    containers.forEach((container) => {
      let timeIn = timeToSeconds(container.time_in);
      let isVisible = videoRef.current && currentTime >= timeIn && currentTime;
  
   
    });
  
    if (videoRef.current && currentTime > maxTimeOut) {
      setIsNavChangedManually(false);
      setShouldAutoSelectNav(true); // Set shouldAutoSelectNav to true here
    }
  })
}
  }, [containers, videoRef.current, isNavChangedManually]);
  const videoOptions = {
    height: '500px',      // Высота плеера
    width: '100%',       // Ширина плеера
    playerVars: {       // Параметры плеера
      autoplay: 1,      // Автовоспроизведение видео
      controls: 1,      // Отображение элементов управления
      showinfo: 0,      // Отображение информации о видео
      modestbranding: 0 // Удаление логотипа YouTube
    }
  };


  useEffect(() => {
    let maxTimeOut = 0;
    let newSelectedNav = selectedNav; // Keep track of the selected navigation
    if(videoRef.current) {
    const currentTimePromise = videoRef.current.internalPlayer.getCurrentTime();

  currentTimePromise.then((currentTime) => {
    termins.forEach((
      termin) => {
      let timeIn = timeToSeconds(termin.time_in);
      let isVisible = videoRef.current && currentTime >= timeIn && currentTime;
  
   
    });
  
    if (videoRef.current && currentTime > maxTimeOut) {
      setIsNavChangedManually(false);
      setShouldAutoSelectNav(true); // Set shouldAutoSelectNav to true here
    }
  })
}
  }, [termins, videoRef.current, isNavChangedManually]);

  
  
  useEffect(() => {
  
    let maxTimeOut = 0;
    let newSelectedNav = selectedNav; // Keep track of the selected navigation
    if(videoRef.current) {
    const currentTimePromise = videoRef.current.internalPlayer.getCurrentTime();

  currentTimePromise.then((currentTime) => {
    questions.forEach((
      question) => {
      let timeIn = timeToSeconds(question.time_in);
      let isVisible = videoRef.current && currentTime >= timeIn && currentTime;
  
   
    });
  
    if (videoRef.current && currentTime > maxTimeOut) {
      setIsNavChangedManually(false);
      setShouldAutoSelectNav(true); // Set shouldAutoSelectNav to true here
    }
  })
}
  }, [questions, videoRef.current, isNavChangedManually]);
  
  const handleFinishLesson = () => {
    fetch(`${BASE_URL}tourschoolphp/finishlesson.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user_id,
        lesson: titleWithSpaces,
        date: formattedTimestamp,
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при сохранении ответа на сервере');
      }
      return response.text();
    })
    .then(data => {
      console.log('Server response:', data);
      return JSON.parse(data);
    })
    .catch(error => {
      console.error('Ошибка при отправке запроса:', error);
    });
}

useEffect(() => {
  const fetchCurrentTime = async () => {
    if (videoRef.current && videoRef.current.internalPlayer && videoRef.current.internalPlayer.getCurrentTime) {
      const time = await videoRef.current.internalPlayer.getCurrentTime();
      setCurrentTime(time);
    }

    if (videoRef.current && videoRef.current.internalPlayer && videoRef.current.internalPlayer.getDuration) {
      const duration = await videoRef.current.internalPlayer.getDuration();
      setDuration(duration);
    }
  };

  fetchCurrentTime();
  const intervalId = setInterval(fetchCurrentTime, 1000); // Update every second

  return () => clearInterval(intervalId); // Clean up on unmount
}, []);

if (loading) {
  return <div>Загрузка...</div>;
} 

  return (
    <div className='connews'>
        <div className='containerlesson'>
      <h1>{titleWithSpaces}</h1>
      <div className='containervideoimg'>
        
      
      {videoRef && responseData && (
        <div className='videoless'>
  <YouTube

    videoId={responseData}
    opts={videoOptions}
    onStateChange={onStateChange}
    ref={videoRef}
  />
  </div>
)}
                                                                                                                                                                                                              
      {/* <img className='imageless' src="/egypt.png"></img> */}
      </div>
      <div className='containerwithinfo'>
        <div className='linewithtypes'>
        <div className={`textnav ${selectedNav === 'Термины' || (!isManualNav === 'Термины') ? 'active' : ''}`} onClick={() => handleNavClick('Термины')}>Термины</div>
        <div className={`textnav ${selectedNav === 'Тест' || (!isManualNav === 'Тест') ? 'active' : ''}`} onClick={() => handleNavClick('Тест')}>Тест</div>
            <div className={`textnav ${selectedNav === 'Информация' || (!isManualNav  === 'Информация') ? 'active' : ''}`} onClick={() => handleNavClick('Информация')}>Информация</div>
            <div className={`textnav ${selectedNav === 'Дополнительная информация' ? 'active' : ''}`} onClick={() => handleNavClick('Дополнительная информация')}>Ссылки</div>
        </div>
        {allTestsPassed && videoEnding && (
        <a href={`/courses/${title}/${lesson}/summary-page`}>
<button 
  className='urokend'
  onClick={handleFinishLesson}
>
  Завершить урок
</button>
</a>


)}
        {questions.map((question) => {
          if (videoRef.current) {
            let timeIn = timeToSeconds(question.time_in);
            let isVisible = videoRef.current && currentTime >= timeIn;
          
        
  // Only render the question if it's both visible and its type matches the selected nav

  if (isVisible && (selectedNav === question.type || (!isManualNav === question.type))) {
    
    return (

    <React.Fragment key={question.id}>
        <div className='testinfo' style={{ display: 'flex', margin: '5px 0' }}>
         
          <h2>{question.question}</h2>
          <div className='buttoncontless'>
          {question.options.map((option, index) => (
    <button
    className={buttonClass[`${question.id}-${index}`] || "buttonindex"}
    key={index}
    onClick={() => handleOptionClick(option, question.id, index)}
>
    {option}
</button>

            ))}

        </div>
        </div>
        <br />
      </React.Fragment>
    );
  }

  return null;

}
})}

  
    
{currentItems.map((container) => {
  let timeIn = timeToSeconds(container.time_in);
  let isVisible = videoRef.current && currentTime >= timeIn;

  if (isVisible && (selectedNav === container.type || (!isManualNav === container.type))) {
    if (isNavChangedManually && selectedNav !== container.type) {
      return null;
    }

    // Проверка, является ли текст ссылкой на изображение
    const imageFormats = ['.jpg', '.png', '.jpeg', '.gif', '.bmp', '.svg', '.webp'];
    const isImage = imageFormats.some(format => container.text.includes(format));

    return (
      <>
        <React.Fragment key={container.id}>
          <div
            className='textinfo'
            style={{
              display: 'block',
              margin: '10px 0', // Add top and bottom margin of 10 pixels
            }}
          >
            {isImage ? (
          <img
          src={`${BASE_URL}tourschoolphp/${container.text}`}
          alt="123123"
          width="400"
          onClick={() => openModal(`${BASE_URL}tourschoolphp/${container.text}`)}
        />

            ) : (
              container.text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))
            )}
          </div>
        </React.Fragment>
      </>
    );
  }
  return null;
})}


  {termins.map((termin) => {
      let timeIn = timeToSeconds(termin.time_in);
      let isVisible = videoRef.current && currentTime >= timeIn;

  if (isVisible && (selectedNav === termin.type || (!isManualNav === termin.type))) {
    // Если пользователь вручную переключился на другой блок, не обновляйте блок автоматически
    if (isNavChangedManually && selectedNav !== termin.type) {
      return null;
    }

    return (
      <React.Fragment key={termin.id}>
        <div
          className='textinfo'
          style={{
            display: 'block',
            margin: '5px 0', // Add top and bottom margin of 10 pixels
          }}
        >
      
          {termin.text}
        </div>
        <br />
      </React.Fragment>
      
    );
  }
  return null;
})
}
{}
{selectedNav === 'Дополнительная информация' &&
doplinks.map((doplink) => {
 // Если selectedNav - это переменная, которая должна быть обновлена, необходимо использовать '=' вместо ';'
  return (
    <div key={doplink.id}>
      <div
        className='textinfo'
        style={{
          display: 'block',
          margin: '5px 0', // Add top and bottom margin of 10 pixels
        }}
      >
        <a href={doplink.text}>{doplink.text}</a>  
      </div>
    </div>
  );
})}

{modalOpen && (
          <div className="modal7">
            <span className="close7" onClick={closeModal}>&times;</span>
            <img className="modal-content7" src={selectedImage} alt="Enlarged Image" />
          </div>
        )}

<Navpanmini/>
</div>
</div>
</div>
);
}

export default LessonListPage; 