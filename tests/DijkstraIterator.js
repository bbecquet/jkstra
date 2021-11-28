/* eslint-env mocha */

import { assert } from 'chai';
import Graph from '../dist/core/Graph.js';
import DijkstraIterator from '../dist/algos/DijkstraIterator.js';
import { IN } from '../dist/core/constants.js';

describe('DijkstraIterator', function() {
    let graph, n, e;

    before(function() {
        graph = new Graph();
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
    });

    describe('next()', function() {
        it('visits the nodes from lower to higher cost from the source', function() {
            const dijkstraIterator = new DijkstraIterator(graph, n[0], {
                edgeCost: e => e.data
            });

            const traversalOrder = [];
            let iteratorResult;
            while(!(iteratorResult = dijkstraIterator.next()).done) {
                traversalOrder.push(iteratorResult.value.data);
            }
            assert.equal(traversalOrder.join(), '0,1,2,5,4,3');
        });

        it('works in reverse', function() {
            const dijkstraIterator = new DijkstraIterator(graph, n[4], {
                edgeCost: e => e.data,
                direction: IN
            });

            const traversalOrder = [];
            let iteratorResult;
            while(!(iteratorResult = dijkstraIterator.next()).done) {
                traversalOrder.push(iteratorResult.value.data);
            }
            assert.equal(traversalOrder.join(), '4,3,5,2,0,1');
        });
    });
});
