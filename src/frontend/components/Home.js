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
                                    <h5 className="text-dark mb-0">${item.price}</h5>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <p class="text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                                <MDBBtn onClick={() => buyItem(item)} color='primary'>Buy Now</MDBBtn>
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