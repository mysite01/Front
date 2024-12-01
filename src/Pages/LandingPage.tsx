import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HostGame from '../components/GameStartButton';
import JoinGame from '../components/JoinGameStartButton';
import ShowNameDialogInput from '../components/ShowNameDialogInput';
import { createNewPlayer } from '../actions/CreateNewPlayer';
import { useAppDispatch } from '../store';
import HomePageImag from "../layout/image/homePage1.png";

/** import css */
import "../layout/css/style.css";
import ReadQACode from '../components/ReadQACode';

const LandingPage: React.FC = () => {
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nickName, setnickName] = useState('');
  const [host, sethost] = useState(Boolean);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGameStartClick = () => {
    setShowNameDialog(true);
    sethost(true)
  };

  const handleJoinGameStartClick = () => {
    setShowNameDialog(true);
    sethost(false)
  };
  const handleClose = () => {
    setShowNameDialog(false);
  };

  const handleSaveName = async () => {
    if (nickName.trim()) {
      const newPlayer = await dispatch(createNewPlayer({ nickName, host }));
      const playerID = newPlayer.payload.id

      handleClose();
      navigate('/game', { state: { nickName, host, playerID } });
    } else {
      alert('Bitte gib einen gültigen Namen ein.');
    }
  };

  return (
    <div className="landing-page ">
      <section className="banner text-center py-4">
        <div className="banner-image">
          <img src={HomePageImag} width="300" alt="imag-header" />
        </div>
        <div className="banner-content" style={{ padding: "5rem" }}>
          <h1>Hallo, Welcome to Geo Pick Points!</h1>
          <HostGame onClick={handleGameStartClick} />
          <ShowNameDialogInput
            show={showNameDialog}
            onClose={handleClose}
            onSave={handleSaveName}
            nickName={nickName}
            setnickName={setnickName}
            host={host}

          />

          <JoinGame onClick={handleJoinGameStartClick} />
          <ReadQACode />
        </div>

      </section>
    </div>
  );
};

export default LandingPage;
