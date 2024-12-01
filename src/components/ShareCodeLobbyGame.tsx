import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShowNameDialogInput from "./ShowNameDialogInput";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

const ReadShareCodeLobbyGame: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [nickName, setnickName] = useState<string>("");
    const host = false;
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const navigate = useNavigate();
    const [showNameDialog, setShowNameDialog] = useState(false);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, []);
    const handleAddPlayerDialog = () => {
        setShowNameDialog(true);

    };

    const handleClose = () => {
        setShowNameDialog(false);
    };

    useEffect(() => {
        // Extrahiere den `c`-Parameter aus der URL
        const code = searchParams.get("c");
        if (code) {
            setCodeInvite(code);
            console.log("CodeInvite aus URL:", code);
        } else {
            console.error("Kein gültiger Code in der URL gefunden.");
        }
    }, [searchParams]);

    const handleAddPlayer = async () => {
        try {
            // Füge den Spieler der Lobby mit dem `codeInvite` hinzu
            const response = await fetch(`${REACT_APP_REST_API_URL}player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickName, host }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Spieler erfolgreich hinzugefügt:", data);
                navigate('/LobbyGamePage', { state: { codeInvite, playerID: data.id, nickName } });

                alert("Spieler wurde erfolgreich hinzugefügt!");
            } else {
                console.error("Fehler beim Hinzufügen des Spielers");
            }
        } catch (error) {
            console.error("Fehler:", error);
        }
    };

    return (
        <div>
            <>
                <button hidden={true} ref={buttonRef} onClick={handleAddPlayerDialog}></button>
                <ShowNameDialogInput
                    show={showNameDialog}
                    onClose={handleClose}
                    onSave={handleAddPlayer}
                    nickName={nickName}
                    setnickName={setnickName}
                    host={host}

                />
            </>

        </div>
    );
};

export default ReadShareCodeLobbyGame;
