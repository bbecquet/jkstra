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
//# sourceMappingURL=jKstra.js.map