import { OUT } from '../core/constants.js';

function BFS(graph, opts) {
    const options = Object.assign({ flagKey: '_bfs' }, opts);
    const flagKey = options.flagKey;

    function clearFlags() {
        graph.forEachVertex(function(v) {
            delete v[flagKey];
        });
    }

    function mark(v) {
        v[flagKey] = true;
    }

    function isMarked(v) {
        return v[flagKey] === true;
    }

    const defaultTraversalOptions = {
        direction: OUT,
        onVisit: function(u) { },
        onTestEdge: function(e) { },
        edgeFilter: null    // take all edges
    };

    return {
        /**
        Traverse the graph using the breadth first algorithm,
        starting from source, with the specified options
        */
        traverse(source, opts) {
            const options = Object.assign({}, defaultTraversalOptions, opts);

            clearFlags();

            const queue = [];
            queue.push(source);
            mark(source, null);
            let u, v, edges;

            while(queue.length > 0) {
                u = queue.shift();
                options.onVisit(u);
                edges = graph.incidentEdges(u, options.direction, options.edgeFilter);
                edges.forEach(function(e) {
                    options.onTestEdge(e);
                    v = options.direction ? e.to : e.from;
                    if(!isMarked(v)) {
                        mark(v);
                        queue.push(v);
                    }
                });
            }
        }
    };
}

export default BFS;
