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
        console.log(itemCount);
        let items = [];
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.items(i);
            if (!item.isSold) {
                // get the token URI
                const uri = await nft.tokenURI(item.tokenId);

                // get the metadata from the URI
                const respone = await fetch(uri);
                const metadata = await respone.json();

                // get the price
                const totalPrice = await marketplace.getTotalPrice(item.itemId);

                // add the item to the items array
                items.push({
                    totalPrice,
                    itemId: item.itemId.toNumber(),
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                });
            }
        }

        // set the items state variable
        setItems(items);
        // set loading to false
        setLoading(false);
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
            <div className='d-flex justify-content-center align-items-center'>
                <MDBSpinner role='status'/>
            <span className='justify-content-center text-center'>Loading...</span>
        </div>
        )
    }

    return (
        <MDBContainer xl className="text-center d-flex" style={{ height: '90%', marginTop: '150px',}}>
            <MDBRow>
                {items.length > 0 ? items.map((item, index) => (
                    <MDBCol md="12" lg="4" className="mb-4 mb-lg-0">
                    <MDBCard>
                        <div className="d-flex justify-content-between p-3">
                            <p className="lead mb-0">Today's Combo Offer</p>
                        </div>
                        <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/4.webp"
                            position="top"
                            alt="Laptop"
                        />

                        <MDBCardBody>

                            <div className="d-flex justify-content-between mb-3">
                                <h5 className="mb-0">HP Notebook</h5>
                                <h5 className="text-dark mb-0">$999</h5>
                            </div>

                            <div class="d-flex justify-content-between mb-2">
                                <p class="text-muted mb-0">
                                    Description
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