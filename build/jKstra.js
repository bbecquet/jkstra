(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jKstra = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('../core/constants.js');

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
        direction: _constants.OUT,
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

},{"../core/constants.js":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PriorityQueue = require('../core/PriorityQueue.js');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SETTLED = 2;
var REACHED = 1;

var Dijkstra = function () {
    function Dijkstra(graph, opts) {
        _classCallCheck(this, Dijkstra);

        this.graph = graph;
        var options = _extends({ flagKey: '_dijkstra' }, opts);
        this.flagKey = options.flagKey;
    }

    // TODO: move these 3 functions to some utils


    _createClass(Dijkstra, [{
        key: '_clearFlags',
        value: function _clearFlags() {
            var _this = this;

            this.graph.forEachVertex(function (v) {
                delete v[_this.flagKey];
            });
        }
    }, {
        key: '_getFlags',
        value: function _getFlags(v) {
            return v[this.flagKey] || {};
        }
    }, {
        key: '_setFlags',
        value: function _setFlags(v, flags) {
            if (!v.hasOwnProperty(this.flagKey)) {
                v[this.flagKey] = {};
            }
            for (var key in flags) {
                v[this.flagKey][key] = flags[key];
            }
        }
    }, {
        key: '_reach',
        value: function _reach(v, incEdge, cost, action) {
            // update state to "reached", and register cost and incomingEdge
            this._setFlags(v, { state: REACHED, cost: cost, inc: incEdge });
            if (action) {
                action(v, incEdge, cost);
            }
        }
    }, {
        key: '_settle',
        value: function _settle(v, action) {
            this._setFlags(v, { state: SETTLED });
            if (action) {
                action(v);
            }
        }
    }, {
        key: 'rebuildPath',
        value: function rebuildPath(end) {
            var edges = [];
            var edge = void 0;
            // going upward in the tree until the first vertex (with no incoming edge)
            while ((edge = this._getFlags(end).inc) !== null) {
                edges.push(edge);
                end = edge.from;
            }
            return edges.reverse();
        }
    }, {
        key: 'shortestPath',
        // take all edges


        /**
        The most common use of Dijkstra traversal
        */
        value: function shortestPath(source, target, opts) {
            function isTargetFound() {
                return this._getFlags(target).state === SETTLED;
            }

            var options = opts || {};
            options.isFinished = isTargetFound.bind(this);

            var found = this.traverse(source, options);
            if (found) {
                return this.rebuildPath(target);
            }
            return null;
        }

        /**
        Traverse the graph using Dijkstra's algorithm,
        starting from source, with the specified options
        */

    }, {
        key: 'traverse',
        value: function traverse(source, opts) {
            var options = _extends({}, Dijkstra.defaultTraversalOptions, opts);
            var edgeFilter = options.edgeFilter;
            var edgeCost = options.edgeCost;
            var heuristic = options.heuristic;
            var shouldUpdateKey = options.shouldUpdateKey;
            var onReach = options.onReach;
            var onSettle = options.onSettle;
            var isFinished = options.isFinished;

            // reset node tagging

            this._clearFlags();

            var kv = void 0;
            var u = void 0,
                v = void 0;
            var totalCost = void 0,
                eCost = void 0;
            var vFlags = void 0;

            var Q = new _PriorityQueue2.default();
            Q.insert(source, 0);
            this._reach(source, null, 0, onReach);

            while (!isFinished() && Q.count > 0) {
                kv = Q.pop();
                u = kv.elt;
                totalCost = kv.key;
                this._settle(u, onSettle);

                var edges = this.graph.outEdges(u, edgeFilter);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var e = _step.value;

                        v = e.to;
                        eCost = totalCost + edgeCost(e, totalCost) + heuristic(v);
                        vFlags = this._getFlags(v);

                        if (vFlags.state !== SETTLED) {
                            if (vFlags.state !== REACHED) {
                                Q.insert(v, eCost);
                                this._reach(v, e, eCost, onReach);
                            } else {
                                if (shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                                    // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
                                    Q.updateKey(v, eCost);
                                    this._reach(v, e, eCost, onReach);
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }

            // if false, means the whole graph was traversed
            return isFinished();
        }
    }]);

    return Dijkstra;
}();

Dijkstra.defaultTraversalOptions = {
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
    edgeFilter: null };
;

exports.default = Dijkstra;
module.exports = exports['default'];

},{"../core/PriorityQueue.js":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PriorityQueue = require('../core/PriorityQueue.js');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

var _nodeFlagger = require('./nodeFlagger.js');

var _nodeFlagger2 = _interopRequireDefault(_nodeFlagger);

var _constants = require('../core/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SETTLED = 2;
var REACHED = 1;

var DijkstraIterator = function () {
    // take all edges

    function DijkstraIterator(graph, source, opts) {
        _classCallCheck(this, DijkstraIterator);

        this.graph = graph;
        this.source = source;
        this.options = _extends({}, DijkstraIterator.defaultOptions, opts);
        this.flags = new _nodeFlagger2.default(this.graph, this.options.flagKey);

        this.pQ = new _PriorityQueue2.default();
        this._initTraversal();
    }

    _createClass(DijkstraIterator, [{
        key: '_reach',
        value: function _reach(v, incEdge, cost, action) {
            // update state to "reached", and register cost and incomingEdge
            this.flags.setFlags(v, { state: REACHED, cost: cost, inc: incEdge });
            if (action) {
                action(v, incEdge, cost);
            }
        }
    }, {
        key: '_settle',
        value: function _settle(v, action) {
            this.flags.setFlags(v, { state: SETTLED });
            if (action) {
                action(v);
            }
        }
    }, {
        key: '_initTraversal',
        value: function _initTraversal() {
            // reset node tagging
            this.flags.clearFlags(this.graph);
            this.pQ.insert(this.source, 0);
            this._reach(this.source, null, 0, this.options.onReach);
        }
    }, {
        key: 'next',
        value: function next() {
            // if no more node available in the queue,
            // return the iterator end signal
            if (this.pQ.count === 0) {
                return { done: true };
            }

            var _options = this.options;
            var direction = _options.direction;
            var onReach = _options.onReach;
            var onSettle = _options.onSettle;
            var edgeFilter = _options.edgeFilter;
            var edgeCost = _options.edgeCost;
            var heuristic = _options.heuristic;
            var shouldUpdateKey = _options.shouldUpdateKey;


            var kv = this.pQ.pop();
            var u = kv.elt;
            var v = void 0;
            var vFlags = void 0;
            var totalCost = kv.key;
            var eCost = void 0;

            this._settle(u, onSettle);
            var edges = this.graph.incidentEdges(u, direction, edgeFilter);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var e = _step.value;

                    v = direction === _constants.OUT ? e.to : e.from;
                    eCost = totalCost + edgeCost(e, totalCost) + heuristic(v);
                    vFlags = this.flags.getFlags(v);

                    if (vFlags.state !== SETTLED) {
                        if (vFlags.state !== REACHED) {
                            this.pQ.insert(v, eCost);
                            this._reach(v, e, eCost, onReach);
                        } else {
                            if (shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                                this.pQ.updateKey(v, eCost);
                                this._reach(v, e, eCost, onReach);
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return { value: u };
        }
    }]);

    return DijkstraIterator;
}();

DijkstraIterator.defaultOptions = {
    flagKey: '_dijkstra',
    direction: _constants.OUT,
    shouldUpdateKey: function shouldUpdateKey(prevCost, newCost) {
        return newCost < prevCost;
    },
    edgeCost: function edgeCost(e, costDone) {
        return 1;
    },
    heuristic: function heuristic(v) {
        return 0;
    },
    onReach: null, // nothing special to do when reaching a node
    onSettle: null, // nothing special to do when setting a node
    edgeFilter: null };
;

exports.default = DijkstraIterator;
module.exports = exports['default'];

},{"../core/PriorityQueue.js":6,"../core/constants.js":7,"./nodeFlagger.js":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(graph, flagKey) {
        _classCallCheck(this, _class);

        this.graph = graph;
        this.flagKey = flagKey;
    }

    _createClass(_class, [{
        key: "clearFlags",
        value: function clearFlags(graph) {
            var _this = this;

            this.graph.forEachVertex(function (v) {
                delete v[_this.flagKey];
            });
        }
    }, {
        key: "getFlags",
        value: function getFlags(v) {
            return v[this.flagKey] || {};
        }
    }, {
        key: "setFlags",
        value: function setFlags(v, flags) {
            if (!v.hasOwnProperty(this.flagKey)) {
                v[this.flagKey] = {};
            }
            for (var key in flags) {
                v[this.flagKey][key] = flags[key];
            }
        }
    }]);

    return _class;
}();

exports.default = _class;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('./constants.js');

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
            return this.incidentEdges(vertex, _constants.OUT, filter);
        },
        inEdges: function inEdges(vertex, filter) {
            return this.incidentEdges(vertex, _constants.IN, filter);
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
            for (var i = 0, l = vertices.length; i < l; i++) {
                if ((0, _utils.propsMatch)(vertices[i].data, props)) {
                    return vertices[i];
                }
            }
            return null;
        },
        edge: function edge(props) {
            for (var i = 0, l = edges.length; i < l; i++) {
                if ((0, _utils.propsMatch)(edges[i].data, props)) {
                    return edges[i];
                }
            }
            return null;
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

},{"./constants.js":7,"./utils.js":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
Binary this.heap implementation of a priority queue
with an updateKey method.
*/

var PriorityQueue = function () {
    function PriorityQueue() {
        _classCallCheck(this, PriorityQueue);

        this.heap = [];
    }

    // TODO: make it an option, for max or min priority queue


    _createClass(PriorityQueue, [{
        key: '_compare',
        value: function _compare(a, b) {
            return a.key - b.key;
        }
    }, {
        key: '_bubbleUp',
        value: function _bubbleUp(idx) {
            var element = this.heap[idx];
            var parentIdx = void 0;
            var parent = void 0;
            while (idx > 0) {
                // Compute the parent element's index, and fetch it.
                parentIdx = Math.floor((idx + 1) / 2) - 1;
                parent = this.heap[parentIdx];
                // If the parent has a lesser score, things are in order and we
                // are done.
                if (this._compare(element, parent) > 0) {
                    break;
                }

                // Otherwise, swap the parent with the current element and
                // continue.
                this.heap[parentIdx] = element;
                this.heap[idx] = parent;
                idx = parentIdx;
            }
        }
    }, {
        key: '_sinkDown',
        value: function _sinkDown(idx) {
            var length = this.heap.length;
            var element = this.heap[idx];
            var swapIdx = void 0;

            while (true) {
                var rChildIdx = (idx + 1) * 2;
                var lChildIdx = rChildIdx - 1;
                swapIdx = -1;

                // if the first child exists
                if (lChildIdx < length) {
                    var lChild = this.heap[lChildIdx];
                    // and is lower than the element, they must be swapped
                    if (this._compare(lChild, element) < 0) {
                        swapIdx = lChildIdx;
                    }

                    // unless there is another lesser child, which will be the one swapped
                    if (rChildIdx < length) {
                        var rChild = this.heap[rChildIdx];
                        if ((swapIdx === -1 || this._compare(rChild, lChild) < 0) && this._compare(rChild, element) < 0) {
                            swapIdx = rChildIdx;
                        }
                    }
                }

                // if no swap occurs, the element found its right place
                if (swapIdx === -1) {
                    break;
                }

                // otherwise, swap and continue on next tree level
                this.heap[idx] = this.heap[swapIdx];
                this.heap[swapIdx] = element;
                idx = swapIdx;
            }
        }
    }, {
        key: '_findElementIndex',
        value: function _findElementIndex(elt) {
            for (var i = 0, l = this.heap.length; i < l; i++) {
                if (this.heap[i].elt === elt) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: 'insert',
        value: function insert(element, key) {
            if (typeof element === 'undefined') {
                throw new Error('No element provided');
            }
            this.heap.push({ elt: element, key: key });
            this._bubbleUp(this.heap.length - 1);
        }
    }, {
        key: 'pop',
        value: function pop() {
            if (this.heap.length === 0) {
                throw new Error('Empty queue');
            }
            var elt = this.heap[0];
            var end = this.heap.pop();
            // replace the first element by the last,
            // and let it sink to its right place
            if (this.heap.length > 0) {
                this.heap[0] = end;
                this._sinkDown(0);
            }
            return elt;
        }
    }, {
        key: 'peek',
        value: function peek() {
            if (this.heap.length === 0) {
                throw new Error('Empty queue');
            }
            return this.heap[0];
        }
    }, {
        key: 'updateKey',
        value: function updateKey(element, newKey) {
            var idx = this._findElementIndex(element);
            if (idx === -1) {
                throw new Error('The element is not in the this.heap');
            }
            var oldKey = this.heap[idx].key;
            this.heap[idx].key = newKey;
            if (newKey < oldKey) {
                this._bubbleUp(idx);
            } else {
                this._sinkDown(idx);
            }
        }
    }, {
        key: 'count',
        get: function get() {
            return this.heap.length;
        }
    }]);

    return PriorityQueue;
}();

;

exports.default = PriorityQueue;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OUT = exports.OUT = true;
var IN = exports.IN = false;

},{}],8:[function(require,module,exports){
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
    if (subSet === null) {
        return set === null;
    }

    if (isScalar(set)) {
        return isScalar(subSet) && set === subSet;
    }

    for (var p in subSet) {
        if (set.hasOwnProperty(p)) {
            if (!propsMatch(set[p], subSet[p])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BFS = require('./algos/BFS.js');

var _BFS2 = _interopRequireDefault(_BFS);

var _DijkstraIterator = require('./algos/DijkstraIterator.js');

var _DijkstraIterator2 = _interopRequireDefault(_DijkstraIterator);

var _Dijkstra = require('./algos/Dijkstra.js');

var _Dijkstra2 = _interopRequireDefault(_Dijkstra);

var _Graph = require('./core/Graph.js');

var _Graph2 = _interopRequireDefault(_Graph);

var _constants = require('./core/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jKstra = {
    IN: _constants.IN,
    OUT: _constants.OUT,
    Graph: _Graph2.default,
    algos: {
        BFS: _BFS2.default,
        Dijkstra: _Dijkstra2.default,
        DijkstraIterator: _DijkstraIterator2.default
    }
};

exports.default = jKstra;
module.exports = exports['default'];

},{"./algos/BFS.js":1,"./algos/Dijkstra.js":2,"./algos/DijkstraIterator.js":3,"./core/Graph.js":5,"./core/constants.js":7}]},{},[9])(9)
});