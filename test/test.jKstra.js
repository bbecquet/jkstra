/* eslint-env mocha */

import { assert } from 'chai';
import { OUT } from 'core/const.js';
import PriorityQueue from 'core/PriorityQueue.js';
import Graph from 'core/Graph.js';
import Dijkstra from 'algos/Dijkstra.js';

describe('Graph', function() {
    let G;

    beforeEach(function() {
        G = new Graph();
    });

    describe('addVertex()', function() {
        it('returns a vertex object with a properly set data field', function() {
            let v = G.addVertex('foo');
            assert.equal(v.data, 'foo');
            v = G.addVertex(1234);
            assert.equal(v.data, 1234);
        });
    });

    describe('addEdge()', function() {
        it('fails if one of the vertices is not in the graph', function() {
            assert.throws(function() { G.addEdge(1, 2, 3); });
        });

        it('returns an edge object with from/to vertices and a properly set data field', function() {
            const u = G.addVertex('from');
            const v = G.addVertex('to');
            const e = G.addEdge(u, v, 'bar');
            assert.strictEqual(e.from, u);
            assert.strictEqual(e.to, v);
            assert.equal(e.data, 'bar');
        });
    });

    describe('addEdgePair()', function() {
        it('fails if one of the vertices is not in the graph', function() {
            assert.throws(function() { G.addEdge({v: 1}, {v: 2}, 'foobar'); });
        });

        it('returns an array of two edges with opposite from/to and the same data', function() {
            const u = G.addVertex('from');
            const v = G.addVertex('to');
            const pair = G.addEdgePair(u, v, 'bar');
            assert.isArray(pair);
            assert.lengthOf(pair, 2);
            assert.strictEqual(pair[0].from, pair[1].to);
            assert.strictEqual(pair[1].from, pair[0].to);
            assert.strictEqual(pair[0].data, pair[1].data);
        });
    });

    describe('incidentEdges()', function() {
        let vA, vB, vC;
        let eAB, eAC;

        beforeEach(function() {
            vA = G.addVertex('A');
            vB = G.addVertex('B');
            vC = G.addVertex('C');
            eAB = G.addEdge(vA, vB, 10);
            eAC = G.addEdge(vA, vC, 50);
        });

        it('returns all incident edges of the vertex in the given direction', function() {
            const outA = G.incidentEdges(vA, OUT);
            assert.isArray(outA);
            assert.lengthOf(outA, 2);
            assert.include(outA, eAB);
            assert.include(outA, eAC);
        });

        it('returns incident edges of the vertex in the given direction and verifying the filter function', function() {
            const outA = G.incidentEdges(vA, OUT, function(e) { return e.data > 20; });
            assert.deepEqual(outA, [eAC]);
        });
    });

    describe('vertex', function() {
        it('returns null on an empty graph', function() {
            assert.isNull(G.vertex({id: 2}));
        });

        it('returns null if no vertex matches the properties', function() {
            G.addVertex('a');
            G.addVertex(1);
            G.addVertex({foo: 'a', bar: 1});
            assert.isNull(G.vertex('b'));
            assert.isNull(G.vertex('1'));
            assert.isNull(G.vertex({foo: 'b'}));
            assert.isNull(G.vertex({foo: 'a', bar: 2}));
        });

        it('returns a vertex matching all or part of the properties', function() {
            const a = G.addVertex('a');
            const b = G.addVertex(1);
            const c = G.addVertex({foo: 'a', bar: 1});
            const n = G.addVertex(null);
            assert.equal(a, G.vertex('a'));
            assert.equal(b, G.vertex(1));
            assert.equal(c, G.vertex({foo: 'a'}));
            assert.equal(c, G.vertex({bar: 1, foo: 'a'}));
            assert.equal(n, G.vertex(null));
        });
    });

    describe('edge', function() {
        it('returns null on an empty graph', function() {
            assert.isNull(G.edge({id: 2}));
        });

        it('returns null if no edge matches the properties', function() {
            const vA = G.addVertex('A');
            const vB = G.addVertex('B');
            const vC = G.addVertex('C');
            G.addEdgePair(vA, vB, 'a');
            G.addEdge(vC, vA, 1);
            G.addEdge(vB, vC, {foo: 'a', bar: 1});
            assert.isNull(G.edge('b'));
            assert.isNull(G.edge('1'));
            assert.isNull(G.edge({foo: 'b'}));
            assert.isNull(G.edge({foo: 'a', bar: 2}));
        });

        it('returns an edge matching all or parf of the properties', function() {
            const vA = G.addVertex('A');
            const vB = G.addVertex('B');
            const vC = G.addVertex('C');
            const eAB = G.addEdge(vA, vB, 'a');
            const eCA = G.addEdge(vC, vA, 1);
            const eBC = G.addEdge(vB, vC, {foo: 'a', bar: 1});
            assert.equal(eAB, G.edge('a'));
            assert.equal(eCA, G.edge(1));
            assert.equal(eBC, G.edge({foo: 'a'}));
            assert.equal(eBC, G.edge({bar: 1, foo: 'a'}));
        });
    });

    describe('removeEdge()', function() {
        it('removes the edge but does not touch vertices', function() {
            const vA = G.addVertex('A');
            const vB = G.addVertex('B');
            const eAB = G.addEdge(vA, vB, 'AB');
            G.removeEdge(eAB);
            assert.isNull(G.edge('AB'));
            assert.isNotNull(G.vertex('A'));
            assert.isNotNull(G.vertex('B'));
        });
    });

    describe('removeVertex()', function() {
        it('removes the vertex and all its incident edges', function() {
            const vA = G.addVertex('A');
            const vB = G.addVertex('B');
            const vC = G.addVertex('C');
            G.addEdgePair(vA, vB, 'AB');
            G.addEdge(vC, vA, 'CA');
            G.addEdge(vB, vC, 'BC');
            G.removeVertex(vA);
            assert.isNull(G.vertex('A'));
            assert.isNull(G.edge('AB'));
            assert.isNull(G.edge('CA'));
        });
    });
});

