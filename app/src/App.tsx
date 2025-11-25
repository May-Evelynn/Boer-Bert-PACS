import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar'

import Home from './pages/Home'
import Overzicht from './pages/Overzicht/Index';
import Druppels from './pages/Druppels/Index';
import Personen from './pages/Personen/Index';

import "./App.css";

function App() {
  return (
    <Router>
        <div className='flex'>
          <SideBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overzicht" element={<Overzicht />} />
            <Route path="/druppels" element={<Druppels />} />
            <Route path="/personen" element={<Personen />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
