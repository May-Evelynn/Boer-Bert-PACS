import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Index';
import Druppels from './pages/Druppels/Index';
import Gasten from './pages/Gasten/Index';
import Gebruikers from './pages/Gebruikers/Index';

import "./App.css";
import "./CustomScrollbar.css"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (

    <Router>
      <div className='select-none flex overflow-hidden h-screen w-screen'>
        <SideBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className='flex w-full h-full overflow-auto custom-scrollbar'>
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
            <Route path="/druppels" element={<Druppels isLoggedIn={isLoggedIn} />} />
            <Route path="/gasten" element={<Gasten isLoggedIn={isLoggedIn} />} />
            <Route path='/gebruikers' element={<Gebruikers isLoggedIn={isLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </Router >
  );
}

export default App;