describe('PriorityQueue', function() {
    let pq;

    beforeEach(function() {
        pq = new PriorityQueue();
    });

    describe('insert()', function() {
        it('fails if no object is provided', function() {
            assert.throw(function() { pq.insert(); });
        });
    });

    describe('pop()', function() {
        it('fails on an empty PriorityQueue', function() {
            assert.throw(function() { pq.pop(); });
        });
        it('returns and removes the element of mininum cost', function() {
            pq.insert('a', 5);
            pq.insert('b', 1);
            pq.insert('c', 3);
            assert.deepEqual(pq.pop(), {elt: 'b', key: 1});
            assert.deepEqual(pq.pop(), {elt: 'c', key: 3});
        });
    });

    describe('count()', function() {
        it('returns 0 on a new PriorityQueue', function() {
            assert.equal(pq.count(), 0);
        });

        it('is incremented after insertions', function() {
            pq.insert('a', 1);
            assert.equal(pq.count(), 1);
            pq.insert('b', 3);
            pq.insert('c', 2);
            assert.equal(pq.count(), 3);
        });

        it('is decremented after deletions', function() {
            pq.insert('a', 1);
            pq.insert('b', 2);
            pq.insert('c', 3);
            pq.pop();
            pq.pop();
            assert.equal(pq.count(), 1);
            pq.pop();
            assert.equal(pq.count(), 0);
        });
    });

    describe('peek()', function() {
        it('fails on an empty PriorityQueue', function() {
            assert.throw(function() { pq.peek(); }, 'Empty queue');
        });

        it('returns the element of mininum cost without removing it from the queue', function() {
            pq.insert('a', 5);
            pq.insert('b', 1);
            pq.insert('c', 3);
            // so it can be called multiple times and return the same element
            assert.deepEqual(pq.peek(), {elt: 'b', key: 1});
            assert.deepEqual(pq.peek(), {elt: 'b', key: 1});
            assert.deepEqual(pq.peek(), {elt: 'b', key: 1});
        });
    });

    describe('updateKey()', function() {
        it('fails on an empty queue', function() {
            assert.throw(function() { pq.updateKey('d', 0); }, Error);
        });

        it('fails when the element is not in the queue', function() {
            pq.insert('a', 1);
            pq.insert('b', 2);
            pq.insert('c', 3);
            assert.throw(function() { pq.updateKey('d', 0); }, Error);
        });

        it('changes the order of the elements when the key is greater', function() {
            pq.insert('a', 1);
            pq.insert('b', 2);
            pq.insert('c', 3);
            pq.updateKey('a', 5);
            assert.deepEqual(pq.peek(), {elt: 'b', key: 2});
        });

        it('changes the order of the elements when the key is lesser', function() {
            pq.insert('a', 1);
            pq.insert('b', 2);
            pq.insert('c', 3);
            pq.updateKey('c', 0);
            assert.deepEqual(pq.peek(), {elt: 'c', key: 0});
        });
    });
});

describe('Dijkstra', function() {
    const G = new Graph();
    const n = [];
    n.push(G.addVertex(1));
    n.push(G.addVertex(2));
    n.push(G.addVertex(3));
    n.push(G.addVertex(4));
    n.push(G.addVertex(5));
    n.push(G.addVertex(6));

    const e = [];
    e.push(G.addEdge(n[0], n[1], 7)); // 0
    e.push(G.addEdge(n[0], n[2], 9)); // 1
    e.push(G.addEdge(n[0], n[5], 14));// 2
    e.push(G.addEdge(n[1], n[2], 10));// 3
    e.push(G.addEdge(n[1], n[3], 15));// 4
    e.push(G.addEdge(n[2], n[5], 2)); // 5
    e.push(G.addEdge(n[2], n[3], 11));// 6
    e.push(G.addEdge(n[3], n[4], 6)); // 7
    e.push(G.addEdge(n[5], n[4], 9)); // 8
    const dijkstra = new Dijkstra(G);

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
            const path = dijkstra.shortestPath(n[0], n[4], { edgeCost: function(e) { return(e.data); } });
            assert.isArray(path);
            assert.deepEqual(path, [e[1], e[5], e[8]]);
        });
    });
});
