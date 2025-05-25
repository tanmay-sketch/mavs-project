// ===================================================================
// Main App component
// ===================================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Board from './components/Board';
import PlayerProfile from './components/PlayerProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/board" element={<Board />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
    </Router>
  )
}

export default App