
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

import Home from './Home';
import Create from './Create';
import MyItems from './MyItems';
import MyPurchases from './MyPurchases';
import { Spinner } from 'react-bootstrap';


function App() {

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
            <div className='App'>
                <Navigation web3Handler={web3Handler} account={account} />
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <Spinner animation="border" style={{ display: 'flex' }} />
                        <p className='mx-3 my-0'>Loading...</p>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
                        <Route path="/create"/>
                        <Route path="/my-items"/>
                        <Route path="/my-purchases" />
                    </Routes>
                )}

            </div>
        </BrowserRouter>
        
    );
}

export default App;
