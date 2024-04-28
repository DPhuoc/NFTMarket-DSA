
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
            <MDBContainer fluid className='p-0' style={{ height: '100%' }}>
                <Navigation web3Handler={web3Handler} account={account} />
                {loading ? (
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '100%'}}>
                        <MDBSpinner role='status'/>
                        <span className='justify-content-center text-center'>Loading...</span>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
                        <Route path="/create"/>
                        <Route path="/my-items"/>
                        <Route path="/my-purchases" />
                    </Routes>
                )}

            </MDBContainer>
        </BrowserRouter>
        
    );
}

export default App;
