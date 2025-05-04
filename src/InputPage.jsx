import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div>
        <h2>사용자 정보 입력 페이지!!!</h2>  
        <div>
          <label>이름: <input type="text" name="name" value={userInfo.name} onChange={handleUserInfo} /></label>
        </div>
        <div>
          <label>학과: <input type="text" name="major" value={userInfo.major} onChange={handleUserInfo} /></label>
        </div>
        <div>
          <label>전화번호: <input type="text" name="phone" value={userInfo.phone} onChange={handleUserInfo} /></label>
          <p></p>
        </div>
        <button onClick={handelStartGame}>게임 시작!</button>
      </div>
    )
}

export default InputPage;