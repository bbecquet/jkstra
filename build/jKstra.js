(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jKstra = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _const = require('../core/const.js');

function BFS(graph, opts) {
    var options = _extends({ flagKey: '_bfs' }, opts);
    var flagKey = options.flagKey;

    function clearFlags() {
        graph.forEachVertex(function (v) {
            delete v[flagKey];
        });
    }

    function mark(v) {
        v[flagKey] = true;
    }

    function isMarked(v) {
        return v[flagKey] === true;
    }

    var defaultTraversalOptions = {
        direction: _const.OUT,
        onVisit: function onVisit(u) {},
        onTestEdge: function onTestEdge(e) {},
        edgeFilter: null // take all edges
    };

    return {
        /**
        Traverse the graph using the breadth first algorithm,
        starting from source, with the specified options
        */

        traverse: function traverse(source, opts) {
            var options = _extends({}, defaultTraversalOptions, opts);

            clearFlags();

            var queue = [];
            queue.push(source);
            mark(source, null);
            var u = void 0,
                v = void 0,
                edges = void 0;

            while (queue.length > 0) {
                u = queue.shift();
                options.onVisit(u);
                edges = graph.incidentEdges(u, options.direction, options.edgeFilter);
                edges.forEach(function (e) {
                    options.onTestEdge(e);
                    v = options.direction ? e.to : e.from;
                    if (!isMarked(v)) {
                        mark(v);
                        queue.push(v);
                    }
                });
            }
        }
    };
}

exports.default = BFS;
module.exports = exports['default'];
},{"../core/const.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _PriorityQueue = require('../core/PriorityQueue.js');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SETTLED = 2;
var REACHED = 1;

function Dijkstra(graph, opts) {
    var options = _extends({ flagKey: '_dijkstra' }, opts);
    var flagKey = options.flagKey;

    function clearFlags() {
        graph.forEachVertex(function (v) {
            delete v[flagKey];
        });
    }

    function getFlags(v) {
        return v[flagKey] || {};
    }

    function setFlags(v, flags) {
        if (!v.hasOwnProperty(flagKey)) {
            v[flagKey] = {};
        }
        for (var key in flags) {
            v[flagKey][key] = flags[key];
        }
    }

    /**
    @param v {Vertex}
    @param incEge {Edge} the incoming edge
    @param cost {the cost }
    */
    function reach(v, incEdge, cost, action) {
        // update state to "reached", and register cost and incomingEdge
        setFlags(v, { state: REACHED, cost: cost, inc: incEdge });
        if (action) {
            action(v, incEdge, cost);
        }
    }

    function settle(v, action) {
        setFlags(v, { state: SETTLED });
        if (action) {
            action(v);
        }
    }

    function rebuildPath(end) {
        var edges = [];
        var edge = void 0;
        // going upward in the tree until the first vertex (with no incoming edge)
        while ((edge = getFlags(end).inc) != null) {
            edges.push(edge);
            end = edge.from;
        }
        return edges.reverse();
    }

    var defaultTraversalOptions = {
        shouldUpdateKey: function shouldUpdateKey(prevCost, newCost) {
            return newCost < prevCost;
        },
        edgeCost: function edgeCost(e, costDone) {
            return 1;
        },
        isFinished: function isFinished(direction) {
            return false;
        },
        heuristic: function heuristic(v) {
            return 0;
        },
        onReach: null, // nothing special to do when reaching a node
        onSettle: null, // nothing special to do when setting a node
        edgeFilter: null // take all edges
    };

    return {
        /**
        The most common use of Dijkstra traversal
        */

        shortestPath: function shortestPath(source, target, opts) {
            function isTargetFound() {
                return getFlags(target).state === SETTLED;
            }

            var options = opts || {};
            options.isFinished = isTargetFound;

            var found = this.traverse(source, options);
            if (found) {
                return rebuildPath(target);
            }
            return null;
        },


        /**
        Traverse the graph using Dijkstra's algorithm,
        starting from source, with the specified options
        */
        traverse: function traverse(source, opts) {
            var options = _extends({}, defaultTraversalOptions, opts);
            var edgeFilter = options.edgeFilter;
            var edgeCost = options.edgeCost;
            var heuristic = options.heuristic;
            var shouldUpdateKey = options.shouldUpdateKey;
            var onReach = options.onReach;
            var onSettle = options.onSettle;
            var isFinished = options.isFinished;

            // reset node tagging

            clearFlags();

            var kv = void 0;
            var u = void 0,
                v = void 0;
            var e = void 0;
            var totalCost = void 0,
                eCost = void 0;
            var vFlags = void 0;

            var Q = new _PriorityQueue2.default();
            Q.insert(source, 0);
            reach(source, null, 0, onReach);

            while (!isFinished() && Q.count() > 0) {
                kv = Q.pop();
                u = kv.elt;
                totalCost = kv.key;
                settle(u, onSettle);

                var edges = graph.outEdges(u, edgeFilter);
                for (var i = 0; i < edges.length; i++) {
                    e = edges[i];
                    v = e.to;
                    eCost = totalCost + edgeCost(e, totalCost) + heuristic(v);
                    vFlags = getFlags(v);

                    if (vFlags.state !== SETTLED) {
                        if (vFlags.state !== REACHED) {
                            Q.insert(v, eCost);
                            reach(v, e, eCost, onReach);
                        } else {
                            if (shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                                // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
                                Q.updateKey(v, eCost);
                                reach(v, e, eCost, onReach);
                            }
                        }
                    }
                }
            }

            // if false, means the whole graph was traversed
            return isFinished();
        }
    };
};

exports.default = Dijkstra;
module.exports = exports['default'];
},{"../core/PriorityQueue.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _const = require('./const.js');

var _utils = require('./utils.js');

var Graph = function Graph() {
    var vertices = [];
    var edges = [];

    return {
        addVertex: function addVertex(data) {
            var vertex = {
                _in: [],
                _out: [],
                data: data
            };
            vertices.push(vertex);
            return vertex;
        },
        addEdge: function addEdge(from, to, data) {
            var edge = {
                from: from,
                to: to,
                data: data || {}
            };
            from._out.push(edge);
            to._in.push(edge);
            edges.push(edge);
            return edge;
        },


        /**
        Shortcut to add an edge and its reverse,
        sharing the same data.
        */
        addEdgePair: function addEdgePair(a, b, data) {
            return [this.addEdge(a, b, data), this.addEdge(b, a, data)];
        },
        removeEdge: function removeEdge(edge) {
            var index = edges.indexOf(edge);
            if (index !== -1) {
                // remove from extremity vertices first
                edge.from._out.splice(edge.from._out.indexOf(edge), 1);
                edge.to._in.splice(edge.to._in.indexOf(edge), 1);
                edges.splice(index, 1);
            }
        },
        removeVertex: function removeVertex(vertex) {
            var index = vertices.indexOf(vertex);
            if (index !== -1) {
                // remove all incident edges first
                var edgesToRemove = vertex._in.concat(vertex._out);
                for (var i = 0; i < edgesToRemove.length; i++) {
                    this.removeEdge(edgesToRemove[i]);
                }
                vertices.splice(index, 1);
            }
        },
        outEdges: function outEdges(vertex, filter) {
            return this.incidentEdges(vertex, _const.OUT, filter);
        },
        inEdges: function inEdges(vertex, filter) {
            return this.incidentEdges(vertex, _const.IN, filter);
        },


        /**
        Returns all edges incident to a vertex, in one direction (outgoing or incoming),
        optionnaly filtered by a given function.
        */
        incidentEdges: function incidentEdges(vertex, direction, filter) {
            if (!filter) {
                return direction ? vertex._out : vertex._in;
            }
            var edges = direction ? vertex._out : vertex._in;
            return edges.filter(filter);
        },
        vertex: function vertex(props) {
            var v = null;
            for (var i = 0, l = vertices.length; i < l && v == null; i++) {
                if ((0, _utils.propsMatch)(vertices[i].data, props)) {
                    v = vertices[i];
                }
            }
            return v;
        },
        edge: function edge(props) {
            var e = null;
            for (var i = 0, l = edges.length; i < l && e == null; i++) {
                if ((0, _utils.propsMatch)(edges[i].data, props)) {
                    e = edges[i];
                }
            }
            return e;
        },


        /**
        Perform an action on each vertex of the graph
        */
        forEachVertex: function forEachVertex(action) {
            vertices.forEach(function (v) {
                return action(v);
            });
        },


        /**
        Perform an action on each edge of the graph
        */
        forEachEdge: function forEachEdge(action) {
            edges.forEach(function (e) {
                return action(e);
            });
        }
    };
};

exports.default = Graph;
module.exports = exports['default'];
},{"./const.js":5,"./utils.js":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
Binary heap implementation of a priority queue
with an updateKey method.
*/
var PriorityQueue = function PriorityQueue(opts) {
    var heap = [];

    // TODO: make it an option, for max or min priority queue
    function compare(a, b) {
        return a.key - b.key;
    }

    function bubbleUp(idx) {
        var element = heap[idx];
        var parentIdx = void 0;
        var parent = void 0;
        while (idx > 0) {
            // Compute the parent element's index, and fetch it.
            parentIdx = Math.floor((idx + 1) / 2) - 1;
            parent = heap[parentIdx];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (compare(element, parent) > 0) {
                break;
            }

            // Otherwise, swap the parent with the current element and
            // continue.
            heap[parentIdx] = element;
            heap[idx] = parent;
            idx = parentIdx;
        }
    }

    function sinkDown(idx) {
        var length = heap.length;
        var element = heap[idx];
        var swapIdx = void 0;

        while (true) {
            var rChildIdx = (idx + 1) * 2;
            var lChildIdx = rChildIdx - 1;
            swapIdx = -1;

            // if the first child exists
            if (lChildIdx < length) {
                var lChild = heap[lChildIdx];
                // and is lower than the element, they must be swapped
                if (compare(lChild, element) < 0) {
                    swapIdx = lChildIdx;
                }

                // unless there is another lesser child, which will be the one swapped
                if (rChildIdx < length) {
                    var rChild = heap[rChildIdx];
                    if ((swapIdx === -1 || compare(rChild, lChild) < 0) && compare(rChild, element) < 0) {
                        swapIdx = rChildIdx;
                    }
                }
            }

            // if no swap occurs, the element found its right place
            if (swapIdx === -1) {
                break;
            }

            // otherwise, swap and continue on next tree level
            heap[idx] = heap[swapIdx];
            heap[swapIdx] = element;
            idx = swapIdx;
        }
    }

    function findElementIndex(elt) {
        for (var i = 0, l = heap.length; i < l; i++) {
            if (heap[i].elt === elt) {
                return i;
            }
        }
        return -1;
    }

    return {
        count: function count() {
            return heap.length;
        },
        insert: function insert(element, key) {
            if (typeof element === 'undefined') {
                throw new Error('No element provided');
            }
            heap.push({ elt: element, key: key });
            bubbleUp(heap.length - 1);
        },
        pop: function pop() {
            if (heap.length === 0) {
                throw new Error('Empty queue');
            }
            var elt = heap[0];
            var end = heap.pop();
            // replace the first element by the last,
            // and let it sink to its right place
            if (heap.length > 0) {
                heap[0] = end;
                sinkDown(0);
            }
            return elt;
        },
        peek: function peek() {
            if (heap.length === 0) {
                throw new Error('Empty queue');
            }
            return heap[0];
        },
        updateKey: function updateKey(element, newKey) {
            var idx = findElementIndex(element);
            if (idx === -1) {
                throw new Error('The element is not in the heap');
            }
            var oldKey = heap[idx].key;
            heap[idx].key = newKey;
            if (newKey < oldKey) {
                bubbleUp(idx);
            } else {
                sinkDown(idx);
            }
        }
    };
};

exports.default = PriorityQueue;
module.exports = exports['default'];
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OUT = exports.OUT = true;
var IN = exports.IN = false;
},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.propsMatch = propsMatch;

function isScalar(o) {
    return (/boolean|number|string/.test(typeof o === "undefined" ? "undefined" : _typeof(o))
    );
};

function propsMatch(set, subSet) {
    if (subSet == null) {
        return set == null;
    }

    if (isScalar(set)) {
        return isScalar(subSet) && set === subSet;
    }

    var match = true;
    for (var p in subSet) {
        if (set.hasOwnProperty(p)) {
            if (!propsMatch(set[p], subSet[p])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return match;
};
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BFS = require('./algos/BFS.js');

var _BFS2 = _interopRequireDefault(_BFS);

var _Dijkstra = require('./algos/Dijkstra.js');

var _Dijkstra2 = _interopRequireDefault(_Dijkstra);

var _Graph = require('./core/Graph.js');

var _Graph2 = _interopRequireDefault(_Graph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jKstra = {
    Graph: _Graph2.default,
    algos: {
        BFS: _BFS2.default,
        Dijkstra: _Dijkstra2.default
    }
};

exports.default = jKstra;
module.exports = exports['default'];
},{"./algos/BFS.js":1,"./algos/Dijkstra.js":2,"./core/Graph.js":3}]},{},[7])(7)
});