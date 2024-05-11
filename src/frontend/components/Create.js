import { useState } from "react";
import { ethers } from "ethers";
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBContainer,
    MDBFile
} from 'mdb-react-ui-kit';

const axios = require('axios')
const FormData = require('form-data')
// const fs = require('fs')
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGUwMmIzZS0yNTA0LTQxOWMtODEzNC0yODU3Y2RiNDZmYTUiLCJlbWFpbCI6InBodW9jN2NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjExOGZmZTFhMzYxNGM5NTExYzg5Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzQ4YmJmNTA2OTkwM2E4ZDI1OGFmMmU2MWZhZTQwMzc3MWJkZWJkMGI1NWRhMTM0ZTFlMmY0YzAwMTQ0OWY5OCIsImlhdCI6MTcxNDQ2OTAwOH0.srhN5HkBzYXRdOF5DXXiPJSQiT2IzS0rPBiqJo--R_w";



const Create = ({ marketplace, nft, account }) => {
    // state variables
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // upload item to IPFS
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${JWT}`
                    }
                });
                console.log('IPFS response: ', response);
                console.log('https://amaranth-sophisticated-rat-495.mypinata.cloud/ipfs/' + response.data.IpfsHash);
                setImage(`https://amaranth-sophisticated-rat-495.mypinata.cloud/ipfs/${response.data.IpfsHash}`);
            } catch (error) {
                console.log('Error uploading file: ', error);
            }
        }
    }

    // create item
    const createNFT = async () => {
        // check if all fields are filled
        if (!name || !description || !price || !image) return;
        
        try {
            const data = JSON.stringify({ image, name, description, price });
            // const formData = new FormData();
            // formData.append('data', data);
            // console.log(data);
            // const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', formData, {
            //     maxBodyLength: "Infinity",
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${JWT}`
            //     }
            // });
            
            // console.log('Metadata response: ', response);
            // mintThenList(response.data.IpfsHash);
            mintThenList(data);
        } catch (error) {
            console.log('Error uploading metadata: ', error);
        }
    }

    // mint and list the item
    const mintThenList = async (result) => {
        // const URI = `https://amaranth-sophisticated-rat-495.mypinata.cloud/ipfs/${result}`;
        const URI = `sampleURI`;
        // mint NFT
        await (await nft.mint(URI)).wait();
        // get toKenId of the minted NFT
        const tokenId = await nft.tokenCount();
        // approve the marketplace to sell the NFT
        await (await nft.setApprovalForAll(marketplace.address, true)).wait();
        // add the item to the marketplace
        const listingPrice = ethers.utils.parseEther(price.toString());
        await (await marketplace.makeItem(nft.address, tokenId, listingPrice)).wait();
    }

    return (
        <MDBContainer xl className="d-flex justify-content-center align-items-center my-5">
            <MDBContainer className="my-5" style={{ width: '100%'}}>
                <MDBFile className='mb-4' size='lg' placeholder='Default file input example' id='customFile' onChange={uploadToIPFS} />

                <MDBInput wrapperClass='mb-4' size='lg' placeholder='Name' onChange={(e) => setName(e.target.value)} />
                <MDBInput wrapperClass='mb-4' size='lg' placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
                <MDBInput wrapperClass='mb-4' size='lg' placeholder='Price' onChange={(e) => setPrice(e.target.value)} />

                <MDBBtn className='mb-4' noRipple onClick={createNFT}>
                    NFT Mint
                </MDBBtn>
            </MDBContainer>
        </MDBContainer>
    )
}

export default Create;