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
//# sourceMappingURL=BFS.js.map