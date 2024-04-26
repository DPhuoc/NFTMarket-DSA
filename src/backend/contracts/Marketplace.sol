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
}