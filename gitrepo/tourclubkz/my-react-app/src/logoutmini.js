import React from "react";
import { useNavigate } from "react-router-dom"; // Импортируйте useNavigate
import { BASE_URL } from './config';
function Logoutmini() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Используйте useNavigate

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        console.log(token);
    
        try {
            const response = await fetch(`${BASE_URL}tourschoolphp/logout.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token  }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.status === 'success') {
                localStorage.removeItem('token'); // Удалите токен из LocalStorage
                navigate('/'); // Используйте navigate для перенаправления на главную страницу
                return;
            } else {
                return data;
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return error;
        }
    };

    return (
        <div className="logoutbutton">
            <div className="logoutround">
        <img src="/exit.svg" alt="logo" className="exiticon" onClick={handleLogout}></img>
        </div>
   
        </div>
    );
}

export default Logoutmini;
