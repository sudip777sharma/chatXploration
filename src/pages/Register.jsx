import React, { useState } from 'react'
import { RiImageAddFill } from 'react-icons/ri';
import { RiCloseCircleFill } from "react-icons/ri";
import { useHistory, useNavigate } from "react-router-dom";

import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import Loading from './Loading';

const Register = () => {

    const [err, setErr] = useState('');
    const history = useHistory();
    const [imgName, setImgName] = useState('');
    const [img, setImg] = useState('');
    const [registered, setRegistered] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        var displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        displayName = displayName?.toLowerCase();
        console.log("displayName: ", displayName);
        console.log("file: ", file);
        try {
            setRegistered(1);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            setErr('');

            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(snapshot.state);
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // console.log('File available at', downloadURL);
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        history.push("/login");
                    });
                    console.log(res.user);
                }
            );
        } catch (error) {
            const errorCode = error.code;
            // console.log(errorCode);
            setErr(errorCode);
        }
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

    return (err === '' && registered) ? (<Loading caption={'Registering in...'} />) : (
        <div className='formContainer'>
            <div className="formWarpper">
                <span className="logo">chatX</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='display name' />
                    <input type="email" placeholder='email' />
                    <input type="password" placeholder='password' />
                    <input style={{ display: "none" }} type="file" onChange={onChangeImg} id="file" />
                    {imgName && <span className='imgNameReg'>
                        {`${imgName.slice(0, 10)} ${imgName && "..."}`}
                        <RiCloseCircleFill className='closeImgRegbtn' onClick={onClickCloseImg}></RiCloseCircleFill>
                    </span>}
                    <label htmlFor="file">
                        <RiImageAddFill />
                        <span>add profile photo</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span className='error'>{err}</span>}
                </form>
                <p>you do have an account? <Link to="/login">Login</Link> </p>
                <p className='madeWithlove'>made with ❤️ by sudeep sharma.</p>
                <p className='viewAbout'> view about <Link to="/about"> chatX </Link></p>
            </div>
        </div>
    )
}

export default Register