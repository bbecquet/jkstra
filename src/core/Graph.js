import { IN, OUT } from './constants.js';
import { propsMatch } from './utils.js';

class Graph {
    constructor() {
        this.vertices = [];
        this.edges = [];
    }

    get vertexCount() {
        return this.vertices.length;
    }

    get edgeCount() {
        return this.edges.length;
    }

    addVertex(data) {
        const vertex = {
            _in: [],
            _out: [],
            data: data
        };
        this.vertices.push(vertex);
        return vertex;
    }

    addEdge(from, to, data) {
        const edge = {
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
    addEdgePair(a, b, data) {
        return [
            this.addEdge(a, b, data),
            this.addEdge(b, a, data)
        ];
    }

    removeEdge(edge) {
        const index = this.edges.indexOf(edge);
        if(index !== -1) {
            // remove from extremity this.vertices first
            edge.from._out.splice(edge.from._out.indexOf(edge), 1);
            edge.to._in.splice(edge.to._in.indexOf(edge), 1);
            this.edges.splice(index, 1);
        }
    }

    removeVertex(vertex) {
        const index = this.vertices.indexOf(vertex);
        if(index !== -1) {
            // remove all incident this.edges first
            const edgesToRemove = vertex._in.concat(vertex._out);
            for(let i = 0; i < edgesToRemove.length; i++) {
                this.removeEdge(edgesToRemove[i]);
            }
            this.vertices.splice(index, 1);
        }
    }

    outEdges(vertex, filter) {
        return this.incidentEdges(vertex, OUT, filter);
    }

    inEdges(vertex, filter) {
        return this.incidentEdges(vertex, IN, filter);
    }

    /**
    Returns all this.edges incident to a vertex, in one direction (outgoing or incoming),
    optionnaly filtered by a given function.
    */
    incidentEdges(vertex, direction, filter) {
        if (!filter) {
            return direction ? vertex._out : vertex._in;
        }
        const edges = direction ? vertex._out : vertex._in;
        return edges.filter(filter);
    }

    vertex(props) {
        const vertices = this.vertices;
        for (let i = 0, l = vertices.length; i < l; i++) {
            if (propsMatch(vertices[i].data, props)) {
                return vertices[i];
            }
        }
        return null;
    }

    edge(props) {
        const edges = this.edges;
        for (let i = 0, l = edges.length; i < l; i++) {
            if (propsMatch(edges[i].data, props)) {
                return edges[i];
            }
        }
        return null;
    }

    /**
    Perform an action on each vertex of the graph
    */
    forEachVertex(action) {
        this.vertices.forEach(v => action(v));
    }

    /**
    Perform an action on each edge of the graph
    */
    forEachEdge(action) {
        this.edges.forEach(e => action(e));
    }
};

export default Graph;
