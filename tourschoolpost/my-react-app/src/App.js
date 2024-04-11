
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Profile from './profile';
import Courses from './сourses';
import LessonListPage from './Lessonlist';
import LessonMain from './lessonmain';
import SummaryPage from './SummaryPage';
import Finaltest from './finaltest';
import Lessonpdf from './lessonpdf';
import Studprof from './studentsprof';
import Messages from './messages';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './Adminroute';
import AddLesson from './addLesson';
import Acceslogin from './acceslogin';
import Checkstud from './checkstudent';
import LandingPage from './landingpage';
import ApplicationList from './Applicationlist';
import Static from './static';
function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path = "/profile" element={<Acceslogin><PrivateRoute><Profile/></PrivateRoute></Acceslogin>}/>
                    <Route path = "/profile/:person" element={<Checkstud><Acceslogin><PrivateRoute><Studprof/></PrivateRoute></Acceslogin></Checkstud>}/>
                    <Route path = "/messages" element={<Acceslogin><PrivateRoute><Messages/></PrivateRoute></Acceslogin>}/>
                    <Route path = "/applications" element={<Acceslogin><PrivateRoute><AdminRoute><ApplicationList/></AdminRoute></PrivateRoute></Acceslogin>}/>


                    <Route path = "/static" element={<Acceslogin><PrivateRoute><AdminRoute><Static/></AdminRoute></PrivateRoute></Acceslogin>}/>


                    <Route path = "/Addlesson/:course" element={<Acceslogin><PrivateRoute><AdminRoute><AddLesson/></AdminRoute></PrivateRoute></Acceslogin>}/>
                    <Route path = "/courses" element={<Acceslogin><PrivateRoute><Courses/></PrivateRoute></Acceslogin>}/>
                    <Route path="/courses/:title" element={<Acceslogin><PrivateRoute><LessonListPage/></PrivateRoute></Acceslogin>}></Route>
                    <Route path="/courses/:title/:lesson" element={<Acceslogin><PrivateRoute><LessonMain/></PrivateRoute></Acceslogin>}></Route>
                    <Route path="/courses/:title/lesson/:lesson" element={<Acceslogin><PrivateRoute><Lessonpdf/></PrivateRoute></Acceslogin>}></Route>
                    <Route path="/courses/:title/:lesson/summary-page" element={<Acceslogin><PrivateRoute><SummaryPage /></PrivateRoute></Acceslogin>} />
                    <Route path="/courses/:title/:lesson/finaltest" element={<Acceslogin><PrivateRoute><Finaltest /></PrivateRoute></Acceslogin>} />
                    <Route path="/courses/:title/:lesson/finaltest" element={<Acceslogin><PrivateRoute><Finaltest /></PrivateRoute></Acceslogin>} />
            </Routes>
        </div>
    );
}

export default App;
