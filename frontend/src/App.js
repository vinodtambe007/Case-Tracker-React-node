import './App.css';
import {BrowserRouter as Router,
  Routes,
  Route } from "react-router-dom";
import Login from './Components/Login';
import CaseList from './Components/CaseList';

function App() {
  return (
    <Router>
       <div>
          <Routes>
              <Route exact path="/" element={<Login />}/>
              <Route exact path="/caselist" element={<CaseList />}/>
          </Routes>
       </div>
   </Router> 
  );
}

export default App;
