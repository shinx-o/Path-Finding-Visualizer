const Heap = require('heap');
const pq = new Heap((a, b) => {
    return a.distance - b.distance;
});


export const getDijkstraAnimations = (grid, src, dest) => {
    const animations = [];
    if (grid.length <= 1 || grid[0].length <= 1) return grid;
    dijkstra(grid, src, dest, animations)
    const shortestPath = hasPath(grid, dest);
    return [animations, shortestPath];
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

const dijkstra = (grid, src, dest, animations) => {
    const visited = new Set();
    pq.push(grid[src[0]][src[1]]);
    while (!pq.empty()) {
        const curr = pq.pop();
        if (curr.isWall) continue;
        if (curr) {
            if (curr.row === dest[0] && curr.col === dest[1]) return;
            const pos = curr.row + ',' + curr.col;
            if (!visited.has(pos)) {
                visited.add(pos);
                curr.isVisited = true;
                animations.push([curr.row, curr.col, curr.weight])
                const neighbours = getNeighbours(grid, curr.row, curr.col);
                for (let node of neighbours) {
                    const newDist = curr.distance + node.weight;
                    if (newDist < node.distance) {
                        node.distance = newDist;
                        node.parent = curr;
                        pq.push(node)
                    }
                }
            }
        }
    }

}

const getNeighbours = (grid, r, c) => {
    const neighbours = [];
    if (r + 1 < grid.length) neighbours.push(grid[r + 1][c])
    if (r - 1 >= 0) neighbours.push(grid[r - 1][c])
    if (c + 1 < grid[0].length) neighbours.push(grid[r][c + 1])
    if (c - 1 >= 0) neighbours.push(grid[r][c - 1])

    return neighbours;
}

