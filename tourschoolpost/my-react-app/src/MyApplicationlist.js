import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import './applicationlist.css';
import Navpanmini from "./navpanmini";
import { jwtDecode } from 'jwt-decode';

function MyApplist() {
    const [applications, setApplications] = useState([]);
   const token = localStorage.getItem('token');
   const decodedToken = jwtDecode(token);
   const id = decodedToken.sub;
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);
   const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const intervalId = setInterval(async () => {
          try {
            const response = await axios.get(`http://localhost:8888/tourschoolphp/MyApplicationlist.php?id=${id}`);
            setApplications(response.data);
          } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
          }
        }, 1000); // Adjust interval as needed (1000 ms = 1 second)
    
        return () => clearInterval(intervalId); // Clean up interval on unmount
      }, []);


  // Calculate pagination variables
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter and slice applications based on search and pagination
  const currentItems = Array.isArray(applications)
  ? applications.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(indexOfFirstItem, indexOfLastItem)
  : []; // Return an empty array if not an array




      
      return (
        <div className="application-list">
      <h2>Список заявок</h2>
      {currentItems.map(app => (
        <div 
          key={app.id} 
          className={`application-item`}
        > 

          <div className="application-info">
            <p><strong>Имя:</strong> {app.name}</p>
            <p><strong>Телефон:</strong> {app.phone}</p>
            <p><strong>Почта:</strong> {app.email}</p>
            <p><strong>Время заявки:</strong> {app.timestamp}</p>
            {/* Add more application details as needed */}
          </div>
        </div>
      ))}

      </div>

      )
}

export default MyApplist;