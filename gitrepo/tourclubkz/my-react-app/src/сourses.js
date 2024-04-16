import React, { useState } from "react";
import Navpan from "./navpan";
import './courses.css';
import Courselist from "./courselist";
import Mycourselist from "./my_courses";
function Courses() {
    
    const [showModal, setShowModal] = useState(false);
    const [selectedNav, setSelectedNav] = useState('all');

    const handleImageClick = () => {
        setShowModal(true);
    }

    const handleNavClick = (nav) => {
        setSelectedNav(nav);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return(
        <>
        <div className="containercourses">
        <div className="header">
            <div className="coursesh">Курсы</div>
           
            {showModal && (
                <div className="modal">
                    <button onClick={closeModal}>Закрыть</button>
                    <p>Это ваше модальное окно!</p>
                </div>
            )}
        </div>
        <div className="linewithnav">
        
            <div className={`textnav ${selectedNav === 'all' ? 'active' : ''}`} onClick={() => handleNavClick('all')}>Все</div>
            <div className={`textnav ${selectedNav === 'my' ? 'active' : ''}`} onClick={() => handleNavClick('my')}>Мои</div>
            <div className={`textnav ${selectedNav === 'Туризм по направлениям' ? 'active' : ''}`} onClick={() => handleNavClick('Туризм по направлениям')}>По направлениям</div>
            <div className={`textnav ${selectedNav === 'Общий туризм' ? 'active' : ''}`} onClick={() => handleNavClick('Общий туризм')}>Общий туризм</div>
        </div>


    
        {selectedNav === 'my' && <Mycourselist />}
        {selectedNav && <Courselist selectedNav={selectedNav} />}
        </div>
        <Navpan />
        
      </>
    )
}

export default Courses;
