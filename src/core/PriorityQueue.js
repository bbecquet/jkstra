
/**
Binary this.heap implementation of a priority queue
with an updateKey method.
*/
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    // TODO: make it an option, for max or min priority queue
    _compare(a, b) {
        return a.key - b.key;
    }

    _bubbleUp(idx) {
        let element = this.heap[idx];
        let parentIdx;
        let parent;
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

    _sinkDown(idx) {
        let length = this.heap.length;
        let element = this.heap[idx];
        let swapIdx;

        while(true) {
            let rChildIdx = (idx + 1) * 2;
            let lChildIdx = rChildIdx - 1;
            swapIdx = -1;

            // if the first child exists
            if (lChildIdx < length) {
                let lChild = this.heap[lChildIdx];
                // and is lower than the element, they must be swapped
                if (this._compare(lChild, element) < 0) {
                    swapIdx = lChildIdx;
                }

                // unless there is another lesser child, which will be the one swapped
                if (rChildIdx < length) {
                    const rChild = this.heap[rChildIdx];
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

    _findElementIndex(elt) {
        for (let i = 0, l = this.heap.length; i < l; i++) {
            if (this.heap[i].elt === elt) { return i; }
        }
        return -1;
    }

    get count() {
        return this.heap.length;
    }

    insert(element, key) {
        if (typeof element === 'undefined') {
            throw new Error('No element provided');
        }
        this.heap.push({elt: element, key: key});
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) {
            throw new Error('Empty queue');
        }
        const elt = this.heap[0];
        const end = this.heap.pop();
        // replace the first element by the last,
        // and let it sink to its right place
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }
        return elt;
    }

    peek() {
        if (this.heap.length === 0) {
            throw new Error('Empty queue');
        }
        return this.heap[0];
    }

    updateKey(element, newKey) {
        const idx = this._findElementIndex(element);
        if (idx === -1) {
            throw new Error('The element is not in the this.heap');
        }
        const oldKey = this.heap[idx].key;
        this.heap[idx].key = newKey;
        if (newKey < oldKey) {
            this._bubbleUp(idx);
        } else {
            this._sinkDown(idx);
        }
    }
};

export default PriorityQueue;
