import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { joinInTeam, unjoinTeam } from '../actions/JoinTeamGame';
import { AppDispatch } from '../store';
import { RootState } from '../store/index';
import icon from "../layout/image/copied-link.png";
import iconCopy from "../layout/image/copy-link.png"
import ShowShareDialog from '../components/ShareDiaglog';

interface Player {
    id: string;
    nickName: string;
    teamId: string;
}

interface TeamData {
    _id: string;
    name: string;
    shortName: string;
    players: {
        nickName: ReactNode; id: string; name: string
    }[];
    codeInvite: string;
    qaCode: string;
    shareUrl: string;
}

interface JoinTeamGameProps {
    joinedTeamID: string | null;
    dataTeam: TeamData[];
    onJoinOrUnjoinTeam: (teamName: string, teamID: string, teamNum: number) => void;
    isGameStarted: boolean;
    filteredPlayers: Player[];
}


function LobbyGamePage() {
    const location = useLocation();
    const { nickName, teamID, playerID, codeInvite } = location.state;
    const [joinedTeamID, setJoinedTeamID] = useState<string | null>(null);
    const [teamJoinMessage, setTeamJoinMessage] = useState<string | null>(null);
    const [dataTeam, setDataTeam] = useState<TeamData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [players, setPlayers] = useState<Player[]>([]); // Alle Spieler
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]); // Gefilterte Spieler
    const isGameStarted = useSelector((state: RootState) => state.gameStatus.isGameStarted);
    //console.log("Is the game started in LobbyGamePage?", isGameStarted);
    console.log("NickName in LobbyGamePage?", nickName);

    useEffect(() => {
        console.log("isGameStarted has changed:", isGameStarted);
    }, [isGameStarted]);

    React.useEffect(() => {
        console.log('LobbyGamePage:in Lobby Game..... isGameStarted =', isGameStarted);
    }, [isGameStarted]);

    // Fetch team data from backend on component mount
    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch(`http://localhost:3443/api/team/${codeInvite}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch team data");
                }
                const teams = await response.json();
                setDataTeam(teams);

            } catch (error) {
                console.error("Error fetching team data:", error);
                setError("Could not load teams. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [playerID]);


    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                if (dataTeam.length > 0) {
                    const teamIds = dataTeam.map(team => team._id);

                    const responses = await Promise.all(
                        teamIds.map(teamId =>
                            fetch(`http://localhost:3443/api/player/team/${teamId}`)
                        )
                    );

                    // Ergebnisse der API-Aufrufe verarbeiten
                    const playersData = await Promise.all(
                        responses.map(response => {
                            if (!response.ok) {
                                throw new Error("Failed to fetch player data");
                            }
                            return response.json();
                        })
                    );
                    const allPlayers = playersData.flat();
                    setPlayers(allPlayers);
                }
            } catch (error) {
                console.error("Error fetching player data:", error);
            }
        };

        fetchPlayerData();
    }, [dataTeam]);

    // Spieler filtern
    useEffect(() => {
        if (dataTeam.length > 0 && players.length > 0) {

            const filtered = players.filter(player =>
                dataTeam.some(team => team._id === player.teamId)
            );
            setFilteredPlayers(filtered);
        }
    }, [dataTeam, players]);



    // Handle join/unjoin logic
    const handleJoinOrUnjoinTeam = (teamName: string, teamId: string, teamNum: number) => {
        console.log("teamName..... in Un join", teamName, teamId, teamNum);
        if (joinedTeamID === teamId) {
            dispatch(unjoinTeam({ teamId, playerID }));
            setJoinedTeamID(null);
            setTeamJoinMessage(`You have unjoined : ${teamName} Team ${teamNum}`);

        } else {
            console.log("teamName..... in join", nickName, playerID, teamId);
            dispatch(joinInTeam({ nickName, playerID, teamId }));
            setJoinedTeamID(teamId);
            setTeamJoinMessage(`You have joined :${teamName} Team ${teamNum}`);

        }
    };
    console.log("NickName in LobbyGamePage?3333", nickName);
    return (
        <div className="container mt-5">
            <h2>Lobby Host : {nickName} , you are here in the lobby game.</h2>
            {teamJoinMessage && <Alert variant="success">{teamJoinMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <p>Loading teams...</p>
            ) : (
                <JoinTeamGame
                    joinedTeamID={joinedTeamID}
                    dataTeam={dataTeam}
                    onJoinOrUnjoinTeam={handleJoinOrUnjoinTeam}
                    isGameStarted={isGameStarted}
                    filteredPlayers={filteredPlayers}

                />
            )}
        </div>
    );
}



