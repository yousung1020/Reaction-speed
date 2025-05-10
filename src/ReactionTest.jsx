import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReactionTest.css";

// 로컬 스토리지에 기록을 저장할 때 사용할 고유한 키 네임
const LOCAL_STORAGE_KEY = "reactionTimeRecords"

function ReactionTest() {
  const [startTime, setStartTime] = useState(null); // 초록색 버튼이 활성화된 순간의 시간(Date.now())
  // 추가: reactionTime -> 각 시도별로 반속 시간을 담을 배열로 초기화!!
  const [reactionTimes, setReactionTimes] = useState([]); // 사용자가 버튼을 누를 때의 시간 (반응속도 값)
  const [currentTime, setCurrentTime] = useState(null) // 현재 시도하는 반속 시간 값 상태
  const [waiting, setWaiting] = useState(false); // 기다리고 있는 중인지 여부(true면 대기) -> 초록색 기다리는중!
  const [ready, setReady] = useState(false); // 클릭할 준비가 되었는지 여부(true일 때 대기 상태)
  const [timerId, setTimerId] = useState(); // 종료할 비동기 함수 id 상태
  const [early, setEarly] = useState(false); // 일찍 클릭했는지 여부 상태
  const [records, setRecords] = useState([]); // 반응 속도 기록 상태
  const [showRanking, setShowRanking] = useState(true) // 반응속도 테스트 중에는 랭킹 정보 숨기기 상태
  const [avgTime, setAvgTime] = useState(null) // 평균 반응 속도 상태
  const [attempts, setAttempts] = useState(0); // 시도 횟수 상태
  const [startTog, setStartTog] = useState(false); // 시작 토글 상태
  const [clickTog, setClickTog] = useState(true); // 클릭 시 토글 상태
  const [btnTog, setBtnTog] = useState(false) // 버튼 토글 상태
  const [currentRanking, setCurrentRanking] = useState(null);

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
            ...userInfo,
            score: time
          }
        ]
      })
    }
  };

  // 반속 테스트를 시작하는 함수("시작" 버튼을 클릭했을 때)
  const startTest = () => {
    // 초기 상태 설정
    setStartTime(null);
    setReady(false);
    setEarly(false);
    setWaiting(true);
    setBtnTog(true);

    const timeoutId = setTimeout(() => {
      setStartTime(Date.now());
      setReady(true);
    }, Math.random() * 3000 + 2000); // 랜덤 대기 시간 설정 (최소 2초부터 5초 사이)

    setTimerId(timeoutId)
  };

  // 세 번의 시도중 초기 테스트 실행 함수
  const startTestInit = () => {
    setReactionTimes([]); // 이전 기록을 초기화
    setWaiting(false); // 대기 상태로 초기화
    setAvgTime(null); // 평균 반응 속도 시간 초기화
    setShowRanking(false); // 랭킹표 숨김
    setStartTog(true); // 테스트 활성화 
    setAttempts(0);
    setBtnTog(!btnTog);
    startTest(); // 첫번째 시도 시작
  }

  // 버튼 클릭시 실행되는 함수(포괄적 기능)
  const handleClick = () => {
    // 세 번의 시도를 진행중인지 여부에 따라 최초 실행 함수와 이후 함수 실행 조건을 나눔
    if(startTog){
      if(clickTog){
        // 정상 클릭시    
        if(ready){
          const reactionTime = Date.now() - startTime;
          setCurrentTime(reactionTime); // 현재 반응 시간 설정
          setReactionTimes((prev) => [...prev, reactionTime]); // 현재 시도의 반속 시간을 배열에 저장
          setReady(false);
          // 시도횟수가 세 번 이하인 경우
          if(attempts < 2){
            setAttempts((prev) => prev + 1); // 시도횟수 상태에 1 증가
            setWaiting(false); // 다음 클릭을 대기
            setClickTog(false);
            setBtnTog(!btnTog);
          // 세 번의 시도가 완료되었을 때
          } else{
            /* 평균 속도 계산식 동작 원리
            ex) [1, 2, 3, 4, 5] 라는 배열이 있다는 가정 하에
            1. 처음 순회 때는 sum 인수에는 0, time에는 1이 설정됨 -> sum + time을 함 (결과: 1)
            2. 두 번째 순회 때 sum 인수에는 이전 결괏값 1, time에는 2가 설정됨 -> sum + time (결과: 3)
            3. 해당 작업을 배열이 끝날 때까지 반복 후 (1+2+3+4+5) 결과를 해당 배열의 길이로 나눔 (5) -> 짜잔! 평균 완성!
            */
            const averageTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
            // 상태 값 초기화
            setBtnTog(false);
            setAvgTime(averageTime) // 출력 할 평균 시간 설정
            saveRecord(averageTime); // 로컬 스토리지에 기록 저장
            setAttempts(0);
            setCurrentTime(null);
            setStartTog(false);
            setClickTog(true);
            setWaiting(false);
            setShowRanking(true);
          }
        // 너무 일찍 클릭시
        } else{  
          // 상태 값 초기화
          clearTimeout(timerId);
          setWaiting(false);
          setReady(false);
          setStartTime(null);
          setEarly(true);
          setShowRanking(true);
          setAttempts(0);
          setCurrentTime(null);
          setStartTog(false);
          setClickTog(true);
          setBtnTog(false);
        }
      } else{ // 처음 시작 버튼을 누른 후 나머지 두 번의 시도
        startTest();
        setClickTog(!clickTog);
      }
    } else{
      startTestInit(); // 초기 시작
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
    const rank = [...records].sort((front, back) => front.score - back.score);

    if(userInfo.name && rank.length > 0){
      const userRecords = rank.filter(
        (record) => (record.name === userInfo.name && record.major === userInfo.major)
      )

      if(userRecords.length > 0){
        // 가장 마지막 기록
        const lastRecord = userRecords[userRecords.length - 1];
        console.log(lastRecord);
        
        for(let i = 0; i < rank.length; i++){
          if(rank[i].name === lastRecord.name && rank[i].major === lastRecord.major && rank[i].score === lastRecord.score){
            setCurrentRanking(i + 1);
            break;
          }
        }
      } else{
        setCurrentRanking(null);
      }
    } else{
      setCurrentRanking(null);
    }
    setShowRanking(true);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records, userInfo.name, userInfo.major]);

  // setTimeout 함수는 비동기 함수이므로, 언마운트 시 클린업 함수를 적용해야 함
  useEffect(() => {
    return () => clearTimeout(timerId);
  }, [timerId]);
  
  return (
    <>
      <div style={{ textAlign: "center" }} className="reaction-container">
        <h2>반응 속도 테스트 페이지!!!</h2>

        {early? (<p className="early-click">너무 일찍 눌렀습니다! 다시 시작해주세요</p>) : 
        <p className="message">{waiting ? (ready ? "지금 클릭하세요!" : "기다리세요...") : "버튼을 눌러 시작하세요"}</p>}

        <div className="attempts">시도횟수: {attempts} / 3</div>

        <button onClick={handleClick} className={`start-button ${btnTog? "active" : ""} 
        ${waiting? (ready? "ready" : "waiting") : ""}`}>
          {waiting ? (ready ? "지금이니!!!" : "대기...") : "시작"}
        </button>

        {currentTime && <p>당신의 현재 반응 속도: {currentTime}ms</p>}
        {avgTime && <div className="rank-info">{currentRanking?
          `현재 랭킹: ${currentRanking}등` : ""} <br></br> {userInfo.name ?
          `${userInfo.name}님의 평균 점수: ` : "당신의 평균 점수: "} {Math.ceil(avgTime)}ms</div>}
        {showRanking && (<button className="back-button" onClick={() => nav('/')}>사용자 정보 입력 페이지로 돌아가기</button>)}
      </div>

      <div>
        {showRanking && (
          <div className="ranking-container">
            <h2 className="ranking-title">반응 속도 순위!!!!</h2>
            {records.sort((front, back) => front.score - back.score)
            .map((item, index) => {
              if(item.name !== ""){
                if(index === 0){
                  return <div key={index} className="ranking-item"><b>🥇 {index + 1}위: {item.name} | {item.major} | {Math.ceil(item.score)}ms</b></div>
                } else if(index === 1){
                  return <div key={index} className="ranking-item"><b>🥈 {index + 1}위: {item.name} | {item.major} | {Math.ceil(item.score)}ms</b></div>
                } else if(index === 2){
                  return <div key={index} className="ranking-item"><b>🥉 {index + 1}위: {item.name} | {item.major} | {Math.ceil(item.score)}ms</b></div>
                } 
                return <div key={index} className="ranking-item">🐌 {index + 1}위: {item.name} | {item.major} | {Math.ceil(item.score)}ms</div>        
              }
            }   
            )}
            
          </div>
        )}
      </div>
    </>
  );
};

export default ReactionTest;