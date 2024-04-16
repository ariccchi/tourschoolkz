import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import Navpanmini from "./navpanmini";
import './static.css';
import LineChart from "./linegraf";
import { BASE_URL } from './config';
function Static() {
    const [staticUser, setStaticUser] = useState([]);


    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [chartData, setChartData] = useState({ xValues: [], yValues: [] });





    const [staticApp, setStaticApp] = useState([]);
    const [chartDataApp, setChartDataApp] = useState({ xValues: [], yValues: [] });

    const [staticAppSucc, setStaticAppSucc] = useState([]);
    const [chartDataAppSucc, setChartDataAppSucc] = useState({ xValues: [], yValues: [] });

 

   


    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const response2 = await axios.get(`${BASE_URL}tourschoolphp/staticapplication.php`);
                setStaticApp(response2.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
       
        fetchData2();
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}tourschoolphp/staticlanduser.php`);
                setStaticUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
       
        fetchData();

        const fetchData3 = async () => {
            try {
                const response3 = await axios.get(`${BASE_URL}tourschoolphp/staticsuccessaplication.php`);
                setStaticAppSucc(response3.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
       
        fetchData3();

    }, []);



    useEffect(() => {
        const dataByDate = staticUser.reduce((acc, user) => {
            const date = new Date(user.registration_date);
            if (date.getMonth() === currentMonth) {
                const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
                acc[day] = (acc[day] || 0) + 1;
            }
        
            return acc;
        }, {});

        const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
        const xValues = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        const yValues = xValues.map(day => dataByDate[day] || 0);

        setChartData({ xValues, yValues });
    }, [staticUser, currentMonth]);





    
    useEffect(() => {
        const dataByDate = staticApp.reduce((acc, user) => {
            const date = new Date(user.timestamp);
            if (date.getMonth() === currentMonth) {
                const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
                acc[day] = (acc[day] || 0) + 1;
            }

            return acc;
        }, {});

        const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
        const xValues = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        const yValues = xValues.map(day => dataByDate[day] || 0);

        setChartDataApp({ xValues, yValues });
    }, [staticApp, currentMonth]);



    useEffect(() => {
        const dataByDate = staticAppSucc.reduce((acc, user) => {
            const date = new Date(user.timestamp);
            if (date.getMonth() === currentMonth) {
                const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
                acc[day] = (acc[day] || 0) + 1;
            }

            return acc;
        }, {});

        const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
        const xValues = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        const yValues = xValues.map(day => dataByDate[day] || 0);

        setChartDataAppSucc({ xValues, yValues });
    }, [staticApp, currentMonth]);



    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    };

    return (
        <>
        <div className="containerstatic">
            <div className="monthLabel">
            <button className='monthstatic' onClick={handlePrevMonth}>{'<'}</button>
<h2>{new Date(0, currentMonth).toLocaleString('ru-RU', { month: 'long' })}</h2>
<button className='monthstatic' onClick={handleNextMonth}>{'>'}</button>

            </div>
            <div className="studentregstat">
            <LineChart xValues={chartData.xValues} yValues={chartData.yValues} lineLabel="Пользователей зарегистрировалось" color="rgb(123, 23, 129)" />

            </div>


            <div className="studentregstat">
            <LineChart xValues={chartDataApp.xValues} yValues={chartDataApp.yValues} lineLabel="Заявок оставленно" color="rgb(0, 0, 129)" />

            </div>

            <div className="studentregstat">
            <LineChart xValues={chartDataAppSucc.xValues} yValues={chartDataAppSucc.yValues} lineLabel="Успешные заявки" color="rgb(320, 23, 139)" />

            </div>



        </div>
        <Navpanmini/>
        </>
    )
}

export default Static;
