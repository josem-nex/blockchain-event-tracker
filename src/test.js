const { ethers } = require("ethers");
const { Web3 } = require("web3");

const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/XO3RVPF7PH8WZBEE3vkWOzr39k0oRhRr");
// const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/XO3RVPF7PH8WZBEE3vkWOzr39k0oRhRr");

// provider.getBlockNumber().then((blockNumber) => {
//     console.log("Block number:", blockNumber);
// });
provider.getBlockNumber().then((blockNumber) => {
    console.log("Block number:", blockNumber);
})

const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_message", "type": "string" }], "name": "NewEventMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewEventName", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_number", "type": "uint256" }], "name": "NewEventNumber", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "addToNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }], "name": "createEventMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "createEventName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

const contractEthjs = new ethers.Contract(contractAddress, contractABI, provider);


contractEthjs.on("*", (event) => {
    console.log("Evento: ", event.fragment.name);
    let eventData = contractEthjs.interface.getEvent(event.fragment.name);
    for (let i = 0; i < eventData.inputs.length; i++) {
        console.log(eventData.inputs[i].name, ":", event.args[i]);
    }
});
