/* eslint-env mocha */

import { assert } from 'chai';
import { OUT } from '../dist/core/constants.js';
import Graph from '../dist/core/Graph.js';

describe('Graph', function() {
    let graph;

    beforeEach(function() {
        graph = new Graph();
    });

    describe('addVertex()', function() {
        it('returns a vertex object with a properly set data field', function() {
            let v = graph.addVertex('foo');
            assert.equal(v.data, 'foo');
            v = graph.addVertex(1234);
            assert.equal(v.data, 1234);
        });
    });

    describe('addEdge()', function() {
        it('fails if one of the vertices is not in the graph', function() {
            assert.throws(function() { graph.addEdge(1, 2, 3); });
        });

        it('returns an edge object with from/to vertices and a properly set data field', function() {
            const u = graph.addVertex('from');
            const v = graph.addVertex('to');
            const e = graph.addEdge(u, v, 'bar');
            assert.strictEqual(e.from, u);
            assert.strictEqual(e.to, v);
            assert.equal(e.data, 'bar');
        });
    });

    describe('addEdgePair()', function() {
        it('fails if one of the vertices is not in the graph', function() {
            assert.throws(function() { graph.addEdge({v: 1}, {v: 2}, 'foobar'); });
        });

        it('returns an array of two edges with opposite from/to and the same data', function() {
            const u = graph.addVertex('from');
            const v = graph.addVertex('to');
            const pair = graph.addEdgePair(u, v, 'bar');
            assert.isArray(pair);
            assert.lengthOf(pair, 2);
            assert.strictEqual(pair[0].from, pair[1].to);
            assert.strictEqual(pair[1].from, pair[0].to);
            assert.strictEqual(pair[0].data, pair[1].data);
        });
    });

    describe('vertexCount', function() {
        it('returns the correct number of vertices', function() {
            assert.equal(graph.vertexCount, 0);
            const u = graph.addVertex();
            graph.addVertex();
            graph.addVertex();
            assert.equal(graph.vertexCount, 3);
            graph.removeVertex(u);
            assert.equal(graph.vertexCount, 2);
        });
    });

    describe('edgeCount', function() {
        it('returns the correct number of edges', function() {
            assert.equal(graph.edgeCount, 0);
            const u = graph.addVertex();
            const v = graph.addVertex();
            const w = graph.addVertex();
            assert.equal(graph.edgeCount, 0);
            const uv = graph.addEdge(u, v);
            graph.addEdge(u, w);
            graph.addEdgePair(v, w);
            assert.equal(graph.edgeCount, 4);
            graph.removeEdge(uv);
            assert.equal(graph.edgeCount, 3);
        });
    });

    describe('incidentEdges()', function() {
        let vA, vB, vC;
        let eAB, eAC;

        beforeEach(function() {
            vA = graph.addVertex('A');
            vB = graph.addVertex('B');
            vC = graph.addVertex('C');
            eAB = graph.addEdge(vA, vB, 10);
            eAC = graph.addEdge(vA, vC, 50);
        });

        it('returns all incident edges of the vertex in the given direction', function() {
            const outA = graph.incidentEdges(vA, OUT);
            assert.isArray(outA);
            assert.lengthOf(outA, 2);
            assert.include(outA, eAB);
            assert.include(outA, eAC);
        });

        it('returns incident edges of the vertex in the given direction and verifying the filter function', function() {
            const outA = graph.incidentEdges(vA, OUT, function(e) { return e.data > 20; });
            assert.deepEqual(outA, [eAC]);
        });
    });

    describe('vertex', function() {
        it('returns null on an empty graph', function() {
            assert.isNull(graph.vertex({id: 2}));
        });

        it('returns null if no vertex matches the properties', function() {
            graph.addVertex('a');
            graph.addVertex(1);
            graph.addVertex({foo: 'a', bar: 1});
            assert.isNull(graph.vertex('b'));
            assert.isNull(graph.vertex('1'));
            assert.isNull(graph.vertex({foo: 'b'}));
            assert.isNull(graph.vertex({foo: 'a', bar: 2}));
        });

        it('returns a vertex matching all or part of the properties', function() {
            const a = graph.addVertex('a');
            const b = graph.addVertex(1);
            const c = graph.addVertex({foo: 'a', bar: 1});
            const n = graph.addVertex(null);
            assert.equal(a, graph.vertex('a'));
            assert.equal(b, graph.vertex(1));
            assert.equal(c, graph.vertex({foo: 'a'}));
            assert.equal(c, graph.vertex({bar: 1, foo: 'a'}));
            assert.equal(n, graph.vertex(null));
        });
    });

    describe('edge', function() {
        it('returns null on an empty graph', function() {
            assert.isNull(graph.edge({id: 2}));
        });

        it('returns null if no edge matches the properties', function() {
            const vA = graph.addVertex('A');
            const vB = graph.addVertex('B');
            const vC = graph.addVertex('C');
            graph.addEdgePair(vA, vB, 'a');
            graph.addEdge(vC, vA, 1);
            graph.addEdge(vB, vC, {foo: 'a', bar: 1});
            assert.isNull(graph.edge('b'));
            assert.isNull(graph.edge('1'));
            assert.isNull(graph.edge({foo: 'b'}));
            assert.isNull(graph.edge({foo: 'a', bar: 2}));
        });

        it('returns an edge matching all or parf of the properties', function() {
            const vA = graph.addVertex('A');
            const vB = graph.addVertex('B');
            const vC = graph.addVertex('C');
            const eAB = graph.addEdge(vA, vB, 'a');
            const eCA = graph.addEdge(vC, vA, 1);
            const eBC = graph.addEdge(vB, vC, {foo: 'a', bar: 1});
            assert.equal(eAB, graph.edge('a'));
            assert.equal(eCA, graph.edge(1));
            assert.equal(eBC, graph.edge({foo: 'a'}));
            assert.equal(eBC, graph.edge({bar: 1, foo: 'a'}));
        });
    });

    describe('removeEdge()', function() {
        it('removes the edge but does not touch vertices', function() {
            const vA = graph.addVertex('A');
            const vB = graph.addVertex('B');
            const eAB = graph.addEdge(vA, vB, 'AB');
            graph.removeEdge(eAB);
            assert.isNull(graph.edge('AB'));
            assert.isNotNull(graph.vertex('A'));
            assert.isNotNull(graph.vertex('B'));
        });
    });

    describe('removeVertex()', function() {
        it('removes the vertex and all its incident edges', function() {
            const vA = graph.addVertex('A');
            const vB = graph.addVertex('B');
            const vC = graph.addVertex('C');
            graph.addEdgePair(vA, vB, 'AB');
            graph.addEdge(vC, vA, 'CA');
            graph.addEdge(vB, vC, 'BC');
            graph.removeVertex(vA);
            assert.isNull(graph.vertex('A'));
            assert.isNull(graph.edge('AB'));
            assert.isNull(graph.edge('CA'));
        });
    });
});
