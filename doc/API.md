API
===

`Graph`
---

Represents a weighted directed graph. Manipulates graph **vertices** (aka. nodes) & **edges** as anonymous objects created through the `addVertex` & `addEdge` methods, respectively. Any kind of data can be assigned to vertices and edges through the `data` attribute of these methods. It is then accessible on the `data` property of this object.

`Edge` objects have a `from` and `to` properties, which points to their extremity vertices.

Access to edges from `Vertex` objects is done through the `incident/out/inEdges` methods.

```javascript
const graph = new jKstra.Graph();

const v1 = graph.addVertex(1);
const v2 = graph.addVertex({id: 2, text: 'Second vertex'});
const e = graph.addEdge(v1, v2, {travelCost: 12, type: 'Road'});

console.log(v1.data);           // => 1
console.log(v2.data.text);      // => 'Second vertex'
console.log(e.data.travelCost); // => 12
console.log(e.from === v1);     // => true
console.log(e.to === v2);       // => true
```

### Properties

Property | Type | Description
---|---|---
vertexCount | `Integer` | Number of vertices in the graph.
edgeCount | `Integer` | Number of directed edges in the graph.

### Methods

Method | Returns | Description
---|---|---
`addVertex([data])`| `Vertex` | Adds a new vertex to the graph, containing the given data.
`addEdge(fromVertex, toVertex, [data])` | `Edge` | Adds a directed edge between two vertices, and containing the given data.
`addEdgePair(vertexA, vertexB, [data])` | `Array<Edge>` | Adds two edges, one for each direction, between two vertices, sharing the same data. Returns an array of the two edge objects.
`vertex(props)` | `Vertex` | Returns the first vertex found in the graph with data matching the given props, or `null` if not found.
`edge(props)` | `Edge` | Returns the first edge found in the graph with data matching the given props, or `null` if not found.
`incidentEdges(vertex, direction, [filter(e)])` | `Array<Edge>` | Returns all edges having the given vertex as start (for `direction === OUT`) or end (`direction === IN`), optionally applying a filtering function.
`outEdges(vertex, [filter(e)])` | `Array<Edge>` | Shortcut for `incidentEdges(vertex, OUT, [filter(e)])`.
`inEdges(vertex, [filter(e)])` | `Array<Edge>` | Shortcut for `incidentEdges(vertex, IN, [filter(e)])`.
`removeEdge(Edge)` | - | Removes the specified edge from the graph.
`removeVertex(Vertex)` | - | Removes the specified vertex, and all its incident edges (out and in), from the graph.
`forEachVertex(action(v))` | - | Applies a function on each vertex of the graph.
`forEachEdge(action(e))` | - | Applies a function on each edge of the graph.

`Direction`
---

Constants used in contexts where it's needed to qualify the direction of travel on the edges.

Constant | Description
---|---
`jkStra.OUT` | represents the direction of edges going out of their origin vertices, i.e. a forward graph traversal.
`jkStra.IN` | represents the direction of edges arriving at their end vertices, i.e. a backward graph traversal.


`algos.Dijkstra`
---

A shortest path finder using the [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra's_algorithm). Can also performs [A* algorithm searches](https://en.wikipedia.org/wiki/A*_search_algorithm), if provided with an heuristic function.

### Constructor
```js
new jKstra.algos.Dijkstra(Graph graph);
```

### Methods

Method | Returns | Description
---|---|---
`shortestPath(Vertex source, Vertex target, DijkstraOptions options)` | `Array<Edge>` | Returns the ordered list of edges that form the shortest path between `source` and `target` vertices, or `null` if no path has been found.


`algos.BidirectionalDijkstra`
---

A shortest path finder using a bidirectional Dijkstra's search, which runs both ways from source and target vertices to reduce the search space.

### Constructor
```js
new jKstra.algos.BidirectionalDijkstra(Graph graph);
```

### Methods

Method | Returns | Description
---|---|---
`shortestPath(Vertex source, Vertex target, DijkstraOptions options)` | `Array<Edge>` | Returns the ordered list of edges that form the shortest path between `source` and `target` vertices, or `null` if no path has been found. The `options` object can have `OUT` and `IN` properties which are also `DijkstraOptions` and will overload any global option for the concerned direction. It's useful to apply different heuristics or cost functions to the forward and backward searches.


`algos.DijkstraIterator`
---

A low-level iterator which traverses a graph from a source vertex, and returns nodes in the order of the Dijkstra's algorithm.
Used internally by `Dijkstra` & `BidirectionalDijkstra`.

### Constructor
```js
new jKstra.algos.DijkstraIterator(Graph graph, Vertex source, DijkstraOptions options);
```

### Methods

Method | Returns | Description
---|---|---
`next()` | `{value: Vertex, done: Boolean}` | Conforms to the [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator). Returns an object with the next vertex added to the shortest path tree as `value`, or a `done: true` field if no more vertices are available.


`DijkstraOptions`
---

Anonymous object shape taken as option by all Dijkstra type graph traversal methods.

Option | Default | Description
---|---|---
`direction` | `Direction.OUT` | Direction of travel on the graph.
`edgeCost` | `(Edge, [costDone]) => 1` | **The edge cost function**. Can take the reaching cost of the previous node as an option.
`heuristic` | `Vertex => 0` | An heuristic function to estimate the remaining travel cost from a node. If returns a non-zero value, effectively transforms the graph traversal to a A* algorithm.
`onReach` | `Vertex => {}` | Function to apply to a vertex when it is added to the priority queue.
`onSettle` | `Vertex => {}` | Function to apply to a vertex when it is removed from the priority queue, and added to shortest path tree.
`edgeFilter` | `Edge => true` | Filter to . By default all edges are considered.
