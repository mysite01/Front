import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import { Col, Row, Container } from "react-bootstrap";
import HostBuildButton from '../components/HostBuildButton';
import HostBuildDialogInput from '../components/HostBuildDialogInput';
import { useAppDispatch, useAppSelector } from '../store/index';
import { createNewTeam } from '../actions/CreateNewTeam';
import { useLocation, useNavigate } from 'react-router-dom';
import { createNewPlayer } from '../actions/CreateNewPlayer';
import ProfileMenu from '../utils/ProfielMenu';

interface Props {
    idOfUser: string;
    nickName: string;
    host: boolean;
}

const GamePageUser: React.FC<Props> = () => {
    const [showHostBuildDialog, setshowHostBuildDialog] = useState(false);
    const [qaCodeData, setqaCodeData] = useState({ codeInvite: '' });
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState({});
    const [amountOfTeam, setAmountOfTeam] = useState('');
    const [nameOfTeam, setNameOfTeam] = useState('');
    const playerList = useAppSelector((state) => state.players.players);
    const navigate = useNavigate();
    const location = useLocation();
    const { nickName, host } = location.state as Props;

    const handleHostBuildClick = () => {
        setshowHostBuildDialog(true);
    };

    const handleClose = () => {
        setshowHostBuildDialog(false);
    };
    //hostBuildButton
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const playerID = playerList.map((player) => String(player.id)).filter((id) => id !== 'undefined');
        //save as Player bevor go to lobby game
        const newPlayer = await dispatch(createNewPlayer({ nickName, host }));
        const playersID = [];
        playersID.push(newPlayer.payload.id);
        if (validateInputs()) {
            navigate('/LobbyGamePage', { state: { codeInvite: qaCodeData.codeInvite, playerID: playersID[0], nickName } });
        }
    };


    // create host
    const handleSaveHostBuild = async () => {
        var numOfTeam = parseInt(amountOfTeam, 10);

        var teamID: string[] = [];
        if (numOfTeam < 0) {
            numOfTeam = 1;
        }
        if (numOfTeam) {
            let codeInvite: undefined;
            let playersIDData: undefined;
            let host = true;
            //save as Player bevor build team
            const newPlayer = await dispatch(createNewPlayer({ nickName, host }));
            const playersID = [];
            playersID.push(newPlayer.payload.id);


            for (let i = 0; i < numOfTeam; i++) {

                const dataInfo = await dispatch(createNewTeam({ amountOfTeam: Number(numOfTeam), playersID, host, nameOfTeam }));
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
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800" style={{ marginTop: "1.5rem", marginLeft: "1.0rem" }}> Hallo, {nickName} !</h1>
            </div>

            {/** content board profil */}
            <ProfileMenu nickName={nickName} idOfUser='' />

            {/** Content create host and search by code */}
            <div className="row" style={{ marginLeft: "0.5rem" }}>
                <div className=" col-lg-7">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Join Team to play</h6>
                        </div>
                        <div className="card-body">
                            <Container>
                                <Row className="vh-20 d-flex justify-content-center align-items-center">

                                    {/* Main Form Section */}
                                    <Col md={10} lg={8} xs={12}>
                                        {/* Border and Heading */}
                                        {/* Form */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="text-center text-primary">Input QA Code:</div>
                                                <div className="form-outline">
                                                    <input
                                                        type="text"
                                                        id="code_Test"
                                                        name="codeInvite"
                                                        value={qaCodeData.codeInvite}
                                                        onChange={handleInput}
                                                        placeholder="Enter your code hier"
                                                        className="form-control form-control-lg"
                                                    />
                                                </div>

                                            </div>

                                            {/* Submit Button */}
                                            <div className="mt-4 ">
                                                <Button variant="warning" id="TestID" type="submit">
                                                    Go to Lobby Game
                                                </Button>
                                            </div>
                                        </form>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-5">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Create Game to be Host</h6>
                        </div>

                        <div className="card-body">

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

                        </div>
                    </div>
                </div>
            </div>
        </>
    );


};



export default GamePageUser;