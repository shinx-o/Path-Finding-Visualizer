import React from 'react'
import './node.scss'

export default function Node({ src, dest, walls, id }) {

    let addClass = 'node-anime';

    if (src) {
        addClass += ' start'
    } else if (dest) {
        addClass += ' end'
    } else if (walls) {
        addClass += ' walls'
    } else if (src && dest) {
        addClass += ' start end'
    }

    return (
        <div className='node'>
            <div id={id} className={addClass}></div>
        </div>
    )
}
