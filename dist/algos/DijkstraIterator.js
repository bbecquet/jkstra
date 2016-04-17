'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PriorityQueue = require('../core/PriorityQueue.js');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

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
        this.flagKey = this.options.flagKey;

        this.pQ = new _PriorityQueue2.default();
        this._initTraversal();
    }

    // TODO: move these 3 functions to some utils


    _createClass(DijkstraIterator, [{
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
        key: '_initTraversal',
        value: function _initTraversal() {
            // reset node tagging
            this._clearFlags();
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
                    vFlags = this._getFlags(v);

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
//# sourceMappingURL=DijkstraIterator.js.map