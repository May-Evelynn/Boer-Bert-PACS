import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Index';
import Druppels from './pages/Druppels/Index';
import Personen from './pages/Personen/Index';

import "./App.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (

    <Router>
      <div className='select-none flex'>
        <SideBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn}/>} />
          <Route path="/druppels" element={<Druppels isLoggedIn={isLoggedIn} />} />
          <Route path="/personen" element={<Personen isLoggedIn={isLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
