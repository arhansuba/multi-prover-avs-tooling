const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://localhost:8545'); // Update with your Ethereum RPC endpoint

async function monitorStatus() {
    try {
        // Example: Monitor events from your contract
        const contractAddress = '0x123456789...'; // Replace with your deployed contract address
        const contractData = fs.readFileSync(path.resolve(__dirname, '../contracts/MultiProverAVS.sol'), 'utf8');
        const contract = new web3.eth.Contract(JSON.parse(contractData).abi, contractAddress);

        // Example: Subscribe to an event
        contract.events.ProverAdded({ fromBlock: 'latest' })
            .on('data', event => {
                console.log('Prover added:', event.returnValues.prover);
            })
            .on('error', error => {
                console.error('Error in event subscription:', error);
            });

        // Example: Query state of a TEE or contract variable
        const proverCount = await contract.methods.proverCount().call();
        console.log('Current prover count:', proverCount);

        // Example: Monitor a specific TEE status using a provider API
        const teeProvider = 'https://example-tee-provider-api.com';
        const teeStatus = await fetch(`${teeProvider}/status`)
            .then(response => response.json())
            .then(data => data.status)
            .catch(error => {
                console.error('Error fetching TEE status:', error);
            });

        console.log('TEE status:', teeStatus);

    } catch (error) {
        console.error('Error in monitoring:', error);
    } finally {
        // Ensure proper disconnection from the Ethereum node
        web3.currentProvider.disconnect();
    }
}

monitorStatus();
