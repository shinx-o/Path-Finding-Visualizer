import React from 'react'
import './node.scss'

export default function Node({ src, dest, walls, id }) {

    let addClass = 'node';

    if (src) {
        addClass += ' start'
    } else if (dest) {
        addClass += ' end'
    } else if (walls) {
        addClass += ' walls'
    } else if (src && dest) {
        addClass += ' start end'
    } else if (src && dest && walls) {
        addClass += ' start end walls'
    }

    return (
        <div className={addClass} >
            <div className='node-anime'><div id={id} className='node-path'></div></div>
        </div>
    )
}
