import React, { useState, useEffect, useRef } from 'react';
import Navpanmini from './navpanmini';
import { useParams, useNavigate, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import './addlesson.css';
import axios from 'axios';
import { BASE_URL } from './config';
const AddLesson = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonType, setLessonType] = useState('text'); // Default to text lesson
  const { course } = useParams();
  const titleWithSpaces = course.replace(/-/g, ' ');
  const [videoLink, setVideoLink] = useState('');
  const [videoSaved, setVideoSaved] = useState(false);
  const videoRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate(); // Используйте useNavigate
  const [videoId, setVideoId] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lessonTitle, setLessonTitle] = useState(""); 
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [terminsModalVisible, setTerminsModalVisible] = useState(false);
  const [infoType, setInfoType] = useState('text'); // Default to text
  const [selectedOption, setSelectedOption] = useState('text');
  const [infoText, setInfoText] = useState('');
  const [infoArray, setInfoArray] = useState([]); // New state for storing information array
  const [terminArray, setTerminArray] = useState([]); // New state for storing information array
  const [terminText, setTerminText] = useState('');
  const [error, setError] = useState(null);

  const [testModalVisible, setTestModalVisible] = useState(false);

  const [finTestModalVisible, setFinTestModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [testArray, setTestArray] = useState([]); // New state for storing information array
  const [testText, setTestText] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState(['', '', '']);
  const [infoImage, setInfoImage] = useState(null);
  const [linkArray, setLinkArray] = useState([]); // New state for storing information array
  const [linkText, setLinkText] = useState('');
  const [step, setStep] = useState(1);
  const [errorVideo, setErrorVideo] = useState('');
  const [errorNext, setErrorNext] = useState('');
  const [finQuestion, setFinQuestion] = useState('');
  const [finCorrectAnswer, setFinCorrectAnswer] = useState('');
  const [finWrongAnswers, setFinWrongAnswers] = useState(['', '', '']);
  const [finTestArray, setFinTestArray] = useState([]); 
  const [errorFin, setErrorFin] = useState('');
  const [photoArray, setPhotoArray] = useState([]); // New state for photos
  const [picArray, setPicArray] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [file, setFile] = useState(null);
  const openInfoModal = () => {
    setInfoModalVisible(true);
    if (videoRef.current) {
      videoRef.current.internalPlayer.pauseVideo();
    }
  };
  const openModal = () => {
    setSelectedCourse(course);
  };
  const closeTerminModal = () => {
    setTerminsModalVisible(false);
    setError(null)
  };

  const openTerminModal = () => {
    setTerminsModalVisible(true);
    if (videoRef.current) {
      videoRef.current.internalPlayer.pauseVideo();
    }
  };

  const closeLinkModal = () => {
    setLinkModalVisible(false);
    setError(null)
  };

  const openLinkModal = () => {
    setLinkModalVisible(true);
    if (videoRef.current) {
      videoRef.current.internalPlayer.pauseVideo();
    }
  };
  const closeInfoModal = () => {
    setInfoModalVisible(false);
    setError(null)
  };


  const openTestModal = () => {
    setTestModalVisible(true);
    if (videoRef.current) {
      videoRef.current.internalPlayer.pauseVideo();
    }
  };

  const openFinTestModal = () => {
    setFinTestModalVisible(true);
    };
    const closeFinTestModal = () => {
      setFinTestModalVisible(false);
      
    };
  

  const closeTestModal = () => {
    setTestModalVisible(false);
    setError(null)
  };


  const onStateChange = (event) => {
    if (videoRef.current) {
      if (event.data === YouTube.PlayerState.PLAYING) {
        const id = setInterval(() => {
          if (videoRef.current && videoRef.current.internalPlayer && videoRef.current.internalPlayer.getCurrentTime) {
            videoRef.current.internalPlayer.getCurrentTime().then((time) => {
         
              picArray.forEach((item, index) => {
              
          
              });
              
              setCurrentTime(time);
            });
          }
        }, 1000);
        setIntervalId(id);
      } else {
        clearInterval(intervalId);
      }
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (isValidFileType(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert('Invalid file type. Please select a text-based file.');
    }
  };
  const isValidFileType = (file) => {
    const textFileExtensions = ['txt', 'doc', 'docx', 'pdf', 'rtf', 'odt']; // Add more if needed
    const fileNameParts = file.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    return textFileExtensions.includes(fileExtension);
  };
  const handleSaveFile = () => {
    if (file) {
      // You can perform any actions with the 'file' here
      // For example, you might want to save it in the component state
  
      closeModal()
    } else {
      alert('Please select a valid text-based file before saving.');
    }


  };

useEffect(() => {
  const interval = setInterval(() => {
    if (videoRef.current && videoRef.current.internalPlayer && videoRef.current.internalPlayer.getCurrentTime) {
      // handleTimeUpdate(currentTime);
    }
  }, 1000); // Проверка каждую секунду

  return () => {
    clearInterval(interval);
  };
}, [videoRef.current]); // Добавлен videoRef.current в зависимости useEffect
  // Function to close the modal
  const closeModal = () => {
    setSelectedCourse(null);
  };
  const extractVideoId = (url) => {
    // Предполагаем, что url имеет формат https://www.youtube.com/watch?v=ALdF0V9Z_os
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/|\/v\/|\/\d{1,2}\/|\/(?=p\/))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  const handleSave = () => {
    const extractedVideoId = extractVideoId(videoLink);
    
    if (extractedVideoId) {
   
      setVideoSaved(true);
      setVideoId(extractedVideoId)
      setErrorVideo("")
    } else {
      console.error('Неверный формат ссылки на видео');
      setErrorVideo('Неверный формат ссылки на видео');
    }
    
    closeModal();
  };
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];

      if (imgFile.size > 5000000) {
        alert('Размер файла не должен превышать 5 МБ');
      } else if (
        imgFile.type === 'image/jpeg' ||
        imgFile.type === 'image/jpg' ||
        imgFile.type === 'image/png'
      ) {
        setCurrentImage(imgFile);
        setPhotoArray((prevArray) => [...prevArray, imgFile]); // Сразу добавляем в массив
      } else {
        alert('Пожалуйста, загрузите файл в формате jpg или jpeg');
      }
    }
  };

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
  }, [videoRef.current]);
  const handleSaveInfo = () => {
    const newInfoItem = {
      time: Math.floor(currentTime),
      text: infoText,
   
    };
    const isTimeExistsInInfo = terminArray.some(item => item.time === newInfoItem.time);
    
    const isTimeExistsInTest = testArray.some(item => item.time === newInfoItem.time);

    if (!isTimeExistsInInfo && !isTimeExistsInTest) {
      setInfoArray(prevArray => {
        const newArray = [...prevArray, newInfoItem];
        return newArray;
      });
      setInfoText('');

      closeInfoModal();
    } else {
      setError('Блок с таким временем уже существует');
    }
  };
  const handleSavePic = () => {
    if (currentImage) {
      const newInfoItem = {
        time: Math.floor(currentTime),
        photos: [currentImage], // Добавляем текущее изображение в photoArray
      };
      const isTimeExistsInTermins = terminArray.some(item => item.time === newInfoItem.time);
      
      const isTimeExistsInTest = testArray.some(item => item.time === newInfoItem.time);
      const isTimeExistsInInfo = infoArray.some(item => item.time === newInfoItem.time);
      if (!isTimeExistsInInfo && !isTimeExistsInTermins && !isTimeExistsInTest) {
        setPicArray((prevArray) => [...prevArray, newInfoItem]);
  
        // Очистка photoArray и сброс текущей картинки
        setPhotoArray([]);
        setCurrentImage(null);
    
        closeInfoModal();
        } else {
        setError('Блок с таким временем уже существует');
    }
    
    }
  };
  

  const handleNextStep = () => {
    if(lessonType === 'video') {
      if (videoId === 0) {
        setErrorNext('Добавьте видео');
      } else if (testArray.length === 0) {
        setErrorNext('Добавьте хотя бы один тест');
      } else if (lessonTitle.length === 0) {
        setErrorNext('Введите название урока');
      } else {
        // Все условия выполнены, можно переходить на следующий шаг
        setErrorNext('');
        setStep(step + 1);
      }
    }
    if(lessonType === 'text') {
      if (file === null) {
        setErrorNext('Добавьте файл');
      } else if (lessonTitle.length === 0) {
        setErrorNext('Введите название урока');
      } else {
        // Все условия выполнены, можно переходить на следующий шаг
        setErrorNext('');
        setStep(step + 1);
      }
    }
  };
  

  const handleSaveTermins = () => {
    const newTerminItem = {
      time: Math.floor(currentTime),
      text: terminText,
    };
  
    // Проверка, существует ли уже элемент с таким же временем в infoArray
    const isTimeExistsInInfo = infoArray.some(item => item.time === newTerminItem.time);
    const isTimeExistsInTest = testArray.some(item => item.time === newTerminItem.time);
    const isTimeExistsInPic = picArray.some(item => item.time === newTerminItem.time);
    if (!isTimeExistsInInfo && !isTimeExistsInTest && !isTimeExistsInPic) {
      // Используйте функцию обратного вызова для вывода информации о массиве после обновления состояния
      setTerminArray(prevArray => {
        const newArray = [...prevArray, newTerminItem];
  
        return newArray;
      });
  
      // Очистка значения текстареи после сохранения
      setTerminText('');
      closeTerminModal();
    } else {
      setError('Термин с таким временем уже существует в информационном блоке');
  }

    // Закрытие модального окна

  };
  const handleSaveLink = () => {
    const newLinkItem = {
      text: linkText,
    };
  
    // Проверка, существует ли уже элемент с таким же временем в infoArray
 
      // Используйте функцию обратного вызова для вывода информации о массиве после обновления состояния
      setLinkArray(prevArray => {
        const newArray = [...prevArray, newLinkItem];
  
        return newArray;
      })
  
      // Очистка значения текстареи после сохранения
      setLinkText('');
      closeLinkModal();
  

    // Закрытие модального окна

  };

  const handleSendSaveClick = async () => {
    if(lessonType === 'video') {
      if(finTestArray <= 3) {
        setErrorFin('Добавьте минимум 3 вопроса для теста в конце урока')
      }else {
  
      
  
      const formData = new FormData();
      formData.append('video', videoId);
      formData.append('terminarray', JSON.stringify(terminArray));
      formData.append('infoarray', JSON.stringify(infoArray));
      formData.append('testarray', JSON.stringify(testArray));
      formData.append('link', JSON.stringify(linkArray));
      formData.append('finarray', JSON.stringify(finTestArray));
      formData.append('name', lessonTitle);
      formData.append('course', titleWithSpaces);
      formData.append('lessontype', lessonType);
  
      
      picArray.forEach((item, index) => {
        formData.append(`image_${index}`, item.photos[0]);
        formData.append(`time_${index}`, item.time); // Append time values
        
      });
      
      
      try {
        const response = await axios.post(
          `${BASE_URL}tourschoolphp/addLessonphp.php`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
    
        navigate(`/courses/${course}`);
  
      } catch (error) {
        console.error('Error sending message:', error);
      }
    
      // setShowUserModal(false);
    }
    }else {
      if(finTestArray <= 3) {
        setErrorFin('Добавьте минимум 3 вопроса для теста в конце урока')
      }else {
  
      const formData = new FormData();
      formData.append('finarray', JSON.stringify(finTestArray));
      formData.append('name', lessonTitle);
      formData.append('course', titleWithSpaces);
      formData.append('lessontype', lessonType);
      formData.append('file', file);

      try {
        const response = await axios.post(
          `${BASE_URL}tourschoolphp/addLessonTextphp.php`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
    
        navigate(`/courses/${course}`);
  
      } catch (error) {
        console.error('Error sending message:', error);
      }
    
      // setShowUserModal(false);
    }
    }
   
  };
  
  

  const handleSaveTest = () => {
    if (!question || !correctAnswer || wrongAnswers.some(answer => !answer)) {
      setError('Пожалуйста, заполните все текстовые поля');
      return;
    }
    const newTestItem = {
      time: Math.floor(currentTime),
      question: question,
      correctAnswer: correctAnswer,
      incorrect1: wrongAnswers[0],
      incorrect2: wrongAnswers[1],
      incorrect3: wrongAnswers[2],
    };
    const isTimeExistsInInfo = infoArray.some(item => item.time === newTestItem.time);
    const isTimeExistsInPic = picArray.some(item => item.time === newTestItem.time);
    const isTimeExistsInTermins = terminArray.some(item => item.time === newTestItem.time);
    if (!isTimeExistsInInfo && !isTimeExistsInTermins && !isTimeExistsInPic) {
      setTestArray(prevArray => {
        const newArray = [...prevArray, newTestItem];
        return newArray;
      });
  
  
      // Очистка значения текстареи после сохранения
      setQuestion('');
      setCorrectAnswer('');
      setWrongAnswers(['', '', '']);
      closeTestModal();
      setError(null)
    } else {
      setError('Блок с таким временем уже существует');
  }

   
  };
  const handleSaveFinTest = () => {
    if (!finQuestion || !finCorrectAnswer || finWrongAnswers.some(answer => !answer)) {
      setError('Пожалуйста, заполните все текстовые поля');
      return;
    }
    const newTestItem = {
      finQuestion: finQuestion,
      finCorrectAnswer: finCorrectAnswer,
      finIncorrect1: finWrongAnswers[0],
      finIncorrect2: finWrongAnswers[1],
      finIncorrect3: finWrongAnswers[2],
    };
      setFinTestArray(prevArray => {
        const newArray = [...prevArray, newTestItem];
        return newArray;
      });
  
  
      // Очистка значения текстареи после сохранения
      setFinQuestion('');
      setFinCorrectAnswer('');
      setFinWrongAnswers(['', '', '']);

      closeFinTestModal();  
}

  return (
    <>
    <div className='container7'>
        <div className='addlessoncoursename'>{titleWithSpaces}</div>
    <Navpanmini />

    {step === 1 && (
      <>
    <input
    className='inputaddless2'
      type="text"
      placeholder="Название урока"
      value={lessonTitle}
      onChange={(e) => setLessonTitle(e.target.value)}
    />

      <div className="lesson-type-selector">
        <label>
          <input
          className='checkadd'
            type="radio"
            value="text"
            checked={lessonType === 'text'}
            onChange={() => setLessonType('text')}
          />
          Текстовый урок
        </label>

        <label>
          <input
            type="radio"
            value="video"
            checked={lessonType === 'video'}
            onChange={() => setLessonType('video')}
          />
          Видео урок
        </label>
      </div>
     
{lessonType === 'text' && (
  <>
  <div className='addlessonlink' onClick={openModal}>
  Добавить документ
</div>
{file && (
  <div className='file'>{file.name}</div>
)}
</>
)}

      {!videoSaved && lessonType === 'video' && (
        <div className='addlessonlink' onClick={openModal}>
          Добавить видеоряд
        </div>
      )}
 {errorVideo && <div style={{ color: 'red' }}>{errorVideo}</div>}
      {selectedCourse && (
        <div className="modal-overlay4">
          <div className="modal4">
          {lessonType === 'text' && (
        <>
      <input className='filediv' type="file" onChange={handleFileChange} />
      <button onClick={handleSaveFile} disabled={!file}>
        Сохранить
      </button>
        </>
            )}
            {lessonType === 'video' && (
              <>
                <input
                  className='inputaddless'
                  type="text"
                  placeholder="Ссылка на видео с YouTube"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                <button onClick={handleSave}>Сохранить</button>
              </>
            )}
            <button onClick={closeModal}>Закрыть</button>
            
          </div>
        </div>
      )}

      {videoSaved && (
  <div className='centeraddless'> 
  <div className='videoandtime'>
    <YouTube
      videoId={videoId}
      opts={{ height: '390', width: '640' }}
      onStateChange={onStateChange}
      ref={videoRef}
    />
    <div>Текущее время: {Math.floor(currentTime)} секунд</div>
    </div>
    <div className='addcontainers'>
    <div className='knopkacont' onClick={openTerminModal}>Добавить термин</div>
    <div className='knopkacont' onClick={openTestModal}>Добавить тест</div>
    <div className='knopkacont' onClick={openInfoModal}>Добавить информацию</div>
    <div className='knopkacont' onClick={openLinkModal}>Добавить ссылки</div>
    <div className='allcontainersadd'>

    <div className='infoblock addshow'>Термины
{terminArray.map((terminItem, index) => (
  <div key={index}>
    Термин: {index + 1}, Время: {terminItem.time} секунд, Текст: 
    <div dangerouslySetInnerHTML={{ __html: terminItem.text.replace(/\n/g, '<br>') }} />
  </div>
))}


</div>


    

<div className='infoblock addshow'>Тест
{testArray.map((testItem, index) => (
  <div key={index}>
    Вопрос: {index + 1}, Время: {testItem.time} секунд, Текст: 
    <div className='addtest' dangerouslySetInnerHTML={{ __html: testItem.question.replace(/\n/g, '<br>') }} />
    Правильный ответ: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.correctAnswer.replace(/\n/g, '<br>') }} />
    Неправильный ответ 1: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.incorrect1.replace(/\n/g, '<br>') }} />
    Неправильный ответ 2: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.incorrect2.replace(/\n/g, '<br>') }} />
    Неправильный ответ 3: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.incorrect3.replace(/\n/g, '<br>') }} />
  </div>
))}

  </div>

  <div className='infoblock addshow'>Информационные блоки
    {infoArray.map((infoItem, index) => (
  <div key={index}>
    Информация: {index + 1}, Время: {infoItem.time} секунд, Текст: 
      <div dangerouslySetInnerHTML={{ __html: infoItem.text.replace(/\n/g, '<br>') }} />
  </div>
))}
  {picArray.map((infoItem, index) => (
    <div key={index}>
      Информация: {index + 1}, Время: {infoItem.time} секунд, Текст: {/* Добавьте ваш текст, если необходимо */}
      
      {/* Отобразите фотографии внутри информационного блока */}
      {infoItem.photos.map((photo, photoIndex) => (
        <img
          key={photoIndex}
          className='imgadd'
          src={URL.createObjectURL(photo)}
          alt={`uploaded-${photoIndex}`}
        />
      ))}
    </div>
  ))}
