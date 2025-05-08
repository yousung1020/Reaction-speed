import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./InputPage.css"

function InputPage(){
    // 사용자 이름 및 학과 정보 입력 상태
    const [userInfo, setUserInfo] = useState({
        name: "",
        major: "",
        phone: "",
    });

    const nav = useNavigate(); // 특정 경로로 이동할 수 있는 함수

    const handleUserInfo = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    }

    const handelStartGame = () => {
        const queryParams = new URLSearchParams(userInfo); // 입력 데이터를 쿼리 파라미터로 변환
        nav(`/startGame?${queryParams.toString()}`); // startGame 경로로 이동하면서 데이터(사용자 정보) 전달 
    }

    return(
      <>
        <div className='container'>
          <div className='input-section'>
            <h1>사용자 정보 입력</h1>
            <div className='input-group'>
              <input type="text" name="name" value={userInfo.name} onChange={handleUserInfo} placeholder='이름'/>
            </div>
          
            <div className='input-group'>
              <input list='browsers' id='browser' value={userInfo.major} onChange={handleUserInfo} name='major' placeholder='학과'/>
              <datalist id='browsers'>
                <option value="기계공학과"/>
                <option value="기계설계공학과"/>
                <option value="자동화공학과"/>
                <option value="로봇소프트웨어과"/>
                <option value="전기공학과"/>
                <option value="반도체전자공학과"/>
                <option value="정보통신공학과"/>
                <option value="소방안전관리과"/>
                <option value="웹응용소프트웨어공학과"/>
                <option value="컴퓨터소프트웨어공학과"/>
                <option value="인공지능소프트웨어학과"/>
                <option value="생명화학공학과"/>
                <option value="바이오융합공학과"/>
                <option value="건축과"/>
                <option value="실내건축디자인과"/>
                <option value="시각디자인과"/>
                <option value="AR·VR콘텐츠디자인과"/>
                <option value="경영학과"/>
                <option value="세무회계학과"/>
                <option value="유통마케팅학과"/>
                <option value="호텔관광학과"/>
                <option value="경영정보학과"/>
                <option value="빅데이터경영과"/>
                <option value="자유전공학과"/>
              </datalist>
            </div>
          
            <div className='input-group'>
              <input type="text" name="phone" value={userInfo.phone} onChange={handleUserInfo} placeholder='전화번호'/>
            </div>
            <button onClick={handelStartGame} className='game-button'>게임 시작!</button>
          </div>
          <div className='el-info-section'>
            <h1>Hello, EL!</h1>
          </div>
        </div>
          
      </>
    )
}

export default InputPage;