API
===

`jKstra.Graph`
---

Represents a weighted directed graph.

```javascript
let graph = new jKstra.Graph();
```

Method | Returns | Description
---|---|---
`addVertex([data])`| `Vertex` | Adds a new vertex (node) to the graph, containing the given data.
`addEdge(fromVertex, toVertex, [data])` | `Edge` | Adds a directed edge between two vertices, and containing the given data.
`addEdgePair(vertexA, vertexB, [data])` | `Array<Edge>` | Adds two edges, one for each direction, between two vertices, sharing the same data. Returns an array of the two edge objects.
`removeEdge(Edge)` | - | Removes the specified edge from the graph.
`removeVertex(Vertex)` | - | Removes the specified vertex, and all its incident edges (out and in), from the graph.
`forEachVertex(function(v))` | - | Applies a function on each vertex of the graph.
`forEachEdge(function(e))` | - | Applies a function on each edge of the graph.
`vertex(props)` | `Vertex` | Returns the first vertex found in the graph with data matching the given props, or `null` if not found.
`edge(props)` | `Edge` | Returns the first edge found in the graph with data matching the given props, or `null` if not found.
`outEdges(vertex, [function(e)])` | `Array<Edge>` | Returns all edges having the given vertex as start, optionally applying a filtering function.
`inEdges(vertex, [function(e)])` | `Array<Edge>` | Returns all edges having the given vertex as end, optionally applying a filtering function.
