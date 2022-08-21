import React from 'react'
import './node.scss'

export default function Node({ src, dest, walls, id , divStyle}) {

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
        <div className='node' style={divStyle}>
            <div id={id} className={addClass} ></div>
        </div>
    )
}
