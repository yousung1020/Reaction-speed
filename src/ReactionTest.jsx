import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReactionTest.css";

// 로컬 스토리지에 기록을 저장할 때 사용할 고유한 키 네임
const LOCAL_STORAGE_KEY = "reactionTimeRecords"

function ReactionTest() {
  const [startTime, setStartTime] = useState(null); // 초록색 버튼이 활성화된 순간의 시간(Date.now())
  const [reactionTime, setReactionTime] = useState(null); // 사용자가 버튼을 누를 때의 시간 (반응속도 값)
  const [waiting, setWaiting] = useState(false); // 기다리고 있는 중인지 여부(true면 대기)
  const [ready, setReady] = useState(false); // 클릭할 준비가 되었는지 여부(true일 때 대기 상태)
  const [timerId, setTimerId] = useState(); // 종료할 비동기 함수 id 상태
  const [early, setEarly] = useState(false); // 일찍 클릭했는지 여부 상태
  const [records, setRecords] = useState([]); // 반응 속도 기록 상태
  const [showRanking, setShowRanking] = useState(true)

  const nav = useNavigate(); // 특정 경로로 이동할 수 있는 함수
  const location = useLocation(); // 현재 url 정보를 가짐
  // location.search -> url의 쿼리 파라미터 부분을 문자열 형태로 가짐
  // queryParams -> URLSeachParams를 통해 쿼리 파라미터 문자열을 쉽게 다를 수 있는 객체 생성(파싱된 쿼리 파라미퉈!!!)
  const queryParams = new URLSearchParams(location.search);
  // 파싱된 쿼리 파라미터에서 사용자 정보 추출
  const userInfo = {
    // 단축평가(||)의 의미: 사용자 정보가 있으면(왼쪽 get 함수) true -> 사용자 정보를 추출
    // 사용자 정보가 없으면(공백이면) false -> 오른쪽 빈 문자열을 반환 ('')
    name: queryParams.get('name') || '',
    major: queryParams.get('major') || '',
    phone: queryParams.get('phone') || '',
  };

  // 새로운 기록을 records 상태에 추가
  const saveRecord = (time) => {
    // 이름이 있을 때만 json 데이터를 로컬 스토리지에 저장
    if(userInfo.name !== ""){
      setRecords((prev) => {
        return [
          ...prev,
          {
            score: time,
            ...userInfo
          }
        ]
      })
    }    
  };

  // 반속 테스트를 시작하는 함수("시작" 버튼을 클릭했을 때)
  const startTest = () => {
    // 초기 상태 설정
    setReactionTime(null);
    setWaiting(true);
    setReady(false);
    setEarly(false);
    setShowRanking(false);

    const timeoutId = setTimeout(() => {
      setStartTime(Date.now());
      setReady(true);
    }, Math.random() * 4000 + 1000); // 랜덤 대기 시간 설정

    setTimerId(timeoutId)
  };

  // 버튼 클릭시 실행되는 함수(포괄적 기능)
  const handleClick = () => {
    // 테스트가 시작된 경우
    if(waiting){
      if (ready) {
        const reactionTime = Date.now() - startTime;
        setReactionTime(reactionTime);
        saveRecord(reactionTime);
        setStartTime(null);
        setWaiting(false);
        setReady(false);
        setShowRanking(true);
      } else{
        // 상태값 초기화 및 비동기 함수 메모리 해제
        clearTimeout(timerId);
        setWaiting(false);
        setReady(false);
        setStartTime(null);
        setEarly(true);
        setShowRanking(true);
      }
    } else{
      startTest(); // 초기 상태에서 클릭하면 테스트 시작
    }
    
  };

  // 최초 마운트시 json 데이터 호출(로컬 스토리지에 저장되어 있던 기록(json)을 불러와 records 상태 초기화)
  useEffect(() => {
    const storedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedRecords){
      setRecords(JSON.parse(storedRecords));
    }
  }, [])

  // records 상태가 변경될 때(데이터를 저장할 상황이 발생되었을 때) 업데이트
  // records 상태의 내용을 json 형태로 변환 후 브라우저 로컬 스토리지에 저장 
  useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records])

  // setTimeout 함수는 비동기 함수이므로, 언마운트 시 클린업 함수를 적용해야 함
  useEffect(() => {
    return () => clearTimeout(timerId);   
  }, [timerId]);


  return (
    <div style={{ textAlign: "center" }} className="reaction-container">
      <h2>반응 속도 테스트 페이지!!!</h2>

      {early? (<p style={{color: "red"}}>너무 일찍 눌렀습니다! 다시 시작해주세요</p>) : 
      <p>{waiting ? (ready ? "지금 클릭하세요!" : "기다리세요...") : "버튼을 눌러 시작하세요"}</p>}
      
      <button
        onClick={handleClick}
        style={{
          fontSize: "20px",
          padding: "10px 20px",
          backgroundColor: ready ? "green" : "gray",
        }}
      >
        {waiting ? (ready ? "클릭!" : "대기 중") : "시작"}
      </button>
      {reactionTime && <p>당신의 반응 속도: {reactionTime}ms</p>}
      
      {showRanking && (
        <div className="ranking">
          <h2>반응 속도 순위!!!!</h2>
          {records.sort((front, back) => front.score - back.score)
          .map((item, index) => {
            if(item.name !== ""){
              if(index === 0){
                return <div style={{fontSize: "19px"}} key={index}><b>🥇 {index + 1}위: {item.name} | {item.major} | {item.score}ms</b></div>
              } else if(index === 1){
                return <div key={index} style={{fontSize: "19px"}}><b>🥈 {index + 1}위: {item.name} | {item.major} | {item.score}ms</b></div>
              } else if(index === 2){
                return <div key={index} style={{fontSize: "19px"}}><b>🥉 {index + 1}위: {item.name} | {item.major} | {item.score}ms</b></div>
              } else if(index < 7){
                return <div key={index} style={{fontSize: "19px"}}>🐌 {index + 1}위: {item.name} | {item.major} | {item.score}ms</div>
              }         
            }
          }   
          )}
          <button style={{marginTop: "30px"}} onClick={() => nav('/')}>사용자 정보 입력 페이지로 돌아가기</button>
        </div>
      )}
      
    </div>
  );
};

export default ReactionTest;