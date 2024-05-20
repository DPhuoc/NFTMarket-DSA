import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBIcon,
    MDBSpinner,
    MDBRipple,
    MDBBtn
} from "mdb-react-ui-kit";

const Home = ({ marketplace, nft }) => {
    /**
     * Home Component
     *
     * This component displays the available NFTs on the marketplace. It fetches and loads the market items,
     * displaying each item with its details (name, description, price, and image). Users can purchase items directly
     * from this interface.
     *
     * @component
     *
     * @param {object} props - The component props.
     * @param {object} props.marketplace - The marketplace contract instance.
     * @param {object} props.nft - The NFT contract instance.
     *
     * @returns {JSX.Element} The rendered component.
     *
     * State Variables:
     * @state {Array} items - An array of items available in the marketplace.
     * @state {boolean} loading - Indicates if the component is in a loading state.
     *
     * Methods:
     * @function loadMarketItems - Fetches and loads items from the marketplace, sets the `items` state variable, and updates the `loading` state.
     * @function buyItem - Purchases an item from the marketplace and reloads the market items.
     *
     * Hooks:
     * @hook useEffect - Calls `loadMarketItems` when the component mounts to load the initial market items.
     *
     * Usage:
     * Import and render this component to display the available items in the marketplace. Ensure that the necessary
     * contract instances are passed as props.
     *
     * @example
     * import React from 'react';
     * import Home from './Home';
     * 
     * const App = () => {
     *   const marketplace = // ... obtain marketplace contract instance
     *   const nft = // ... obtain NFT contract instance
     * 
     *   return <Home marketplace={marketplace} nft={nft} />;
     * }
     *
     * export default App;
     */

    // state variables
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load Market Items
    const loadMarketItems = async () => {
        // get the total number of items
        const itemCount = await marketplace.itemCount();
        let items = [];
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.items(i);
            if (!item.isSold) {
                // get the token URI
                const uri = await nft.tokenURI(item.tokenId);

                console.log(uri);
                if (uri === 'sampleURI') continue;
                // get the metadata from the URI
                const metadata = await fetch(uri);
                const metadataJson = await metadata.json();
                console.log(metadataJson);

                // get the price
                const totalPrice = await marketplace.getTotalPrice(item.itemId);

                // add the item to the items array
                items.push({
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    price: metadataJson.price,
                    name: metadataJson.name,
                    description: metadataJson.description,
                    image: metadataJson.image,
                });
                console.log(item);

            }
        }

        // set the items state variable
        setItems(items);
        // set loading to false
        setLoading(false);
        console.log(loading);
    }

    // Buy Item
    const buyItem = async (item) => {
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
        loadMarketItems();
    }

    // Load Market Items on component mount
    useEffect(() => {
        loadMarketItems();
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
            <MDBRow>
                {items.length > 0 ? items.map((item, index) => (
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
                                    <h5 className="text-dark mb-0">{item.price} ETH</h5>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <p class="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                                <MDBBtn noRipple onClick={() => buyItem(item)} color='primary'>Buy Now</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                )) : (
                    <div className='d-flex justify-content-center'>
                        <h5 className='justify-content-center text-dark'>No items available</h5>
                    </div>
                )}
                
            </MDBRow>
        </MDBContainer>
    )
}

export default Home;