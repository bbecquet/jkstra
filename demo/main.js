'use strict';

/* global jKstra */

function init() {
    var gridW = 50;
    var gridH = 30;
    var linearCost = 1;
    var diagonalCost = Math.sqrt(2);

    var graph = new jKstra.Graph();
    var start = null;
    var end = null;

    function cellIdToIJ(cellId) {
        var parts = cellId.split('_');
        return {
            i: parseInt(parts[1], 10),
            j: parseInt(parts[2], 10)
        };
    }

    function nodeToCellId(node) {
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
            tBodyContent += '<td id="' + nodeToCellId(node) + '" />';
            if (j === gridW - 1) {
                tBodyContent += '</tr>';
            }
        }
    }
    document.getElementById('grid').innerHTML = tBodyContent;

    // add some obstacles in the grid by removing some nodes
    function removeNode(n) {
        document.getElementById(nodeToCellId(n)).className = 'off';
        graph.removeVertex(n);
    }
    for (var _i = 0; _i < 13; _i++) {
        removeNode(graph.vertex({ i: _i, j: 5 }));
    }
    for (var _i2 = 5; _i2 < 20; _i2++) {
        removeNode(graph.vertex({ i: _i2, j: 10 }));
    }
    for (var _j = 0; _j < 15; _j++) {
        removeNode(graph.vertex({ i: 20, j: _j }));
    }
    for (var _i3 = 1; _i3 < 10; _i3++) {
        removeNode(graph.vertex({ i: _i3, j: 18 }));
    }
    for (var _j2 = 18; _j2 < 25; _j2++) {
        removeNode(graph.vertex({ i: 10, j: _j2 }));
    }

    function clearPath() {
        var elements = document.getElementsByClassName('onPath');
        for (var _i4 = elements.length - 1; _i4 >= 0; --_i4) {
            elements.item(_i4).classList.remove('onPath');
        }
        elements = document.getElementsByClassName('onTree');
        for (var _i5 = elements.length - 1; _i5 >= 0; --_i5) {
            elements.item(_i5).classList.remove('onTree');
        }
        document.getElementById('pathCost').innerHTML = '';
        document.getElementById('settledNodes').innerHTML = '';
    }

    function getTotalCost(path) {
        if (!path) return -1;
        return path.map(function (e) {
            return e.data;
        }).reduce(function (prev, curr) {
            return prev + curr;
        }, 0);
    }

    function distance(from, to) {
        var iDiff = from.data.i - to.data.i;
        var jDiff = from.data.j - to.data.j;
        return Math.sqrt(iDiff * iDiff + jDiff * jDiff);
    }

    function computePath(from, to, bidirectional, useHeuristic) {
        var nbSettledNodes = 0;
        var dijkstra = bidirectional ? new jKstra.algos.BidirectionalDijkstra(graph) : new jKstra.algos.Dijkstra(graph);
        var options = {
            edgeCost: function edgeCost(e) {
                return e.data;
            },
            onSettle: function onSettle(n) {
                // mark nodes added to the tree
                document.getElementById(nodeToCellId(n)).classList.add('onTree');
                nbSettledNodes++;
            }
        };
        if (useHeuristic) {
            if (bidirectional) {
                options.heuristicOut = function (n) {
                    return distance(n, to);
                };
                options.heuristicIn = function (n) {
                    return distance(n, from);
                };
            } else {
                options.heuristic = function (n) {
                    return distance(n, to);
                };
            }
        }
        var path = dijkstra.shortestPath(from, to, options);
        // mark nodes on the shortestPath
        path.map(function (e) {
            return e.from;
        }).concat(to).forEach(function (node) {
            document.getElementById(nodeToCellId(node)).classList.add('onPath');
        });

        document.getElementById('pathCost').innerHTML = getTotalCost(path);
        document.getElementById('settledNodes').innerHTML = nbSettledNodes;
    }

    document.getElementById('grid').addEventListener('click', function (e) {
        var cell = e.target;
        if (cell && cell.matches('td')) {
            if (cell.matches('.off')) {
                return;
            }
            if (start) {
                document.getElementById(nodeToCellId(start)).classList.remove('start');
                clearPath();
            }
            cell.classList.add('start');
            start = graph.vertex(cellIdToIJ(cell.id));
        }
    });

    document.getElementById('grid').addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var cell = e.target;
        if (cell && cell.matches('td')) {
            if (cell.matches('.off')) {
                return;
            }
            if (end) {
                document.getElementById(nodeToCellId(end)).classList.remove('end');
                clearPath();
            }
            cell.classList.add('end');
            end = graph.vertex(cellIdToIJ(cell.id));
        }
    });

    document.getElementById('computePath').addEventListener('click', function () {
        clearPath();
        if (!start || !end) {
            return;
        }
        computePath(start, end, document.getElementById('bidirectional').checked, document.getElementById('useHeuristic').checked);
    });
}

window.onload = init;