import React, { useEffect, useState } from "react";
import AddPlayerDialog from "../components/AddPlayerDialog";

const ReadQACode: React.FC = () => {
    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Extrahiere den `codeInvite` aus der URL
        const extractedCodeInvite = extractCodeInviteFromCurrentUrl();

        if (extractedCodeInvite) {
            setCodeInvite(extractedCodeInvite);
            console.log("CodeVom ReadQACODE......++++", extractedCodeInvite);
            setIsDialogOpen(true); // Öffne den Dialog direkt
        } else {
            console.log("Kein Code in der URL gefunden.");
        }
    }, []);

    const handlePlayerAdded = (playerName: string) => {
        setIsDialogOpen(false);
        console.log(`${playerName} wurde erfolgreich hinzugefügt.`);
        // Optional: Aktionen nach dem Hinzufügen durchführen
    };

    return (
        <div>
            {codeInvite && isDialogOpen && (
                <AddPlayerDialog codeInvite={codeInvite} onPlayerAdded={handlePlayerAdded} />
            )}
        </div>
    );
};

export default ReadQACode;

// Extrahiere den Code aus der URL
function extractCodeInviteFromCurrentUrl(): string | null {
    const path = window.location.pathname;
    const match = path.match(/\/ReadQACode\/([A-Z0-9]+)$/);
    //const match = path.match(/\/ReadQACode\/\?qac=([A-Z0-9:]+)/);
    return match ? match[1] : null;
}
