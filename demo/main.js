'use strict';

/* global jKstra */

function init() {
    var gridW = 15;
    var gridH = 15;
    var linearCost = 1;
    var diagonalCost = Math.sqrt(2);

    var graph = new jKstra.Graph();

    function cellId(node) {
        return 'n_' + node.data.i + '_' + node.data.j;
    }

    function createNode(i, j) {
        var node = graph.addVertex({ i: i, j: j });
        // connect automatically to surrounding nodes
        if (i > 0) {
            graph.addEdgePair(node, graph.vertex({ i: i - 1, j: j }), linearCost);
        }
        if (j > 0) {
            graph.addEdgePair(node, graph.vertex({ i: i, j: j - 1 }), linearCost);
        }
        if (i > 0 && j > 0) {
            graph.addEdgePair(node, graph.vertex({ i: i - 1, j: j - 1 }), diagonalCost);
        }
        if (i > 0 && j < gridW - 1) {
            graph.addEdgePair(node, graph.vertex({ i: i - 1, j: j + 1 }), diagonalCost);
        }
        return node;
    }

    var tBodyContent = '';
    // create a full grid graph and a table representation
    for (var i = 0; i < gridH; i++) {
        for (var j = 0; j < gridW; j++) {
            if (j === 0) {
                tBodyContent += '<tr>';
            }
            var node = createNode(i, j);
            tBodyContent += '<td id="' + cellId(node) + '" />';
            if (j === gridW - 1) {
                tBodyContent += '</tr>';
            }
        }
    }
    document.getElementById('grid').innerHTML = tBodyContent;

    // add some obstacles in the grid by removing some nodes
    function removeNode(n) {
        document.getElementById(cellId(n)).className = 'off';
        graph.removeVertex(n);
    }
    for (var _i = 0; _i < 13; _i++) {
        removeNode(graph.vertex({ i: _i, j: 5 }));
    }
    for (var _i2 = 5; _i2 < 14; _i2++) {
        removeNode(graph.vertex({ i: _i2, j: 10 }));
    }

    var dijkstra = new jKstra.algos.Dijkstra(graph);
    var path = dijkstra.shortestPath(graph.vertex({ i: 0, j: 0 }), graph.vertex({ i: 8, j: 14 }), {
        edgeCost: function edgeCost(e) {
            return e.data;
        },
        onSettle: function onSettle(n) {
            // mark nodes added to the tree
            document.getElementById(cellId(n)).className = 'onTree';
        }
    });
    // mark nodes on the shortestPath
    path.forEach(function (e) {
        document.getElementById(cellId(e.from)).className = 'onPath';
    });
}

window.onload = init;