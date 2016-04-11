API
===

`jKstra.Graph`
---

#### `addVertex([data]) => vertex`
Adds a new vertex to the graph, containing the given data. Returns the vertex object.

#### `addEdge(fromVertex, toVertex, [data]) => edge`
Adds a directed edge between two vertices, and containing the given data. Returns the edge object.

#### `addEdgePair(vertexA, vertexB, [data]) => [edge1, edge2]`
Adds two edges, one for each direction, between two vertices, sharing the same data. Returns an array of the two edge objects.

#### `removeEdge(edge)`
Removes the specified edge, from the graph.

#### `removeVertex(vertex)`
Removes the specified vertex, and all its incident edges (out and in), from the graph.

#### `forEachVertex(function(v))`
Applies a function on each vertex of the graph.

#### `forEachEdge(function(e))`
Applies a function on each edge of the graph.

#### `vertex(props) => vertex`
Returns the first vertex found in the graph with data matching the given props, or null if not found.

#### `edge(props) => edge`
Returns the first edge found in the graph with data matching the given props, or null if not found.

#### `outEdges(vertex, [function(e)]) => Array of edge`
Returns all edges having the given vertex as start, optionally applying a filtering function.

#### `inEdges(vertex, [function(e)]) => Array of edge`
Returns all edges having the given vertex as end, optionally applying a filtering function.
