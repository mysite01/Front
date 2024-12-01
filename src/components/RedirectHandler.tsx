import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const RedirectHandler: React.FC = () => {
    const { codeInvite } = useParams<{ codeInvite: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const feature = searchParams.get("feature");

        // Prüfe, ob der Parameter `feature=shared` vorhanden ist
        if (feature === "shared" && codeInvite) {
            // Leite zur neuen URL um
            navigate(`/codelobbygame?c=${codeInvite}`);
        } else {
            console.error("Ungültige URL oder fehlende Parameter.");
        }
    }, [codeInvite, searchParams, navigate]);

    return null;
};

export default RedirectHandler;
