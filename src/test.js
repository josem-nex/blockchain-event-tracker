// const { ethers } = require("ethers");
const { Web3 } = require("web3");
// const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/XO3RVPF7PH8WZBEE3vkWOzr39k0oRhRr");

const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/XO3RVPF7PH8WZBEE3vkWOzr39k0oRhRr");

// provider.getBlockNumber().then((blockNumber) => {
//     console.log("Block number:", blockNumber);
// });
web3.eth.getBlockNumber().then((blockNumber) => {
    console.log("Block number:", blockNumber);
});

const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_message", "type": "string" }], "name": "NewEventMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewEventName", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_number", "type": "uint256" }], "name": "NewEventNumber", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "addToNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }], "name": "createEventMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "createEventName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

const contract = new web3.eth.Contract(contractABI, contractAddress);


// contract.on("NewEventName", (_from, _name) => {
//     console.log(`Nombre cambiado por ${_from} a ${_name}`);
// });

// console.log(contract.events.allEvents());
// console.log(contract.events.allEvents());

let nameEvents = [];

const events = contract.events.allEvents();
// console.log(events.jsonInterface);

events.jsonInterface.forEach(element => {
    if (element.type === "event") {
        nameEvents.push(element.name);
    }
});

// console.log(nameEvents);

function listenForEvents() {
    // Escuchando todos los eventos del contrato
    contract.events.allEvents(nameEvents, (error, event) => {
        if (error) {
            console.error("Error al escuchar eventos:", error);
        } else {
            console.log("Evento recibido:", event);
        }
    });
}

listenForEvents();

setInterval(() => {
    listenForEvents();
}, 1000); // Revisa cada segundo


// console.log("Esperando eventos del contrato...");