import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from './Pages/LandingPage';
import GamePage from './Pages/GamePage';
import LobbyHostGamePage from './Pages/LobbyHostGamePage';
import LobbyGamePage from './Pages/LobbyGamePage';
import { GameStatusProvider } from './utils/GameStatusContext';
import GamePageUser from './Pages/GamePageUser';
import TopMenu from './utils/TopMenu';
import Signup from './Pages/Signup';
import ReadQACode from './components/ReadQACode';
import ShareCodeLobbyGame from './components/ShareCodeLobbyGame';
import RedirectHandler from './components/RedirectHandler';
import MapPage from './Pages/MapPage';
import ProfileDetail from './components/userManagement/ProfileDetail';

const App: React.FC = () => {

  return (
    <GameStatusProvider>
      <Router>
        <TopMenu />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage nickName={''} host />} />

          <Route path="/LobbyHostGamePage" element={<LobbyHostGamePage />} />
          <Route path="/LobbyGamePage" element={<LobbyGamePage />} />
          <Route path="/GamePageUser" element={<GamePageUser idOfUser='' nickName={""} host />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Map" element={<MapPage />} />

          <Route path="/ReadQACode/:codeInvite" element={<ReadQACode />} />
          <Route path="/:codeInvite" element={<RedirectHandler />} />
          <Route path="/codelobbygame" element={<ShareCodeLobbyGame />} />

          <Route path="/details/profile" element={<ProfileDetail idOfUser='' nickName={""} />} />
          <Route path="/details/dashboard" element={<GamePage nickName={''} host />} />
        </Routes>

      </Router>
    </GameStatusProvider>
  );
};

export default App;

/**
 * <Route path="/details/history" element={<HistoryDetail />} />
        <Route path="/details/tasks" element={<TasksDetail />} />
        <Route path="/details/requests" element={<RequestsDetail />} />
 */