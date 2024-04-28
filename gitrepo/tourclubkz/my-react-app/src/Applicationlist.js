import React, { useState } from "react";
import './applicationlist.css';
import Navpanmini from "./navpanmini";
import AllApplicationList from "./AllApplicationlist";
import MyApplicationList from "./MyApplicationlist";

function ApplicationList() {
  const [showMyApplications, setShowMyApplications] = useState(false);

  const toggleApplications = () => {
    setShowMyApplications(prevState => !prevState);
  };

  return (
    <div className="Applicationcont"> 
      <Navpanmini/>

      <div className="application-list">
        <h2>Список заявок</h2>    
           <button className="buttonallApplication" onClick={toggleApplications}>
          {showMyApplications ? 'Показать все заявки' : 'Показать мои заявки'}
        </button>
        {showMyApplications ? <MyApplicationList /> : <AllApplicationList />}
    
      </div>
    </div>
  );
}

export default ApplicationList;
