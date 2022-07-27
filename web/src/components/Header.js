import { useState, useEffect } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const auth = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    auth.refresh();
  }, []);

  return (
    <>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Container fluid className='px-5'>
          <Navbar.Brand href='/'>Brewable</Navbar.Brand>
          {user ? (
            <>
              <Navbar.Toggle aria-controls='responsive-navbar-nav' />
              <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className='me-auto'>
                  <Nav.Link href='#features'>Beans</Nav.Link>
                  <Nav.Link href='#pricing'>Brews</Nav.Link>
                </Nav>
                <Nav>
                  <NavDropdown
                    title='Colin Santee'
                    className='mr-2'
                    id='collasible-nav-dropdown'
                  >
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                    <NavDropdown.Item href='#action/3.2'>
                      My Beans
                    </NavDropdown.Item>
                    <NavDropdown.Item href='#action/3.3'>
                      My Brews
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href='#action/3.4'>
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => auth.signout()}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <Nav>
              <Nav.Item className='me-2'>
                <Nav.Link
                  className='text-light'
                  onClick={() => setShowSignIn(true)}
                >
                  Sign In
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <button
                  className='btn btn-outline-light'
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </button>
              </Nav.Item>
            </Nav>
          )}
        </Container>
      </Navbar>

      <SignInModal
        show={showSignIn}
        setShow={setShowSignIn}
        showSignUp={() => setShowSignUp(true)}
      />
      <SignUpModal
        show={showSignUp}
        setShow={setShowSignUp}
        showSignIn={() => setShowSignIn(true)}
      />
    </>
  );
}
