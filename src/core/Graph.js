import { IN, OUT } from './const.js';
import { propsMatch } from './utils.js';

const Graph = function() {
    const vertices = [];
    const edges = [];

    return {
        addVertex(data) {
            const vertex = {
                _in: [],
                _out: [],
                data: data
            };
            vertices.push(vertex);
            return vertex;
        },

        addEdge(from, to, data) {
            const edge = {
                from: from,
                to: to,
                data: data || {}
            };
            from._out.push(edge);
            to._in.push(edge);
            edges.push(edge);
            return edge;
        },

        /**
        Shortcut to add an edge and its reverse,
        sharing the same data.
        */
        addEdgePair(a, b, data) {
            return [
                this.addEdge(a, b, data),
                this.addEdge(b, a, data)
            ];
        },

        removeEdge(edge) {
            const index = edges.indexOf(edge);
            if(index !== -1) {
                // remove from extremity vertices first
                edge.from._out.splice(edge.from._out.indexOf(edge), 1);
                edge.to._in.splice(edge.to._in.indexOf(edge), 1);
                edges.splice(index, 1);
            }
        },

        removeVertex(vertex) {
            const index = vertices.indexOf(vertex);
            if(index !== -1) {
                // remove all incident edges first
                const edgesToRemove = vertex._in.concat(vertex._out);
                for(let i = 0; i < edgesToRemove.length; i++) {
                    this.removeEdge(edgesToRemove[i]);
                }
                vertices.splice(index, 1);
            }
        },

        outEdges(vertex, filter) {
            return this.incidentEdges(vertex, OUT, filter);
        },

        inEdges(vertex, filter) {
            return this.incidentEdges(vertex, IN, filter);
        },

        /**
        Returns all edges incident to a vertex, in one direction (outgoing or incoming),
        optionnaly filtered by a given function.
        */
        incidentEdges(vertex, direction, filter) {
            if(!filter) {
                return direction ? vertex._out : vertex._in;
            }
            const edges = direction ? vertex._out : vertex._in;
            return edges.filter(filter);
        },

        vertex(props) {
            let v = null;
            for(let i = 0, l = vertices.length; i < l && v == null; i++) {
                if(propsMatch(vertices[i].data, props)) {
                    v = vertices[i];
                }
            }
            return v;
        },

        edge(props) {
            let e = null;
            for(let i = 0, l = edges.length; i < l && e == null; i++) {
                if(propsMatch(edges[i].data, props)) {
                    e = edges[i];
                }
            }
            return e;
        },

        /**
        Perform an action on each vertex of the graph
        */
        forEachVertex(action) {
            vertices.forEach(v => action(v));
        },

        /**
        Perform an action on each edge of the graph
        */
        forEachEdge(action) {
            edges.forEach(e => action(e));
        }
    };
};

export default Graph;
