import React, { useContext, useState } from 'react'

import { RiCloseCircleFill, RiImageAddFill } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";
import { RiSendPlaneFill } from "react-icons/ri";

import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const InputMessage = () => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [imgName, setImgName] = useState('');

    const handleSend = async () => {
        setText('');
        setImg(null);
        setImgName('');
        if (img) {

            console.log("img handleSend: ", img);
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(snapshot.state);
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // console.log('File available at', downloadURL);

                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        });
                    });
                }
            );
        } else {
            text && await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            });
        }

        text && await updateDoc(doc(db, "userChats", currentUser.uid), {

            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        });

        text && await updateDoc(doc(db, "userChats", data.user.uid), {

            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        });

    }

    const onChangeImg = (e) => {
        console.log("img: ", img);
        setImg(e.target.files[0]);
        setImgName(e.target.files[0].name);
    }
    const onClickCloseImg = () => {
        setImgName('');
        setImg(null);
    }

    return (
        <div className="inputMessage">
            <input type="text" placeholder='Type something...' onKeyDown={(e) => e.code === "Enter" && handleSend()} onChange={(e) => setText(e.target.value)} value={text} />
            <div className="send">
                <input type="file" style={{ display: "none" }} id="file" onChange={onChangeImg} value={''} />
                {imgName && <span className='imgName'>
                    {`${imgName.slice(0, 10)} ${imgName && "..."}`}
                    <RiCloseCircleFill className='closeImgbtn' onClick={onClickCloseImg}></RiCloseCircleFill>
                </span>}
                <label htmlFor="file">
                    <RiImageAddFill />
                </label>
                <ImAttachment />

                <button onClick={handleSend}>
                    <RiSendPlaneFill className='plane' />
                    send
                </button>
            </div>
        </div>
    )
}

export default InputMessage