import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

// Typen für die Props und den Benutzer
interface User {
    userID: string;
    password: string;
    firstName: string;
    lastName: string;

}

interface UserEditProps {
    data: User[];
    updateUserAction: (accessToken: string, data: User) => void;
    accessToken: string;
}

const UserEdit: React.FC<UserEditProps> = ({ data, updateUserAction, accessToken }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Typisierung für useParams

    console.log("IDDDDDD", id);
    const userData = data.find((user) => user.userID === id);
    console.log("IDDDDDD Data Props", data);

    const initialState: User = userData || {
        userID: "",
        password: "",
        firstName: "",
        lastName: "",

    };

    const [user, setUser] = useState<User>(initialState);
    console.log("Updated User Dataaaa: ", user);

    // Handler für Input-Änderungen
    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, type, value, checked } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Speichern und Aktualisieren des Benutzers
    const saveUpdateUser: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const dataToUpdate = {
            userID: user.userID,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,

        };

        //updateUser(accessToken, dataToUpdate);
        navigate("/userManagement");
    };

    return (
        <div id="UserManagementPageEditComponent">
            <Container>
                <Row className="vh-20 d-flex justify-content-center align-items-center">
                    <Col md={10} lg={8} xs={12}>
                        <div className="border border-3 border-primary"></div>
                        <div className="mb-3 mb-4">
                            <h2 className="fw-bold mb-2 text-uppercase">Edit Profile</h2>
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
                            onSubmit={saveUpdateUser}
                        >
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">User ID</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <input
                                            style={{ background: "#E4E4E4" }}
                                            type="text"
                                            id="ComponentEditUserUserID"
                                            name="userID"
                                            value={user.userID}
                                            className="form-control form-control-lg"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">Password</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <input
                                            type="password"
                                            id="ComponentEditUserPassword"
                                            name="password"
                                            value={user.password}
                                            onChange={handleInputChange}
                                            placeholder="Password"
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">First Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            id="ComponentEditUserFirstName"
                                            name="firstName"
                                            value={user.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter First Name"
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <label className="form-label">Last Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            id="ComponentEditUserLastName"
                                            name="lastName"
                                            value={user.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter Last Name"
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-2">
                                <Button
                                    variant="primary"
                                    id="EditUserSaveUserButton"
                                    type="submit"
                                >
                                    Update profile settings
                                </Button>{" "}
                                &nbsp; &nbsp;
                                <Link to="/userManagement">
                                    <Button
                                        variant="danger"
                                        id="CancelComponentButtonEditUser"
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

export default UserEdit;
