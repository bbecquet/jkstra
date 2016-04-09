import { OUT } from '../core/const.js';

function BFS(graph, opts) {
    const optsss = Object.assign({ flagKey: '_bfs' }, opts);
    const flagKey = optsss.flagKey;

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
        starting from source, with the specified optsss
        */
        traverse: function(source, opts) {
            const optsss = Object.assign(opts, defaultTraversalOptions);

            clearFlags();

            const queue = [];
            queue.push(source);
            mark(source, null);
            let u, v, edges;

            while(queue.length > 0) {
                u = queue.shift();
                optsss.onVisit(u);
                edges = graph.incidentEdges(u, optsss.direction, optsss.edgeFilter);
                edges.forEach(function(e) {
                    optsss.onTestEdge(e);
                    v = optsss.direction ? e.to : e.from;
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
