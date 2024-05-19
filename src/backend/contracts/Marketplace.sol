// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev A decentralized marketplace for buying and selling ERC721 NFTs.
 *
 * This contract allows users to list their NFTs for sale and purchase listed NFTs.
 * The contract charges a fee on each sale, which is transferred to the fee account.
 * The contract uses ReentrancyGuard to prevent reentrancy attacks.
 */
contract Marketplace is ReentrancyGuard {
    // state variables
    address payable public immutable feeAccount; // the account that receives fees
    uint256 public immutable feePercent; // the fee percentage on sales

    uint256 public itemCount; // the number of items listed for sale

    // struct to represent an item
    struct Item {
        uint itemId;
        IERC721 nftContract;
        uint tokenId;
        uint price;
        address payable seller;
        bool isSold;
    }
     // Events
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

    mapping(uint => Item) public items;
    /**
     * @dev Sets the fee percentage and fee account.
     * @param _feePercent The fee percentage on sales
     */
    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    /**
     * @dev Lists an NFT for sale.
     * @param _nft The address of the NFT contract
     * @param _tokenId The ID of the token in the NFT contract
     * @param _price The price of the item in wei
     */
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be at least 1 wei");
        // increment the item count
        itemCount++;
        // transfer the NFT to this contract
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add the item to the items mapping
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), false);
        // emit the Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }
    /**
     * @dev Purchases an NFT.
     * @param _itemId The ID of the item to purchase
     */
    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        // check if the item is available
        require(item.itemId > 0 && _itemId <= itemCount, "Item not available");
        require(msg.value >= _totalPrice, "Not enough funds sent");
        require(item.isSold == false, "Item is already sold");

        // pay the seller and the fee account
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        // update the item
        item.isSold = true;

        // rtansfer the NFT to the buyer
        item.nftContract.transferFrom(address(this), msg.sender, item.tokenId);
        // emit the Purchased event
        emit Purchased(_itemId, address(item.nftContract), item.tokenId, item.price, item.seller, msg.sender);
    }
    
    /**
     * @dev Returns the total price of an item including the marketplace fee.
     * @param _itemId The ID of the item
     * @return The total price of the item in wei
     */
    function getTotalPrice(uint _itemId) public view returns (uint) {
        return items[_itemId].price * (100 + feePercent) / 100;
    }
}