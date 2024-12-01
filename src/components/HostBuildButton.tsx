import React from "react";
import Button from "react-bootstrap/Button";


interface Props {
    onClick: () => void;
}

const HostBuildButton: React.FC<Props> = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} data-testid={'HostBuildButton'}>
            Create Team
        </Button>
    );
};

export default HostBuildButton;