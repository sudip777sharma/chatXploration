import React, { useEffect } from 'react'

import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {

    if (window.screen.width < 552) {
        window.onpopstate = function () {
            window.history.forward();
            // alert("Back/Forward clicked!");
            var sidebarEle = document.querySelector(".sidebar");
            var chatEle = document.querySelector(".chat");
            if (sidebarEle && chatEle) {
                chatEle.style.display = "none";
                sidebarEle.style.display = "unset";
            }
        }
    }

    return (
        <div className='home'>
            <div className="container">
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default Home
