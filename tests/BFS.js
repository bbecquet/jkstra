/* eslint-env mocha */

import { assert } from 'chai';
import Graph from '../dist/core/Graph.js';
import Dijkstra from '../dist/algos/BFS.js';
import { IN } from '../dist/core/constants.js';

describe('BFS', function() {
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
        it('visits the nodes in the BFS order from the source', function() {
            const traversalOrder = [];
            dijkstra.traverse(n[0], {
                onVisit: node => { traversalOrder.push(node.data); }
            });
            assert.equal(traversalOrder.join(), '0,1,2,5,3,4');
        });

        it('visits the nodes in the BFS order upstream from the source', function() {
            const traversalOrder = [];
            dijkstra.traverse(n[4], {
                direction: IN,
                onVisit: node => { traversalOrder.push(node.data); }
            });
            assert.equal(traversalOrder.join(), '4,3,5,1,2,0');
        });
    });
});
