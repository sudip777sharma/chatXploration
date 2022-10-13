import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Chats = () => {

    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        if (window.screen.width < 552) {
            var sidebarEle = document.querySelector(".sidebar");
            var chatEle = document.querySelector(".chat");
            if (chatEle) {
                chatEle.style.display = "unset";
                sidebarEle.style.display = "none";
            }
        }
    }

    // console.log("chats: ", Object.entries(chats));
    return (
        <div className='chats'>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)} >
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        <p className='lastMessage'>{`${(chat[1].lastMessage?.text) ? (chat[1].lastMessage?.text).slice(0, 40) : ''} ${(((chat[1].lastMessage?.text) ? (chat[1].lastMessage?.text).length : 0) > 40) ? ". . ." : ""}`}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats