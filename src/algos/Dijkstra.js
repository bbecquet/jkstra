import PriorityQueue from '../core/PriorityQueue.js';
const SETTLED = 2;
const REACHED = 1;

class Dijkstra {
    constructor(graph, opts) {
        this.graph = graph;
        const options = Object.assign({ flagKey: '_dijkstra' }, opts);
        this.flagKey = options.flagKey;
    }

    // TODO: move these 3 functions to some utils
    _clearFlags() {
        this.graph.forEachVertex(v => {
            delete v[this.flagKey];
        });
    }

    _getFlags(v) {
        return v[this.flagKey] || {};
    }

    _setFlags(v, flags) {
        if (!v.hasOwnProperty(this.flagKey)) {
            v[this.flagKey] = {};
        }
        for (let key in flags) {
            v[this.flagKey][key] = flags[key];
        }
    }

    _reach(v, incEdge, cost, action) {
        // update state to "reached", and register cost and incomingEdge
        this._setFlags(v, {state: REACHED, cost, inc: incEdge});
        if (action) {
            action(v, incEdge, cost);
        }
    }

    _settle(v, action) {
        this._setFlags(v, {state: SETTLED});
        if (action) {
            action(v);
        }
    }

    rebuildPath(end) {
        const edges = [];
        let edge;
        // going upward in the tree until the first vertex (with no incoming edge)
        while ((edge = this._getFlags(end).inc) !== null) {
            edges.push(edge);
            end = edge.from;
        }
        return edges.reverse();
    }

    static defaultTraversalOptions = {
        shouldUpdateKey: (prevCost, newCost) => { return newCost < prevCost; },
        edgeCost: (e, costDone) => 1,
        isFinished: direction => false,
        heuristic: v => 0,
        onReach: null,        // nothing special to do when reaching a node
        onSettle: null,     // nothing special to do when setting a node
        edgeFilter: null    // take all edges
    }

    /**
    The most common use of Dijkstra traversal
    */
    shortestPath(source, target, opts) {
        function isTargetFound() {
            return this._getFlags(target).state === SETTLED;
        }

        const options = opts || {};
        options.isFinished = isTargetFound.bind(this);

        const found = this.traverse(source, options);
        if(found) {
            return this.rebuildPath(target);
        }
        return null;
    }

    /**
    Traverse the graph using Dijkstra's algorithm,
    starting from source, with the specified options
    */
    traverse(source, opts) {
        const options = Object.assign({}, Dijkstra.defaultTraversalOptions, opts);
        const {
            edgeFilter,
            edgeCost,
            heuristic,
            shouldUpdateKey,
            onReach,
            onSettle,
            isFinished
        } = options;

        // reset node tagging
        this._clearFlags();

        let kv;
        let u, v;
        let totalCost, eCost;
        let vFlags;

        const Q = new PriorityQueue();
        Q.insert(source, 0);
        this._reach(source, null, 0, onReach);

        while (!isFinished() && Q.count > 0) {
            kv = Q.pop();
            u = kv.elt;
            totalCost = kv.key;
            this._settle(u, onSettle);

            const edges = this.graph.outEdges(u, edgeFilter);
            for (let e of edges) {
                v = e.to;
                eCost = totalCost + edgeCost(e, totalCost) + heuristic(v);
                vFlags = this._getFlags(v);

                if (vFlags.state !== SETTLED) {
                    if (vFlags.state !== REACHED) {
                        Q.insert(v, eCost);
                        this._reach(v, e, eCost, onReach);
                    } else {
                        if (shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
                        // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
                            Q.updateKey(v, eCost);
                            this._reach(v, e, eCost, onReach);
                        }
                    }
                }
            }
        }

        // if false, means the whole graph was traversed
        return isFinished();
    }
};

export default Dijkstra;
