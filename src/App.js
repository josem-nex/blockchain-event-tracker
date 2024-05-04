import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
// https://eth-sepolia.g.alchemy.com/v2/8PiV1eJiecx-k9WgE-aa-yZQ5RsdUYrY

function App() {
  const [provider, setProvider] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(''); // Nuevo estado para la URL del proveedor RPC
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [events, setEvents] = useState([]);

  // Conexión a la blockchain
  const connectToBlockchain = async () => {
    try {
      // Utilizar la URL del proveedor RPC ingresada por el usuario
      const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/8PiV1eJiecx-k9WgE-aa-yZQ5RsdUYrY");
      setProvider(provider);
    } catch (error) {
      console.error("Error connecting to blockchain:", error);
    }
  };

  // Obtener eventos del contrato
  useEffect(() => {
    if (provider && contractAddress && contractABI) {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Suscribirse a eventos del contrato (ejemplo: evento "Transfer")
      contract.on("NewEventName", (_from, _name) => {
        setEvents(prevEvents => [...prevEvents, { _from, _name }]);
      });

      // Limpieza al desmontar el componente
      return () => {
        contract.removeAllListeners();
      };
    }
  }, [provider, contractAddress, contractABI]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!provider && <button onClick={connectToBlockchain}>Connect to Blockchain</button>}
        {provider && (
          <>
            <input
              type="text"
              placeholder="RPC URL"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <textarea
              placeholder="Contract ABI"
              value={contractABI}
              onChange={(e) => setContractABI(e.target.value)}
            />
            <h2>Eventos del Contrato:</h2>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  Nombre cambiado por {event._from} a {event._name}
                </li>
              ))}
            </ul>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
