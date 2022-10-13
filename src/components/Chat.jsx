import React, { useContext, useEffect, useState } from 'react'

import { FaVideo } from 'react-icons/fa'
import { HiUserAdd } from 'react-icons/hi'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdArrowRoundBack } from 'react-icons/io'

import Messages from './Messages'
import InputMessage from './InputMessage'
// import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import NoChat from './NoChat'

const Chat = () => {

    // const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const handleClickBack = () => {
        if (window.screen.width < 552) {
            var sidebarEle = document.querySelector(".sidebar");
            var chatEle = document.querySelector(".chat");
            if (chatEle) {
                chatEle.style.display = "none";
                sidebarEle.style.display = "unset";
            }
        }
    }
    return (data.chatId === 'null') ? (<NoChat />) : (
        <div className='chat'>
            <div className="chatInfo">
                {window.screen.width < 552 && <IoMdArrowRoundBack className='backbtn' onClick={handleClickBack} />}
                <img src={data.user?.photoURL} alt="" />
                <span className='chatName'>{data.user?.displayName}</span>
                <div className="chatIcons">
                    <span>
                        <FaVideo />
                    </span>
                    <span>
                        <HiUserAdd />
                    </span>
                    <span>
                        <BsThreeDots />
                    </span>
                </div>
            </div>
            <Messages />
            <InputMessage />
        </div>
    )
}

export default Chat