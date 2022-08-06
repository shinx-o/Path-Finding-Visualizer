import React, { useState } from 'react'
import { useCallback } from 'react';
import { useEffect } from 'react';
import Node from '../node/Node'
import './grid.scss'
import { getDfsAnimations } from '../../pathfindingAlgorithms/dfs.js'
import { getBfsAnimations } from '../../pathfindingAlgorithms/bfs.js'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox, InputLabel, Button } from '@mui/material';

export default function Grid() {
    const [ROWS, setROWS] = useState(Math.floor(window.innerHeight / 28.9) - 8)
    const [COLS, setCOLS] = useState(Math.floor(window.innerWidth / 28.9) - 4)
    const [disableControls, setDisableControls] = useState(false)
    const [algorithm, setAlgorithm] = useState('null')
    const [speed, setSpeed] = useState(8)
    const [message, setMessage] = useState(null)
    const [grid, setGrid] = useState([[]])
    const [removeWalls, setRemoveWalls] = useState(false);
    const source = { r: 11, c: 5 }
    const target = { r: 11, c: 56 }
    const src = [source.r, source.c]
    const dest = [target.r, target.c]

    const resetBoard = () => {
        const nodes = document.getElementsByClassName('node-anime')
        for (let node of nodes) {
            node.classList.remove('anime-visited')
            node.classList.remove('path')
            node.classList.remove('walls')
        }
    }

    const resetAlgorithm = () => {
        const nodes = document.getElementsByClassName('node-anime')
        for (let node of nodes) {
            node.classList.remove('anime-visited')
            node.classList.remove('path')
        }
    }

    const createGrid = useCallback(() => {
        setMessage(null)
        resetBoard();
        const GRID = [];
        for (let row = 0; row < ROWS; row++) {
            GRID.push([])
            for (let col = 0; col < COLS; col++) {
                GRID[row].push({
                    row: +row,
                    col: +col,
                    start: row === source.r && col === source.c,
                    end: row === target.r && col === target.c,
                    visited: false,
                    parent: null,
                    isWall: false,
                })
            }
        }
        setGrid([...GRID])
    }, [ROWS, COLS, source.r, source.c, target.r, target.c]);

    const handleAlgorithm = () => {
        setDisableControls(true)
        setRemoveWalls(false)
        document.getElementById('walls-check').checked = false;
        document.getElementsByClassName('grid')[0].style.pointerEvents = 'none';
        switch (algorithm) {
            case 'dfs':
                resetAlgorithm()
                setMessage('Depth First Search does not guarantee the shortest path.')
                beginDfs();
                break;
            case 'bfs':
                resetAlgorithm()
                setMessage(null)
                beginBfs();
                break;
            default:
                setDisableControls(false)
                setMessage('Select an Algorithm to Continue!')
        }
    }

    useEffect(() => {
        createGrid()

        window.addEventListener('resize', (e) => {
            setROWS(Math.floor(e.target.innerHeight / 28.9) - 9)
            setCOLS(Math.floor(e.target.innerWidth / 28.9) - 4)
        })

    }, [createGrid, ROWS, COLS])

    const animateShortestPath = (shortestPath) => {
        if (shortestPath.length === 0) {
            setMessage('No Path Exist From Source To Target!')
            setDisableControls(false)
            return
        }
        document.getElementById(dest[0] + ',' + dest[1]).classList.add('anime-visited')
        document.getElementById(src[0] + ',' + src[1]).classList.add('path')
        const nodes = document.getElementsByClassName('node-anime');
        for (let i = 0; i < shortestPath.length; i++) {
            const [r, c] = shortestPath[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('path')
            }, i * speed);
        }

        setTimeout(() => {
            setDisableControls(false)
            document.getElementsByClassName('grid')[0].style.pointerEvents = 'auto';
            document.getElementById(dest[0] + ',' + dest[1]).classList.add('path')
        }, shortestPath.length * speed)

    }

    const beginDfs = () => {
        const [animations, shortestPath] = getDfsAnimations(grid, src && src, dest && dest)
        document.getElementById(src[0] + ',' + src[1]).classList.add('anime-visited')
        for (let i = 0; i < animations.length; i++) {
            const nodes = document.getElementsByClassName('node-anime');
            const [r, c] = animations[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('anime-visited')
            }, i * speed);
        }
        setTimeout(() => {
            animateShortestPath(shortestPath);
        }, (animations.length * speed) + 500)

    }

    const beginBfs = () => {
        const [animations, shortestPath] = getBfsAnimations(grid, src && src, dest && dest)
        document.getElementById(src[0] + ',' + src[1]).classList.add('anime-visited')
        for (let i = 0; i < animations.length; i++) {
            const nodes = document.getElementsByClassName('node-anime');
            const [r, c] = animations[i];
            const node = nodes[c + r * COLS];
            setTimeout(() => {
                node.classList.add('anime-visited')
            }, i * speed);
        }
        setTimeout(() => {
            animateShortestPath(shortestPath);
        }, (animations.length * speed) + 500)
    }

    const handleWalls = (event) => {
        const node = document.getElementById(event.target.id)
        if (node) {
            const [r, c] = event.target.id.split(',');
            if (grid[r][c].start || grid[r][c].end) return;
            const child = event.target.classList;
            if (removeWalls) {
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        grid[r][c].parent = null;
                    }
                }
                child.add('walls')
                grid[r][c].isWall = true
            }
            else {
                child.remove('walls')
                grid[r][c].isWall = false
            }
        }
    }

    const randomMaze = () => {
        resetBoard();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                document.getElementById(r + ',' + c).classList.remove('walls');
                grid[r][c].isWall = false;
                grid[r][c].parent = null;
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
                    document.getElementById(r + ',' + c).classList.add('walls');
                    grid[r][c].isWall = true;
                }
            }
        }

        for (let i = 0; i < (COLS) * 10; i++) {
            const r = randomIntFromInterval(0, ROWS - 1)
            const c = randomIntFromInterval(0, COLS - 1)
            if (grid[r][c].start || grid[r][c].end) continue
            document.getElementById(r + ',' + c).classList.add('walls');
            grid[r][c].isWall = true;
        }
        setGrid([...grid])
    }


    return (
        <div className="container">
            <div className="header">
                <div className="upper">
                    <Button variant="text" sx={{ textTransform: 'capitalize' }} disabled={disableControls} onClick={randomMaze}>Random Maze</Button>
                    <Button variant="text" sx={{ textTransform: 'capitalize' }} className="board" disabled={disableControls} onClick={createGrid} >Clear Board</Button>
                    <Select
                        sx={{ color: 'white', fontWeight: '500', fontSize: '18px', width: '250px' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={algorithm}
                        label="Algorithm"
                        onChange={(e) => setAlgorithm(e.target.value)}
                        disabled={disableControls}
                    >
                        <MenuItem value='null'>Select An Algorithm</MenuItem>
                        <MenuItem value='bfs'>Breadth First Search</MenuItem>
                        <MenuItem value='dfs'>Depth First Search</MenuItem>
                    </Select>
                    <button className="begin" style={{ backgroundColor: disableControls ? '#e63d3d' : '#4eaa4e' }} disabled={disableControls} onClick={handleAlgorithm}>Visualize</button>
                    <div className="speed">
                        <InputLabel id='remove-walls' sx={{ color: 'white', fontWeight: '500', fontSize: '18px', cursor: 'pointer' }} >Speed:</InputLabel >
                        <Select
                            sx={{ color: 'white', fontWeight: '500', fontSize: '18px', width: '150px' }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={speed}
                            label="Algorithm"
                            onChange={(e) => setSpeed(e.target.value)}
                            disabled={disableControls}
                        >
                            <MenuItem value={25}>Very Slow</MenuItem>
                            <MenuItem value={15}>Slow</MenuItem>
                            <MenuItem value={8}>Normal</MenuItem>
                            <MenuItem value={5}>Fast</MenuItem>
                        </Select>
                    </div>
                    <div className="walls-checkbox">
                        <InputLabel id='remove-walls' sx={{ color: 'white', fontWeight: '500', fontSize: '18px', cursor: 'pointer' }} >Add / Remove Walls</InputLabel >
                        <Checkbox labelid='remove-walls' id='walls-check' sx={{ cursor: 'pointer' }} disabled={disableControls} onChange={(e) => setRemoveWalls(e.target.checked)} />
                    </div>
                </div>
                <div className="bottom">
                    <div className="message-box">
                        {
                            message && (
                                <span className="message">{message}</span>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="grid-container">
                <div className='grid' >
                    {
                        grid.map((row, rowIdx) => {
                            return (
                                <div className="row-container" key={rowIdx} >
                                    {
                                        row.map((col, colIdx) => {
                                            const { start, end, visited, isWall } = col
                                            return (
                                                <div className="col-container" key={colIdx} onDragOver={handleWalls}>
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


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}