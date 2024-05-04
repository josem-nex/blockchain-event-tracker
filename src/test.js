
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/8PiV1eJiecx-k9WgE-aa-yZQ5RsdUYrY");


provider.getBlockNumber().then((blockNumber) => {
    console.log("Block number:", blockNumber);
});


const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
const contractABI = [
    "event NewEventName(address indexed _from, string _name)"
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);

contract.on("NewEventName", (_from, _name) => {
    console.log(`Nombre cambiado por ${_from} a ${_name}`);
});

console.log("Esperando eventos del contrato...");