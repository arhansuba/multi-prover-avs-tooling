// utils/ethereum.js
const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545'); // Update with your Ethereum RPC endpoint

// Function to get Ethereum accounts
const getAccounts = async () => {
    try {
        return await web3.eth.getAccounts();
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return [];
    }
};

module.exports = {
    web3,
    getAccounts,
};
