# Docstrings for ADP Marketplace

## Contracts

### NFT

This contract allows users to mint ERC721 tokens with associated metadata URIs.
```javascript
uint256 public tokenCount; // The total number of tokens minted
```
```javascript
/**
* @dev Initializes the contract by setting the name and symbol for the NFT.
* The name is "Dapp NFT" and the symbol is "DAPP".
*/
constructor() ERC721("Dapp NFT", "DAPP") {
        
}
```
```javascript
/**
* @dev Mints a new NFT with the specified token URI.
* @param _tokenURI The URI for the token's metadata.
* @return The ID of the newly minted token.
*/
function mint(string memory _tokenURI) public returns (uint256) {

}
```

### Marketplace

This contract allows users to list their NFTs for sale and purchase listed NFTs.
The contract charges a fee on each sale, which is transferred to the fee account.
The contract uses ReentrancyGuard to prevent reentrancy attacks.

```javascript
address payable public immutable feeAccount; // the account that receives fees
uint256 public immutable feePercent; // the fee percentage on sales
uint256 public itemCount; // the number of items listed for sale
```
```javascript
/**     
* @dev Emitted when an item is offered for sale.
* @param itemId The ID of the item
* @param nftContract The address of the NFT contract
* @param tokenId The ID of the token in the NFT contract
* @param price The price of the item in wei
* @param seller The address of the seller
*/
event Offered (
    uint itemId,
    address indexed nftContract,
    uint tokenId,
    uint price,
    address indexed seller
);
```
```javascript
/**
* @dev Emitted when an item is purchased.
* @param itemId The ID of the item
* @param nftContract The address of the NFT contract
* @param tokenId The ID of the token in the NFT contract
* @param price The price of the item in wei
* @param seller The address of the seller
* @param buyer The address of the buyer
*/
event Purchased (
    uint itemId,
    address indexed nftContract,
    uint tokenId,
    uint price,
    address indexed seller,
    address indexed buyer
);
```
```javascript
/**
* @dev Sets the fee percentage and fee account.
* @param _feePercent The fee percentage on sales
*/
constructor(uint _feePercent) {
    feeAccount = payable(msg.sender);
    feePercent = _feePercent;
}
```
```javascript
/**
* @dev Lists an NFT for sale.
* @param _nft The address of the NFT contract
* @param _tokenId The ID of the token in the NFT contract
* @param _price The price of the item in wei
*/
function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        
}
```
```javascript
/**
* @dev Purchases an NFT.
* @param _itemId The ID of the item to purchase
*/
function purchaseItem(uint _itemId) external payable nonReentrant {
    
}
```
```javascript
/**
* @dev Returns the total price of an item including the marketplace fee.
* @param _itemId The ID of the item
* @return The total price of the item in wei
*/
function getTotalPrice(uint _itemId) public view returns (uint) {
    
}
```

## Components

### App.js
Main application component for managing and displaying NFT marketplace.

This component handles the initialization of the application state, including user authentication with MetaMask, and loading of contract data for interacting with an NFT marketplace and NFT contracts. It renders the main layout and navigation for the application, conditionally displaying content based on the loading state.


Component:
```javascript
@returns {JSX.Element} The rendered component.
```
State Variables:
```javascript
@state {boolean} loading - Indicates if the application is in a loading state.
@state {string|null} account - The user's Ethereum account address from MetaMask.
@state {object} nft - The NFT contract instance.
@state {object} marketplace - The marketplace contract instance.
```
Methods:
```javascript
@function web3Handler - Handles MetaMask login and sets the account state variable, then loads contract data.
@function loadContractData - Loads the marketplace and NFT contract instances, sets the respective state variables, and sets loading to false.
```
Usage:
- Import and render this component at the root of your application to provide the main structure and functionality for the NFT marketplace. The component will handle MetaMask authentication, load the necessary contract data, and conditionally render the application routes based on the loading state.

Example:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

```

### Home.js
Home Component

This component displays the available NFTs on the marketplace. It fetches and loads the market items,  displaying each item with its details (name, description, price, and image). Users can purchase items directly from this interface.

Compenent:
```javascript
@param {object} props - The component props.
@param {object} props.marketplace - The marketplace contract instance.
@param {object} props.nft - The NFT contract instance.
     
@returns {JSX.Element} The rendered component.
```

State Variables:
```javascript
@state {Array} items - An array of items available in the marketplace.
@state {boolean} loading - Indicates if the component is in a loading state.
```

Methods:
```javascript
@function loadMarketItems - Fetches and loads items from the marketplace, sets the `items` state variable, and updates the `loading` state.
@function buyItem - Purchases an item from the marketplace and reloads the market items.
```

Hooks:
```javascript
@hook useEffect - Calls `loadMarketItems` when the component mounts to load the initial market items.
```

Usage:
- Import and render this component to display the available items in the marketplace. Ensure that the necessary contract instances are passed as props.
     
Example:
```javascript
import React from 'react';
import Home from './Home';

const App = () => {
const marketplace = // ... obtain marketplace contract instance
const nft = // ... obtain NFT contract instance
     return <Home marketplace={marketplace} nft={nft} />;
}

export default App;
```

### Navbar.js
