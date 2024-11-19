import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const pusher = new Pusher('838cc5df0f3c8414bd03', {
            cluster: 'mt2',
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        const channel = pusher.subscribe('messages');
        channel.bind('App\\Events\\MessageSent', function(data) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return (
        <div>
            <h1>Messages:</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
