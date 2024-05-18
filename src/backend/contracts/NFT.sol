// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title NFT
 * @dev A simple ERC721 NFT contract with URI storage.
 * This contract allows users to mint ERC721 tokens with associated metadata URIs.
 */
contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    /**
     * @dev Initializes the contract by setting the name and symbol for the NFT.
     * The name is "Dapp NFT" and the symbol is "DAPP".
     */
    constructor() ERC721("Dapp NFT", "DAPP") {
        
    }

    /**
     * @dev Mints a new NFT with the specified token URI.
     * @param _tokenURI The URI for the token's metadata.
     * @return The ID of the newly minted token.
     */
    function mint(string memory _tokenURI) public returns (uint256) {
        tokenCount++;
        uint256 tokenId = tokenCount;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }
}