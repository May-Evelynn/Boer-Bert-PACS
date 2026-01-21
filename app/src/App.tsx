import { useEffect, useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Index';
import Druppels from './pages/Druppels/Index';
import Gasten from './pages/Gasten/Index';
import Gebruikers from './pages/Gebruikers/Index';

import { User, ApiUrl, Scan, Facility, Keyfob, DataContext, DEFAULT_API_URLS } from './types';
import { setApiBaseUrl, getApiBaseUrl } from './services/api';

import "./App.css";
import "./CustomScrollbar.css"

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  const [apiUrls, setApiUrls] = useState<ApiUrl[]>(DEFAULT_API_URLS);
  const [activeApiUrl, setActiveApiUrlState] = useState<string>(getApiBaseUrl());
  
  const [scans, setScans] = useState<Scan[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [keyfobs, setKeyfobs] = useState<Keyfob[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setActiveApiUrl = (url: string) => {
    setActiveApiUrlState(url);
    setApiBaseUrl(url);
    setApiUrls(prev => prev.map(apiUrl => ({
      ...apiUrl,
      active: apiUrl.value === url
    })));
  };

  const contextValue = useMemo(() => ({
    user,
    setUser,
    apiUrls,
    setApiUrls,
    activeApiUrl,
    setActiveApiUrl,
    scans,
    setScans,
    facilities,
    setFacilities,
    keyfobs,
    setKeyfobs,
    isLoading,
    setIsLoading,
  }), [user, apiUrls, activeApiUrl, scans, facilities, keyfobs, isLoading]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userObj = localStorage.getItem('user');
      if (userObj) {
        setUser(JSON.parse(userObj));
      }
    }
  }, []);

  return (
    <Router>
      <DataContext.Provider value={contextValue}>
        <div className='select-none flex overflow-hidden h-screen w-screen'>
          <SideBar />
          <div className='flex w-full h-full overflow-auto custom-scrollbar'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/druppels" element={<Druppels />} />
              <Route path="/gasten" element={<Gasten />} />
              <Route path='/gebruikers' element={<Gebruikers />} />
            </Routes>
          </div>
        </div>
      </DataContext.Provider>
    </Router>
  );
}

export default App;
