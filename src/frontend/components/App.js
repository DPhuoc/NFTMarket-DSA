
import logo from './logo.png';
import './App.css';

import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';

import { useState } from 'react';

import { ethers } from 'ethers';

import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';

import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

import Navigation from './Navbar';
import { 
    MDBContainer,
    MDBSpinner,
    MDBBtn
} from 'mdb-react-ui-kit';

import Home from './Home';
import Create from './Create';
import MyItems from './MyItems';
import MyPurchases from './MyPurchases';


function App() {

    /**
     * Main application component for managing and displaying NFT marketplace.
     *
     * This component handles the initialization of the application state, including user authentication with MetaMask,
     * and loading of contract data for interacting with an NFT marketplace and NFT contracts. It renders the main layout
     * and navigation for the application, conditionally displaying content based on the loading state.
     *
     * @component
     *
     * @returns {JSX.Element} The rendered component.
     *
     * State Variables:
     * @state {boolean} loading - Indicates if the application is in a loading state.
     * @state {string|null} account - The user's Ethereum account address from MetaMask.
     * @state {object} nft - The NFT contract instance.
     * @state {object} marketplace - The marketplace contract instance.
     *
     * Methods:
     * @function web3Handler - Handles MetaMask login and sets the account state variable, then loads contract data.
     * @function loadContractData - Loads the marketplace and NFT contract instances, sets the respective state variables, and sets loading to false.
     *
     * Usage:
     * Import and render this component at the root of your application to provide the main structure and functionality
     * for the NFT marketplace. The component will handle MetaMask authentication, load the necessary contract data, and
     * conditionally render the application routes based on the loading state.
     *
     * @example
     * import React from 'react';
     * import ReactDOM from 'react-dom';
     * import App from './App';
     *
     * ReactDOM.render(<App />, document.getElementById('root'));
     */

    // state variable
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [nft, setNft] = useState({});
    const [marketplace, setMarketplace] = useState({});

    // MetaMask Login
    const web3Handler = async () => {
        // request access to the user's MetaMask account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // set the account state variable
        setAccount(accounts[0]);
        // get the provider from metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // get the signer
        const signer = provider.getSigner();

        // load contract data
        loadContractData(signer);
    }

    // Load Contract Data
    const loadContractData = async (signer) => {
        // Get deployed contract
        const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
        // Set the marketplace state variable
        setMarketplace(marketplace);
        // get NFT contract
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
        // Set the nft state variable
        setNft(nft);
        // set loading to false
        setLoading(false);
    }

    return (
        <BrowserRouter>
            <MDBContainer fluid className='p-5' style={{ height: '100%' }}>
                <Navigation web3Handler={web3Handler} account={account} />
                {loading ? (
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '100%'}}>
                        <MDBSpinner role='status'/>
                        <span className='justify-content-center text-center'>Loading...</span>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
                        <Route path="/create" element={<Create marketplace={marketplace} nft={nft} />} />
                        <Route path="/my-items" element={<MyItems marketplace={marketplace} nft={nft} account={account} />} />
                        <Route path="/my-purchases" element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} />
                    </Routes>
                )}

            </MDBContainer>
        </BrowserRouter>
        
    );
}

export default App;
