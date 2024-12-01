import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { joinInTeam, unjoinTeam } from '../actions/JoinTeamGame'; // Assuming you have an unjoin action too
import { AppDispatch } from '../store';
import { createGameInstance } from '../actions/CreateGameInstance';
import { useGameStatus } from '../utils/GameStatusContext';
import { startGame } from '../actions/GameStatusSlice';
import ShowShareDialog from '../components/ShareDiaglog';
import icon from "../layout/image/copied-link.png";
import { useNavigate } from 'react-router-dom';
import iconCopy from "../layout/image/copy-link.png"

interface TeamData {
    _id: string;
    name: string;
    shortName: string;
    players: {
        nickName: ReactNode; id: string; name: string
    }[];
    codeInvite: string;
    playersIDData: string;
    qaCode: string;
    shareUrl: string;


}
interface Player {
    playerId: string;
    nickName: string;
    teamId: string;
}

interface LobbyHostGamePageProps {
    teamName: string;
    numberOfTeam: number;
    teamID: string[];
}

// Main Lobby Component
function LobbyHostGamePage() {

    const location = useLocation();
    const { amountOfTeam, nickName, teamID, codeInvite, playerID } = location.state || {};
    const [joinedTeamID, setJoinedTeamID] = useState<string | null>(null); // Track joined team
    const [teamJoinMessage, setTeamJoinMessage] = useState<string | null>(null);
    const { isGameStarted, setIsGameStarted } = useGameStatus();
    const [dataTeam, setDataTeam] = useState<TeamData[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(true);
    const [players, setPlayers] = useState<Player[]>([]); // Alle Spieler
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]); // Gefilterte Spieler




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
                //setError("Could not load teams. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [playerID]);

    // Spieler für alle Team-IDs laden
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
    console.log("DataTeam....+++++", dataTeam);
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
    const handleJoinOrUnjoinTeam = (teamName: string, teamId: string) => {
        if (joinedTeamID === teamId) {
            // Unjoin logic
            dispatch(unjoinTeam({ teamId, playerID }));
            setJoinedTeamID(null);
            setTeamJoinMessage(`You have unjoined ${teamName}`);

        } else {
            // Join logic
            dispatch(joinInTeam({ nickName, playerID, teamId }));
            setJoinedTeamID(teamId);
            setTeamJoinMessage(`You have joined ${teamName}`);

        }
    };
    console.log("dataTeam.......unter join", dataTeam);
    console.log(".......isGameStarted.....", isGameStarted);
    console.log(".......setIsGameStarted,......", setIsGameStarted);
    return (
        <>
            <h3 style={{ margin: "1.5rem" }}>Your Lobby Host</h3>
            {teamJoinMessage && <div>{teamJoinMessage}</div>}
            <JoinTeamGame
                joinedTeamID={joinedTeamID}
                dataTeam={dataTeam}
                onJoinOrUnjoinTeam={handleJoinOrUnjoinTeam}
                setIsGameStarted={setIsGameStarted}
                isGameStarted={isGameStarted}
                filteredPlayers={filteredPlayers}
            />
        </>
    );
}

interface JoinTeamGameProps {
    joinedTeamID: string | null;
    dataTeam: TeamData[];
    onJoinOrUnjoinTeam: (teamName: string, teamID: string, teamNum: number) => void;
    isGameStarted: boolean;
    setIsGameStarted: (value: boolean) => void;
    filteredPlayers: Player[];
}

// Component to List and Join Teams
function JoinTeamGame({ joinedTeamID, dataTeam, onJoinOrUnjoinTeam, isGameStarted, setIsGameStarted, filteredPlayers }: JoinTeamGameProps) {
    const dispatch = useDispatch<AppDispatch>();
    const nameGameInstance = "StartNow";
    const navigate = useNavigate(); 

    const handleHostGameStartClick = async () => {
        const startTime = new Date().getTime();
        
        const endTime = new Date().getTime() + 3600000;
        const teamIds = dataTeam.map((team) => team._id); // Sammle die Team-IDs
        const gameId = "qwd2390dfsadfasdf23";

        try {
            const dataGameInstance = await dispatch(
                createGameInstance({ nameGameInstance: "StartNow", startTime, endTime, gameId, teamsID: teamIds })
            );
            if (dataGameInstance) {
                setIsGameStarted(true);
                dispatch(startGame());
                navigate("/map");
            }
        } catch (error) {
            console.error("Error starting game instance:", error);
        }
    };
    

    //button share
    const [isCopied, setIsCopied] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const handleCopyLink = () => {
        if (dataTeam.length > 0 && dataTeam[0].shareUrl) {
            navigator.clipboard.writeText(dataTeam[0].shareUrl); // Kopiert den Link
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


    React.useEffect(() => {
        console.log('LobbyHostGamePage:in Host...... isGameStarted =', isGameStarted);
    }, [isGameStarted]);


    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header text-primary">
                    <h4 >List of your Teams</h4>
                </div>
                {/* QA-Code außerhalb der Team-Liste anzeigen */}
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

                    {/* <li><strong>Invite Code: {dataTeam[0].codeInvite}</strong> </li>*/}
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
                                            ))} (Your)</ListGroupItem>

                                            {/* Zeige nur die Spieler des aktuellen Teams */}
                                            <ListGroupItem>
                                                <strong>Players List:</strong>
                                                <ul>
                                                    {playersInCurrentTeam.length > 0 ? (
                                                        playersInCurrentTeam.map(player => (

                                                            <li key={player.playerId}>
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
                        <p>No teams available</p>
                    )}
                </div>
            </div>
            <ShowShareDialog
                show={showShareDialog}
                onClose={handleClose}
                shareUrl={dataTeam.length > 0 && dataTeam[0].shareUrl ? dataTeam[0].shareUrl : ""}
            />

            <Button variant="danger" onClick={handleHostGameStartClick} disabled={isGameStarted}>
                {isGameStarted ? "Game beginn !!" : " Start Game"}
            </Button>
        </div>
    );

}

export default LobbyHostGamePage;
