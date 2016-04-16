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
//# sourceMappingURL=Dijkstra.js.map