</div>

  <div className='infoblock addshow'>Ссылки
{linkArray.map((linkItem, index) => (
  <div key={index}>
    Ссылки: {index + 1}
    <div dangerouslySetInnerHTML={{ __html: linkItem.text.replace(/\n/g, '<br>') }} />
  </div>
))}
</div>
</div>
</div>

  </div>
  
)}
 {errorNext && <div style={{ color: 'red' }}>{errorNext}</div>}
     <button className='knopkacont' onClick={handleNextStep}>Далее</button>
</>
)}

</div>
{step === 2 && (
  <>
  <div className='fintesttoadd'>Добавление теста после урока </div>
  <div className='fintestcont'>
  <div className='finknopkacont' onClick={openFinTestModal}>Добавить вопрос</div>
  {finTestArray.map((testItem, index) => (
  <div key={index}>
    Вопрос: {index + 1}, 
    <div className='addtest' dangerouslySetInnerHTML={{ __html: testItem.finQuestion.replace(/\n/g, '<br>') }} />
    Правильный ответ: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.finCorrectAnswer.replace(/\n/g, '<br>') }} />
    Неправильный ответ 1: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.finIncorrect1.replace(/\n/g, '<br>') }} />
    Неправильный ответ 2: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.finIncorrect2.replace(/\n/g, '<br>') }} />
    Неправильный ответ 3: 
    <div className='addtest'  dangerouslySetInnerHTML={{ __html: testItem.finIncorrect3.replace(/\n/g, '<br>') }} />
  </div>
))}
  <button className='knopkacont' onClick={handleSendSaveClick}>Добавить урок</button>
  </div>
  </>
)}

