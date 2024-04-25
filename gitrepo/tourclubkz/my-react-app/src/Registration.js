import React, { useState, useEffect } from "react";
import './registration.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { BASE_URL } from './config';
function Registration() {

const token2 = localStorage.getItem('token');
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState('');
const [username, setUsername] = useState("");
const [surname, setSurname] = useState("");
const [curatorUsername, setCuratorUsername] = useState("");
const [token, setToken] = useState(''); 
const [data, setData] = useState([]);
const [page, setPage] = useState(1); 
const [dob, setDob] = useState("");
const [sentData, setSentData] = useState(null);
const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);


  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    let countdown;

    if (page === 3) {
      // Start the timer only when page is 3
      countdown = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    }
    if (timeLeft <= 0) {
      clearInterval(countdown);
      setIsActive(true);
    }

    return () => clearInterval(countdown); // Cleanup
  }, [timeLeft, page]); // Add page as a dependency

const date = new Date(); // текущая дата и время
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль, если месяц меньше 10
const day = String(date.getDate()).padStart(2, '0'); // добавляем ведущий ноль, если день меньше 10
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


  
const handleLoginClick = () => {
    navigate('/login');
  };
  const handleSetPageClick = () => {
 
    if (email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '') {
        setMessage('');
      if (password === confirmPassword) {
        setMessage('');

        setPage(2);
      } else {
        // If passwords don't match, show an error message or take appropriate action
        setMessage('Пароли не совпадают.');
      }
    } else {
      // If any of the fields are empty, show an error message or take appropriate action
      setMessage('Заполните все поля.');
    }
  };
 
  const handleSubmit = async (event) => {
    const data = {
        name: username,
        surname: surname,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        dob: dob,
        curatorUsername: curatorUsername,
        role: "student",
        city: "Almaty",
        timestamp: formattedTimestamp,
      };
  
      console.log("Registration Data:", data);
    event.preventDefault();
    try {

    
      const response = await axios.post(
       `${BASE_URL}tourschoolphp/registration.php`,
        JSON.stringify({
          name: username,
          surname: surname,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          dob: dob,
          curatorUsername: curatorUsername,
          role: "student",
          city: "Almaty",
          timestamp: formattedTimestamp
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const responseData = response.data;
      
      if (responseData.success) {
        // Обработка успешного выполнения, например, перенаправление пользователя или отображение сообщения
        console.log("Регистрация прошла успешно!");
        setMessage('');
        setPage(3);
      } else {
        setMessage(responseData.error)
        console.error("Ошибка при регистрации:", responseData.error);
      }
      setSentData(responseData);
      setData(responseData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    


    const data2 = {
      email: email
    };
    
      try {
        const response2 = await axios.post(
          `${BASE_URL}tourschoolphp/emailconf.php`,
          JSON.stringify(data2),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (response2.data.success) {
         console.log("сообщение отправленно");
        } else {
          console.error('Error sending message:', response2.data.error);
        }
      } catch (error) {
  if (error.response) {
      // Серверная ошибка
      console.error('Server Error:', error.response.data);
  } else if (error.request) {
      // Ошибка при отправке запроса
      console.error('Request Error:', error.request);
  } else {
      // Другая ошибка
      console.error('Error:', error.message);
  }
}
  };



  const handleSubmitEmail = async (event) => {
    const data = {
        name: username,
        surname: surname,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        dob: dob,
        curatorUsername: curatorUsername,
        role: "student",
        city: "Almaty",
        timestamp: formattedTimestamp,
        verificationCode: verificationCode,
      };
  
      console.log("Registration Data:", data);
    event.preventDefault();
    try {
     
    
      const response = await axios.post(
       `${BASE_URL}tourschoolphp/emailconfirm.php`,
        JSON.stringify({
          email: email,
          verificationCode: verificationCode,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const responseData = response.data;
      
      if (responseData.success) {
 
        console.log("Регистрация прошла успешно!");
        navigate('/login')
     
      } else {
        setMessage(responseData.error)
        console.error("Ошибка при регистрации:", responseData.error);
      }
      setSentData(responseData);
      setData(responseData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    

  };


  const handleClickEmailResend = async (event) => {

    const data2 = {
      email: email
    };
    
      try {
        const response2 = await axios.post(
          `${BASE_URL}tourschoolphp/emailconf.php`,
          JSON.stringify(data2),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (response2.data.success) {
         console.log("сообщение отправленно");
        } else {
          console.error('Error sending message:', response2.data.error);
        }
      } catch (error) {
  if (error.response) {
      // Серверная ошибка
      console.error('Server Error:', error.response.data);
  } else if (error.request) {
      // Ошибка при отправке запроса
      console.error('Request Error:', error.request);
  } else {
      // Другая ошибка
      console.error('Error:', error.message);
  }
}
    setTimeLeft(60); // Reset timer to 60 seconds
    setIsActive(false); // Make the button inactive again
  };



    return(
        <div className="containerreg">
        <div className="fullscreen-image-containerreg">
      
            <div className="half-login-rightreg">
                <div className="centerrightcontreg">
                    <div className="tourlogo-groupreg">
                        <div className="logo-loginreg"></div>
                        <div className="logotext-loginreg">Tourclub</div>
                    </div>
          
        <div className="buttonforregreg" onClick={handleLoginClick} >Войти</div>


                </div>
            </div>
            <div className="half-login-leftreg">
            <div className="h1loginreg">Регистрация</div>
            <div className="input-containerreg">
            {page === 1 && (
                <>
            <div className="input-groupreg">
            <label htmlFor="email" className="labelloginreg">Email</label>
            <input type="email" id="email" name="email" className="inputloginreg"     maxLength="25" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-groupreg">
            <label htmlFor="password" className="labelloginreg">Пароль</label>
            <input type="password" id="password" name="password"   maxLength="40" className="inputloginreg"      value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
   
        <div className="input-groupreg">
            <label htmlFor="password" className="labelloginreg">Повторите пароль</label>
            <input type="password" id="password" name="password"   maxLength="40" className="inputloginreg"      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

    <div className="forgoth2reg" onClick={handleLoginClick}>
          Войти
        </div>
    {message && <div className="error-messagereg">{message}</div>}
    <div className="loginbuttonreg" onClick={handleSetPageClick}>
    Далее
</div>
</>
  )}
 {page === 2 && (
                <>
            <div className="input-groupreg">
            <label htmlFor="text" className="labelloginreg">Имя</label>
            <input type="text" id="username" name="username" className="inputloginreg"     maxLength="40" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="input-groupreg">
            <label htmlFor="text" className="labelloginreg">Фамилия</label>
            <input type="text" id="surname" name="surname"   maxLength="40" className="inputloginreg"      value={surname} onChange={(e) => setSurname(e.target.value)} />
        </div>
   
        <div className="input-groupreg">
            <label htmlFor="password" className="labelloginreg">Дата рождения</label>
            <input type="date" id="password" name="password"  className="inputloginreg"      value={dob} onChange={(e) => setDob(e.target.value)} min="1900-01-01"
  max={new Date().toISOString().split("T")[0]}/>
        </div>
        <div className="input-groupreg">
            <label htmlFor="email" className="labelloginreg">Email куратора</label>
            <input type="email" id="password" name="password"   maxLength="40" className="inputloginreg"      value={curatorUsername} onChange={(e) => setCuratorUsername(e.target.value)} />
        </div>

    <div className="forgoth2reg" onClick={handleLoginClick}>
          Войти
        </div>
    {message && <div className="error-messagereg">{message}</div>}
    <div className="loginbuttonreg" onClick={handleSubmit}>
    Зарегестрироваться
</div>
</>
  )}


{page === 3 && (
                <>
          <div id="myModal" className="modalemail">


<div className="modal-contentemail">
 <img src='/emailver.svg' className="svgemail"></img>
  <p className="emailverp"> Подтвердите почту</p>
  <p className="emailverp2">На вашу почту пришло письмо с кодом подтверждения, введите этот код ниже</p>
  <button className={`timer-button ${isActive ? 'active' : ''}`} disabled={!isActive}   onClick={isActive ? handleClickEmailResend : null} >
      {isActive ? "Отправить код повторно" : `Отправить повторно через ${timeLeft} секунд`}
    </button>

  <input type="text" 
  className="emailver"
       maxLength="6" 
       placeholder="xxxxxx" 
       pattern="[0-9]{6}" 
       value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} 
       ></input>
       {message && <div className="error-messagereg">{message}</div>}

       <div className="emailconfver" onClick={handleSubmitEmail}>Подтвердить почту</div>
</div>

</div>
</>
  )}



    </div>
            </div>
        <img src="/mountains.jpeg" alt='bg' className="fullscreen-imagereg"/>
        </div>
        </div>
    )
}

export default Registration;