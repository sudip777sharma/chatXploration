import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

import { FaSearch } from 'react-icons/fa'
import { IoMdArrowRoundBack } from 'react-icons/io'

const ElasticSearch = () => {

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const [searchUsername, setSearchUsername] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [err, setErr] = useState('');

    const rd = (array) => {
        console.log("remove duplicate")
        const ids = array.map(o => o.id)
        const filtered = array.filter(({ id }, index) => !ids.includes(id, index + 1))
        console.log("rd: filtered: ", filtered);
        return filtered
    }

    const handleSearch = async () => {
        // console.log("handleSearch : ", searchUsername);
        try {
            setErr('');
            setSearchedUsers([]);
            if (searchUsername !== '') {
                const q = query(collection(db, "users"), where("displayName", ">=", searchUsername), where("displayName", "<=", searchUsername + '\uf8ff'));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data().email);
                    setSearchedUsers(oldArr => [...oldArr, doc.data()]);
                });
            }

        } catch (err) {
            console.log(err.code);
            setErr(err.code);
        }
    }

    const handleKey = (e) => {
        // console.log(e.target.value);
        // e.code === "Enter" && handleSearch();
        handleSearch();
    }

    const onChange = (e) => {
        setSearchUsername(e.target.value);
    }

    const handleSelect = async (u) => {
        // check whether the group(chats in firestore )exists, if not create
        const combinedId = currentUser.uid > u.uid ? (currentUser.uid + u.uid) : (u.uid + currentUser.uid);
        console.log("combinedId: ", combinedId);
        try {
            console.log("try{: ");
            const res = await getDoc(doc(db, "chats", combinedId));
            console.log("res: ", res);
            if (!res.exists()) {
                // create a chat in chat collection
                console.log("res.exists(): ", res.exists());
                await setDoc(doc(db, "chats", combinedId), {
                    messages: []
                });

                // create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: u.uid,
                        displayName: u.displayName,
                        photoURL: u.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", u.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
            dispatch({ type: "CHANGE_USER", payload: u })
            if (window.screen.width < 552) {
                var sidebarEle = document.querySelector(".sidebar");
                var chatEle = document.querySelector(".chat");
                chatEle.style.display = "unset";
                sidebarEle.style.display = "none";
            }
        } catch (err) {
            console.log(err.code);
        }
        setSearchedUsers([]);
        setSearchUsername("");
    }

    const onBackSearch = () => {
        setSearchUsername("");
        setSearchedUsers([]);
    }

    return (
        <div div className="search" >
            <div className="searchForm">
                {
                    (searchedUsers.length > 0) && (<IoMdArrowRoundBack className='searchBackbtn' onClick={onBackSearch} />)
                }
                <input type="text" placeholder="Type user name..." onChange={onChange} value={searchUsername} onKeyDown={handleKey} />
                <button className='searchbtn' onClick={handleSearch}>
                    <FaSearch /> Search user
                </button>
            </div>
            {err && <span className='userNotFound'>{err}</span>}
            {/* (<span className='userNotFound'>user not found!</span>)  */}
            <div className='searchedUsers'>
                {
                    !err && (
                        searchedUsers?.map((user, index) => (
                            <div className="userChat" key={index} onClick={() => handleSelect(user)}>
                                <img src={user.photoURL} alt="" />
                                <div className="userChatInfo">
                                    <span>{user.displayName}</span>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div >
    )
}

export default ElasticSearch