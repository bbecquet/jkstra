"use strict";

var jKstra = {
  OUT: true,
  IN: false
};


jKstra.BFS = function(graph, opts) {
  var graph = graph;
  var options = jKstra.Util.extend({
      flagKey: '_bfs'
    },
    opts
  );
  var flagKey = options.flagKey;

  function clearFlags() {
    graph.forEachVertex(function(v) {
      delete v[flagKey];
    });
  }

  function mark(v) {
    v[flagKey] = true;
  }

  function isMarked(v) {
    return v[flagKey] === true;
  }

  var defaultTraversalOptions = {
    direction: jKstra.OUT,
    onVisit: function(u) { },
    onTestEdge: function(e) { },
    edgeFilter: null  // take all edges
  }

  return {
    /**
    Traverse the graph using the breadth first algorithm,
    starting from source, with the specified options
    */
    traverse: function(source, opts) {
      var options = jKstra.Util.extend(
        defaultTraversalOptions,
        opts
      );

      clearFlags();

      var queue = [];
      queue.push(source);
      mark(source, null);
      var u, v, edges;

      while(queue.length > 0) {
        u = queue.shift();
        options.onVisit(u);
        edges = graph.incidentEdges(u, options.direction, options.edgeFilter);
        edges.forEach(function(e) {
          options.onTestEdge(e);
          v = options.direction ? e.to : e.from;
          if(!isMarked(v)) {
            mark(v);
            queue.push(v);
          }
        });
      }
    }
  }
}


jKstra.Dijkstra = function(graph, opts) {
  var graph = graph;
  var options = jKstra.Util.extend({
      flagKey: '_dijkstra'
    },
    opts
  );
  var flagKey = options.flagKey;
  var SETTLED = 2;
  var REACHED = 1;

  function clearFlags() {
    graph.forEachVertex(function(v) {
      delete v[flagKey];
    });
  }

  function getFlags(v) {
    return v[flagKey] || {};
  }

  function setFlags(v, flags) {
    if(!v.hasOwnProperty(flagKey)) {
      v[flagKey] = {};
    }
    for(var key in flags) {
      v[flagKey][key] = flags[key];
    }
  }

  /**
  @param v {Vertex}
  @param incEge {Edge} the incoming edge
  @param cost {the cost }
  */
  function reach(v, incEdge, cost, action) {
    // update state to "reached", and register cost and incomingEdge
    setFlags(v, {state:REACHED, cost:cost, inc:incEdge});
    if(action) {
      action(v, incEdge, cost);
    }
  }

  function settle(v, action) {
    setFlags(v, {state:SETTLED});
    if(action) {
      action(v);
    }
  }

  function rebuildPath(end) {
    var edges = [];
    var edge;
    // going upward in the tree until the first vertex (with no incoming edge)
    while((edge = getFlags(end).inc) != null) {
      edges.push(edge);
      end = edge.from;
    }
    return edges.reverse();
  }

  var defaultTraversalOptions = {
    shouldUpdateKey: function(prevCost, newCost) {
      return newCost < prevCost;
    },
    edgeCost: function(e, costDone) {
      return 1;
    },
    isFinished: function(direction) {
      return false;
    },
    onReach: null,    // nothing special to do when reaching a node
    onSettle: null,   // nothing special to do when setting a node
    edgeFilter: null  // take all edges
  }

  return {
    /**
    The most common use of Dijkstra traversal
    */
    shortestPath: function(source, target, opts) {
      function isTargetFound() {
        return getFlags(target).state == SETTLED;
      }

      var options = opts || {};
      options.isFinished = isTargetFound;

      var found = this.traverse(source, options);
      if(found) {
        return rebuildPath(target);
      }
      return null;
    },

    /**
    Traverse the graph using Dijkstra's algorithm,
    starting from source, with the specified options
    */
    traverse: function(source, opts) {
      var options = jKstra.Util.extend(
        defaultTraversalOptions,
        opts
      );

      // reset node tagging
      clearFlags();

      var kv;
      var u, v;
      var e;
      var totalCost, eCost;
      var vFlags;

      var Q = new jKstra.PriorityQueue();
      Q.insert(source, 0);
      reach(source, null, 0, options.onReach);

      while(!options.isFinished(true) && Q.count() > 0) {
        kv = Q.pop();
        u = kv.elt;
        totalCost = kv.key;
        settle(u, options.onSettle);

        var edges = graph.outEdges(u, options.edgeFilter);
        for(var i=0; i < edges.length; i++) {
          e = edges[i];
          v = e.to;
          eCost = totalCost + options.edgeCost(e, totalCost);
          vFlags = getFlags(v);

          if(vFlags.state != SETTLED) {
            if(vFlags.state != REACHED) {
              Q.insert(v, eCost);
              reach(v, e, eCost, options.onReach);
            }
            else if (options.shouldUpdateKey(vFlags.cost, eCost, vFlags.inc, e)) {
            // else if (eCost < vFlags.cost) { // if already reached but new cost is less than current
              Q.updateKey(v, eCost);
              reach(v, e, eCost, options.onReach);
            }
          }
        }
      }

      // if false, means the whole graph was traversed
      return options.isFinished(true);
    }
  }
}