// Component to List and Join Teams
function JoinTeamGame({ joinedTeamID, dataTeam, onJoinOrUnjoinTeam, isGameStarted, filteredPlayers }: JoinTeamGameProps) {

    //button share
    const [isCopied, setIsCopied] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const handleCopyLink = () => {
        if (dataTeam.length > 0 && dataTeam[0].shareUrl) {
            navigator.clipboard.writeText(dataTeam[0].shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        }
    };

    const handelnShowShareDialog = () => {
        setShowShareDialog(true);
    }

    const handleClose = () => {
        setShowShareDialog(false);
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header text-primary">
                    <h4>Select your Teams</h4>
                </div>
                <div className="text-center my-4">
                    <h5>Invite QR Code</h5>
                    {dataTeam.length > 0 && dataTeam[0].qaCode && (
                        <>
                            <img
                                src={dataTeam[0].qaCode}
                                alt="Team QR Code"
                                style={{ width: "200px", border: "1px solid gray", padding: "10px" }}
                            />
                        </>

                    )}

                    <div>{dataTeam.length > 0 && dataTeam[0].shareUrl && (dataTeam[0].codeInvite)} </div>

                    {dataTeam.length > 0 && dataTeam[0].shareUrl && (
                        <div><h5 style={{ marginTop: "1.5rem" }}>Links to share</h5>
                            <div style={{ border: "1px solid white" }}>
                                <a href={dataTeam[0].shareUrl}>{dataTeam[0].shareUrl}</a>
                            </div>
                            <Button
                                variant="primary"
                                style={{ margin: "0.5rem" }}
                                onClick={handleCopyLink}
                                disabled={isCopied}
                            >
                                {isCopied ? (
                                    <>
                                        <img
                                            src={icon}
                                            alt="check icon"
                                            style={{ width: "30px", height: "30px" }}
                                        />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={iconCopy}
                                            alt="copy icon"
                                            style={{ width: "30px", height: "30px" }}
                                        />

                                    </>
                                )}
                            </Button>
                            <button className="btn  btn-warning " style={{ margin: "0.5rem" }} onClick={handelnShowShareDialog}> share </button></div>
                    )}
                </div>

                <div className="card-body row">
                    {dataTeam.length > 0 ? (
                        dataTeam.map((item, index) => {

                            // Filtere die Spieler, die zum aktuellen Team gehören
                            const playersInCurrentTeam = filteredPlayers.filter(player => player.teamId === item._id);

                            return (
                                <Card
                                    key={index}
                                    className="flex-shrink-0"
                                    style={{ width: '18rem', border: "1px solid gray", margin: "0.5rem" }}
                                >
                                    <CardBody>
                                        <CardTitle>{item.name} Team {index + 1}</CardTitle>
                                        <ListGroup>
                                            <ListGroupItem><strong>Host Name:</strong> {item.players.map((player, idx) => (
                                                <span key={player.id}>
                                                    {player.nickName}
                                                    {idx < item.players.length - 1 ? ", " : ""}
                                                </span>
                                            ))} </ListGroupItem>

                                            {/* Zeige nur die Spieler des aktuellen Teams */}
                                            <ListGroupItem>
                                                <strong>Players List:</strong>
                                                <ul>
                                                    {playersInCurrentTeam.length > 0 ? (
                                                        playersInCurrentTeam.map(player => (
                                                            <li key={player.id}>
                                                                {player.nickName}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li style={{ color: "Tomato" }}>No players in this team</li>
                                                    )}
                                                </ul>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </CardBody>
                                    <Button
                                        variant={joinedTeamID === item._id ? "danger" : "primary"}
                                        onClick={() => onJoinOrUnjoinTeam(item.name, item._id, index + 1)}
                                        disabled={joinedTeamID !== null && joinedTeamID !== item._id}
                                    >
                                        {joinedTeamID === item._id ? "Unjoin" : "Join Team"}
                                    </Button>
                                </Card>
                            );
                        })
                    ) : (
                        <p style={{ color: "Tomato" }}>No teams available</p>
                    )}
                </div>
            </div>
            <ShowShareDialog
                show={showShareDialog}
                onClose={handleClose}
                shareUrl={dataTeam.length > 0 && dataTeam[0].shareUrl ? dataTeam[0].shareUrl : ""}
            />
            <Button variant={isGameStarted ? "success" : "secondary"} className="mt-3" disabled={!isGameStarted}>
                {isGameStarted ? "Game Started!" : "Wait for Host To Start Game ..."}
            </Button>
        </div>
    );
}


export default LobbyGamePage;
