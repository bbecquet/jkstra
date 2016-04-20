API
===

`Graph`
---

Represents a weighted directed graph. Manipulates graph **vertices** (aka. nodes) & **edges** as anonymous objects created through the `addVertex` & `addEdge` methods, respectively. Any kind of data can be assigned to vertices and edges through the `data` attribute of these methods. It is then accessible on the `data` property of this object.

`Edge` objets have a `from` and `to` properties, which points to their extremity vertices.

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

Property | Type | Description
---|---|---
vertexCount | `Integer` | Number of vertices in the graph.
edgeCount | `Integer` | Number of directed edges in the graph.

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

`core.PriorityQueue`
---

A generic, updatable priority queue, based on a binary heap implementation.

Property | Type | Description
---|---|---
count | `Integer` | Number of items stored in the queue.

Method | Returns | Description
---|---|---
`insert(element, key)`| `Vertex` | Adds an item to the queue, with a key used as sorting value.
`pop()` | `{elt, key}` | Removes and returns the first item of the queue, with its associated key.
`peek()` | `{elt, key}` | Reads the first item of the queue, with its associated key, without removing it.
`updateKey(element, newKey)` | - | Updates the key associated with an element.
