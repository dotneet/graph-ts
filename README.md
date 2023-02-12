# @devneko/graph-ts

in-memory graph database written in typescript.

## Features

- Basic graph structure inspired by Gremlin.
- Gremlin like graph traversal.
- Topological Sort
- Decomposition of SCC
- Depth First Search

## Example

```ts
import { Graph } from '@devneko/graph-ts'

// create a graph instance
const g: Graph = new Graph();

// add a vertex labeled 'people' to the graph g.
// a label represents what the vertex is.
// second parameter is attributes of a vertex. 
const v1 = g.addVertex('people', {
  name: 'Bob',
});
const v2 = g.addVertex('people', {
  name: 'Alice',
});
// add a vertex labeled 'item' to the graph g.
const v3 = g.addVertex('item', {
  name: 'Pencil',
});

// create an edge labeled 'knows' that connect v1 to v2.
// a label represents relationships between vertices.
g.addEdge('knows', v1, v2);
// create an edge labeled 'has' that connect v1 to v3.
g.addEdge('has', v1, v3);

// returns vertices that have 'people' label.
g.V().hasLabel('people').toArray();
// returns the item that Bob has.
g.V(v1).out('has').toArray();
```
