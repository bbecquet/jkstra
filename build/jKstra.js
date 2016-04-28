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

var _DijkstraIterator = require('../algos/DijkstraIterator.js');

var _DijkstraIterator2 = _interopRequireDefault(_DijkstraIterator);

var _nodeFlagger = require('./nodeFlagger.js');

var _nodeFlagger2 = _interopRequireDefault(_nodeFlagger);

var _constants = require('../core/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BidirectionalDijkstra = function () {
    function BidirectionalDijkstra(graph, opts) {
        _classCallCheck(this, BidirectionalDijkstra);

        this.graph = graph;
        this.options = _extends({}, opts);
        this.outKey = '_dijkstra_out';
        this.inKey = '_dijkstra_in';
    }

    _createClass(BidirectionalDijkstra, [{
        key: 'rebuildPath',
        value: function rebuildPath(meetingNode) {
            var edges = [];
            var edge = void 0;
            var currentNode = meetingNode;
            // going upward in the tree until the first vertex (with no incoming edge)
            while ((edge = this.outFlagger.getFlags(currentNode).inc) !== null) {
                edges.push(edge);
                currentNode = edge.from;
            }
            edges.reverse();
            currentNode = meetingNode;
            // going upward in the tree until the first vertex (with no incoming edge)
            while ((edge = this.inFlagger.getFlags(currentNode).inc) !== null) {
                edges.push(edge);
                currentNode = edge.to;
            }
            return edges;
        }
    }, {
        key: '_hasBeenReachBothWays',
        value: function _hasBeenReachBothWays(node) {
            var outState = this.outFlagger.getFlags(node);
            var inState = this.inFlagger.getFlags(node);

            return (outState.state === _constants.REACHED || outState.state === _constants.SETTLED) && (inState.state === _constants.REACHED || inState.state === _constants.SETTLED);
        }
    }, {
        key: 'shortestPath',
        value: function shortestPath(source, target, options) {
            var outIteraror = new _DijkstraIterator2.default(this.graph, source, _extends({}, options, options.OUT, { direction: _constants.OUT, flagKey: this.outKey }));
            var inIterator = new _DijkstraIterator2.default(this.graph, target, _extends({}, options, options.IN, { direction: _constants.IN, flagKey: this.inKey }));
            this.outFlagger = new _nodeFlagger2.default(this.graph, this.outKey);
            this.inFlagger = new _nodeFlagger2.default(this.graph, this.inKey);

            var iterator = outIteraror;
            var meetingNode = void 0;
            var next = void 0;

            // simply loop over the iterator until it ends
            while (!(next = iterator.next()).done) {
                if (this._hasBeenReachBothWays(next.value)) {
                    meetingNode = next.value;
                    break;
                }
                // alternate between the two iterators
                iterator = iterator === outIteraror ? inIterator : outIteraror;
            }

            if (meetingNode) {
                return this.rebuildPath(meetingNode);
            }
            return null;
        }
    }]);

    return BidirectionalDijkstra;
}();

;

