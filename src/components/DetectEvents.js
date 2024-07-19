import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './DetectEvents.css';
import Button from './Button';

function DetectEvents() {
    // the provider is the connection to the blockchain
    const RPCProvider = "https://eth-sepolia.g.alchemy.com/v2/xfnApveI4Et5xdxgicivAdAbWsKTt3LY"
    // the contract address of the smart contract
    const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
    // the contract ABI (Application Binary Interface) is the definition of the smart contract
    const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_message", "type": "string" }], "name": "NewEventMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewEventName", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_number", "type": "uint256" }], "name": "NewEventNumber", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "addToNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }], "name": "createEventMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "createEventName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
    const [provider, setProvider] = useState(null);
    const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || []);
    const [eventHash, setEventHash] = useState(() => JSON.parse(localStorage.getItem('eventHash')) || []);

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
    useEffect(() => {
        // save the events and event hash in localStorage whenever they change
        localStorage.setItem('events', JSON.stringify(events));
        localStorage.setItem('eventHash', JSON.stringify(eventHash));
    }, [events, eventHash]);

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
                    setEventHash([eventH, ...eventHash]);
                    let eventInfo = { nombre: event.fragment.name, args: [] };
                    for (let i = 0; i < eventData.inputs.length; i++) {
                        eventInfo.args.push({ nombre: String(eventData.inputs[i].name), valor: String(event.args[i]) });
                    }
                    setEvents([eventInfo, ...events]);
                });

            }, 2000);
            return () => clearInterval(interval);
        }
    }, [provider, contractAddress, contractABI]);
    // a simple UI to show the events
    return (
        <>
            <Button onClick={() => { localStorage.clear(); window.location.reload(); }}>Clear Events</Button>
            <div className='contract-address'>
                <h4>Contract Address:</h4>
                <p>{contractAddress}</p>
            </div>

            <div className="events">
                <h3>Events:</h3>
                <ul>
                    {events.map((evento, index) => (
                        <li key={index}>
                            <h4>{evento.nombre}:</h4>
                            <ul>
                                {evento.args.map(arg => (
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

export default DetectEvents;

