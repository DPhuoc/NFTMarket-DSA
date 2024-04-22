require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        ]
    },
    paths: {
        artifacts: "./src/backend/artifacts",
        sources: "./src/backend/contracts",
        cache: "./src/backend/cache",
        tests: "./src/backend/test"
    },
    neworks: {
        hardhat: {
            chainId: 1337
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        }
    }
};
