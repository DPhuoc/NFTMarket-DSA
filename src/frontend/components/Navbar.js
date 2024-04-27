import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="https://www.facebook.com/profile.php?id=100015934804255">ADP Marketplace</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/create" className="nav-link">Create</Link>
                        <Link to="/my-items" className="nav-link">My Items</Link>
                        <Link to="/my-purchases" className="nav-link">My Purchases</Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4"
                            >
                                <Button variant="outline-light">
                                    {account.slice(0, 5)}...{account.slice(account.length - 4)}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button variant="outline-light" onClick={web3Handler}>Connect</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;