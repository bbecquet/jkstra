import DijkstraIterator from '../algos/DijkstraIterator.js';
import NodeFlagger from './nodeFlagger.js';
import { IN, OUT, REACHED, SETTLED } from '../core/constants.js';

class BidirectionalDijkstra {
    constructor(graph, opts) {
        this.graph = graph;
        this.options = Object.assign({}, opts);
        this.outKey = '_dijkstra_out';
        this.inKey = '_dijkstra_in';
    }

    rebuildPath(meetingNode) {
        const edges = [];
        let edge;
        let currentNode = meetingNode;
        // going upward in the tree until the first vertex (with no incoming edge)
        while ((edge = this.outFlagger.getFlags(currentNode).inc) !== null) {
            edges.push(edge);
            currentNode = edge.from;
        }
        edges.reverse();
        currentNode = meetingNode;
        // going upward in the tree until the first vertex (with no incoming edge)
        while ((edge = this.inFlagger.getFlags(currentNode).inc) !== null) {
            edges.push(edge);
            currentNode = edge.to;
        }
        return edges;
    }

    _hasBeenReachBothWays(node) {
        const outState = this.outFlagger.getFlags(node);
        const inState = this.inFlagger.getFlags(node);

        return (outState.state === REACHED || outState.state === SETTLED)
            && (inState.state === REACHED || inState.state === SETTLED);
    }

    shortestPath(source, target, options) {
        const outIteraror = new DijkstraIterator(this.graph, source,
            Object.assign({},
                options,
                options.OUT,
                { direction: OUT, flagKey: this.outKey })
        );
        const inIterator = new DijkstraIterator(this.graph, target,
            Object.assign({},
                options,
                options.IN,
                { direction: IN, flagKey: this.inKey })
        );
        this.outFlagger = new NodeFlagger(this.graph, this.outKey);
        this.inFlagger = new NodeFlagger(this.graph, this.inKey);

        let iterator = outIteraror;
        let meetingNode;
        let next;

        // simply loop over the iterator until it ends
        while (!(next = iterator.next()).done) {
            if(this._hasBeenReachBothWays(next.value)) {
                meetingNode = next.value;
                break;
            }
            // alternate between the two iterators
            iterator = iterator === outIteraror ? inIterator : outIteraror;
        }

        if (meetingNode) {
            return this.rebuildPath(meetingNode);
        }
        return null;
    }
};

export default BidirectionalDijkstra;
