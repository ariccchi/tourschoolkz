import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './navpan.css';
import Logout from "./logout";
import * as jwtDecode from 'jwt-decode';
function Navpan() {
    const token = localStorage.getItem('token');
    const [activeIcon, setActiveIcon] = useState("");
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [knopka, setKnopka] = useState(true);
    const [data, setData] = useState([]);
    const decodedToken = jwtDecode.jwtDecode(token);
    const [loading, setLoading] = useState(true);
    const id = decodedToken.sub;
    const role = decodedToken.role;
    const name = decodedToken.name;
    const surname = decodedToken.surname;
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Выполняем HTTP запрос к PHP файлу
                const response = await fetch('http://localhost:8888/tourschoolphp/showavatar.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user: id }),
                });

                const data = await response.json();
                setData(data);

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                // Устанавливаем статус загрузки в false после завершения запроса
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);
    const avatarSrc = data.avatar ? `http://localhost:8888/tourschoolphp/${data.avatar}` : null;
    const toggleNav = () => {
        setIsOpen(!isOpen);
    };
  
    useEffect(() => {
        const currentPath = location.pathname;
        switch (currentPath) {
            case "/profile":
                setActiveIcon("profile");
                break;
            case "/courses":
                setActiveIcon("vector");
                break;
            case "/messages":
                setActiveIcon("message");
                break;
            default:
                setActiveIcon("");
        }
    }, [location]);

    return (
        <>
            <button onClick={toggleNav} className="hamburger">
                <img src="./hamburger.svg"></img>
            </button>               
            <div className={`navpan ${isOpen ? "" : "hidden"}`}>
                <div className="logo">
                    <div className="tourlogo">
                        <div className="logosmall"></div>
                        <div className="logotext">Tour Club</div>
                    </div>
                    <div className="blockforavatarka2">
                <div className="avatarkaprof2">
                {avatarSrc && <img src={avatarSrc} alt="User Avatar" className="avatar-image2" />}
                </div>
                </div>

<div className="nameblock">
        <div className="namenav">{name}</div>
        <div className="namenav">{surname}</div>
        </div>
        <div className="textnavblock">
                    <Link className = "mainicontextactive" to="/profile">
                        <div className={activeIcon === "profile" ? "mainicontextactive" : "mainicontext"}>Личный кабинет</div>
                    </Link>
                    <Link className = "mainicontextactive" to="/courses">
                       
                        <div className={activeIcon === "vector" ? "mainicontextactive" : "mainicontext"}>Курсы</div>
                    </Link>
                    <Link className = "mainicontextactive" to="/messages">
                      
                        <div className={activeIcon === "message" ? "mainicontextactive" : "mainicontext"}>Чат</div>
                    </Link>
            
                    <div className={activeIcon === "plane" ? "mainicontextactive" : "mainicontext"}>Продажа туров</div>
                    <div className="logoutbutton">
            <Logout />
        </div>
                    </div>
                   
                </div>
              
            </div>
        </>
    )
}

export default Navpan;
