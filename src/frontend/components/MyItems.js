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