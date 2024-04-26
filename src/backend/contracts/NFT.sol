// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("Dapp NFT", "DAPP") {
        
    }

    // Mint a new NFT
    function mint(string memory _tokenURI) public returns (uint256) {
        tokenCount++;
        uint256 tokenId = tokenCount;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }
}