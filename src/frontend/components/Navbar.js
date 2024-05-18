import { Link } from "react-router-dom";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';

import { useState } from 'react';

import ICON from '../Ethereum.svg'

const Navigation = ({ web3Handler, account }) => {
    /**
     * Navigation Component
     *
     * This component renders the navigation bar for the application, including links to different pages and a
     * button for connecting to MetaMask. The navigation bar is fixed to the top of the page and collapses on smaller screens.
     *
     * @component
     *
     * @param {object} props - The component props.
     * @param {function} props.web3Handler - The function to handle MetaMask connection.
     * @param {string} props.account - The user's Ethereum account address.
     *
     * @returns {JSX.Element} The rendered component.
     *
     * State Variables:
     * @state {boolean} openBasic - A state variable that toggles the collapse state of the navigation menu.
     *
     * Usage:
     * Import and render this component to provide navigation links and a MetaMask connection button in the application.
     * Ensure that the necessary functions and account information are passed as props.
     *
     * @example
     * import React from 'react';
     * import Navigation from './Navigation';
     * 
     * const App = () => {
     *   const web3Handler = // ... define the function to handle MetaMask connection
     *   const account = // ... obtain the user's Ethereum account
     * 
     *   return <Navigation web3Handler={web3Handler} account={account} />;
     * }
     *
     * export default App;
     */

    const [openBasic, setOpenBasic] = useState(false);

    return (
        <MDBNavbar fixed='top' light style={{ backgroundColor: '#EEEDF2' }} expand="lg">
            <MDBContainer xl>
                <MDBNavbarBrand href="https://www.facebook.com/profile.php?id=100015934804255">
                    <img src={ICON} alt="Ethereum" style={{ width: '50px', height: '50px' }} />
                    ADP Marketplace
                </MDBNavbarBrand>
                <MDBNavbarToggler      
                    aria-controls='navbarSupportedContent'
                    aria-expanded='true'
                    aria-label='Toggle navigation' 
                    onClick={() => setOpenBasic(!openBasic)}
                />
                <MDBNavbarNav open={openBasic}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/create" className="nav-link">Create</Link>
                    <Link to="/my-items" className="nav-link">My Items</Link>
                    <Link to="/my-purchases" className="nav-link">My Purchases</Link>
                </MDBNavbarNav>
                <MDBCollapse navbar fluid>
                    <MDBNavbarNav>
                        {account ? (
                            <MDBNavbarLink href={`https://etherscan.io/address/${account}`}>
                                <MDBBtn outline noRipple >{account.slice(0, 4) + '...' + account.slice(28, 32)}</MDBBtn>
                            </MDBNavbarLink>
                        ) : (
                            <MDBBtn outline  noRipple onClick={web3Handler}>Connect</MDBBtn>
                        )}
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    )
}

export default Navigation;