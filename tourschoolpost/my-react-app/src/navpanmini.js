import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import './navpanmini.css';
import Logoutmini from "./logoutmini";
import { jwtDecode } from 'jwt-decode';
function Navpan() {
    const [activeIcon, setActiveIcon] = useState("");
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [token, setToken] = useState(''); 
    const [knopka, setKnopka] = useState(true);
    const toggleNav = () => {
        setIsOpen(!isOpen);
    };
  
    useEffect(() => {

        const currentPath = location.pathname;
    
        const pathParts = currentPath.split('/');
    
        const mainPath = pathParts[1]; // Получаем первую часть пути
    
    
        switch (mainPath) {
    
            case "profile":
    
                setActiveIcon("profile");
    
                break;
    
            case "courses":
    
                setActiveIcon("vector");
    
                break;
    
            case "messages":
    
                setActiveIcon("message");
    
                break;
    
            default:
    
                setActiveIcon("");
    
        }
    
    }, [location]);
    console.log(activeIcon);
    return (
        <>
            <button onClick={toggleNav} className="hamburgermini">
                <img src="/hamburger.svg"></img>
            </button>               
            <div className={`navpanmini ${isOpen ? "" : "hidden"}`}>
                <div className="logomini">
                    <div className="logosmall"></div>
                    <div className="mainiconmini"></div>
                    <Link to="/profile">
                        <img src={activeIcon === "profile" ? "/profileyellow.svg" : "/profile.svg"} alt="logo" className="mainiconmini" onClick={() => setActiveIcon("profile")}></img>
                    </Link>
                    <Link to="/courses">
                        <img src={activeIcon === "vector" ? "/bookyellow.svg" : "/book.svg"} alt="logo" className="mainiconmini" onClick={() => setActiveIcon("vector")}></img>
                    </Link>
                    <Link to="/messages">
                        <img src={activeIcon === "message" ? "/messagegreen.svg" : "/messages.svg"} alt="logo" className="mainiconmini" onClick={() => setActiveIcon("message")}></img>
                    </Link>
                    <img src={activeIcon === "plane" ? "/planeyellow.svg" : "/plane.svg"} alt="logo" className="mainiconmini" onClick={() => setActiveIcon("plane")}></img>
                    <Logoutmini />
                </div>
            </div>
        </>
    )
}

export default Navpan;
