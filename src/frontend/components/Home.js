import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";

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
            <div className="flex justify-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            
        </div>
    )
}

export default Home;