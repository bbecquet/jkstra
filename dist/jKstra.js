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
//# sourceMappingURL=jKstra.js.map