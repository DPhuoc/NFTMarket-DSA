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
    const [loading, setLoading] = useState(true);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const loadPurchasedItems = async () => {
        const itemCount = await marketplace.itemCount();
        console.log(marketplace);
        const filter = marketplace.filters.Purchased(null, null, null, null, null, account);
        const results = await marketplace.queryFilter(filter);
        const purchasedItems = Promise.all(results.map(async (result) => {
            const item = await marketplace.items(result.args.itemId);
            return item;
        }));
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
        <MDBContainer xl className="text-center d-flex mt-5">
            <MDBRow>
                {purchasedItems.length > 0 ? purchasedItems.map((item, index) => (
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
                )) : <p className='lead'>No items found</p>}
            </MDBRow>
        </MDBContainer>
    )
}