// src/Chat.js
import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/chathub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', (user, message) => {
                        setMessages(messages => [...messages, { user, message }]);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection.connectionStarted) {
            try {
                await connection.send('SendMessage', user, message);
                setMessage('');
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Name" />
            <div>
                {messages.map((m, index) => (
                    <div key={index}><strong>{m.user}</strong>: {m.message}</div>
                ))}
            </div>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;