exports.default = BidirectionalDijkstra;
module.exports = exports['default'];

},{"../algos/DijkstraIterator.js":4,"../core/constants.js":7,"./nodeFlagger.js":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DijkstraIterator = require('../algos/DijkstraIterator.js');

var _DijkstraIterator2 = _interopRequireDefault(_DijkstraIterator);

var _nodeFlagger = require('./nodeFlagger.js');

var _nodeFlagger2 = _interopRequireDefault(_nodeFlagger);

var _constants = require('../core/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dijkstra = function () {
    function Dijkstra(graph, opts) {
        _classCallCheck(this, Dijkstra);

        this.graph = graph;
        this.options = _extends({ flagKey: '_dijkstra' }, opts);
        this.nodeFlagger = new _nodeFlagger2.default(this.graph, this.options.flagKey);
    }

    _createClass(Dijkstra, [{
        key: 'rebuildPath',
        value: function rebuildPath(end) {
            var edges = [];
            var edge = void 0;
            // going upward in the tree until the first vertex (with no incoming edge)
            while ((edge = this.nodeFlagger.getFlags(end).inc) !== null) {
                edges.push(edge);
                end = edge.from;
            }
            return edges.reverse();
        }
    }, {
        key: 'shortestPath',


        /**
        The most common use of Dijkstra traversal
        */
        value: function shortestPath(source, target, opts) {
            var _this = this;

            var options = opts || {};
            options.isFinished = function () {
                return _this.nodeFlagger.getFlags(target).state === _constants.SETTLED;
            };

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
            var dijkstraIterator = new _DijkstraIterator2.default(this.graph, source, opts);

            // simply loop over the iterator until it ends
            while (!dijkstraIterator.next().done && !options.isFinished()) {}

            // if false, means the whole graph was traversed
            return options.isFinished();
        }
    }]);

    return Dijkstra;
}();

Dijkstra.defaultTraversalOptions = {
    isFinished: function isFinished() {
        return false;
    }
};
;

exports.default = Dijkstra;
module.exports = exports['default'];

},{"../algos/DijkstraIterator.js":4,"../core/constants.js":7,"./nodeFlagger.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _updatablePriorityQueue = require('updatable-priority-queue');

var _updatablePriorityQueue2 = _interopRequireDefault(_updatablePriorityQueue);

var _nodeFlagger = require('./nodeFlagger.js');

var _nodeFlagger2 = _interopRequireDefault(_nodeFlagger);

var _constants = require('../core/constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DijkstraIterator = function () {
    // take all edges

    function DijkstraIterator(graph, source, opts) {
        _classCallCheck(this, DijkstraIterator);

        this.graph = graph;
        this.source = source;
        this.options = _extends({}, DijkstraIterator.defaultOptions, opts);
        this.flags = new _nodeFlagger2.default(this.graph, this.options.flagKey);

        this.pQ = new _updatablePriorityQueue2.default();
        this._initTraversal();
    }

    _createClass(DijkstraIterator, [{
        key: '_reach',
        value: function _reach(v, incEdge, fCost, gCost, action) {
            // update state to "reached", and register cost and incomingEdge
            this.flags.setFlags(v, { state: _constants.REACHED, fCost: fCost, gCost: gCost, inc: incEdge });
            if (action) {
                action(v);
            }
        }
    }, {
        key: '_settle',
        value: function _settle(v, action) {
            this.flags.setFlags(v, { state: _constants.SETTLED });
            if (action) {
                action(v);
            }
        }
    }, {
        key: '_initTraversal',
        value: function _initTraversal() {
            // reset node tagging
            this.flags.clearFlags(this.graph);
            this.pQ.insert(this.source, this.options.heuristic(this.source));
            this._reach(this.source, null, this.options.heuristic(this.source), 0, this.options.onReach);
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


            var u = this.pQ.pop().item;
            var v = void 0;
            var vFlags = void 0;
            var uGCost = this.flags.getFlags(u).gCost;
            var vFCost = void 0,
                vGCost = void 0;

            this._settle(u, onSettle);
            var edges = this.graph.incidentEdges(u, direction, edgeFilter);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var e = _step.value;

                    v = direction === _constants.OUT ? e.to : e.from;
                    vFlags = this.flags.getFlags(v);

                    if (vFlags.state !== _constants.SETTLED) {
                        vGCost = uGCost + edgeCost(e, uGCost);
                        vFCost = vGCost + heuristic(v);
                        if (vFlags.state !== _constants.REACHED) {
                            this.pQ.insert(v, vFCost);
                            this._reach(v, e, vFCost, vGCost, onReach);
                        } else {
                            if (shouldUpdateKey(vFlags.fCost, vFCost, vFlags.inc, e)) {
                                this.pQ.updateKey(v, vFCost);
                                this._reach(v, e, vFCost, vGCost, onReach);
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

},{"../core/constants.js":7,"./nodeFlagger.js":5,"updatable-priority-queue":10}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants.js');

var _utils = require('./utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = function () {
    function Graph() {
        _classCallCheck(this, Graph);

        this.vertices = [];
        this.edges = [];
    }

    _createClass(Graph, [{
        key: 'addVertex',
        value: function addVertex(data) {
            var vertex = {
                _in: [],
                _out: [],
                data: data
            };
            this.vertices.push(vertex);
            return vertex;
        }
    }, {
        key: 'addEdge',
        value: function addEdge(from, to, data) {
            var edge = {
                from: from,
                to: to,
                data: data || {}
            };
            from._out.push(edge);
            to._in.push(edge);
            this.edges.push(edge);
            return edge;
        }

        /**
        Shortcut to add an edge and its reverse,
        sharing the same data.
        */

    }, {
        key: 'addEdgePair',
        value: function addEdgePair(a, b, data) {
            return [this.addEdge(a, b, data), this.addEdge(b, a, data)];
        }
    }, {
        key: 'removeEdge',
        value: function removeEdge(edge) {
            var index = this.edges.indexOf(edge);
            if (index !== -1) {
                // remove from extremity this.vertices first
                edge.from._out.splice(edge.from._out.indexOf(edge), 1);
                edge.to._in.splice(edge.to._in.indexOf(edge), 1);
                this.edges.splice(index, 1);
            }
        }
    }, {
        key: 'removeVertex',
        value: function removeVertex(vertex) {
            var index = this.vertices.indexOf(vertex);
            if (index !== -1) {
                // remove all incident this.edges first
                var edgesToRemove = vertex._in.concat(vertex._out);
                for (var i = 0; i < edgesToRemove.length; i++) {
                    this.removeEdge(edgesToRemove[i]);
                }
                this.vertices.splice(index, 1);
            }
        }
    }, {
        key: 'outEdges',
        value: function outEdges(vertex, filter) {
            return this.incidentEdges(vertex, _constants.OUT, filter);
        }
    }, {
        key: 'inEdges',
        value: function inEdges(vertex, filter) {
            return this.incidentEdges(vertex, _constants.IN, filter);
        }

        /**
        Returns all this.edges incident to a vertex, in one direction (outgoing or incoming),
        optionnaly filtered by a given function.
        */

    }, {
        key: 'incidentEdges',
        value: function incidentEdges(vertex, direction, filter) {
            if (!filter) {
                return direction ? vertex._out : vertex._in;
            }
            var edges = direction ? vertex._out : vertex._in;
            return edges.filter(filter);
        }
    }, {
        key: 'vertex',
        value: function vertex(props) {
            var vertices = this.vertices;
            for (var i = 0, l = vertices.length; i < l; i++) {
                if ((0, _utils.propsMatch)(vertices[i].data, props)) {
                    return vertices[i];
                }
            }
            return null;
        }
    }, {
        key: 'edge',
        value: function edge(props) {
            var edges = this.edges;
            for (var i = 0, l = edges.length; i < l; i++) {
                if ((0, _utils.propsMatch)(edges[i].data, props)) {
                    return edges[i];
                }
            }
            return null;
        }

        /**
        Perform an action on each vertex of the graph
        */

    }, {
        key: 'forEachVertex',
        value: function forEachVertex(action) {
            this.vertices.forEach(function (v) {
                return action(v);
            });
        }

        /**
        Perform an action on each edge of the graph
        */

    }, {
        key: 'forEachEdge',
        value: function forEachEdge(action) {
            this.edges.forEach(function (e) {
                return action(e);
            });
        }
    }, {
        key: 'vertexCount',
        get: function get() {
            return this.vertices.length;
        }
    }, {
        key: 'edgeCount',
        get: function get() {
            return this.edges.length;
        }
    }]);

    return Graph;
}();

;

exports.default = Graph;
module.exports = exports['default'];

},{"./constants.js":7,"./utils.js":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OUT = exports.OUT = true;
var IN = exports.IN = false;
var REACHED = exports.REACHED = 1;
var SETTLED = exports.SETTLED = 2;

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

var _BidirectionalDijkstra = require('./algos/BidirectionalDijkstra.js');

var _BidirectionalDijkstra2 = _interopRequireDefault(_BidirectionalDijkstra);

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
        BidirectionalDijkstra: _BidirectionalDijkstra2.default,
        DijkstraIterator: _DijkstraIterator2.default
    }
};

exports.default = jKstra;
module.exports = exports['default'];

},{"./algos/BFS.js":1,"./algos/BidirectionalDijkstra.js":2,"./algos/Dijkstra.js":3,"./algos/DijkstraIterator.js":4,"./core/Graph.js":6,"./core/constants.js":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PriorityQueue = function () {
    function PriorityQueue() {
        _classCallCheck(this, PriorityQueue);

        this.heap = [];
    }

    // TODO: make it an option, for max or min priority queue


    _createClass(PriorityQueue, [{
        key: "_compare",
        value: function _compare(a, b) {
            return a.key - b.key;
        }
    }, {
        key: "_bubbleUp",
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
        key: "_sinkDown",
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
        key: "_findElementIndex",
        value: function _findElementIndex(item) {
            // TODO: optimize
            for (var i = 0, l = this.heap.length; i < l; i++) {
                if (this.heap[i].item === item) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: "insert",
        value: function insert(item, key) {
            this.heap.push({ item: item, key: key });
            this._bubbleUp(this.heap.length - 1);
        }
    }, {
        key: "pop",
        value: function pop() {
            if (this.heap.length === 0) {
                return null;
            }
            var element = this.heap[0];
            var end = this.heap.pop();
            // replace the first element by the last,
            // and let it sink to its right place
            if (this.heap.length > 0) {
                this.heap[0] = end;
                this._sinkDown(0);
            }
            return element;
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.heap.length === 0) {
                return null;
            }
            return this.heap[0];
        }
    }, {
        key: "updateKey",
        value: function updateKey(item, newKey) {
            var idx = this._findElementIndex(item);
            if (idx === -1) {
                return;
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
        key: "count",
        get: function get() {
            return this.heap.length;
        }
    }]);

    return PriorityQueue;
}();

;

exports.default = PriorityQueue;
module.exports = exports['default'];

},{}]},{},[9])(9)
});