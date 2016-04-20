"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
Binary this.heap implementation of a priority queue
with an updateKey method.
*/

var PriorityQueue = function () {
    function PriorityQueue() {
        _classCallCheck(this, PriorityQueue);

        this.heap = [];
    }

    // TODO: make it an option, for max or min priority queue


    _createClass(PriorityQueue, [{
        key: "_compare",
        value: function _compare(a, b) {
            return a.key - b.key;
        }
    }, {
        key: "_bubbleUp",
        value: function _bubbleUp(idx) {
            var element = this.heap[idx];
            var parentIdx = void 0;
            var parent = void 0;
            while (idx > 0) {
                // Compute the parent element's index, and fetch it.
                parentIdx = Math.floor((idx + 1) / 2) - 1;
                parent = this.heap[parentIdx];
                // If the parent has a lesser score, things are in order and we
                // are done.
                if (this._compare(element, parent) > 0) {
                    break;
                }

                // Otherwise, swap the parent with the current element and
                // continue.
                this.heap[parentIdx] = element;
                this.heap[idx] = parent;
                idx = parentIdx;
            }
        }
    }, {
        key: "_sinkDown",
        value: function _sinkDown(idx) {
            var length = this.heap.length;
            var element = this.heap[idx];
            var swapIdx = void 0;

            while (true) {
                var rChildIdx = (idx + 1) * 2;
                var lChildIdx = rChildIdx - 1;
                swapIdx = -1;

                // if the first child exists
                if (lChildIdx < length) {
                    var lChild = this.heap[lChildIdx];
                    // and is lower than the element, they must be swapped
                    if (this._compare(lChild, element) < 0) {
                        swapIdx = lChildIdx;
                    }

                    // unless there is another lesser child, which will be the one swapped
                    if (rChildIdx < length) {
                        var rChild = this.heap[rChildIdx];
                        if ((swapIdx === -1 || this._compare(rChild, lChild) < 0) && this._compare(rChild, element) < 0) {
                            swapIdx = rChildIdx;
                        }
                    }
                }

                // if no swap occurs, the element found its right place
                if (swapIdx === -1) {
                    break;
                }

                // otherwise, swap and continue on next tree level
                this.heap[idx] = this.heap[swapIdx];
                this.heap[swapIdx] = element;
                idx = swapIdx;
            }
        }
    }, {
        key: "_findElementIndex",
        value: function _findElementIndex(elt) {
            for (var i = 0, l = this.heap.length; i < l; i++) {
                if (this.heap[i].elt === elt) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: "insert",
        value: function insert(element, key) {
            this.heap.push({ elt: element, key: key });
            this._bubbleUp(this.heap.length - 1);
        }
    }, {
        key: "pop",
        value: function pop() {
            if (this.heap.length === 0) {
                return null;
            }
            var elt = this.heap[0];
            var end = this.heap.pop();
            // replace the first element by the last,
            // and let it sink to its right place
            if (this.heap.length > 0) {
                this.heap[0] = end;
                this._sinkDown(0);
            }
            return elt;
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.heap.length === 0) {
                return null;
            }
            return this.heap[0];
        }
    }, {
        key: "updateKey",
        value: function updateKey(element, newKey) {
            var idx = this._findElementIndex(element);
            if (idx === -1) {
                return;
            }
            var oldKey = this.heap[idx].key;
            this.heap[idx].key = newKey;
            if (newKey < oldKey) {
                this._bubbleUp(idx);
            } else {
                this._sinkDown(idx);
            }
        }
    }, {
        key: "count",
        get: function get() {
            return this.heap.length;
        }
    }]);

    return PriorityQueue;
}();

;

exports.default = PriorityQueue;
module.exports = exports['default'];
//# sourceMappingURL=PriorityQueue.js.map