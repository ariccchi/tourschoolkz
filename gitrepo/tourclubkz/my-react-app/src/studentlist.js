import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './config';
function StudentList ({ complexArray }) {
    
    const token = localStorage.getItem('token');
    const [Curatordata, setCuratorData] = useState([]);
    const [Admindata, setAdminData] = useState([]);
    const [loading, setLoading] = useState(true);
    const decodedToken = jwtDecode(token);
    const [data, setData] = useState([]);
  
    const [data3, setData3] = useState([]);
    const id = decodedToken.sub;
    const role = decodedToken.role;
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (complexArray && complexArray.length > 0) {
                    if (complexArray[0].role === 'curator') {
                        const curatorResponse = await fetch(`${BASE_URL}tourschoolphp/curatorlist.php`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user: complexArray[0].id }),
                        });

                        const curatorData = await curatorResponse.json();
                        setCuratorData(curatorData);
                    } else if (complexArray[0].role === 'admin') {
                        const adminResponse = await fetch(`${BASE_URL}tourschoolphp/adminlist.php`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user: complexArray[0].id  }),
                        });

                        const adminData = await adminResponse.json();
                        setAdminData(adminData);
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }

          
        }

        fetchData();
    }, [complexArray[0].id ]);
    const isCurator = complexArray[0]?.role === 'curator';
    const isAdmin = complexArray[0]?.role === 'admin';
return (
<> 
        <div className="studentsprofilelist">
       
<>

{Curatordata.length > 0 && (
    <>
        {Curatordata.map((student, index) => (
            <Link to={`/profile/${student.id}`} key={index}>
                <div className="namesurnameprofile" key={index}>
                <img className="imgavatarstud" src= {`${BASE_URL}tourschoolphp/${student.avatar}` }></img>
                    <div className="namesurname">
                        {student.name} {student.surname}
                    </div>
                </div>
            </Link>
        ))}
    </>
)}

{isAdmin && Admindata.length > 0 && (
    <>
        <div className="infoprofile"></div>
        {Admindata.map((student, index) => (
            <Link to={`/profile/${student.id}`} key={index}>
                <div className="namesurnameprofile" key={index}>
                    <img className="imgavatarstud" src= {`${BASE_URL}tourschoolphp/${student.avatar}` }></img>
                    <div className="namesurname">
                        {student.name} {student.surname}
                    </div>
                </div>
            </Link>
        ))}
    </>
)}

</>

        </div>
        </>
)


}

export default StudentList;