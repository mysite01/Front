import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ImageLogo from "../layout/image/logo.png";
import { Link } from "react-router-dom";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

class TopMenu extends Component {
    render() {
        return (
            <div>
                <Navbar expand="lg" className="shadow">
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <div>
                                <img src={ImageLogo} width="200" alt="logo" />
                            </div>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                            >
                                <Nav.Link href="#action2">Service</Nav.Link>
                                <Nav.Link href="#action2">about uns</Nav.Link>
                                <Nav.Link href="#action2">contact</Nav.Link>
                                <Nav.Link href="#action2">Impressum</Nav.Link>

                            </Nav>
                            <Login />


                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}
export default TopMenu;
