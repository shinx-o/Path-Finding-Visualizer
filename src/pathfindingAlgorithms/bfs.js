export const getBfsAnimations = (grid, src, dest) => {
    const animations = [];
    if (grid.length <= 1 || grid[0].length <= 1) return grid;
    bfs(grid, src, dest, animations)
    const shortestPath = hasPath(grid, dest);
    return [animations, shortestPath]
}

const hasPath = (grid, dest) => {
    const path = []
    let currNode = grid[dest[0]][dest[1]].parent
    if (currNode === null) return path;
    while (currNode.parent !== null) {
        path.unshift([currNode.row, currNode.col])
        currNode = currNode.parent
    }
    return path;
}

const bfs = (grid, src, dest, animations) => {
    const visited = new Set();
    const queue = [src];
    while (queue.length > 0) {
        const [currRow, currCol] = queue.shift();
        if(grid[currRow][currCol].isWall) continue
        if (currRow === dest[0] && currCol === dest[1]) return;
        if (!visited.has(`${currRow},${currCol}`)) {
            visited.add(`${currRow},${currCol}`);
            if ((!grid[currRow][currCol].start || !grid[currRow][currCol] ) && grid[currRow][currCol].isWall === false) {
                grid[currRow][currCol].visited = true;
                animations.push([currRow, currCol])
            }
            if (currRow + 1 >= 0 && currRow + 1 < grid.length) {
                const node = grid[currRow+1][currCol]
                if(node.parent === null && node.start === false && node.isWall === false) grid[currRow+1][currCol].parent = grid[currRow][currCol]
                queue.push([currRow + 1, currCol])
            }
            if (currCol - 1 >= 0 && currCol - 1 < grid[0].length) {
                const node = grid[currRow][currCol-1]
                if(node.parent === null && node.start === false && node.isWall === false) grid[currRow][currCol-1].parent = grid[currRow][currCol]
                queue.push([currRow, currCol - 1])
            }
            if (currRow - 1 >= 0 && currRow - 1 < grid.length) {
                const node = grid[currRow-1][currCol]
                if(node.parent === null && node.start === false && node.isWall === false) grid[currRow-1][currCol].parent = grid[currRow][currCol]
                queue.push([currRow - 1, currCol])
            }
            if (currCol + 1 >= 0 && currCol + 1 < grid[0].length) {
                const node = grid[currRow][currCol+1]
                if(node.parent === null && node.start === false && node.isWall === false) grid[currRow][currCol+1].parent = grid[currRow][currCol]
                queue.push([currRow, currCol + 1])
            }
        }
    }
}
