import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../store/index";
import { register } from "../actions/Register";
import { authentication } from "../actions/Authentication";
import { createNewPlayer } from "../actions/CreateNewPlayer";
import { useSelector } from "react-redux";

interface SignupPageState {
    name: string;
    password: string;
    pending: boolean;
    isError: boolean;
    errorMessage: string;
}

const SignupPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState<SignupPageState>({
        name: "",
        password: "",
        pending: false,
        isError: false,
        errorMessage: "",
    });

    const [errors, setErrors] = useState<{ name?: string; password?: string }>({});

    //new for signup after got links share
    let isLoggedIn = useSelector((state: RootState) => state.authentication.authen.isLoggedIn)

    const [codeInvite, setCodeInvite] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const queryCode = searchParams.get("c"); // Query parameter
        const path = window.location.pathname;

        console.log("Current path:", path);
        console.log("Query parameter 'c':", queryCode);

        // Check for query parameter first
        if (queryCode) {
            console.log("Found query parameter code:", queryCode);
            setCodeInvite(queryCode);
        } else {
            // Check for code in the path (QR code scenario)
            const regexMatch = path.match(/\/ReadQACode\/([A-Z0-9]+)/);
            if (regexMatch) {
                console.log("Found code in path:", regexMatch[1]);
                setCodeInvite(regexMatch[1]);
            } else {
                console.log("No code found in URL. Proceeding without codeInvite.");
                setCodeInvite(null); // Explicitly set null if no code is present
            }
        }
    }, [searchParams]);

    console.log("codeInvite in Signup..+++++111", codeInvite)

    // Handle input changes
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    // Validate form inputs
    const validateForm = (): boolean => {
        const newErrors: { name?: string; password?: string } = {};
        if (!state.name) newErrors.name = "Name is required.";
        if (!state.password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const saveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setState((prevState) => ({
            ...prevState,
            pending: true,
            isError: false,
            errorMessage: "",
        }));

        try {
            const userData = await dispatch(register({ name: state.name, password: state.password }));

            if (register.fulfilled.match(userData)) {
                console.log("User registered successfully!");
                setState({
                    ...state,
                    name: "",
                    password: "",
                    pending: false,
                    isError: false,
                    errorMessage: "",
                });

                const result = await dispatch(authentication({ name: state.name, password: state.password }));
                if (authentication.fulfilled.match(result)) {
                    const token = result.payload.token;
                    const decodedToken = atob(token.split(".")[1]);
                    const userInformation = JSON.parse(decodedToken);
                    const idOfUser = userInformation.id;
                    isLoggedIn = true;

                    if (codeInvite) {
                        console.log("Proceeding with shared link/QR Code flow...");

                        const newPlayer = await dispatch(createNewPlayer({ nickName: state.name, host: false }));
                        if (createNewPlayer.fulfilled.match(newPlayer)) {
                            const playerID = newPlayer.payload.id;
                            navigate("/LobbyGamePage", {
                                state: { codeInvite, playerID, nickName: state.name, host: false },
                            });
                        } else {
                            console.error("Failed to create new player.");
                        }
                    } else {
                        console.log("Normal signup flow...");
                        navigate("/GamePageUser", {
                            state: { idOfUser, nickName: state.name, host: false },
                        });
                    }
                } else {
                    console.error("Authentication failed.");
                }
            } else if (register.rejected.match(userData)) {
                setState({
                    ...state,
                    pending: false,
                    isError: true,
                    errorMessage: "User name already exists.",
                });
            }
        } catch (error: any) {
            console.error("Error during registration:", error);
            setState({
                ...state,
                pending: false,
                isError: true,
                errorMessage: error.message || "Something went wrong.",
            });
        }
    };


    return (
        <div id="UserManagementPageCreateComponent">
            <Container>
                <Row className="vh-20 d-flex justify-content-center align-items-center">
                    <Col md={10} lg={8} xs={12}>
                        <div className="border border-3 border-primary"></div>
                        <div className="mb-3 mb-4">
                            <h2 className="fw-bold mb-2 text-uppercase">Create an Account</h2>
                        </div>
                        <form
                            style={{
                                position: "static",
                                top: 95,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0rem",
                                padding: "0rem",
                            }}
                            onSubmit={saveUser}
                        >
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            id="CreateUserComponentEditUserID"
                                            name="name"
                                            value={state.name}
                                            onChange={handleInput}
                                            placeholder="Name"
                                            className="form-control form-control-lg"
                                        />
                                        {errors.name && (
                                            <span style={{ color: "red" }}>{errors.name}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            id="CreateUserComponentEditPassword"
                                            name="password"
                                            value={state.password}
                                            onChange={handleInput}
                                            placeholder="Password"
                                            className="form-control form-control-lg"
                                        />
                                        {errors.password && (
                                            <span style={{ color: "red" }}>{errors.password}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {state.isError && (
                                    <div style={{ color: "red", marginTop: "10px" }}>
                                        {state.errorMessage}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-2">
                                <Button
                                    variant="primary"
                                    id="CreateUserComponentCreateUserButton"
                                    type="submit"
                                    disabled={state.pending}
                                >
                                    {state.pending ? <Spinner animation="border" size="sm" /> : "Register Account"}
                                </Button>{" "}
                                <Link to="/">
                                    <Button
                                        variant="danger"
                                        id="OpenUserManagementPageListComponentButton"
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>

                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignupPage;
