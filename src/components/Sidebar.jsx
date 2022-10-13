import React from 'react'

import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Chats from '../components/Chats'
import ElasticSearch from './ElasticSearch'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Navbar />
            {/* <Search /> */}
            <ElasticSearch />
            <Chats />
        </div>
    )
}

export default Sidebar