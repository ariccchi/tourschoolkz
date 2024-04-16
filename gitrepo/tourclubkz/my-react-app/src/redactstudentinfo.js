import React, { useState, useEffect } from "react";
import { BASE_URL } from './config';
function BlockUser({ value1, value2, value3, value4 }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const handleBlockClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleBlockUser = async () => {
        console.log(value1);
        try {
            // Отправляем измененные данные на сервер
            const response = await fetch(`${BASE_URL}tourschoolphp/Blockuser.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: value1,
                    curatorid: value2,
                    blockReason: blockReason, // Use blockReason directly from state
                }),
            });
    
            const newData = await response.json();
    
    
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
        setIsModalOpen(false);
        window.location.reload();
    };

    const handleUnblockUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}tourschoolphp/Unblockuser.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: value1,
                    curatorid: value2,
                }),
            });
    
            const newData = await response.json();
        } catch (error) {
            console.error('Ошибка при разблокировке пользователя:', error);
        }
        setIsModalOpen(false);
        window.location.reload();
    };
    const isCurator = value4[0]?.role === 'curator';
    const isCurrentUserCurator = value2[0]?.curator === value3;
    const isAdmin = value4[0]?.role === 'admin';
    const isUserBlocked = value3[0]?.user_exists_in_blocks === 1;
    return (
        <>
        {(!isUserBlocked && isCurrentUserCurator) || (isAdmin && !isUserBlocked) && (
            <>
                {/* <button className="redactirovat" onClick={handleEditClick}>Редактировать</button> */}
                <button className="redactirovat" onClick={handleBlockClick}>Заблокировать</button>
            </>
        )}
         {isUserBlocked && (
                <>
                <h1 className="blocked-message2">Пользователь заблокирован</h1> 
                <h1 className="blocked-message2">Причина: {value3[0].block_reason}</h1> 
                </>
            )}
           {(isUserBlocked && isAdmin) && (
            <>
               
                <button className="redactirovat2" onClick={handleBlockClick}>Разблокировать</button>
            </>
        )}
          {isModalOpen && (
            <div className="modal-overlay3">
                <div className="modal3">
                    {isAdmin && isUserBlocked ? (
                        <>
                            <h2>Вы уверены, что хотите разблокировать пользователя?</h2>
                            <button onClick={handleCloseModal}>Отмена</button>
                            <button onClick={handleUnblockUser}>Разблокировать</button>
                        </>
                    ) : (
                        <>
                            <h2>Вы уверены, что хотите заблокировать пользователя?</h2>
                            <input
                                type="text"
                                placeholder="Введите причину блокировки"
                                onChange={(e) => setBlockReason(e.target.value)}
                            />
                            <button onClick={handleCloseModal}>Отмена</button>
                            <button onClick={handleBlockUser}>Заблокировать</button>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    )
}

export default BlockUser;