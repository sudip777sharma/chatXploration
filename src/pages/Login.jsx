import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import Loading from './Loading';

const Login = () => {

    const [err, setErr] = useState('');
    const [logedin, setLogedin] = useState(0);
    const history = useHistory();

    const handleSubmit = async (e) => {
        setLogedin(1);
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push("/");
        } catch (error) {
            const errorCode = error.code;
            // console.log(errorCode);
            setErr(errorCode);
        }
    }

    return (err === '' && logedin) ? (<Loading caption={'Loggin in...'} />) : (
        <>
            <div className='formContainer'>
                <div className="formWarpper">
                    <span className="logo">chatX
                    </span>
                    <span className="title">Login</span>
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder='email' autoComplete="on" />
                        <input type="password" placeholder='password' />
                        <button>Sign in</button>
                        {err && <span className='error'>{err}</span>}
                    </form>
                    <p>you don't have an account? <Link to="/register">Register</Link></p>
                    <p className="madeWithlove">made with ❤️ by sudeep sharma.</p>
                    <p className='viewAbout'> view about <Link to="/about">chatX </Link></p>
                </div>
            </div>
        </>
    )
}

export default Login