
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