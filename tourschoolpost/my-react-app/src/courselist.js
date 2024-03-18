import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import './courses.css';
function Courselist({ selectedNav }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
          const response = await fetch('http://localhost:8888/tourschoolphp/courselist.php');
          const data = await response.json();
          setData(data);
        }
        fetchData();
    }, [selectedNav]);

    const filteredData = selectedNav === 'all' ? data : data.filter(item => item.type === selectedNav);

    const items = filteredData.map((item, index) => {
        const link = item.course_name.replace(/\s/g, '-');
        return (
          <div key={index} className='courselink'>
            <Link to={link}>      
                <div className="courseimg">
                <img src={`http://localhost:8888/tourschoolphp/${item.image_url}`} alt="Tour Image" />

                </div>
                <div className="coursetype">{item.type}</div>
                <div className="coursename">{item.course_name}</div>
                <div className="coursesinfo">
                  <div className="courseslessons">
                    <div className="infocont">
                      <div className="imageles">
                        <img src="../layer.svg"></img>
                      </div>
                      <div className="infoles"> Количество уроков: {item.lesson_count}</div>
                    </div>
                
                  </div>
                </div>
            </Link>
          </div>
        );
    });
    

    return <div className='courseslist'>{items}</div>;
};

export default Courselist;