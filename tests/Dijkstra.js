/* eslint-env mocha */

import { assert } from 'chai';
import Graph from '../dist/core/Graph.js';
import Dijkstra from '../dist/algos/Dijkstra.js';

describe('Dijkstra', function() {
    let n, e, dijkstra;

    before(function() {
        const graph = new Graph();
        n = [];
        e = [];

        n.push(graph.addVertex(0));
        n.push(graph.addVertex(1));
        n.push(graph.addVertex(2));
        n.push(graph.addVertex(3));
        n.push(graph.addVertex(4));
        n.push(graph.addVertex(5));

        e.push(graph.addEdge(n[0], n[1], 7)); // 0
        e.push(graph.addEdge(n[0], n[2], 9)); // 1
        e.push(graph.addEdge(n[0], n[5], 14));// 2
        e.push(graph.addEdge(n[1], n[2], 10));// 3
        e.push(graph.addEdge(n[1], n[3], 15));// 4
        e.push(graph.addEdge(n[2], n[5], 2)); // 5
        e.push(graph.addEdge(n[2], n[3], 12));// 6
        e.push(graph.addEdge(n[3], n[4], 6)); // 7
        e.push(graph.addEdge(n[5], n[4], 9)); // 8

        dijkstra = new Dijkstra(graph);
    });

    describe('traverse()', function() {
        it('visits the nodes from lower to higher cost from the source', function() {
            const traversalOrder = [];
            dijkstra.traverse(n[0], {
                edgeCost: e => e.data,
                onSettle: node => { traversalOrder.push(node.data); }
            });
            assert.equal(traversalOrder.join(), '0,1,2,5,4,3');
        });
    });

    describe('shortestPath()', function() {
        it('returns null (path not found) between two unroutable nodes', function() {
            assert.isNull(dijkstra.shortestPath(n[1], n[0]));
            assert.isNull(dijkstra.shortestPath(n[5], n[2]));
        });

        it('returns an empty path between a node and itself', function() {
            const path = dijkstra.shortestPath(n[0], n[0]);
            assert.isArray(path);
            assert.equal(path.length, 0);
        });

        it('returns the shortest path as an edge array', function() {
            const path = dijkstra.shortestPath(n[0], n[4], {
                edgeCost: e => e.data
            });
            assert.isArray(path);
            assert.deepEqual(path, [e[1], e[5], e[8]]);
        });
    });
});
