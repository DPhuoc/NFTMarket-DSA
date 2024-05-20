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
    MDBCardTitle
} from 'mdb-react-ui-kit';

export default function MyPurchases({ marketplace, nft, account }) {
    /**
     * MyPurchases Component
     *
     * This component displays the items purchased by the current user from the marketplace. It fetches and loads
     * the purchased items, displaying them in a grid layout.
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
     * @state {Array} purchasedItems - An array of items purchased by the user.
     *
     * Methods:
     * @function loadPurchasedItems - Fetches and loads items purchased by the user from the marketplace, setting the
     *                                `purchasedItems` state variable, and updating the `loading` state.
     *
     * Hooks:
     * @hook useEffect - Calls `loadPurchasedItems` when the component mounts to load the initial purchased items.
     *
     * Usage:
     * Import and render this component to display the items purchased by the user from the marketplace.
     * Ensure that the necessary contract instances and account information are passed as props.
     *
     * @example
     * import React from 'react';
     * import MyPurchases from './MyPurchases';
     * 
     * const App = () => {
     *   const marketplace = // ... obtain marketplace contract instance
     *   const nft = // ... obtain NFT contract instance
     *   const account = // ... obtain the user's Ethereum account
     * 
     *   return <MyPurchases marketplace={marketplace} nft={nft} account={account} />;
     * }
     *
     * export default App;
     */
    const [loading, setLoading] = useState(true);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const loadPurchasedItems = async () => {
        const itemCount = await marketplace.itemCount();
        const filter = marketplace.filters.Purchased(null, null, null, null, null, account);
        const results = await marketplace.queryFilter(filter);
        const purchasedItems = [];
        for (let i = 0; i < results.length; i++) {
            const event = results[i];
            const item = await marketplace.items(event.args.itemId);
            const uri = await nft.tokenURI(item.tokenId);
            if (uri === 'sampleURI') continue;
            const metadata = await fetch(uri);
            const metadataJson = await metadata.json();
            purchasedItems.push({
                totalPrice: item.totalPrice,
                itemId: item.itemId,
                seller: item.seller,
                price: metadataJson.price,
                name: metadataJson.name,
                description: metadataJson.description,
                image: metadataJson.image,
            });
        }
        console.log(purchasedItems);
        setPurchasedItems(purchasedItems);
        setLoading(false);
    }

    useEffect(() => {
        loadPurchasedItems();
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
            <MDBRow className="my-5"><h2>My Purchased Items</h2></MDBRow> 
            <MDBRow>
                {purchasedItems.length > 0 ? purchasedItems.map((item, index) => (
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
                                    <h5 className="text-dark mb-0">{item.price} ETH</h5>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <p class="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                )) : <p className='lead'>No items found</p>}
            </MDBRow>
        </MDBContainer>
    )
}