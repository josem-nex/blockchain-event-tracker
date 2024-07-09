import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
// https://eth-sepolia.g.alchemy.com/v2/8PiV1eJiecx-k9WgE-aa-yZQ5RsdUYrY

function App() {
  // the provider is the connection to the blockchain
  const RPCProvider = "https://eth-sepolia.g.alchemy.com/v2/xfnApveI4Et5xdxgicivAdAbWsKTt3LY"
  // the contract address of the smart contract
  const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
  // the contract ABI (Application Binary Interface) is the definition of the smart contract
  const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_message", "type": "string" }], "name": "NewEventMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewEventName", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_number", "type": "uint256" }], "name": "NewEventNumber", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "addToNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }], "name": "createEventMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "createEventName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
  const [provider, setProvider] = useState(null);
  const [events, setEvents] = useState([]);

  // blockchain connection
  useEffect(() => {
    const connect = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPCProvider);
        setProvider(provider);
      } catch (error) {
        console.error("Error connecting to blockchain:", error);
      }
    };
    connect();
  }, []);

  // get events from the smart contract
  useEffect(() => {
    if (provider && contractAddress && contractABI) {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      contract.on("*", (event) => {
        console.log("Evento: ", event.fragment.name);
        let eventData = contract.interface.getEvent(event.fragment.name);
        let eventInfo = { nombre: event.fragment.name, argumentos: [] };
        for (let i = 0; i < eventData.inputs.length; i++) {
          eventInfo.argumentos.push({ nombre: eventData.inputs[i].name, valor: event.args[i] });
        }
        setEvents(eventosAnteriores => [...eventosAnteriores, eventInfo]);
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [provider, contractAddress, contractABI]);
  // a simple UI to show the events
  return (
    <div className="App">
      <h2>Eventos del Contrato:</h2>
      <ul>
        {events.map((evento, index) => (
          <li key={index}>
            <h3>{evento.nombre}:</h3>
            <ul>
              {evento.argumentos.map(arg => (
                <li key={arg.nombre}>{arg.nombre}: {arg.valor}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App;