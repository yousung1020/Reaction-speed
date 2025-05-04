import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InputPage from './InputPage';
import ReactionTest from './ReactionTest';

function App(){
    return (
      <Router> {/** react router 기능 활성화 */}
        <Routes> {/** url 경로에 따른 컴포넌트 매칭 */}
          <Route path='/' element={<InputPage />} />
          <Route path='/startGame' element={<ReactionTest />} />
        </Routes>
      </Router>
    )
}

export default App;