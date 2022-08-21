import React, {useEffect, useCallback, useReducer} from "react";
import Node from "../node/Node";
import "./grid.scss";
import { getDfsAnimations } from "../../pathfindingAlgorithms/dfs.js";
import { getBfsAnimations } from "../../pathfindingAlgorithms/bfs.js";
import { getDijkstraAnimations } from "../../pathfindingAlgorithms/dijkstra.js";
import { Checkbox, InputLabel, Button, Select, MenuItem } from "@mui/material";
import { boardState, INITIAL_STATE } from "../../stateManager/boardState";
import { ACTION_TYPES } from "../../stateManager/stateActions";

export default function Grid() {
  const [state, dispatch] = useReducer(boardState, INITIAL_STATE);
  const {ROWS, COLS, disableControls, algorithm, speed, message, grid, removeWalls, source, target} = state;
  const src = [source.r, source.c];
  const dest = [target.r, target.c];

  const resetBoard = () => {
    const nodes = document.getElementsByClassName("node-anime");
    for (let node of nodes) {
      node.classList.remove("visited");
      node.classList.remove("path");
      node.classList.remove("walls");
      node.classList.remove("weight");
    }
  };

  const resetAlgorithm = () => {
    const nodes = document.getElementsByClassName("node-anime");
    for (let node of nodes) {
      node.classList.remove("visited");
      node.classList.remove("path");
    }
    for (let list of grid) {
      for (let node of list) {
        node.isVisited = false;
        node.weight = node.start ? 0 : node.weight === 2 ? node.weight : 1;
        node.distance = node.start ? 0 : Infinity;
        node.parent = null;
      }
    }
  };

  const createGrid = useCallback(() => {
    dispatch({ type: ACTION_TYPES.MESSAGE, payload: null });
    resetBoard();
    const GRID = [];
    for (let row = 0; row < ROWS; row++) {
      GRID.push([]);
      for (let col = 0; col < COLS; col++) {
        GRID[row].push({
          row: +row,
          col: +col,
          start: row === source.r && col === source.c,
          end: row === target.r && col === target.c,
          visited: false,
          parent: null,
          isWall: false,
          weight: row === source.r && col === source.c ? 0 : 1,
          distance: row === source.r && col === source.c ? 0 : Infinity,
        });
      }
    }
    dispatch({ type: ACTION_TYPES.GRID, payload: [...GRID] });
  }, [ROWS, COLS, source.r, source.c, target.r, target.c]);

  const handleAlgorithm = () => {
    dispatch({ type: ACTION_TYPES.DISABLE_CONTROLS, payload: true });
    dispatch({ type: ACTION_TYPES.REMOVE_WALLS, payload: false });
    document.getElementById("walls-check").checked = false;
    document.getElementsByClassName("grid")[0].style.pointerEvents = "none";
    switch (algorithm) {
      case "dfs":
        resetAlgorithm();
        dispatch({
          type: ACTION_TYPES.MESSAGE,
          payload: "Depth First Search does not guarantee the shortest path.",
        });
        beginDfs();
        break;
      case "bfs":
        resetAlgorithm();
        dispatch({
          type: ACTION_TYPES.MESSAGE,
          payload: null,
        });
        beginBfs();
        break;
      case "dijkstra":
        resetAlgorithm();
        dispatch({
          type: ACTION_TYPES.MESSAGE,
          payload: null,
        });
        beginDijkstra();
        break;
      default:
        dispatch({ type: ACTION_TYPES.DISABLE_CONTROLS, payload: false });
        dispatch({
          type: ACTION_TYPES.MESSAGE,
          payload: null,
        });
    }
  };

  useEffect(() => {
    createGrid();

    window.addEventListener("resize", (e) => {
      dispatch({
        type: ACTION_TYPES.CHANGE_ROWS,
        payload: Math.floor(e.target.innerHeight / 28.9) - 9,
      });
      dispatch({
        type: ACTION_TYPES.CHANGE_COLS,
        payload: Math.floor(e.target.innerWidth / 28.9) - 4,
      });
    });
  }, [createGrid, ROWS, COLS]);

  const animateShortestPath = (shortestPath) => {
    if (shortestPath.length === 0) {
      dispatch({
        type: ACTION_TYPES.MESSAGE,
        payload: "No Path Exist From source To target!",
      });
      dispatch({
        type: ACTION_TYPES.DISABLE_CONTROLS,
        payload: false,
      });
      document.getElementsByClassName("grid")[0].style.pointerEvents = "auto";
      return;
    }
    document.getElementById(dest[0] + "," + dest[1]).classList.add("visited");
    document.getElementById(src[0] + "," + src[1]).classList.add("path");
    const nodes = document.getElementsByClassName("node-anime");
    for (let i = 0; i < shortestPath.length; i++) {
      const [r, c] = shortestPath[i];
      const node = nodes[c + r * COLS];
      setTimeout(() => {
        node.classList.add("path");
      }, i * speed * 3);
    }

    setTimeout(() => {
      dispatch({
        type: ACTION_TYPES.DISABLE_CONTROLS,
        payload: false,
      });
      document.getElementsByClassName("grid")[0].style.pointerEvents = "auto";
      document.getElementById(dest[0] + "," + dest[1]).classList.add("path");
    }, shortestPath.length * speed * 3);
  };

  const beginDfs = () => {
    const [animations, shortestPath] = getDfsAnimations(
      grid,
      src && src,
      dest && dest
    );
    document.getElementById(src[0] + "," + src[1]).classList.add("visited");
    for (let i = 0; i < animations.length; i++) {
      const nodes = document.getElementsByClassName("node-anime");
      const [r, c] = animations[i];
      const node = nodes[c + r * COLS];
      setTimeout(() => {
        node.classList.add("visited");
      }, i * speed * 3);
    }
    setTimeout(() => {
      animateShortestPath(shortestPath);
    }, animations.length * speed * 3 + 500);
  };

  const beginBfs = () => {
    const [animations, shortestPath] = getBfsAnimations(
      grid,
      src && src,
      dest && dest
    );
    document.getElementById(src[0] + "," + src[1]).classList.add("visited");
    for (let i = 0; i < animations.length; i++) {
      const nodes = document.getElementsByClassName("node-anime");
      const [r, c] = animations[i];
      const node = nodes[c + r * COLS];
      setTimeout(() => {
        node.classList.add("visited");
      }, i * speed * 2);
    }
    setTimeout(() => {
      animateShortestPath(shortestPath);
    }, animations.length * speed * 2 + 500);
  };

  const beginDijkstra = () => {
    const [animations, shortestPath] = getDijkstraAnimations(
      grid,
      src && src,
      dest && dest
    );
    document.getElementById(src[0] + "," + src[1]).classList.add("visited");
    for (let i = 0; i < animations.length; i++) {
      const nodes = document.getElementsByClassName("node-anime");
      const [r, c, w] = animations[i];
      const node = nodes[c + r * COLS];
      setTimeout(() => {
        node.classList.add("visited");
      }, i * 2 * speed * w);
    }
    setTimeout(() => {
      animateShortestPath(shortestPath);
    }, animations.length * speed * 2 + 500);
  };

  const handleWalls = (event) => {
    const node = document.getElementById(event.target.id);
    if (node) {
      const [r, c] = event.target.id.split(",");
      if (grid[r][c].start || grid[r][c].end) return;
      const child = event.target.classList;
      if (removeWalls) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            grid[r][c].parent = null;
          }
        }
        child.add("walls");
        child.remove("visited");
        child.remove("path");
        child.remove("weight");
        grid[r][c].isWall = true;
        grid[r][c].isVisited = false;
        grid[r][c].weight = 1;
      } else {
        child.remove("walls");
        grid[r][c].isWall = false;
      }
    }
  };

  const randomMaze = () => {
    resetBoard();
    for (let list of grid) {
      for (let node of list) {
        node.isWall = false;
        node.isVisited = false;
        node.weight = node.start ? 0 : 1;
        node.distance = node.start ? 0 : Infinity;
        node.parent = null;
      }
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (
          r === 0 ||
          r === ROWS - 1 ||
          c === 0 ||
          c === COLS - 1
        ) {
          document.getElementById(r + "," + c).classList.add("walls");
          grid[r][c].isWall = true;
        }
      }
    }
    let multiplier = randomIntFromInterval(8, 10);
    if (window.innerWidth <= 1366) multiplier = randomIntFromInterval(6, 8);
    for (let i = 0; i < COLS * multiplier; i++) {
      const r = randomIntFromInterval(0, ROWS - 1);
      const c = randomIntFromInterval(0, COLS - 1);
      if (grid[r][c].start || grid[r][c].end) continue;
      document.getElementById(r + "," + c).classList.add("walls");
      grid[r][c].isWall = true;
    }
    dispatch({ type: ACTION_TYPES.GRID, payload: [...grid] });
  };

  const randomWeight = () => {
    resetBoard();
    for (let list of grid) {
      for (let node of list) {
        node.isWall = false;
        node.isVisited = false;
        node.weight = node.start ? 0 : 1;
        node.distance = node.start ? 0 : Infinity;
        node.parent = null;
        node.isMazeWeight = false;
      }
    }

    let multiplier = randomIntFromInterval(8, 10);
    if (window.innerWidth <= 1366) multiplier = randomIntFromInterval(6, 8);
    for (let i = 0; i < COLS * multiplier; i++) {
      const r = randomIntFromInterval(0, ROWS - 1);
      const c = randomIntFromInterval(0, COLS - 1);
      if (grid[r][c].start || grid[r][c].end) continue;
      grid[r][c].weight = 2;
      document.getElementById(r + "," + c).classList.add("weight");
    }
    dispatch({ type: ACTION_TYPES.GRID, payload: [...grid] });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="upper">
          <Button
            variant="text"
            sx={{ textTransform: "capitalize" }}
            disabled={disableControls}
            onClick={randomMaze}
          >
            Random Maze
          </Button>
          <Button
            variant="text"
            sx={{ textTransform: "capitalize" }}
            disabled={disableControls}
            onClick={randomWeight}
          >
            Random Weight
          </Button>
          <Button
            variant="text"
            sx={{ textTransform: "capitalize" }}
            className="board"
            disabled={disableControls}
            onClick={createGrid}
          >
            Clear Board
          </Button>
          <Select
            sx={{
              color: "white",
              fontWeight: "500",
              fontSize: "18px",
              width: "250px",
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={algorithm}
            label="Algorithm"
            onChange={(e) =>
              dispatch({
                type: ACTION_TYPES.ALGORITHM,
                payload: e.target.value,
              })
            }
            disabled={disableControls}
          >
            <MenuItem value="null">Select An Algorithm</MenuItem>
            <MenuItem value="bfs">Breadth First Search</MenuItem>
            <MenuItem value="dfs">Depth First Search</MenuItem>
            <MenuItem value="dijkstra">Dijkstra's Algorithm</MenuItem>
          </Select>
          <button
            className="begin"
            style={{
              backgroundColor: disableControls ? "#e63d3d" : "#4eaa4e",
            }}
            disabled={disableControls}
            onClick={handleAlgorithm}
          >
            Visualize
          </button>
          <div className="speed">
            <InputLabel
              id="remove-walls"
              sx={{
                color: "white",
                fontWeight: "500",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Speed:
            </InputLabel>
            <Select
              sx={{
                color: "white",
                fontWeight: "500",
                fontSize: "18px",
                width: "150px",
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={speed}
              label="Algorithm"
              onChange={(e) =>
                dispatch({
                  type: ACTION_TYPES.SPEED,
                  payload: e.target.value,
                })
              }
              disabled={disableControls}
            >
              <MenuItem value={25}>Very Slow</MenuItem>
              <MenuItem value={15}>Slow</MenuItem>
              <MenuItem value={8}>Normal</MenuItem>
              <MenuItem value={5}>Fast</MenuItem>
            </Select>
          </div>
          <div className="walls-checkbox">
            <InputLabel
              id="remove-walls"
              sx={{
                color: "white",
                fontWeight: "500",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Add / Remove Walls
            </InputLabel>
            <Checkbox
              labelid="remove-walls"
              id="walls-check"
              sx={{ cursor: "pointer" }}
              disabled={disableControls}
              onChange={(e) =>
                dispatch({
                  type: ACTION_TYPES.REMOVE_WALLS,
                  payload: e.target.checked,
                })
              }
            />
          </div>
        </div>
        <div className="bottom">
          <div className="message-box">
            {message && <span className="message">{message}</span>}
          </div>
        </div>
      </div>
      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div className="row-container" key={rowIdx}>
                {row.map((col, colIdx) => {
                  const { start, end, visited, isWall } = col;
                  return (
                    <div
                      className="col-container"
                      key={colIdx}
                      onDragOver={handleWalls}
                    >
                      <Node
                        key={colIdx}
                        id={`${rowIdx},${colIdx}`}
                        src={start}
                        dest={end}
                        visited={visited}
                        walls={isWall}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
