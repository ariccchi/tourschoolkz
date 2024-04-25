import React, { useState } from "react";
import './landingpage.css';
import { useEffect, useRef } from 'react';
import { BASE_URL } from './config';

function LandingPage() {
  
    const element1Ref = useRef(null);
    const element2Ref = useRef(null);
    const element3Ref = useRef(null);
    const [element1Visible, setElement1Visible] = useState(false);
    const [element2Visible, setElement2Visible] = useState(false);
    const [element3Visible, setElement3Visible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');   
  const [message, setMessage] = useState('');


  const handleClickAbout = () => {
    const aboutElement = document.querySelector('.aboutuslanding');
    if (aboutElement) {
      aboutElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleTop = () => {
    const TopElement = document.querySelector('.containerlandup');
    if (TopElement) {
        TopElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClickCourse = () => {
    const courseElement = document.querySelector('.programmcourse');
    if (courseElement) {
      courseElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const { top: element1Top, bottom: element1Bottom } = element1Ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (element1Top < windowHeight && element1Bottom >= 0) {
        setElement1Visible(true);
      } else {
        setElement1Visible(false);
      }
    };

    const interval = setInterval(handleScroll, 1000);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем видимость элемента при загрузке страницы

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [element1Ref]);

  useEffect(() => {
    const handleScroll = () => {
      const { top: element2Top, bottom: element2Bottom } = element2Ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (element2Top < windowHeight && element2Bottom >= 0) {
        setElement2Visible(true);
      } else {
        setElement2Visible(false);
      }
    };

    const interval = setInterval(handleScroll, 1000);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем видимость элемента при загрузке страницы

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [element2Ref]);

  useEffect(() => {
    const handleScroll = () => {
      const { top: element3Top, bottom: element3Bottom } = element3Ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (element3Top < windowHeight && element3Bottom >= 0) {
        setElement3Visible(true);
      } else {
        setElement3Visible(false);
      }
    };

    const interval = setInterval(handleScroll, 1000);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем видимость элемента при загрузке страницы

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [element3Ref]);
    
    
  const handleClickRegistration = () => {
    const registrationElement = document.querySelector('.feedbackland');
    if (registrationElement) {
      registrationElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
    const handleSubmit = async (event) => {
    event.preventDefault();
   
    if(name == '' || phone == '' || email == '') {
        setMessage('Заполните все поля')
    }else {
    try {

        const response = await fetch(`${BASE_URL}tourschoolphp/Application.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name:name, phone: phone, email: email }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            setMessage('Вы оставили заявку');
        } else if(data.status=== 'empty') {
            setMessage('Заполните все поля');
        }


    } catch (error) {
        console.error('An error occurred:', error);
        setMessage('Не получилось оставить заявку, попробуйте позже');
    }
}
    alert(message)
};

    return (
        <div className="containerlanding">
            <div className="headerlanding">
                <div className="tourlogoland" onClick={handleTop}>
                    <div className="logohead"></div>
                    <div className="tourclubhead">TourClub</div>
                </div>
                <div className="tourinfoland" onClick={handleClickAbout}>О нас</div>
                <div className="tourinfoland" onClick={handleClickCourse}>Про курс</div>
                <div className="tourinfoland" onClick={handleClickRegistration}>Записаться на курс</div>

                <a href="/login" className="tourloginland">Войти</a>
            </div>


            <div className="containerlandup">
                <div className="containerlandupleft">
                    <div className="bigtextlandup">Стань восстребованным турагентом</div>
                    <div className="smalltextlandup">Стань востребованным турагентом и зарабатывай от 500 $ в месяц!</div>
                    <div className="buttonlandzap" onClick={handleClickRegistration}>Записаться на курс</div>
                </div>


                <div className="containerlandupright">
                    <div className="womanclassname">
                        <img className="womansrc" src="./womanpng.png"></img>
                        <div className="orangeroundland"></div>
                       
                        </div>
                      </div>



            </div>


            <div ref={element2Ref} className={element2Visible ? 'dreamplush slideInLeft' : 'dreamplush'}>Мечтаешь о работе, которая сочетает в себе свободу, путешествия и высокий доход?</div>


            <div className="courseinfopeople">
                <div className="h1courseinfopeople">Кому подходит курс?</div>

                <div className="reasonsboxcourse">
                    <div className="reasoncourses">Тем, кто увлекается путешествиями</div>
                    <div className="reasoncourses">Тем, кто уже работает в турагентстве и хочет повысить свою квалификацию</div>
                    <div className="reasoncourses">Тем, кто хочет начать карьеру в сфере туризма</div>
                    <div className="reasoncourses">Тем, кто хочет работать из любой точки мира</div>
                </div>

            </div>



            <div className="aboutuslanding">
                <div className="aboutush1">О нас:</div>
                <div className="aboutusboxes">
                    <div className="aboutusbox">
                        <div className="boxfromaboutus yellowland">
                            <img src='./plane.svg'></img>
                        </div>
                        <div className="zagaboutus">150 000 путешествий</div>
                        <div className="infoaboutus">Наша компания осуществила помощь более чем 150 000 путешественникам в реализации их заветных желаний, связанных с открытиями новых уголков мира</div>
                    </div>
                    <div className="aboutusbox">
                        <div className="boxfromaboutus greenland">
                            <img src='./messages.svg'></img>
                        </div>
                        <div className="zagaboutus">Сотрудничество</div>
                        <div className="infoaboutus">Наладили плодотворное сотрудничество с ведущими туристическими компаниями и операторами, что гарантирует моим клиентам доступ к самым выгодным предложениям на рынке.</div>
                    </div>
                    <div className="aboutusbox">
                        <div className="boxfromaboutus blueland">
                            <img src='./profile.svg'></img>
                        </div>
                        <div className="zagaboutus">Студенты</div>
                        <div className="infoaboutus">За 10 лет работы нашего курса 70% выпускников успешно реализовали себя в туристической сфере</div>
                    </div>
                </div>
            </div>

            <div className="aboutmelanding">
            <div className="containerlandcenterright">
                    <div className="womanclassnamecenter">
                        <img className="womansrccenter" src="./womencenter.png"></img>
                        <img className="blobcenter" src="./centerwomenblob.svg"></img>
                        </div>
                      </div>

                      <div className="aboutmetext">
                        <div className="aboutmeh2">Обо мне:</div>
                        <div className="aboutmetexth3">Я – [Ваше имя], и на протяжении 20 лет я успешно реализую себя в качестве основателя и директора компании TourClub в туристической индустрии.
В сферу моей компетенции входят:
Глубокие знания и практический опыт в области различных видов туризма: будь то пляжный отдых, познавательные экскурсии, горнолыжные приключения, оздоровительные программы или экспедиционные маршруты.
Индивидуальный подход к каждому клиенту: умеем понимать потребности и пожелания каждого человека, что позволяет нам создавать максимально комфортные условия для каждого путешествия.
Разработка эффективных стратегий рекламы и продвижения туристических услуг: используем все доступные инструменты онлайн-маркетинга, PR и другие методы для привлечения клиентов.
</div>
                      </div>
            </div>
            <div ref={element1Ref} className={element1Visible ? 'dreamplush slideInLeft' : 'dreamplush'}>Открой мир безграничных возможностей c курсом "Стань восстребованным турагентом! "</div>


<div className="programmcourse">
<div className="programmcourseh1">Программа курса:</div>
<div className="programmput">
    <div className="leftprogramm">
        <div className="lefttextprogramm">Классификация отелей, стран по сезонам</div>
        <div className="lefttextprogramm">Отношения туроператор - турагент</div>
        <div className="lefttextprogramm">Граммотный подбор тура</div>
            </div>
            <div className="yellowlineprog">
                <div className="yellowlineon"></div>
                <img className="arrowland" src="./arrowlanding.png"></img>
            </div>



            <div className="rightprogramm">
        <div className="righttextprogramm">Терминология для туристического агента</div>
        <div className="righttextprogramm">Типы размещения, типы питания</div>
        <div className="righttextprogramm">Калькуляция тура</div>
        <div className="righttextprogramm">Популярные сезонные направления</div>
            </div>
</div>
<div className="certificateget">Получение сертификата о прохождении</div>

</div>
<div ref={element3Ref} className={element3Visible ? 'dreamplush needbot slideInLeft' : 'dreamplush needbot '}>Запишись на курс сейчас и получи в подарок уроки по уверенному голосу в продажах</div>


<div className="feedbackland">
    <div className="leftsideoffeedback">
        <div className="formtogetus">
        <div className="getconsland">Записаться на консультацию</div>
        <div className="input-groupland">
            
            <label htmlFor="name" className="labelnamelanding"></label>
            <input type="text" id="text" name="text" placeholder="Имя" className="inputnameland"     maxLength="25" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="name" className="labelnamelanding"></label>
            <input type="text" id="text" name="text" placeholder="Номер телефона" className="inputnameland"     maxLength="25" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <label htmlFor="name" className="labelnamelanding"></label>
            <input type="text" id="text" name="text" placeholder="Электронная почта" className="inputnameland"     maxLength="25" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="submitbuttonland" onClick={handleSubmit}>
    Записаться
</div> 
{message && <div className="messagegetland">{message}</div>}

        </div>
     

        </div>
    </div>
    <div className="rightsideoffeedback">
        <div className="rightdownside">
        <div className="rightbigfeed">Связаться с нами</div>
        <div className="rightsmallfeed">Подайте заявку на звонок для покупки курса, консультации и прочих вопросов. Наши менеджеры свяжутся с вами за короткое время</div>
        </div>
    </div>

</div>


        </div>
    )
}

export default LandingPage;