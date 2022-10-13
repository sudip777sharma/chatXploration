import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const Search = () => {

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState('');

    const handleSerach = async () => {
        console.log("handleSearch : ", username);
        try {
            setErr('');
            const q = query(collection(db, "users"), where("displayName", ">=", username), where("displayName", ">=", username + '\uf8ff'));

            console.log("q: ", q);
            const querySnapshot = await getDocs(q);
            // console.log("querySnapshort: ", querySnapshot);

            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data().email);
                setUser(doc.data());
            });
        } catch (err) {
            console.log(err.code);
            setErr(err.code);
        }
    }

    const handleKey = (e) => {
        // console.log(e.target.value);
        e.code === "Enter" && handleSerach();
    }

    const handleSelect = async (u) => {
        // check whether the group(chats in firestore )exists, if not create
        const combinedId = currentUser.uid > user.uid ? (currentUser.uid + user.uid) : (user.uid + currentUser.uid);
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
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
            dispatch({ type: "CHANGE_USER", payload: u })
        } catch (err) {
            console.log(err.code);
        }
        setUser(null);
        setUsername("");
    }

    return (
        <div div className="search" >
            <div className="searchForm">
                <input type="text" placeholder="🔍  find users" onKeyDown={handleKey} onChange={e => setUsername(e.target.value)} value={username} />
            </div>
            {err && <span className='userNotFound'>{err}</span>}
            {/* {!err && !user && <span className='userNotFound'>user not found!</span>} */}
            {!err && user && <div className="userChat" onClick={() => handleSelect(user)}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div >
    )
}

export default Search