import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBContainer,
    MDBFile,
    MDBSpinner,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
} from 'mdb-react-ui-kit';

export default function MyItems({ marketplace, nft, account }) {
    /**
     * MyItems Component
     *
     * This component displays the items listed by the current user in the marketplace. It fetches and loads
     * both listed and sold items, displaying them in separate sections.
     *
     * @component
     *
     * @param {object} props - The component props.
     * @param {object} props.marketplace - The marketplace contract instance.
     * @param {object} props.nft - The NFT contract instance.
     * @param {string} props.account - The user's Ethereum account address.
     *
     * @returns {JSX.Element} The rendered component.
     *
     * State Variables:
     * @state {boolean} loading - Indicates if the component is in a loading state.
     * @state {Array} listedItems - An array of items listed by the user.
     * @state {Array} soldItems - An array of items sold by the user.
     *
     * Methods:
     * @function loadListedItems - Fetches and loads items listed by the user from the marketplace, setting the
     *                             `listedItems` and `soldItems` state variables, and updating the `loading` state.
     *
     * Hooks:
     * @hook useEffect - Calls `loadListedItems` when the component mounts to load the initial listed items.
     *
     * Usage:
     * Import and render this component to display the items listed and sold by the user in the marketplace.
     * Ensure that the necessary contract instances and account information are passed as props.
     *
     * @example
     * import React from 'react';
     * import MyItems from './MyItems';
     * 
     * const App = () => {
     *   const marketplace = // ... obtain marketplace contract instance
     *   const nft = // ... obtain NFT contract instance
     *   const account = // ... obtain the user's Ethereum account
     * 
     *   return <MyItems marketplace={marketplace} nft={nft} account={account} />;
     * }
     *
     * export default App;
     */

    const [loading, setLoading] = useState(true);
    const [listedItems, setListedItems] = useState([]);
    const [soldItems, setSoldItems] = useState([]);
    const loadListedItems = async () => {
        const itemCount = await marketplace.itemCount();
        let listedItems = [];
        let soldItems = [];
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.items(i);
            if (item.seller.toLowerCase() === account.toLowerCase()) {
                // get the token URI
                const uri = await nft.tokenURI(item.tokenId);
                if (uri === 'sampleURI') continue;

                // get the metadata from the URI
                const metadata = await fetch(uri);
                const metadataJson = await metadata.json();

                const itemDetail = {
                    totalPrice: item.totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    price: metadataJson.price,
                    name: metadataJson.name,
                    description: metadataJson.description,
                    image: metadataJson.image,
                    isSold: item.isSold
                }
                listedItems.push(itemDetail);
                if (item.isSold) {
                    soldItems.push(itemDetail);
                }
            }
        }
        setListedItems(listedItems);
        setSoldItems(soldItems);
        setLoading(false);
    }


    useEffect(() => {
        loadListedItems();
    }, []);

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center text-center d-flex my-5'>
                <MDBSpinner role='status'/>
            <span className='justify-content-center text-center'>Loading...</span>
        </div>
        )
    }
    return (
        <MDBContainer xl className="text-center d-flex mt-5 flex-column">
            <MDBRow className="my-5"><h2>My items</h2></MDBRow>    
            <MDBRow>
                {listedItems.length > 0 ? listedItems.map((item, index) => (
                    <MDBCol md="12" lg="4" className="mb-4 mb-lg-0">
                        <MDBCard>
                            <div className="d-flex justify-content-between p-3">
                                <p className="lead mb-0">Today's Combo Offer {index + 1}</p>
                            </div>
                            <MDBCardImage
                                src={item.image}
                                position="top"
                                alt="Laptop"
                            />

                            <MDBCardBody>

                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="mb-0">{item.name}</h5>
                                    <h5 className="text-dark mb-0">${item.price}</h5>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <p class="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                )) : (
                    <p className='lead'>No items found</p>
                )}
                
            </MDBRow>
            <MDBRow className="my-5"><h2>Sold items</h2></MDBRow>   
            <MDBRow className="mb-5">
                {soldItems.length > 0 ? soldItems.map((item, index) => (
                    <MDBCol md="12" lg="4" className="mb-4 mb-lg-0">
                        <MDBCard>
                            <div className="d-flex justify-content-between p-3">
                                <p className="lead mb-0">Today's Combo Offer {index}</p>
                            </div>
                            <MDBCardImage
                                src={item.image}
                                position="top"
                                alt="Laptop"
                            />

                            <MDBCardBody>

                                <div className="d-flex justify-content-between mb-3">
                                    <h5 className="mb-0">{item.name}</h5>
                                    <h5 className="text-dark mb-0">${item.price}</h5>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <p class="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                )) : (
                    <p className='lead'>No items found</p>
                )}
                
            </MDBRow>
            
        </MDBContainer>
    );
}