{infoModalVisible && (
        <div className="modal-info-overlay">
          <div className="modal-info">
            <div className='centeraddless'>
              Текущее время: 
              <input 
                className='inputaddless2'
                type="number"
                value={Math.floor(currentTime)}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  if (videoRef.current) {
                    videoRef.current.internalPlayer.seekTo(parseFloat(e.target.value));
                  }
                }}
              />
              секунд
            </div>
            <select 
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="text">Текст</option>
              <option value="pic">Картинка</option>
            </select>

            {selectedOption === 'text' && (
              <>
                {error && <p>{error}</p>}
                <textarea
                  placeholder="Добавьте информацию"
                  value={infoText}
                  onChange={(e) => setInfoText(e.target.value)}
                />
                <button onClick={handleSaveInfo}>Сохранить</button>
              </>
            )}
    {selectedOption === 'pic' && (
        <div>
       {error && <p>{error}</p>}
          <input type="file" onChange={handleImageUpload} />
          {currentImage && (
            <img
              className='imgadd'
              src={URL.createObjectURL(currentImage)}
              alt={`uploaded-0`}
            />
          )}
          <button onClick={handleSavePic}>Сохранить</button>
        </div>
  )}

            <button onClick={closeInfoModal}>Закрыть</button>
    </div>
  </div>
)}
{testModalVisible && (
        <div className="modal-info-overlay">
          <div className="modal-info">
            <div>
              Текущее время: 
              <input 
                className='inputaddless2'
                type="number"
                value={Math.floor(currentTime)}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  if (videoRef.current) {
                    videoRef.current.internalPlayer.seekTo(parseFloat(e.target.value));
                  }
                }}
              />
              секунд
            </div>
           
           
              <>
              <textarea
        placeholder="Добавьте вопрос"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <textarea
        placeholder="Добавьте правильный ответ"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      {wrongAnswers.map((answer, index) => (
        <textarea
          key={index}
          placeholder={`Добавьте неправильный ответ ${index + 1}`}
          value={answer}
          onChange={(e) => {
            const newWrongAnswers = [...wrongAnswers];
            newWrongAnswers[index] = e.target.value;
            setWrongAnswers(newWrongAnswers);
          }}
        />
      ))}
      {error && <p>{error}</p>}
                <button onClick={handleSaveTest}>Сохранить</button>
              </>
            <button onClick={closeTestModal}>Закрыть</button>
    </div>
  </div>
)}
{finTestModalVisible && (
        <div className="modal-info-overlay">
          <div className="modal-info">
              <>
              <textarea
        placeholder="Добавьте вопрос"
        value={finQuestion}
        onChange={(e) => setFinQuestion(e.target.value)}
      />
      <textarea
        placeholder="Добавьте правильный ответ"
        value={finCorrectAnswer}
        onChange={(e) => setFinCorrectAnswer(e.target.value)}
      />
      {finWrongAnswers.map((answer, index) => (
        <textarea
          key={index}
          placeholder={`Добавьте неправильный ответ ${index + 1}`}
          value={answer}
          onChange={(e) => {
            const newWrongAnswers = [...finWrongAnswers];
            newWrongAnswers[index] = e.target.value;
            setFinWrongAnswers(newWrongAnswers);
          }}
        />
      ))}
                <button onClick={handleSaveFinTest}>Сохранить</button>
              </>
            <button onClick={closeFinTestModal}>Закрыть</button>
    </div>
  </div>
)}
{terminsModalVisible && (
        <div className="modal-info-overlay">
          <div className="modal-info">
            <div>
              Текущее время: 
              <input 
                className='inputaddless2'
                type="number"
                value={Math.floor(currentTime)}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  if (videoRef.current) {
                    videoRef.current.internalPlayer.seekTo(parseFloat(e.target.value));
                  }
                }}
              />
              секунд
            </div>
           
           
              <>
                <textarea
                  placeholder="Добавьте термин"
                  value={terminText}
                  onChange={(e) => setTerminText(e.target.value)}
                />
                    {error && <p>{error}</p>}
                <button onClick={handleSaveTermins}>Сохранить</button>
              </>
            <button onClick={closeTerminModal}>Закрыть</button>
    </div>
  </div>
)}
{linkModalVisible && (
        <div className="modal-info-overlay">
          <div className="modal-info">           
              <>
                <textarea
                  placeholder="Добавьте ссылку"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
                    {error && <p>{error}</p>}
                <button onClick={handleSaveLink}>Сохранить</button>
              </>
            <button onClick={closeLinkModal}>Закрыть</button>
    </div>
  </div>
)}

       </>
  );
}

export default AddLesson;