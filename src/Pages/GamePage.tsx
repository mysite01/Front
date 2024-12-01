import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../store/index";
import HostBuildButton from '../components/HostBuildButton';
import { createNewTeam } from '../actions/CreateNewTeam';
import HostBuildDialogInput from '../components/HostBuildDialogInput';
import Button from "react-bootstrap/Button";
import { Col, Row, Container } from "react-bootstrap";

import { unjoinTeam } from '../actions/JoinTeamGame';

interface Props {
  nickName: string;
  host: boolean;
}

const GamePage: React.FC<Props> = () => {
  const [showHostBuildDialog, setshowHostBuildDialog] = useState(false);
  const [qaCodeData, setqaCodeData] = useState({ codeInvite: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});
  const { nickName, host } = location.state as Props;
  const [amountOfTeam, setAmountOfTeam] = useState('');
  const [nameOfTeam, setNameOfTeam] = useState('');

  const playerList = useAppSelector((state) => state.players.players);
  const { loading, error } = useAppSelector((state) => ({
    loading: state.players.loading,
    error: state.players.error,
  }));

  const handleHostBuildClick = () => {

    if (host) {
      setshowHostBuildDialog(true);
    }
  };

  const handleClose = () => {
    setshowHostBuildDialog(false);
  };


  const validateInputs = () => {
    let tempErrors: { codeInvite?: string } = {};
    if (!qaCodeData.codeInvite.trim()) {
      tempErrors.codeInvite = "QA-Code is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setqaCodeData({ ...qaCodeData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const playerID = playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined');

    if (validateInputs()) {
      navigate('/LobbyGamePage', { state: { codeInvite: qaCodeData.codeInvite, playerID: playerID[0], nickName } });
    }
  };



  const handleSaveHostBuild = async () => {
    var numOfTeam = parseInt(amountOfTeam, 10);
    var teamID: string[] = [];
    if (numOfTeam < 0) {
      numOfTeam = 1;
    }
    if (amountOfTeam) {
      let codeInvite: undefined;
      let playersIDData: undefined;
      const playersID = playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined');

      for (let i = 0; i < numOfTeam; i++) {

        const dataInfo = await dispatch(createNewTeam({ amountOfTeam: Number(amountOfTeam), playersID, host, nameOfTeam }));
        codeInvite = dataInfo.payload.codeInvite;
        playersIDData = dataInfo.payload.playersID;


        if (createNewTeam.fulfilled.match(dataInfo)) {
          teamID.push(dataInfo.payload.id);
        } else {
          console.error("Error creating team:", dataInfo);
        }
      }

      handleClose();
      navigate('/LobbyHostGamePage', { state: { amountOfTeam, nickName, teamID, codeInvite: codeInvite, playerID: playersID[0] } });

    } else {
      alert('Bitte gib einen gültigen Anzahl ein.');
    }
  };

  return (
    <div className="game-page text-center">
      <h4 style={{ margin: "1.5rem" }}>Welcome to the GEO Pick Points, {nickName}!</h4>
      {loading ? (
        <p>Setting up your player...</p>
      ) : error ? (
        <p className="error">An error occurred: {error}</p>
      ) : (
        <>
          {playerList.length > 0 && (
            <div>
              {playerList.map((player) => (
                <p key={player.id}></p>
              ))}
              {host ? (
                <>
                  <h4>Your Host now !</h4>
                  <h5> It's time to manage your team ! </h5>
                  <HostBuildButton onClick={handleHostBuildClick} />
                  <HostBuildDialogInput
                    show={showHostBuildDialog}
                    onClose={handleClose}
                    onSave={handleSaveHostBuild}
                    playersID={playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined')}
                    nameOfTeam={nameOfTeam}
                    setNameOfTeam={setNameOfTeam}
                    amountOfTeam={amountOfTeam}
                    setAmountOfTeam={setAmountOfTeam}
                  />
                </>
              ) : <>


                <div id="HobbyComponent">
                  <Container>
                    <Row className="vh-20 d-flex justify-content-center align-items-center">
                      <Col md={10} lg={8} xs={12}>
                        <div className="border border-3 border-primary"></div>
                        <div className="mb-3 mb-4">
                          <h4 className="fw-bold mb-2">Please enter the Code before proceeding to the lobby.</h4>
                        </div>

                        <form
                          style={{
                            position: "static",
                            top: 95,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0rem",
                            padding: "0rem",
                          }}
                          onSubmit={handleSubmit}
                        >

                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className='text-center'> Input QA Code :</div>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="code_Test"
                                  name="codeInvite"
                                  value={qaCodeData.codeInvite}
                                  onChange={handleInput}
                                  placeholder="Enter your code"
                                  className="form-control form-control-lg"
                                />

                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-2">
                            <Button
                              variant="primary"
                              id="TestID"
                              type="submit"

                            >
                              Go to Lobby Game
                            </Button>
                          </div>
                        </form>
                      </Col>
                    </Row>
                  </Container>
                </div>

              </>}
            </div>
          )}
        </>
      )}
    </div>
  );

};



export default GamePage;
