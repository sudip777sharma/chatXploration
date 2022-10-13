import React from 'react'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
const About = () => {
    const history = useHistory();
    const handleClickBack = () => {
        history.push("/login");
    }
    return (
        <>
            <IoMdArrowRoundBack className='backBtn' onClick={handleClickBack} />
            <div className='noChatWrapper'>
                <h1>Chat Xploration</h1>
                <p>end-to-end encrypted.</p>
                <p>ChatX, is an internationally available freeware, cross-platform centralized instant messaging app owned by sudeep sharma</p>
                <h1>made with ❤️</h1 >
                <h1> by sudeep sharma. </h1>
            </div>
        </>

    )
}

export default About
