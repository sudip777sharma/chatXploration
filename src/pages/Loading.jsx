import React from 'react'
import '../loading.css';

const Loading = ({ caption }) => {
    return (
        <>
            <div className="loadingContainer">
                <div className='loadingWrapper'>
                    <div class="loader"></div>
                    <p>{caption}</p>
                </div>
            </div>
        </>
    )
}

export default Loading