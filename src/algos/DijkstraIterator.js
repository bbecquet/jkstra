import PriorityQueue from 'updatable-priority-queue';
import NodeFlagger from './nodeFlagger.js';
import { OUT, SETTLED, REACHED } from '../core/constants.js';

class DijkstraIterator {
    static defaultOptions = {
        flagKey: '_dijkstra',
        direction: OUT,
        shouldUpdateKey: (prevCost, newCost) => { return newCost < prevCost; },
        edgeCost: (e, costDone) => 1,
        heuristic: v => 0,
        onReach: null,        // nothing special to do when reaching a node
        onSettle: null,     // nothing special to do when setting a node
        edgeFilter: null    // take all edges
    }

    constructor(graph, source, opts) {
        this.graph = graph;
        this.source = source;
        this.options = Object.assign({}, DijkstraIterator.defaultOptions, opts);
        this.flags = new NodeFlagger(this.graph, this.options.flagKey);

        this.pQ = new PriorityQueue();
        this._initTraversal();
    }

    _reach(v, incEdge, fCost, gCost, action) {
        // update state to "reached", and register cost and incomingEdge
        this.flags.setFlags(v, {state: REACHED, fCost, gCost, inc: incEdge});
        if (action) {
            action(v);
        }
    }

    _settle(v, action) {
        this.flags.setFlags(v, {state: SETTLED});
        if (action) {
            action(v);
        }
    }

    _initTraversal() {
        // reset node tagging
        this.flags.clearFlags(this.graph);
        this.pQ.insert(this.source, this.options.heuristic(this.source));
        this._reach(this.source, null, this.options.heuristic(this.source), 0, this.options.onReach);
    }

    next() {
        // if no more node available in the queue,
        // return the iterator end signal
        if (this.pQ.count === 0) {
            return { done: true };
        }

        const {
            direction,
            onReach,
            onSettle,
            edgeFilter,
            edgeCost,
            heuristic,
            shouldUpdateKey
        } = this.options;

        const u = this.pQ.pop().item;
        let v;
        let vFlags;
        const uGCost = this.flags.getFlags(u).gCost;
        let vFCost, vGCost;

        this._settle(u, onSettle);
        const edges = this.graph.incidentEdges(u, direction, edgeFilter);
        for (let e of edges) {
            v = direction === OUT ? e.to : e.from;
            vFlags = this.flags.getFlags(v);

            if (vFlags.state !== SETTLED) {
                vGCost = uGCost + edgeCost(e, uGCost);
                vFCost = vGCost + heuristic(v);
                if (vFlags.state !== REACHED) {
                    this.pQ.insert(v, vFCost);
                    this._reach(v, e, vFCost, vGCost, onReach);
                } else {
                    if (shouldUpdateKey(vFlags.fCost, vFCost, vFlags.inc, e)) {
                        this.pQ.updateKey(v, vFCost);
                        this._reach(v, e, vFCost, vGCost, onReach);
                    }
                }
            }
        }

        return { value: u };
    }
};

export default DijkstraIterator;
