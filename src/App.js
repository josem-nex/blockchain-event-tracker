import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
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
  const [eventHash, setEventHash] = useState([]);

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

      const interval = setInterval(() => {
        contract.on("*", (event) => {
          console.log("Evento: ", event.fragment.name);
          let eventData = contract.interface.getEvent(event.fragment.name);
          let eventH = event.log.transactionHash;
          if (eventHash.includes(eventH)) {
            return;
          }
          setEventHash(eventHash.push(eventH));
          let eventInfo = { nombre: event.fragment.name, argumentos: [] };
          for (let i = 0; i < eventData.inputs.length; i++) {
            eventInfo.argumentos.push({ nombre: eventData.inputs[i].name, valor: event.args[i] });
          }
          setEvents(eventosAnteriores => {
            const nuevosEventos = [...eventosAnteriores, eventInfo];
            console.log(nuevosEventos); // Verifica que los eventos se estén actualizando correctamente
            return nuevosEventos;
          });
        });

      }, 2000);
      return () => clearInterval(interval);

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [provider, contractAddress, contractABI]);
  // a simple UI to show the events
  return (
    <>
      <Header />

      {/* informacion del contrato actual al que se está conectado, nombre y direccion: */}
      <h4>Contract Address:</h4>
      <p>{contractAddress}</p>

      <div className="App">
        <h3>Events:</h3>
        <ul>
          {events.map((evento, index) => (
            <li key={index}>
              <h4>{evento.nombre}:</h4>
              <ul>
                {evento.argumentos.map(arg => (
                  <li key={arg.nombre}>{arg.nombre}: {String(arg.valor)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

}

export default App;