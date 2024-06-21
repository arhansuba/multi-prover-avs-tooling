const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://localhost:8545'); // Update with your Ethereum RPC endpoint

async function deployContract() {
    try {
        // Fetch accounts from the local node
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts found on the local node. Please check your setup.');
        }
        console.log('Deploying contract from account:', accounts[0]);

        // Read contract data from file
        const contractPath = path.resolve(__dirname, '../contracts/MultiProverAVS.sol');
        const contractData = fs.readFileSync(contractPath, 'utf8');

        // Compile contract ABI and bytecode
        const compiledContract = new web3.eth.Contract(JSON.parse(contractData).abi);

        // Deploy the contract
        const deployedContract = await compiledContract.deploy({
            data: '0x' + JSON.parse(contractData).bytecode, // Ensure bytecode is prefixed with '0x'
        }).send({
            from: accounts[0],
            gas: web3.utils.toHex(5000000), // Convert gas limit to hex format
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()), // Use current gas price
        });

        console.log('Contract deployed at address:', deployedContract.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error.message);
    } finally {
        // Ensure proper disconnection from the Ethereum node
        web3.currentProvider.disconnect();
    }
}

deployContract();
