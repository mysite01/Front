import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { authentication } from "../actions/Authentication";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { useNavigate, useSearchParams } from "react-router-dom";
import { createNewPlayer } from "../actions/CreateNewPlayer";


interface LoginPageState {
    showDialog: boolean;
    name: string;
    password: string;
    pending: boolean;
    isError: boolean;
    errorMessage: string;
}

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [state, setState] = useState<LoginPageState>({

        showDialog: false,
        name: '',
        password: '',
        pending: false,
        isError: false,
        errorMessage: '',
    });

    //new
    let isLoggedIn = useSelector((state: RootState) => state.authentication.authen.isLoggedIn)
    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    //Case : login with share-Links and QACode
    // Extrahiere `codeInvite`-Parameter aus der URL
    useEffect(() => {
        const code = searchParams.get("c");
        if (code) {
            setCodeInvite(code);
        }

        const path = window.location.pathname;
        const match = path.match(/\/ReadQACode\/([A-Z0-9]+)/);

        if (match) {
            const qaCodeIn = match[1];
            setCodeInvite(qaCodeIn);
        }

    }, [searchParams]);
    //new bis hier

    const handleShow = () => {
        setState(prevState => ({ ...prevState, showDialog: true }));
    };

    const handleClose = () => {
        setState(prevState => ({
            ...prevState,
            showDialog: false,
            isError: false,
            errorMessage: "",
        }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleLogin = async () => {
        const { name, password } = state;
        setState(prevState => ({ ...prevState, pending: true, isError: false, errorMessage: '' }));

        try {
            // Dispatch den Thunk mit den Login-Daten
            const result = await dispatch(authentication({ name, password }));

            if (authentication.fulfilled.match(result)) {
                // Erfolg: Optional kannst du hier noch etwas tun, z. B. Navigation
                console.log('Login erfolgreich!');
                setState(prevState => ({
                    ...prevState,
                    showDialog: false,
                    name: '',
                    password: '',
                }));
                console.log("token login Erfolg.....", result.payload.token);
                const token = result.payload.token;
                const decodedToken = atob(token.split(".")[1]);
                const userInformation = JSON.parse(decodedToken);
                const idOfUser = userInformation.id;

                const newPlayer = await dispatch(createNewPlayer({ nickName: name, host: false }));
                const playerID = newPlayer.payload.id;
                if (createNewPlayer.fulfilled.match(newPlayer)) {
                    // navigate('/GamePageUser', { state: { idOfUser, nickName: name, host: false } })

                    if (codeInvite) {
                        console.log("Navigiere zu LobbyGamePage");
                        let host = false;
                        const nickName = state.name;
                        isLoggedIn = true;
                        try {
                            console.log("Navigiere zu LobbyGamePage++++ is2LoggedIn...", isLoggedIn);

                            navigate("/LobbyGamePage", {
                                state: { codeInvite, playerID, nickName, host },
                            });
                        } catch (err) {
                            console.error("Fehler beim Erstellen des Spielers:", err);
                        }
                    } else {
                        console.log("Navigiere zu GamePageUser");
                        isLoggedIn = true;
                        console.log("Navigiere zu GamePageUser++++ is2LoggedIn...", isLoggedIn);
                        navigate("/GamePageUser", {
                            state: { idOfUser, nickName: state.name, host: false },
                        });
                    }
                } else {
                    const error = result.payload || 'Fehler beim add new Player';
                }

            } else {

                const error = result.payload || 'Fehler beim Login';
                setState(prevState => ({
                    ...prevState,
                    isError: true,
                    errorMessage: error,
                }));
            }
        } catch (error) {
            console.error('Login fehlgeschlagen:', error);
            setState(prevState => ({
                ...prevState,
                isError: true,
                errorMessage: 'Ein unbekannter Fehler ist aufgetreten.',
            }));
        } finally {
            setState(prevState => ({ ...prevState, pending: false }));
        }
    };

    //logout
    const logout = () => (dispatch: AppDispatch) => {
        dispatch({ type: "auth/logout" })
    }
    const logoutDialog = async () => {
        setState(prevState => ({
            ...prevState,
            showDialog: false,
        }));
        dispatch(logout())
        navigate("/");
    }
    // const authState = useSelector((state: RootState) => state.authentication.authen);
    // console.log("authState after logout:", authState);

    const handleSignup = async () => {
        setState(prevState => ({
            ...prevState,
            showDialog: false,
        }));
        const url = codeInvite ? `/Signup?c=${codeInvite}` : "/Signup";
        console.log("Navigating to:", url);
        navigate(url);

        //navigate("/Signup");
    }
    //isLoggedIn,
    const { showDialog, pending, isError, errorMessage } = state;
    console.log("isLoggedIn....+++++++++ LoginPage++++", isLoggedIn)
    return (
        <div>
            {isLoggedIn ? (
                <Button variant="secondary" onClick={logoutDialog}>
                    Logout
                </Button>
            ) : (
                <div style={{ margin: "0.2rem" }}>
                    <><Button
                        id="OpenLoginDialogButton"
                        variant="primary"
                        onClick={handleShow}
                    >
                        Login
                    </Button></> <Button variant="warning" onClick={handleSignup}> Signup</Button></div>
            )}

            <Modal id="LoginDialog" show={showDialog} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group style={{ margin: "0.5rem" }}>

                            <Form.Control
                                id="LoginDialogUserIDText"
                                type="text"
                                placeholder="name"
                                name="name"
                                value={state.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group style={{ margin: "0.5rem" }}>
                            <Form.Control
                                id="LoginDialogPasswordText"
                                type="password"
                                placeholder="password"
                                name="password"
                                value={state.password}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group>

                            <div className="d-flex align-items-center" style={{ margin: "0.5rem" }}>
                                <Button variant="primary" onClick={handleLogin} disabled={pending}>
                                    Login
                                </Button>
                                {pending && <Spinner animation="border" variant="primary" className="ms-3" />}
                                {isError && (
                                    <span style={{ color: "red", marginLeft: "1rem" }}>
                                        {errorMessage}
                                    </span>
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <a href="#">Passwort vergessen?</a>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginPage;
