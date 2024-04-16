import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import './applicationlist.css';
import Navpanmini from "./navpanmini";
import { jwtDecode } from 'jwt-decode';
import MyApplist from "./MyApplicationlist";
import { BASE_URL } from './config';
function AllApplicationList() {
  const [paginationApplication, setPaginationApplication] = useState(1)
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedApplications, setDeletedApplications] = useState([]); // Track deleted applications
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [appToSuccess, setAppToSuccess] = useState(null);
   


    const [showUnSuccessModal, setShowUnSuccessModal] = useState(false);
    const [appToUnSuccess, setAppToUnSuccess] = useState(null);
   


   const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const id = decodedToken.sub;



  // Fetch data on component mount
  useEffect(() => {
  

   
    const intervalId = setInterval(async () => {
     
      try {
        const response = await axios.get(`${BASE_URL}tourschoolphp/Applicationlist.php`);
        setApplications(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
  
  
    }, 1000); // Adjust interval as needed (1000 ms = 1 second)

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);



  const handleDelete = async (appId) => {
    try {
      const response = await axios.delete(`${BASE_URL}tourschoolphp/deleteApplication.php?id=${appId}`);
  
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




  const handleSuccess = async (appId) => {
    try {
      const currentTime = new Date();
      const formData = new FormData();
      console.log(appId);
      console.log(id);
      const data = {
        appID: appId,
        id: id
      };
      console.log(formData);
  
      const response = await axios.post(
        `${BASE_URL}tourschoolphp/Applicationsuccsess.php`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          
        }
      );
  
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
        // Handle error - вывод ошибки в консоль
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      // Handle error - вывод ошибки в консоль
    }
  };
  


  const handleUnsucess = async (appId) => {
    try {
      const currentTime = new Date();
      const formData = new FormData();
      console.log(appId);
      console.log(id);
      const data = {
        appID: appId,
        id: id
      };
      console.log(formData);
  
      const response = await axios.post(
        `${BASE_URL}tourschoolphp/Applicationunsucsessful.php`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          
        }
      );
  
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
        // Handle error - вывод ошибки в консоль
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      // Handle error - вывод ошибки в консоль
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

          const handleSuccessClick = (app) => {
            setAppToSuccess(app);
        setShowSuccessModal(true);
      };
    
   const handleUnSuccessClick = (app) => {
            setAppToUnSuccess(app);
        setShowUnSuccessModal(true);
      };
    



      const handleConfirmSuccess = async () => {
        if (appToSuccess) {
          await handleSuccess(appToSuccess.id);
          setShowSuccessModal(false);
          setAppToSuccess(null);
        }
      };
  


      const handleConfirmUnSuccess = async () => {
        if (appToUnSuccess) {
          await handleUnsucess(appToUnSuccess.id);
          setShowUnSuccessModal(false);
          setAppToUnSuccess(null);
        }
      };


      const handleCancelUnSuccess = () => {
        setShowUnSuccessModal(false);
        setAppToUnSuccess(null);
      };

    
      const handleCancelSuccess = () => {
        setShowSuccessModal(false);
        setAppToSuccess(null);
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
            {/* Add more application details as needed */}
          </div>
          <div className="buttonstoapplications">
          <button className="delete-button" onClick={() => handleDeleteClick(app)}>
          ⌫
            </button>
             <button className="success-button" onClick={() => handleSuccessClick(app)}>
             ✓
            </button>
            <button className="success-button" onClick={() => handleUnSuccessClick(app)}>
            × 
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


{showSuccessModal && (
          <div className="modalpad">
            <div className="modal-content">
              <p>Пользователь  <strong>{appToSuccess.name}?</strong> согласился на курс?</p>
              <div className="modal-actions">
                <button onClick={handleConfirmSuccess}>Да</button>
                <button onClick={handleCancelSuccess}>Закрыть</button>
              </div>
            </div>
         
          </div>
        )}



{showUnSuccessModal && (
          <div className="modalpad">
            <div className="modal-content">
              <p>Пользователь  <strong>{appToUnSuccess.name}?</strong> отказался записываться на курс?</p>
              <div className="modal-actions">
                <button onClick={handleConfirmUnSuccess}>Да</button>
                <button onClick={handleCancelUnSuccess}>Закрыть</button>
              </div>
            </div>
          </div>
        )}
</>
  );
}
export default AllApplicationList;