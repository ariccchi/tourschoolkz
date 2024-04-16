import React, { useState } from "react";
import './login.css';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from './config';

import { jwtDecode } from 'jwt-decode';


function Login() {

const token2 = localStorage.getItem('token');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const [token, setToken] = useState(''); 



  const handleSubmit = async (event) => {
    event.preventDefault();
 
  
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
} else {
    setMessage('Авторизация не удалась. Пожалуйста, попробуйте еще раз.');
}

// ... (остальной код)

    } catch (error) {
        console.error('An error occurred:', error);
        setMessage('Произошла ошибка при попытке авторизации. Пожалуйста, попробуйте еще раз.');
    }
};
const handleRegisterClick = () => {
    navigate('/registration');
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
            <input type="password" id="password" name="password"   maxLength="40" className="inputlogin"      value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
   
    <div className="forgoth">Забыли логин или пароль?</div>
    <div className="forgoth2" onClick={handleRegisterClick}>
          Зарегистрироваться
        </div>
    {message && <div className="error-message">{message}</div>}
    <div className="loginbutton" onClick={handleSubmit}>
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
        </div>
    )
}

export default Login;