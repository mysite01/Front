import React from "react";
import Button from "react-bootstrap/Button";


interface Props {
  onClick: () => void;
}

const GameStartButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button variant="primary" className="btn-space" onClick={onClick} data-testid={'GameStartButton'}>
      Host Game
    </Button>
  );
};

export default GameStartButton;