const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://localhost:8545'); // Update with your Ethereum RPC endpoint
const accountIndex = 0; // Index of the account to use for deployment
const gasLimit = 5000000; // Adjust gas limit as needed

const deployContract = async () => {
    try {
        // Fetch accounts from the local node
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts found on the local node. Please check your setup.');
        }
        console.log('Deploying contract from account:', accounts[accountIndex]);

        // Read contract data from file
        const contractPath = path.resolve(__dirname, '../contracts/MultiProverAVS.sol');
        const contractData = fs.readFileSync(contractPath, 'utf8');
        const contractABI = JSON.parse(contractData).abi;
        const contractBytecode = '0x' + JSON.parse(contractData).bytecode; // Ensure bytecode is prefixed with '0x'

        // Create contract instance
        const MyContract = new web3.eth.Contract(contractABI);

        // Deploy contract
        const deployTransaction = MyContract.deploy({
            data: contractBytecode,
        });

        const gasPrice = await web3.eth.getGasPrice();
        const options = {
            data: deployTransaction.encodeABI(),
            gas: gasLimit,
            gasPrice: gasPrice,
            from: accounts[accountIndex],
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(options, process.env.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log('Contract deployed successfully at address:', receipt.contractAddress);
    } catch (error) {
        console.error('Error deploying contract:', error.message);
    } finally {
        // Ensure proper disconnection from the Ethereum node
        web3.currentProvider.disconnect();
    }
};

module.exports = deployContract;
