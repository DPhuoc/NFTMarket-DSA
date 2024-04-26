// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    // state variables
    address payable public immutable feeAccount; // the account that receives fees
    uint256 public immutable feePercent; // the fee percentage on sales

    uint256 public itemCount;

    // struct to represent an item
    struct Item {
        uint itemId;
        IERC721 nftContract;
        uint tokenId;
        uint price;
        address payable seller;
        bool isSold;
    }

    // event to emit when an item is offered for sale
    event Offered (
        uint itemId,
        address indexed nftContract,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // event to emit when an item is purchased
    event Purchased (
        uint itemId,
        address indexed nftContract,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    mapping(uint => Item) public items;

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // function to make an item
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

    // function to buy an item
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

    // function to get total price
    function getTotalPrice(uint _itemId) public view returns (uint) {
        return items[_itemId].price * (100 + feePercent) / 100;
    }
}