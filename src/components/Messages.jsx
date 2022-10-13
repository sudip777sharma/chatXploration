import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase';

import Message from './Message'

const Messages = () => {

    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const getMessages = () => {
            const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                doc.exists() && setMessages(doc.data().messages);
                // doc.exists() && console.log("doc.data() Messages.js: ", doc.data().messages);
            });
            return () => {
                unsub();
            };
        };

        data.chatId && getMessages();
    }, [data.chatId]);

    return (
        <div className='messages'>
            {messages && messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    )
}

export default Messages