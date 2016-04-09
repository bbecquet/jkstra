import PriorityQueue from '../core/PriorityQueue.js';
const SETTLED = 2;
const REACHED = 1;

function Dijkstra(graph, opts) {
    const options = Object.assign({ flagKey: '_dijkstra' }, opts);
    let flagKey = options.flagKey;

    function clearFlags() {
        graph.forEachVertex(function(v) {
            delete v[flagKey];
        });
    }

    function getFlags(v) {
        return v[flagKey] || {};
    }

    function setFlags(v, flags) {
        if(!v.hasOwnProperty(flagKey)) {
            v[flagKey] = {};
        }
        for(let key in flags) {
            v[flagKey][key] = flags[key];
        }
    }

    /**
    @param v {Vertex}
    @param incEge {Edge} the incoming edge
    @param cost {the cost }
    */
    function reach(v, incEdge, cost, action) {
        // update state to "reached", and register cost and incomingEdge
        setFlags(v, {state: REACHED, cost: cost, inc: incEdge});
        if(action) {
            action(v, incEdge, cost);
        }
    }

    function settle(v, action) {
        setFlags(v, {state: SETTLED});
        if(action) {
            action(v);
        }
    }

    function rebuildPath(end) {
        const edges = [];
        let edge;
        // going upward in the tree until the first vertex (with no incoming edge)
        while((edge = getFlags(end).inc) != null) {
            edges.push(edge);
            end = edge.from;
        }
        return edges.reverse();
    }

    const defaultTraversalOptions = {
        shouldUpdateKey: function(prevCost, newCost) {
            return newCost < prevCost;
        },
        edgeCost: function(e, costDone) {
            return 1;
        },
        isFinished: function(direction) {
            return false;
        },
        onReach: null,        // nothing special to do when reaching a node
        onSettle: null,     // nothing special to do when setting a node
        edgeFilter: null    // take all edges
    };

    return {
        /**
        The most common use of Dijkstra traversal
        */
        shortestPath(source, target, opts) {
            function isTargetFound() {
                return getFlags(target).state === SETTLED;
            }

            const options = opts || {};
            options.isFinished = isTargetFound;

            const found = this.traverse(source, options);
            if(found) {
                return rebuildPath(target);
            }
            return null;
        },

        /**
        Traverse the graph using Dijkstra's algorithm,
        starting from source, with the specified options
        */
        traverse(source, opts) {
            const options = Object.assign({}, defaultTraversalOptions, opts);

            // reset node tagging
            clearFlags();

            let kv;
            let u, v;
            let e;
            let totalCost, eCost;
            let vFlags;

            const Q = new PriorityQueue();
            Q.insert(source, 0);
            reach(source, null, 0, options.onReach);

            while(!options.isFinished() && Q.count() > 0) {
                kv = Q.pop();
                u = kv.elt;
                totalCost = kv.key;
                settle(u, options.onSettle);

                const edges = graph.outEdges(u, options.edgeFilter);
                for(let i = 0; i < edges.length; i++) {
                    e = edges[i];
                    v = e.to;
                    eCost = totalCost + options.edgeCost(e, totalCost);
                    vFlags = getFlags(v);

                    if(vFlags.state !== SETTLED) {
                        if(vFlags.state !== REACHED) {
                            Q.insert(v, eCost);
                            reach(v, e, eCost, options.onReach);
                        } else {
                            if (options.shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                            // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
                                Q.updateKey(v, eCost);
                                reach(v, e, eCost, options.onReach);
                            }
                        }
                    }
                }
            }

            // if false, means the whole graph was traversed
            return options.isFinished();
        }
    };
};

export default Dijkstra;
