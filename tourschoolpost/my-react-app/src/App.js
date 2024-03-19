
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
function App() {
    return (
        <div className="App">
            <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path = "/profile" element={<Profile/>}/>
                    <Route path = "/profile/:person" element={<Studprof/>}/>
                    <Route path = "/courses" element={<Courses/>}/>
                    <Route path="/courses/:title" element={<LessonListPage/>}></Route>
                    <Route path="/courses/:title/:lesson" element={<LessonMain/>}></Route>
                    <Route path="/courses/:title/lesson/:lesson" element={<Lessonpdf/>}></Route>
                    <Route path="/courses/:title/:lesson/summary-page" element={<SummaryPage />} />
                    <Route path="/courses/:title/:lesson/finaltest" element={<Finaltest />} />
                    <Route path="/courses/:title/:lesson/finaltest" element={<Finaltest />} />
            </Routes>
        </div>
    );
}

export default App;
