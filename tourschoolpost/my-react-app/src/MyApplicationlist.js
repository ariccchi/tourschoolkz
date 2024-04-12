import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import './applicationlist.css';
import Navpanmini from "./navpanmini";
import { jwtDecode } from 'jwt-decode';

function MyApplicationList() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedApplications, setDeletedApplications] = useState([]); // Track deleted applications
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

   const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const id = decodedToken.sub;



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



  const handleDelete = async (appId) => {
    try {
      const response = await axios.delete(`http://localhost:8888/tourschoolphp/deleteApplication.php?id=${appId}`);
  
      if (response.data.success) {
        // Mark application as deleted for animation
        setDeletedApplications([...deletedApplications, appId]);

        // Remove application from state after a short delay to allow animation
        setTimeout(() => {
          setApplications(applications.filter(app => app.id !== appId));
          setDeletedApplications(deletedApplications.filter(id => id !== appId));
        }, 300); // Adjust delay as needed for animation duration
      } else {
        console.error('Error deleting application:', response.data.error);
        // Handle error
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      // Handle error
    }
  };


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Calculate pagination variables
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter and slice applications based on search and pagination
  const currentItems = Array.isArray(applications)
  ? applications.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(indexOfFirstItem, indexOfLastItem)
  : []; // Return an empty array if not an array



    const handleDeleteClick = (app) => {
        setAppToDelete(app);
        setShowDeleteModal(true);
      };


      const handleConfirmDelete = async () => {
        if (appToDelete) {
          await handleDelete(appToDelete.id);
          setShowDeleteModal(false);
          setAppToDelete(null);
        }
      };
    
      const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAppToDelete(null);
      };




  // Pagination component
  const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} href="#" className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const statusMapping = {
    Successful: 'Успешно',
    Unsuccessful: 'Неуспешно',
    // Добавьте другие статусы при необходимости
  };
  return (
   
<>
      <input 
        type="text" 
        className="inputapplic"
        placeholder="Поиск по имени..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
   
   <div className="myapplicationlink">Выполненные заявки</div>

      {currentItems.map(app => (
        <div 
          key={app.id} 
          className={`application-item ${deletedApplications.includes(app.id) ? 'fade-out' : ''}`}
        > {/* Add fade-out class if deleted */}
          <div className="application-info">
            <p><strong>Имя:</strong> {app.name}</p>
            <p><strong>Телефон:</strong> {app.phone}</p>
            <p><strong>Почта:</strong> {app.email}</p>
            <p><strong>Время заявки:</strong> {app.timestamp}</p>
            <p><strong>Время обработки заявки:</strong> {app.progress_time}</p>
            <p><strong>Статус:</strong> {statusMapping[app.status]}</p>
            {/* Add more application details as needed */}
          </div>
          <div className="buttonstoapplications">
          <button className="delete-button" onClick={() => handleDeleteClick(app)}>
          ⌫
            </button>
          
            </div>


            

        </div>
      ))}

      <Pagination 
        itemsPerPage={itemsPerPage} 
        totalItems={applications.length} 
        paginate={paginate}
        currentPage={currentPage} 
      />
{showDeleteModal && (
          <div className="modalpad">
            <div className="modal-content">
              <p>Вы уверены что хотите удалить заявку пользователя <strong>{appToDelete.name}?</strong>?</p>
              <div className="modal-actions">
                <button onClick={handleConfirmDelete}>Удалить</button>
                <button onClick={handleCancelDelete}>Закрыть</button>
              </div>
            </div>
          </div>
        )}

</>
  );
}
export default MyApplicationList;