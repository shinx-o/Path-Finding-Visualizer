import React, { useState } from 'react'
import { useCallback } from 'react';
import { useEffect } from 'react';
import Node from '../node/Node'
import './grid.scss'
import { getDfsAnimations } from '../../pathfindingAlgorithms/dfs.js'
import { getBfsAnimations } from '../../pathfindingAlgorithms/bfs.js'

export default function Grid() {
    const [ROWS, setROWS] = useState(28)
    const [COLS, setCOLS] = useState(62)
    const [grid, setGrid] = useState([[]])
    const [START_ROW, START_COL] = [7, 12]
    const [END_ROW, END_COL] = [12, 25]
    const source = [START_ROW, START_COL]
    const destination = [END_ROW, END_COL]


    const createGrid = useCallback(() => {
        const nodes = document.getElementsByClassName('node-anime')
        const nodesPath = document.getElementsByClassName('node-path')
        for (let node of nodes) {
            node.classList.remove('anime-visited')
        }
        for (let node of nodesPath) {
            node.classList.remove('path')
        }
        const GRID = [];
        for (let row = 0; row < ROWS; row++) {
            GRID.push([])
            for (let col = 0; col < COLS; col++) {
                GRID[row].push({
                    row: +row,
                    col: +col,
                    start: row === START_ROW && col === START_COL,
                    end: row === END_ROW && col === END_COL,
                    visited: false,
                    parent: null,
                    isWall: false,
                })
            }
        }
        setGrid([...GRID])
    }, [ROWS, COLS, START_COL, START_ROW, END_COL, END_ROW]);

    const handleWalls = () => {

    }

    useEffect(() => {
        createGrid()

        window.addEventListener('resize', (e) => {
            setROWS(Math.floor(e.target.innerHeight / 28.9) - 9)
            setCOLS(Math.floor(e.target.innerWidth / 28.9) - 4)
        })

    }, [createGrid, ROWS, COLS])

    const animateShortestPath = (shortestPath) => {
        for (let i = 0; i < shortestPath.length; i++) {
            const nodes = document.getElementsByClassName('node-path');
            const [r, c] = shortestPath[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('path')
            }, i * 20);
        }

    }

    const beginDfs = () => {
        const [animations, shortestPath] = getDfsAnimations(grid, source && source, destination && destination)
        for (let i = 0; i < animations.length; i++) {
            const nodes = document.getElementsByClassName('node-anime');
            const [r, c] = animations[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('anime-visited')
            }, i * 10);
        }
        setTimeout(() => {
            animateShortestPath(shortestPath);
        }, (animations.length * 10) + 500)

    }

    const beginBfs = () => {
        const [animations, shortestPath] = getBfsAnimations(grid, source && source, destination && destination)
        for (let i = 0; i < animations.length; i++) {
            const nodes = document.getElementsByClassName('node-anime');
            const [r, c] = animations[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('anime-visited')
            }, i * 10);
        }
        setTimeout(() => {
            animateShortestPath(shortestPath);
        }, (animations.length * 10) + 500)
    }


    return (
        <div className="container">
            <div className="header">
                <button className="begin" onClick={createGrid}>Reset</button>
                <button className="begin" onClick={beginDfs}>DFS</button>
                <button className="begin" onClick={beginBfs}>BFS</button>
            </div>
            <div className="grid-container">
                <div className='grid'>
                    {
                        grid.map((row, rowIdx) => {
                            return (
                                <div className="row-container" key={rowIdx}>
                                    {
                                        row.map((col, colIdx) => {
                                            const { start, end, visited, isWall } = col
                                            return (
                                                <div className="col-container" key={colIdx} onMouseDown={handleWalls}>
                                                    <Node key={colIdx} id={`${rowIdx},${colIdx}`} src={start} dest={end} visited={visited} walls={isWall} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
