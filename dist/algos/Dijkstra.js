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
            reach(source, null, 0, options.onReach);

            while (!options.isFinished() && Q.count() > 0) {
                kv = Q.pop();
                u = kv.elt;
                totalCost = kv.key;
                settle(u, options.onSettle);

                var edges = graph.outEdges(u, options.edgeFilter);
                for (var i = 0; i < edges.length; i++) {
                    e = edges[i];
                    v = e.to;
                    eCost = totalCost + options.edgeCost(e, totalCost);
                    vFlags = getFlags(v);

                    if (vFlags.state !== SETTLED) {
                        if (vFlags.state !== REACHED) {
                            Q.insert(v, eCost);
                            reach(v, e, eCost, options.onReach);
                        } else {
                            if (options.shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                                // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
                                Q.updateKey(v, eCost);
                                reach(v, e, eCost, options.onReach);
                            }
                        }
                    }
                }
            }

            // if false, means the whole graph was traversed
            return options.isFinished();
        }
    };
};

exports.default = Dijkstra;
module.exports = exports['default'];