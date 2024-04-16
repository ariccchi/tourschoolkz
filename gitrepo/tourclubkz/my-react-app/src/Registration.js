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
  // useEffect(() => {
  //   const isCuratorUsernameValid = async () => {
  //     if (!curatorUsername) {
  //       return true;
  //     }

  //     try {
  //       const response = await axios.get(
  //        `${BASE_URL}backend/check-curator-username.php`,
  //         {
  //           params: {
  //             curatorUsername: curatorUsername
  //           }
  //         }
  //       );

  //       return response.data.success;
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //       return false;
  //     }
  //   };

  //   const isFormValid = () => {
  //     return (
  //       username.trim().length > 0 &&
  //       email.trim().length > 0 &&
  //       surname.trim().length > 0 &&
  //       password.trim().length > 0 &&
  //       confirmPassword.trim().length > 0 &&
  //       dob.trim().length > 0 &&
  //       (curatorUsername ? isCuratorUsernameValid() : true)
  //     );
  //   };

  //   setSubmitButtonDisabled(!isFormValid());

  //   const inputFields = [username, surname, email, password, confirmPassword, dob, curatorUsername];
  //   const setSubmitButtonDisabledOnInput = () => setSubmitButtonDisabled(!isFormValid());

  //   inputFields.forEach((field) => {
  //     if (field && field.addEventListener) {
  //       field.addEventListener("input", setSubmitButtonDisabledOnInput);
  //     }
  //   });

  //   return () => {
  //     inputFields.forEach((field) => {
  //       if (field && field.removeEventListener) {
  //         field.removeEventListener("input", setSubmitButtonDisabledOnInput);
  //       }
  //     });
  //   };
  // }, [username, surname, email, password, confirmPassword, dob, curatorUsername]);

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
        navigate('/login')
      } else {
        // Обработка ошибки, например, вывод сообщения об ошибке
        console.error("Ошибка при регистрации:", responseData.error);
      }
      setSentData(responseData);
      setData(responseData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    
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
    </div>
            </div>
        <img src="/mountains.jpeg" alt='bg' className="fullscreen-imagereg"/>
        </div>
        </div>
    )
}

export default Registration;