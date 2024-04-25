import React from "react";
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
import axios from 'axios';
function EmailCheck() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const id = decodedToken.sub;
    const handleSendEmail = async () => {
       
      
      const data = {
        id: id
      };
      
        try {
          const response = await axios.post(
            `${BASE_URL}tourschoolphp/emailcheck.php`,
            JSON.stringify(data),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          if (response.data.success) {
           console.log("сообщение отправленно");
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
        <div className="buttontest" onClick={handleSendEmail}>Отправить письмо </div>
    )
}
export default EmailCheck;