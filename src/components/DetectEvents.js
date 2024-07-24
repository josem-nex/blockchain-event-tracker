import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './DetectEvents.css';
import Button from './Button';
// rxdb
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// storage
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { createRxDatabase } from 'rxdb';
addRxPlugin(RxDBDevModePlugin);


async function initializeDatabase() {


    const eventdb = await createRxDatabase({
        name: 'eventdb',
        storage: getRxStorageDexie(),
        eventReduce: true,
        multiInstance: true,
        ignoreDuplicate: true,
    })

    await eventdb.addCollections({
        events: {
            schema: {
                title: 'event schema',
                version: 0,
                description: 'describes a simple event',
                primaryKey: 'hash',
                type: 'object',
                properties: {
                    nombre: {
                        type: 'string',
                    },
                    hash: {
                        type: 'string',
                        maxLength: 100,
                    },
                    args: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                nombre: {
                                    type: 'string',
                                },
                                valor: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                    timestamp: {
                        type: 'number',
                    },
                },
                required: ['nombre', 'args'],
            },
        },
    });
    console.log('Database initialized');
    return eventdb;
}

function DetectEvents() {



    //#region PARAMETERS TO CONNECT TO THE BLOCKCHAIN

    // the provider is the connection to the blockchain
    const RPCProvider = "https://eth-sepolia.g.alchemy.com/v2/xfnApveI4Et5xdxgicivAdAbWsKTt3LY"
    // the contract address of the smart contract
    const contractAddress = "0xD8466f8C9846955Dcc7415b1F06b766E14c663d7";
    // the contract ABI (Application Binary Interface) is the definition of the smart contract
    // eslint-disable-next-line
    const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_message", "type": "string" }], "name": "NewEventMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewEventName", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_number", "type": "uint256" }], "name": "NewEventNumber", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "addToNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }], "name": "createEventMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "createEventName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

    //#endregion

    const [provider, setProvider] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventdb, setEventdb] = useState(null);
    // blockchain connection

    useEffect(() => {
        const connect = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(RPCProvider);
                setProvider(provider);
            } catch (error) {
                console.error("Error connecting to blockchain: ", error);
                alert("Error connecting to blockchain.");
            }
        };
        const initBD = async () => {
            const eventdb = await initializeDatabase();
            setEventdb(eventdb);
        };
        connect();
        initBD();
    }, []);

    // get events from the smart contract
    useEffect(() => {
        if (provider && contractAddress && contractABI && eventdb) {
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const interval = setInterval(async () => {
                contract.on("*", async (event) => {
                    console.log("Evento: ", event.fragment.name);
                    let eventData = contract.interface.getEvent(event.fragment.name);
                    let eventH = event.log.transactionHash;
                    // if (eventHash.includes(eventH)) {
                    //     return;
                    // }
                    const foundEvent = await eventdb.events.findOne({
                        selector: {
                            hash: eventH,
                        },
                    }).exec();

                    if (foundEvent) {
                        return;
                    }


                    // setEventHash([eventH, ...eventHash]);
                    let eventInfo = { nombre: event.fragment.name, args: [] };
                    for (let i = 0; i < eventData.inputs.length; i++) {
                        eventInfo.args.push({ nombre: String(eventData.inputs[i].name), valor: String(event.args[i]) });
                    }
                    // setEvents([eventInfo, ...events]);

                    const myEvent = {
                        nombre: eventInfo.nombre,
                        hash: eventH,
                        args: eventInfo.args,
                        timestamp: Date.now(),
                    };
                    await eventdb.events.upsert(myEvent);
                });

                // get all events from the database
                const allEvents = await eventdb.collections.events.find().exec();
                setEvents(allEvents.map(event => event.toJSON()).sort((a, b) => b.timestamp - a.timestamp));

            }, 2000);
            return () => clearInterval(interval);
        }

    }, [provider, contractAddress, contractABI, eventdb/* , events, eventHash */]);
    // a simple UI to show the events
    return (
        <>
            <Button onClick={async () => { await eventdb.events.find().remove(); window.location.reload(); }}>Clear Events</Button>
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

