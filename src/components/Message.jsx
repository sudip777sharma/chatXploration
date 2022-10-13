import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {

    console.log(message);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const textRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        textRef.current?.scrollIntoView({
            behavior: "smooth"
        });
        // console.log("message");
    }, [message]);

    return (
        <div ref={textRef} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
                <span>just now</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img ref={imgRef} src={message.img} alt="" />}
            </div>
        </div>
    )
}

export default Message