/* eslint-env mocha */

import { assert } from 'chai';
import PriorityQueue from '../dist/core/PriorityQueue.js';

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
