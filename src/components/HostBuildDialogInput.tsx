import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    nameOfTeam: string;
    setNameOfTeam: (nameOfTeam: string) => void;
    amountOfTeam: string;
    setAmountOfTeam: (mountOfTeam: string) => void;
    playersID: string[];

}

const HostBuildDialogInput: React.FC<Props> = ({ show, onClose, onSave, nameOfTeam, setNameOfTeam, amountOfTeam, setAmountOfTeam }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton >
                <Modal.Title>How many team your wanna build ?</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Form>
                    <Form.Group controlId="formName"  >

                        <Form.Control
                            type="text"
                            placeholder="enter the name of your team"
                            value={nameOfTeam}
                            onChange={(e) => setNameOfTeam(e.target.value)}
                            data-testid={'nameInput'}
                            className="form-spacing"
                        />
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="enter number of team"
                            value={amountOfTeam}
                            onChange={(e) => setAmountOfTeam(e.target.value)}
                            data-testid={'numberInput'}
                            className="form-spacing"

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
        </Modal>
    );
};

export default HostBuildDialogInput;
