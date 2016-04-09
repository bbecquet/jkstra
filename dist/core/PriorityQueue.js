'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
Binary heap implementation of a priority queue
with an updateKey method.
*/
var PriorityQueue = function PriorityQueue(opts) {
    var heap = [];

    function compare(a, b) {
        return a.key - b.key;
    }

    function bubbleUp(idx) {
        var element = heap[idx];
        var parentIdx = void 0;
        var parent = void 0;
        while (idx > 0) {
            // Compute the parent element's index, and fetch it.
            parentIdx = Math.floor((idx + 1) / 2) - 1;
            parent = heap[parentIdx];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (compare(element, parent) > 0) {
                break;
            }

            // Otherwise, swap the parent with the current element and
            // continue.
            heap[parentIdx] = element;
            heap[idx] = parent;
            idx = parentIdx;
        }
    }

    function sinkDown(idx) {
        var length = heap.length;
        var element = heap[idx];
        var swapIdx = void 0;

        while (true) {
            var rChildIdx = (idx + 1) * 2;
            var lChildIdx = rChildIdx - 1;
            swapIdx = -1;

            // if the first child exists
            if (lChildIdx < length) {
                var lChild = heap[lChildIdx];
                // and is lower than the element, they must be swapped
                if (compare(lChild, element) < 0) {
                    swapIdx = lChildIdx;
                }

                // unless there is another lesser child, which will be the one swapped
                if (rChildIdx < length) {
                    var rChild = heap[rChildIdx];
                    if ((swapIdx === -1 || compare(rChild, lChild) < 0) && compare(rChild, element) < 0) {
                        swapIdx = rChildIdx;
                    }
                }
            }

            // if no swap occurs, the element found its right place
            if (swapIdx === -1) {
                break;
            }

            // otherwise, swap and continue on next tree level
            heap[idx] = heap[swapIdx];
            heap[swapIdx] = element;
            idx = swapIdx;
        }
    }

    function findElementIndex(elt) {
        for (var i = 0, l = heap.length; i < l; i++) {
            if (heap[i].elt === elt) {
                return i;
            }
        }
        return -1;
    }

    return {
        count: function count() {
            return heap.length;
        },

        insert: function insert(element, key) {
            if (typeof element === 'undefined') {
                throw new Error('No element provided');
            }
            heap.push({ elt: element, key: key });
            bubbleUp(heap.length - 1);
        },

        pop: function pop() {
            if (heap.length === 0) {
                throw new Error('Empty queue');
            }
            var elt = heap[0];
            var end = heap.pop();
            // replace the first element by the last,
            // and let it sink to its right place
            if (heap.length > 0) {
                heap[0] = end;
                sinkDown(0);
            }
            return elt;
        },

        peek: function peek() {
            if (heap.length === 0) {
                throw new Error('Empty queue');
            }
            return heap[0];
        },

        updateKey: function updateKey(element, newKey) {
            var idx = findElementIndex(element);
            if (idx === -1) {
                throw new Error('The element is not in the heap');
            }
            var oldKey = heap[idx].key;
            heap[idx].key = newKey;
            if (newKey < oldKey) {
                bubbleUp(idx);
            } else {
                sinkDown(idx);
            }
        }
    };
};

exports.default = PriorityQueue;
module.exports = exports['default'];