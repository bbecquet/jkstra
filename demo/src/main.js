/* global jKstra */

function init() {
    const gridW = 50;
    const gridH = 30;
    const linearCost = 1;
    const diagonalCost = Math.sqrt(2);

    const graph = new jKstra.Graph();
    let start = null;
    let end = null;

    function cellIdToIJ(cellId) {
        const parts = cellId.split('_');
        return {
            i: parseInt(parts[1], 10),
            j: parseInt(parts[2], 10)
        };
    }

    function nodeToCellId(node) {
        return `n_${node.data.i}_${node.data.j}`;
    }

    function createNode(i, j) {
        const node = graph.addVertex({i, j});
        // connect automatically to surrounding nodes
        if(i > 0) { graph.addEdgePair(node, graph.vertex({i: i - 1, j}), linearCost); }
        if(j > 0) { graph.addEdgePair(node, graph.vertex({i, j: j - 1}), linearCost); }
        if(i > 0 && j > 0) { graph.addEdgePair(node, graph.vertex({i: i - 1, j: j - 1}), diagonalCost); }
        if(i > 0 && j < gridW - 1) { graph.addEdgePair(node, graph.vertex({i: i - 1, j: j + 1}), diagonalCost); }
        return node;
    }

    let tBodyContent = '';
    // create a full grid graph and a table representation
    for(let i = 0; i < gridH; i++) {
        for(let j = 0; j < gridW; j++) {
            if (j === 0) { tBodyContent += '<tr>'; }
            const node = createNode(i, j);
            tBodyContent += `<td id="${nodeToCellId(node)}" />`;
            if (j === gridW - 1) { tBodyContent += '</tr>'; }
        }
    }
    document.getElementById('grid').innerHTML = tBodyContent;

    // add some obstacles in the grid by removing some nodes
    function removeNode(n) {
        document.getElementById(nodeToCellId(n)).className = 'off';
        graph.removeVertex(n);
    }
    for(let i = 0; i < 13; i++) { removeNode(graph.vertex({i, j: 5})); }
    for(let i = 5; i < 20; i++) { removeNode(graph.vertex({i, j: 10})); }
    for(let j = 0; j < 15; j++) { removeNode(graph.vertex({i: 20, j})); }
    for(let i = 1; i < 10; i++) { removeNode(graph.vertex({i, j: 18})); }
    for(let j = 18; j < 25; j++) { removeNode(graph.vertex({i: 10, j})); }

    function clearPath() {
        let elements = document.getElementsByClassName('onPath');
        for (let i = elements.length - 1; i >= 0; --i) {
            elements.item(i).classList.remove('onPath');
        }
        elements = document.getElementsByClassName('onTree');
        for (let i = elements.length - 1; i >= 0; --i) {
            elements.item(i).classList.remove('onTree');
        }
        document.getElementById('pathCost').innerHTML = '';
        document.getElementById('settledNodes').innerHTML = '';
    }

    function getTotalCost(path) {
        if (!path) return -1;
        return path.map(e => e.data).reduce((prev, curr) => prev + curr, 0);
    }

    function distance(from, to) {
        const iDiff = from.data.i - to.data.i;
        const jDiff = from.data.j - to.data.j;
        return Math.sqrt(iDiff * iDiff + jDiff * jDiff);
    }

    function computePath(from, to, bidirectional, useHeuristic) {
        let nbSettledNodes = 0;
        const dijkstra = bidirectional ?
            new jKstra.algos.BidirectionalDijkstra(graph) :
            new jKstra.algos.Dijkstra(graph);
        const options = {
            edgeCost: e => e.data,
            onSettle: n => {
                // mark nodes added to the tree
                document.getElementById(nodeToCellId(n)).classList.add('onTree');
                nbSettledNodes++;
            }
        };
        if (useHeuristic) {
            if (bidirectional) {
                options.OUT = { heuristic: n => distance(n, to) };
                options.IN = { heuristic: n => distance(n, from) };
            } else {
                options.heuristic = n => distance(n, to);
            }
        }
        const path = dijkstra.shortestPath(from, to, options);
        // mark nodes on the shortestPath
        path.map(e => e.from)
            .concat(to)
            .forEach(node => { document.getElementById(nodeToCellId(node)).classList.add('onPath'); });

        document.getElementById('pathCost').innerHTML = getTotalCost(path);
        document.getElementById('settledNodes').innerHTML = nbSettledNodes;
    }

    function setPathPoint(cell, isStart) {
        let previousPoint = isStart ? start : end;
        const className = isStart ? 'start' : 'end';

        if (cell && cell.matches('td')) {
            if (cell.matches('.off')) { return; }
            if (previousPoint) {
                document.getElementById(nodeToCellId(previousPoint)).classList.remove(className);
                clearPath();
            }
            cell.classList.add(className);
            if (isStart) {
                start = graph.vertex(cellIdToIJ(cell.id));
            } else {
                end = graph.vertex(cellIdToIJ(cell.id));
            }
            // if (start && end) {
            //     document.getElementById('computePath').click();
            // }
        }
    }

    document.getElementById('grid').addEventListener('click', e => {
        setPathPoint(e.target, true);
    });

    document.getElementById('grid').addEventListener('contextmenu', e => {
        e.preventDefault();
        setPathPoint(e.target, false);
    });

    document.getElementById('computePath').addEventListener('click', () => {
        clearPath();
        if (!start || !end) { return; }
        computePath(start, end,
            document.getElementById('bidirectional').checked,
            document.getElementById('useHeuristic').checked);
    });
}

window.onload = init;
