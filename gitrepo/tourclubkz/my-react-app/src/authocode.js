import React, { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
import axios from 'axios';
function Authcode() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
    const [emailModal, setEmailModal] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);

    const [unicCode, setUnicCode] = useState(''); 
    const handleCloseEmail = () => {
          setEmailModal(false)
          };
    
          
    const handleGetAuthCode = async () => {
        setEmailModal(true)
        setIsLoading(true)
      const data = {
        id: id
      };
      
        try {
          const response = await axios.post(
            `${BASE_URL}tourschoolphp/authcode.php`,
            JSON.stringify(data),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          if (response.data.success) {
            setIsLoading(false)
           console.log("Уникальный код был создан");
           setUnicCode(response.data.unic_code)
       
          } else {
            console.error('Error sending message:', response.data.error);
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

    return(
        <>
                <div className="knopkaApplication" onClick={handleGetAuthCode}> <div className="applicationtextprof">Создать код авторизации</div>
        </div>


{emailModal && (
    <>
<div id="myModal" className="modalunic">

<div className="modal-contentunic">
<span className="closeemail" onClick={handleCloseEmail}>×</span>
{isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Загрузка...</span>
          </div>
        ) : (
            <>
    <img src="/vercodestud.svg" className="svgemail"></img>
    
<div className="vercodetext">Код доступа для нового пользователя:</div>
<div className="vercodecode">{unicCode}</div>
<div className="vercodenot">Отправьте этот код вашему ученику, чтобы он смог зарегестрироваться в качестве вашего ученика</div>
</>
        )}
</div>


</div>
</>
)}
</>

    )
    
}
export default Authcode;