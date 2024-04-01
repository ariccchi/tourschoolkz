import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './message.css';
import Navpanmini from './navpanmini';
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({}); // Изменено на объект
  const [unreadMessages, setUnreadMessages] = useState({});
  const [scrollPosition, setScrollPosition] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [senderId, setSenderId] = useState(null);
  const [showRightChats, setShowRightChats] = useState(true);
  const [fullscreenChat, setFullscreenChat] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
// Добавьте следующее в начале компонента
const [imageLoading, setImageLoading] = useState(true);
const [selectedStudents, setSelectedStudents] = useState([]);
  let prevDate = null;
const [forwardpic, setForwardpic] = useState([]);
const [selectAll, setSelectAll] = useState(false);
  const handleToggleRightChats = () => {
    setShowRightChats(!showRightChats);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const id = decodedToken.sub;
  
        setSenderId(id);
        const role = decodedToken.role;
        let response;

        if (role === 'curator') {
          response = await axios.post('http://localhost:8888/tourschoolphp/usercurlist.php', {
            title: id
          });
        } else if (role === 'student') {
          response = await axios.post('http://localhost:8888/tourschoolphp/studentMessages.php', {
            title: id
          });
        } else if (role === 'admin') {
          response = await axios.post('http://localhost:8888/tourschoolphp/adminleslist.php', {
            title: id
          });
        }
  
        const data = response.data;
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000); // обновление каждую секунду
  
    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, []);
  




 

  const chatMessagesRef = useRef();
  useEffect(() => {
    const handleScroll = () => {
      const container = chatMessagesRef.current;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    
        if (isAtBottom) {
          setScrollPosition(container.scrollTop);
        }
      }
    };
  
    const chatContainer = chatMessagesRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatMessagesRef.current]);
  
  
  useEffect(() => {
    if (chatMessagesRef.current) {
      const container = chatMessagesRef.current;
  
      const handleScroll = () => {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        if (isAtBottom) {
          setShouldScrollToBottom(true);
        } else {
          setShouldScrollToBottom(false);
        }
      };
  
      container.addEventListener('scroll', handleScroll);
  
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [chatMessagesRef.current]);
  
  useEffect(() => {
    if (shouldScrollToBottom && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);

 
  const handleStudentsClick = (student) => {
    if (student.id === 'selectAll') {
      handleSelectAll();
    } else {
    
      const isSelected = selectedStudents.some((selectedStudent) => selectedStudent.id === student.id);
  
      if (isSelected) {
        // Remove the student from the selectedStudents array
        setSelectedStudents((prevSelectedStudents) =>
          prevSelectedStudents.filter((selectedStudent) => selectedStudent.id !== student.id)
        );
      } else {
        // Add the student to the selectedStudents array
        setSelectedStudents((prevSelectedStudents) => [...prevSelectedStudents, student]);
      }
    }
  };
  


  const markMessagesAsRead = async (receiverId, senderId) => {
    try {
      const response = await axios.post(
        'http://localhost:8888/tourschoolphp/markMessagesAsRead.php',
        JSON.stringify({
          receiver_user_id: receiverId,
          sender_user_id: senderId
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      

      if (!response.data.success) {
        console.error('Error marking messages as read:', response.data.error);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      getMessages(selectedStudent.id, senderId);
    }
  }, [selectedStudent, senderId]);

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setFullscreenChat(true);
    setShowRightChats(false);
    setShowRightChats(showRightChats);
    setShowRightChats(!showRightChats);

    try {
      setSelectedStudent(student);
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const senderId = decodedToken.sub;
  
      if (senderId !== student.id) {
        await markMessagesAsRead(student.id, senderId);
      }
  
      getMessages(student.id, senderId);
      ReadMess(student.id, senderId)
    } catch (error) {
      console.error('Error handling student click:', error);
    }
  };
  
  
  

  const getMessages = async (receiverId, senderId) => {
    try {
      const response = await axios.post(
        'http://localhost:8888/tourschoolphp/getMessages.php',
        JSON.stringify({
          receiver_user_id: receiverId,
          sender_user_id: senderId
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      const messagesArray = Array.from(response.data);
      setMessages((prev) => ({
        ...prev,
        [receiverId]: messagesArray
      }));
  
   
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const ReadMess = async (receiverId, senderId) => {
    try {
      const response = await axios.post(
        'http://localhost:8888/tourschoolphp/readmessages.php',
        JSON.stringify({
          receiver_user_id: receiverId,
          sender_user_id: senderId
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );  
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const handleFileChange = (files) => {
    const file = files[0];
    
    if (file) {

      const fileSizeInMB = file.size / (1024 * 1024); 
      const maxSizeInMB = 5; 
      
      if (fileSizeInMB > maxSizeInMB) {
        alert("Файл слишком большой. Пожалуйста, выберите файл размером до 5 МБ.");
      } else {
        setAttachedFile(file);
      }
    }
  };
  
  const handleForwClick = (fileName) => {
    setShowUserModal(true);
    console.log('Forwarding file:', fileName);
    setForwardpic(fileName)
  };
  
  // console.log(messages);
  const handleSendMessage = async () => {
    const read = 0;

    // Check if both message and attached file are present
    if (!selectedStudent || !selectedStudent.id || (!message && !attachedFile)) {
      console.error('Error: Missing student ID, message, or attached file');
      // You can display an error message or handle it in another way
      return;
    }
  
    const formData = new FormData();
    formData.append('sender_user_id', senderId);
    formData.append('receiver_user_id', selectedStudent.id);
    formData.append('message_text', message);
    formData.append('is_read', read);
    formData.append('file', attachedFile);
  
    try {
      const response = await axios.post(
        'http://localhost:8888/tourschoolphp/sendMessage.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.success) {
        setMessage('');
        setAttachedFile(null);
        getMessages(selectedStudent.id, senderId);
      } else {
        console.error('Error sending message:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    // Если "Выбрать всех" включено, выберите всех студентов, в противном случае сбросьте выбор
    if (!selectAll) {
      setSelectedStudents([...students]);
    } else {
      setSelectedStudents([]);
    }
  };
  const closeModal = () => {
    setSelectedStudent(null);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSendMessage();
    }
  };
  const formatMessageDate = (createdAt) => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${formattedHours}:${formattedMinutes}`;
  };

  const formatMessageDateMonth = (createdAt) => {
    const months = [
        "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];

    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth();
  
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = months[month];
  
    return `${formattedDay} ${formattedMonth}`;
};
   


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setMessage((prevMessage) => prevMessage + '\n');
    }
  };
  const [maxCharacters, setMaxCharacters] = useState(100);  

  useEffect(() => {
   
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 600) {
        setMaxCharacters(50);
      } else if (screenWidth <= 1024) {
        setMaxCharacters(75);
      } else {
        setMaxCharacters(100);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const formatMessageText = (text) => {
    if (text === null) {
      return '';
    }
    if (text.length > maxCharacters) {
      const chunks = [];
      let currentChunk = '';

      for (let i = 0; i < text.length; i++) {
        currentChunk += text[i];

        if ((i + 1) % maxCharacters === 0 || i === text.length - 1) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
      }

      return chunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {chunk}
        </React.Fragment>
      ));
    }


    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  };

  const handleSendButtonClick = async () => {
    console.log('Sending messages to selected students:', selectedStudents, showUserModal, forwardpic);
    const read = 0;
   

    const selectedUserIds = selectedStudents.map(user => user.id);
   console.log('Selected Students:', selectedStudents, senderId, selectedUserIds, read, forwardpic);
    const formData = new FormData();
    formData.append('sender_user_id', senderId);
    formData.append('receiver_user_ids', JSON.stringify(selectedUserIds)); // Use JSON.stringify to convert array to string
    formData.append('is_read', read);
    formData.append('file', forwardpic);
  
    try {
      const response = await axios.post(
        'http://localhost:8888/tourschoolphp/forwardmessage.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.success) {
        setMessage('');
        setAttachedFile(null);
        getMessages(selectedStudent.id, senderId);
      } else {
        console.error('Error sending message:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setShowUserModal(false);
  };

  const sortedStudents = students.slice().sort((a, b) => {
    // Если у студента `a` нет последнего сообщения или его message_id равен null, то он остается на своем месте
    if (!a.last_message || !a.last_message.message_id) {

        if (!b.last_message || !b.last_message.message_id) return 0;
        // Возвращаем 1, чтобы `a` остался на своем месте
        return 1;
    }
    // Если у студента `b` нет последнего сообщения или его message_id равен null, то он считается меньшим и идет выше в списке
    if (!b.last_message || !b.last_message.message_id) return -1;
    // Возвращаем разницу между message_id, как в предыдущем коде
    return b.last_message.message_id - a.last_message.message_id;
});

  return (
    <div className='couratorjs'>
      <Navpanmini/>
      <button className="hamburgerchat" onClick={handleToggleRightChats}>
        <img src="./hamburger.svg" alt="Toggle Right Chats" />
      </button>
      <div className={`rightchats ${showRightChats ? 'show' : ''}`}>
        <div className={`rightchats-container ${selectedStudent ? 'selected' : ''}`}>
          <div className='chath'>Чаты</div>
          <div className='chatinfousers'>
          {sortedStudents.map((student) => (
    <div
        key={student.id}
        className={`student-item ${selectedStudent === student ? 'selected' : ''}`}
        onClick={() => handleStudentClick(student)}
    >
        <div className='avatarka'>
            {student.avatar && <img className='avamessages' src={`http://localhost:8888/tourschoolphp/${student.avatar}`} alt={`${student.name} ${student.surname}'s Avatar`} />}
        </div>
        <div className='studlastmess'>
            <div className="student-name">
                {student.name}
                {'   '}
                {student.surname}
                {student.unread_messages > 0 && (
            <div className="notification-dot">{student.unread_messages}</div>
        )}
            </div>
            <div className="student-lastmess">
                {student.last_message.message_text && student.last_message.message_text.length > 20 ? `${student.last_message.message_text.slice(0, 20)}...` : student.last_message.message_text}
            </div>
        </div>
    </div>
))}
          </div>
        </div>
      </div>
      <div className={`leftchat ${fullscreenChat ? 'fullscreen' : ''}`}>
        {selectedStudent && (
        <div className="modal2" onClick={() => selectedStudent.id && ReadMess(selectedStudent.id, senderId)}>

            <div className='topnamestud'>
              <div className='roundavatarka'>
              {selectedStudent.avatar && <img className='avamessages' src={`http://localhost:8888/tourschoolphp/${selectedStudent.avatar}`} alt={`${selectedStudent.name} ${selectedStudent.surname}'s Avatar`} />}
      </div>
              <h2>{selectedStudent.name} {selectedStudent.surname}</h2>
            </div>
            
            <div className="chat-messages" ref={chatMessagesRef}>
      {messages[selectedStudent.id]?.map((message, index) => {
        const currentDate = formatMessageDateMonth(message.created_at);
        const showDate = prevDate !== currentDate; // Проверяем, отличается ли текущая дата от предыдущей

        // Если текущая дата отличается от предыдущей, сохраняем текущую дату
        if (showDate) {
          prevDate = currentDate;
        }

        return (
          <div key={index} className={message.sender_user_id === senderId ? 'outgoing_msg' : 'incoming_msg'}>
            {showDate && (
              <div className="message-date">
                {currentDate}
              </div>
            )}
           <div className="msg">

{(message.message_text || message.file_name) && (
  <div className={message.sender_user_id === senderId ? 'outgoing-text' : 'incoming-text'}>
    {formatMessageText(message.message_text)}
    {message.file_name && (
      <div className={`file-container ${message.sender_user_id === senderId ? 'outgoing-file' : 'incoming-file'}`}>
        {message.file_name.includes('.jpg') || message.file_name.includes('.jpeg') || message.file_name.includes('.png') ? (
          <>
            {/* Render image with alt text and optional placeholder */}
            <img
              className='picturemess'
              src={`http://localhost:8888/tourschoolphp/${message.file_name}`}
              alt="Attached Image"
              onError={(e) => e.target.src = 'path/to/placeholder.jpg'} // Optional placeholder
            />
            <img className='forw' src="./forward.svg" alt="Forward Icon" onClick={() => handleForwClick(message.file_name)} />
          </>
        ) : (
          /* Handle non-image files */
          <a
            className='ahrew'
            href={`http://localhost:8888/tourschoolphp/${message.file_name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ lineHeight: '60px' }}>{message.file_name.slice(4)}</span>
          </a>
        )}
      </div>
    )}
 
 
    <span className="message-date">
      {formatMessageDate(message.created_at)}
    </span>
  </div>
)}
</div>
          </div>
        );
      })}
    </div>
     
            <div className='alltextandyellow'>
              <div className='yellowbuttonchat2'>
                <label htmlFor="fileInput">
                  <img src="./clip.svg" alt="Attach File" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  onChange={(e) => handleFileChange(e.target.files)}
                  style={{ display: 'none' }}
                />
              </div>
  
              {attachedFile && (
                <div className="attached-file-info">
                  <span>{attachedFile.name}</span>
                  <span>- {attachedFile.size} bytes</span>
                </div>
              )}
  
              <div className="chat-input">
                <textarea
                  className="inin"
                  value={message}
                  placeholder="Сообщение"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className='yellowbuttonchat'>
                <img src="./sendmessage.svg" onClick={handleSendMessage} alt="Send Message" />

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
   
  

   
      {showUserModal && (
  <div className="modal-overlay4">
    <div className="modal4">
      <div className={`rightchats2 ${showRightChats ? 'show' : ''}`}>
        <button onClick={() => setShowUserModal(false)}>Отменить</button>
        <div
          className={`stuсdent-item ${selectAll ? 'selected' : ''}`}
          onClick={() => handleStudentsClick({ id: 'selectAll' })}
        >
          <div className={`student-name2 ${selectAll ? 'selected-name' : ''}`}>
            Выбрать всех
          </div>
        </div>

        <div className={`rightchats-container ${selectedStudents.length > 0 ? 'selected' : ''}`}>
          <div className='chatinfousers'>
            {/* Остальные студенты */}
            {students.map((student) => (
              <div
                key={student.id}
                className={`student-item ${selectedStudents.some((selectedStudent) => selectedStudent.id === student.id) ? 'selected' : ''}`}
                onClick={() => handleStudentsClick(student)}
              >
                <div className={`avatarka ${selectedStudents.some((selectedStudent) => selectedStudent.id === student.id) ? 'selected-avatar' : ''}`}></div>
                <div className={`student-name ${selectedStudents.some((selectedStudent) => selectedStudent.id === student.id) ? 'selected-name' : ''}`}>
                  {student.name} {student.surname}
                  {unreadMessages[student.id] && <div className="notification-dot"></div>}
                </div>
              </div>
            ))}
          </div>
          {selectedStudents.length > 0 && (
            <button className="send-button" onClick={handleSendButtonClick}>
              Отправить
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}


    </div>

    
  );
  
};

export default ListStudents;