jKstra.Graph = function (opts) {
  var vertices = [];
  var edges = [];

  return {
    addVertex: function(data) {
      var vertex = {
        _in: [],
        _out: [],
        data: data
      }
      vertices.push(vertex);
      return vertex;
    },

    addEdge: function(from, to, data) {
      var edge = {
        from: from,
        to: to,
        data: data || {}
      }
      from._out.push(edge);
      to._in.push(edge);
      edges.push(edge);
      return edge;
    },

    /**
    Shortcut to add an edge and its reverse,
    sharing the same data.
    */
    addEdgePair: function(a, b, data) {
      return [
        this.addEdge(a, b, data),
        this.addEdge(b, a, data)
      ];
    },

    removeEdge: function(edge) {
      var index = edges.indexOf(edge);
      if(index != -1) {
        // remove from extremity vertices first
        // TODO PERF: replace splice with a function operating in-place
        edge.from._out.splice(edge.from._out.indexOf(edge), 1);
        edge.to._in.splice(edge.to._in.indexOf(edge), 1);
        edges.splice(index, 1);
      }
    },

    removeVertex: function(vertex) {
      var index = vertices.indexOf(vertex);
      if(index != -1) {
        // remove all incident edges first
        var edgesToRemove = vertex._in.concat(vertex._out);
        for(var i = 0; i < edgesToRemove.length; i++) {
          this.removeEdge(edgesToRemove[i]);
        }
        vertices.splice(index, 1);
      }
    },

    outEdges: function(vertex, filter) {
      return this.incidentEdges(vertex, true, filter);
    },

    inEdges: function(vertex, filter) {
      return this.incidentEdges(vertex, false, filter);
    },

    /**
    Returns all edges incident to a vertex, in one direction (outgoing or incoming),
    optionnaly filtered by a given function.
    */
    incidentEdges: function(vertex, direction, filter) {
      if(typeof filter == 'undefined' || filter == null) {
        return direction ? vertex._out : vertex._in;
      }
      var edges = direction ? vertex._out : vertex._in;
      return edges.filter(filter);
    },

    vertex: function(props) {
      var v = null;
      for(var i = 0, l = vertices.length; i < l && v == null; i++) {
        if(jKstra.Util.propsMatch(vertices[i].data, props)) {
          v = vertices[i];
        }
      }
      return v;
    },

    edge: function(props) {
      var e = null;
      for(var i = 0, l = edges.length; i < l && e == null; i++) {
        if(jKstra.Util.propsMatch(edges[i].data, props)) {
          e = edges[i];
        }
      }
      return e;
    },

    /**
    Perform an action on each vertex of the graph
    */
    forEachVertex: function(action) {
      for(var i=0, l=vertices.length; i<l; i++) {
        action(vertices[i]);
      }
    },

    /**
    Perform an action on each edge of the graph
    */
    forEachEdge: function(action) {
      for(var i=0, l=edges.length; i<l; i++) {
        action(edges[i]);
      }
    }
  }
}


/**
Binary heap implementation of a priority queue
with an updateKey method.
*/
jKstra.PriorityQueue = function(opts) {
  var heap = [];

  function compare(a, b) {
    return a.key - b.key;
  }

  function bubbleUp(idx) {
    var element = heap[idx],
        parentIdx,
        parent;
    while (idx > 0) {
      // Compute the parent element's index, and fetch it.
      parentIdx = Math.floor((idx + 1) / 2) - 1,
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
    var length = heap.length,
        element = heap[idx],
        swapIdx;

    while(true) {
      var rChildIdx = (idx + 1) * 2,
          lChildIdx = rChildIdx - 1;
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
          if ((swapIdx == -1 || compare(rChild, lChild) < 0) &&
              compare(rChild, element) < 0)
            swapIdx = rChildIdx;
        }
      }

      // if no swap occurs, the element found its right place
      if (swapIdx == -1) {
        break;
      }

      // otherwise, swap and continue on next tree level
      heap[idx] = heap[swapIdx];
      heap[swapIdx] = element;
      idx = swapIdx;
    }
  }

  function findElementIndex(elt) {
    var idx = -1;
    for(var i=0, l=heap.length; i<l; i++) {
      if(heap[i].elt == elt) {
         idx = i;
         break;
      }
    }
    return idx;
  }

  return {
    count: function() {
      return heap.length;
    },

    insert: function(element, key) {
      if (typeof element === 'undefined') {
        throw new Error('No element provided');
      }
      heap.push({elt:element, key:key});
      bubbleUp(heap.length - 1);
    },

    pop: function() {
      if(heap.length == 0) {
        throw new Error('Empty queue');
      }
      var elt = heap[0],
          end = heap.pop();
      // replace the first element by the last,
      // and let it sink to its right place
      if (heap.length > 0) {
        heap[0] = end;
        sinkDown(0);
      }
      return elt;
    },

    peek: function() {
      if(heap.length == 0) {
        throw new Error('Empty queue');
      }
      return heap[0];
    },

    updateKey: function(element, newKey) {
      var idx = findElementIndex(element);
      if(idx == -1) {
        throw new Error('The element is not in the heap');
      }
      var oldKey = heap[idx].key;
      heap[idx].key = newKey;
      if(newKey < oldKey) {
        bubbleUp(idx);
      } else {
        sinkDown(idx);
      }
    }
  }
}


jKstra.Util = {
  // taken as-is from Leaflet
  extend: function (dest) { // (Object[, Object, ...]) ->
    var sources = Array.prototype.slice.call(arguments, 1),
        i, j, len, src;

    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j] || {};
      for (i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  },

  isScalar: function(o) {
    return (/boolean|number|string/).test(typeof o);
  },

  propsMatch: function(set, subSet) {
    if(subSet == null) {
      return set == null;
    }

    if(jKstra.Util.isScalar(set)) {
      return jKstra.Util.isScalar(subSet) && set === subSet;
    }

    var match = true;
    for(var p in subSet) {
      if(set.hasOwnProperty(p)) {
        if(!jKstra.Util.propsMatch(set[p], subSet[p]))
          return false;
      } else
        return false;
    }
    return match;
  }
}
