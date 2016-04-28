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
//# sourceMappingURL=BidirectionalDijkstra.js.map