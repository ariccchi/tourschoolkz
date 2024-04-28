import React, { useState } from "react";
import { useEffect } from 'react';
import './login.css';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from './config';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';


function Login() {
    const [sentData, setSentData] = useState(null);
    const [data, setData] = useState([]);
const token2 = localStorage.getItem('token');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const [token, setToken] = useState(''); 
const [emailModal, setEmailModal] = useState(false); 
const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [page, setPage] = useState(1);

  const [passwordnew, setPasswordnew] = useState('');
const [confirmPasswordnew, setConfirmPasswordnew] = useState("");
const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let countdown;

    if (page == 2) {
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
useEffect(() => {
    if (token2) {
      navigate('/profile'); // Если нет токена, перенаправляем на /login
    }
  }, [token2]);





  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Установить isLoading в true перед отправкой запроса
    if (email.trim() !== '' && passwordnew.trim() !== '' && confirmPasswordnew.trim() !== '') {
      setMessage('');
    if (passwordnew === confirmPasswordnew) {
      setMessage('');

      try {
        const response = await fetch(`${BASE_URL}tourschoolphp/changepassword.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: passwordnew }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
   
        if (data.success) {
          setMessage('Вы успешно обновили пароль');
          setTimeout(() => {
           setEmailModal(false);
        }, 3000);
      } else {
          setMessage(data.error);
      }
    } catch (error) {
        console.error('An error occurred:', error);
        setMessage('Произошла ошибка при попытке авторизации. Пожалуйста, попробуйте еще раз.');
    }


     
    } else {
      // If passwords don't match, show an error message or take appropriate action
      setMessage('Пароли не совпадают.');
    }
  } else {
    // If any of the fields are empty, show an error message or take appropriate action
    setMessage('Заполните все поля.');
  }
    setIsLoading(false); // Установить isLoading в false после получения ответа
   
};



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Установить isLoading в true перед отправкой запроса
  
    try {
        const response = await fetch(`${BASE_URL}tourschoolphp/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
   
if (data.status === 'success') {
    setMessage('Авторизация прошла успешно!');
    setToken(data.token); 
    localStorage.setItem('token', data.token); 
    navigate('/profile');
} else if (data.status === 'blocked') {
    setMessage(`Авторизация не удалась. Пользователь заблокирован. Причина: ${data.block_reason}`);
  } else if (data.status === 'error' && data.message === 'Email not verified') {
    setMessage('Авторизация не удалась. Пользователя не существует.');
  }  else {
    setMessage('Авторизация не удалась. Пожалуйста, попробуйте еще раз.');
}

// ... (остальной код)

    } catch (error) {
        console.error('An error occurred:', error);
        setMessage('Произошла ошибка при попытке авторизации. Пожалуйста, попробуйте еще раз.');
    }
    setIsLoading(false); // Установить isLoading в false после получения ответа
};
const handleRegisterClick = () => {
    navigate('/registration');
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSubmit(event);
    }

  
};

const handleEmailConf = () => {
  setMessage('');
    setEmailModal(true)
    };

    const handleCloseEmail = () => {
      setMessage('');
        setEmailModal(false)
        };
    
    
const handleSubmitEmail = async (event) => {
  const data = {
      email: email,
      password: password,
    
      role: "student",
      city: "Almaty",
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
      setMessage('');
      setPage(3);
   
    } else {
      setMessage("Вы ввели неправильный код")
      console.error("Ошибка при регистрации:", responseData.error);
    }

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
       setMessage('');
       setPage(2);
      } else {
        console.error('Error sending message:', response2.data.error);
      }
    } catch (error) {
if (error.response) {

    setMessage(error.response.data); // Установить сообщение об ошибке
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
        <div className="fullscreen-image-container">
            <div className="half-login-left">
            <div className="h1login">Вход</div>
            <div className="input-container">
            <div className="input-group">
            <label htmlFor="email" className="labellogin">Email</label>
            <input type="email" id="email" name="email" className="inputlogin"     maxLength="25" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="input-group">
            <label htmlFor="password" className="labellogin">Пароль</label>
            <input type="password" id="password" name="password"   maxLength="40" className="inputlogin"      value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} />
        </div>
   
        <div className="forgoth" onClick={handleEmailConf}>Забыли логин или пароль?</div>
    <div className="forgoth2" onClick={handleRegisterClick}>
          Зарегистрироваться
        </div>
    {message && <div className="error-message">{message}</div>}
    <div className="loginbutton" onClick={handleSubmit} >
    Войти
</div>
    </div>
            </div>
            <div className="half-login-right">
                <div className="centerrightcont">
                    <div className="tourlogo-group">
                        <div className="logo-login"></div>
                        <div className="logotext-login">Tourclub</div>
                    </div>
        <div className="Nicetomeet">Добро пожаловать!</div>
        
        <div className="graynot">Не имеете аккаунт?</div>
        <div className="buttonforreg" onClick={handleRegisterClick} >Зарегистрироваться</div>


                </div>
            </div>
        <img src="/mountains.jpeg" alt='bg' className="fullscreen-image"/>

{emailModal && (
                <>
          <div id="myModal" className="modalemail">


<div className="modal-contentemail">

{isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Загрузка...</span>
          </div>
        ) : (
          <>
{page === 1 && (
  <>
    <span className="closeemail" onClick={handleCloseEmail}>×</span>
    <img src='/password.svg' className="svgemail"></img>
    <p className="emailverp">Сбросить пароль</p>
    <p className="emailverp2">Для сброса пароля введите ваш адрес электронной почты</p>
   
    <label htmlFor="email" className="emaillabelconf">Email</label>
            <input type="email" id="email" name="email" 
            placeholder="example@example.com"
            className="emailver2"     maxLength="25" value={email} onChange={(e) => setEmail(e.target.value)} />
    {message && <div className="error-messagereg">{message}</div>}
    <div className="emailconfver" onClick={handleClickEmailResend}>Далее</div>
  </>
)}

{page === 2 && (
  <>
    <span className="closeemail" onClick={handleCloseEmail}>×</span>
    <img src='/emailver.svg' className="svgemail"></img>
    <p className="emailverp"> Подтвердите почту</p>
    <p className="emailverp2">На вашу почту пришло письмо с кодом подтверждения, введите этот код ниже</p>
    <button className={`timer-button ${isActive ? 'active' : ''}`} disabled={!isActive} onClick={isActive ? handleClickEmailResend : null}>
      {isActive ? "Отправить код повторно" : `Отправить повторно через ${timeLeft} секунд`}
    </button>
    <input
      type="text"
      className="emailver"
      maxLength="6"
      placeholder="xxxxxx"
      pattern="\[0-9\]{6}"
      value={verificationCode}
      onChange={(e) => setVerificationCode(e.target.value)}
    />
    {message && <div className="error-messagereg">{message}</div>}
    <div className="emailconfver" onClick={handleSubmitEmail}>Подтвердить почту</div>
  </>
)}

{page === 3 && (
  <>
    <span className="closeemail" onClick={handleCloseEmail}>×</span>
    <img src='/password.svg' className="svgemail"></img>
    <p className="emailverp">Введите новый пароль</p>
   
            <label htmlFor="password" className="emaillabelconf3">Пароль</label>
            <input type="password" id="password" name="password"   maxLength="40" className="emaillabelconf2"      value={passwordnew} onChange={(e) => setPasswordnew(e.target.value)} />
      
   
      
            <label htmlFor="password" className="emaillabelconf3">Повторите пароль</label>
            <input type="password" id="password" name="password"   maxLength="40" className="emaillabelconf2"      value={confirmPasswordnew} onChange={(e) => setConfirmPasswordnew(e.target.value)} />
     
    {message && <div className="error-messagereg">{message}</div>}
    <div className="emailconfver" onClick={handleUpdatePassword}>Обновить пароль</div>
    
  </>
)}
</>
     )}
</div>


</div>
</>
  )}

        </div>

        
    )
}

export default Login;