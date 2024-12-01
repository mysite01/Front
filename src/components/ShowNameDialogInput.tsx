import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';
import Login from '../Pages/Login';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  nickName: string;
  setnickName: (nickName: string) => void;
  host: boolean;
  //setGameId: (gameId: string) => void;
}

const ShowNameDialogInput: React.FC<Props> = ({ show, onClose, onSave, nickName, setnickName, host }) => {
  return (
    <Modal show={show} onHide={onClose} data-testid={'DialogNameInput'}>
      <Modal.Header closeButton>
        <Modal.Title>What is your name?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Control
              type="text"
              placeholder="enter your name hier"
              value={nickName}
              onChange={(e) => setnickName(e.target.value)}
              data-testid={'nameInput'}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} data-testid={'closeButton'}>
          cancel
        </Button>
        <Button variant="primary" onClick={onSave} data-testid={'saveButton'}>
          save
        </Button>
      </Modal.Footer>
      <div style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #eae5e5",
        borderRadius: "10px", margin: "0.5rem",
        padding: "0.5rem"
      }}>
        Already have an account or wanna Signup?
        <Login />
      </div>
    </Modal>
  );
};

export default ShowNameDialogInput;
