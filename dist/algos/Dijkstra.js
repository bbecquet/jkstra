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
//# sourceMappingURL=Dijkstra.js.map