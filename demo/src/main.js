/* global jKstra */

function init() {
    const gridW = 15;
    const gridH = 15;
    const linearCost = 1;
    const diagonalCost = Math.sqrt(2);

    const graph = new jKstra.Graph();

    function cellId(node) {
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
            tBodyContent += `<td id="${cellId(node)}" />`;
            if (j === gridW - 1) { tBodyContent += '</tr>'; }
        }
    }
    document.getElementById('grid').innerHTML = tBodyContent;

    // add some obstacles in the grid by removing some nodes
    function removeNode(n) {
        document.getElementById(cellId(n)).className = 'off';
        graph.removeVertex(n);
    }
    for(let i = 0; i < 13; i++) { removeNode(graph.vertex({i, j: 5})); }
    for(let i = 5; i < 14; i++) { removeNode(graph.vertex({i, j: 10})); }

    const dijkstra = new jKstra.algos.Dijkstra(graph);
    const path = dijkstra.shortestPath(graph.vertex({i: 0, j: 0}), graph.vertex({i: 8, j: 14}), {
        edgeCost: function(e) { return e.data; },
        onSettle: function(n) {
            // mark nodes added to the tree
            document.getElementById(cellId(n)).className = 'onTree';
        }
    });
    // mark nodes on the shortestPath
    path.forEach(function(e) { document.getElementById(cellId(e.from)).className = 'onPath'; });
}

window.onload = init;
