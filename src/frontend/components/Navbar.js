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