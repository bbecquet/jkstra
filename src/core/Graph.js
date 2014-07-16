
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