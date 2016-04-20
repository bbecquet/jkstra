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
//# sourceMappingURL=Graph.js.map