import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Index';
import Druppels from './pages/Druppels/Index';
import Gasten from './pages/Gasten/Index';
import Gebruikers from './pages/Gebruikers/Index';

import { User } from './types';

import "./App.css";
import "./CustomScrollbar.css"

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:3000');

  useEffect(() => {
    // Controleer of de gebruiker is ingelogd (bijv. door een token in localStorage te controleren)
    const token = localStorage.getItem('token');
    if (token) {
      // (Later) Check of token geldig is
      const userObj = localStorage.getItem('user');
      if (userObj) {
        setUser(JSON.parse(userObj));
      }
    }
  }, []);

  return (

    <Router>
      <div className='select-none flex overflow-hidden h-screen w-screen'>
        <SideBar user={user} setUser={setUser} apiUrl={apiUrl} setApiUrl={setApiUrl} />
        <div className='flex w-full h-full overflow-auto custom-scrollbar'>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/druppels" element={<Druppels user={user} />} />
            <Route path="/gasten" element={<Gasten user={user} />} />
            <Route path='/gebruikers' element={<Gebruikers user={user} />} />
          </Routes>
        </div>
      </div>
    </Router >
  );
}

export default App;
