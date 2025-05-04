import React, { useState } from "react"; // React를 불러오고 useState Hook을 가져옴옴

const ToDoApp = () => {
  // 할 일 목록(tasks)과 사용자 입력값(input)을 상태로 관리함.
  const [tasks, setTasks] = useState([]); // 할 일 목록을 저장하는 상태 (초기값: 빈 배열)
  const [input, setInput] = useState(""); // 사용자 입력값을 저장하는 상태 (초기값: 빈 문자열)

  // 입력 필드가 변경될 때 호출되는 함수
  const handleInputChange = (event) => {
    setInput(event.target.value); // 입력 필드의 값을 input 상태로 업데이트
  };

  // 새로운 할 일을 추가하는 함수
  const addTask = () => {
    if (input.trim() !== "") { // 입력값이 공백이 아니라면
      const newTask = { text: input, completed: false }; // 새로운 할 일 객체 생성 (기본적으로 완료 상태는 false)
      setTasks([...tasks, newTask]); // 기존 할 일 목록에 새로운 할 일을 추가
      setInput(""); // 입력 필드를 초기화
    }
  };

  // 특정 할 일의 완료 상태를 토글(전환)하는 함수
  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, taskIndex) =>
      taskIndex === index
        ? { ...task, completed: !task.completed } // 클릭한 항목의 완료 상태를 반전
        : task // 나머지 항목은 그대로 유지
    );
    setTasks(updatedTasks); // 업데이트된 할 일 목록을 상태에 저장
  };

  // 특정 할 일을 삭제하는 함수
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index); // 선택한 항목 제외한 나머지 항목만 필터링
    setTasks(updatedTasks); // 업데이트된 할 일 목록을 상태에 저장
  };

  return (
    <div style={{ margin: "20px" }}> {/* 전체 레이아웃을 잡는 div */}
      <h1>To-Do 리스트</h1> {/* 제목 표시 */}
      <input
        type="text"
        value={input} // 입력 필드에 input 상태 값을 표시
        onChange={handleInputChange} // 입력 필드가 변경될 때 handleInputChange 호출
        placeholder="할 일을 입력하세요" // 사용자가 볼 수 있는 힌트 텍스트
      />
      <button onClick={addTask}>추가</button> {/* 버튼 클릭 시 addTask 함수 호출 */}
      <ul>
        {tasks.map((task, index) => ( // 할 일 목록을 순회하며 각각의 항목을 렌더링
          <li
            key={index} // React에서 리스트를 렌더링할 때 고유한 키를 지정해야 함
            style={{
              textDecoration: task.completed ? "line-through" : "none", // 완료 상태에 따라 텍스트 스타일 변경
              color: task.completed ? "gray" : "black", // 완료된 항목은 회색, 미완료는 검은색
            }}
          >
            <span
              onClick={() => toggleCompletion(index)} // 항목 클릭 시 완료 상태 토글
              style={{ cursor: "pointer" }} // 커서를 손 모양으로 변경
            >
              {task.text} {/* 할 일의 텍스트 표시 */}
            </span>
            <button onClick={() => deleteTask(index)}>삭제</button> {/* 클릭 시 deleteTask 호출 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoApp; // ToDoApp 컴포넌트를 외부에서 사용할 수 있도록 내보냄