# graph-ts

in-memory graph database written in typescript.

## Features

- Basic graph structure inspired by Gremlin.
- Gremlin like graph traversal.
- Topological Sort
- Decomposition of SCC

## Example

```ts
const g: Graph = new Graph();
const v1 = g.addVertex('people', {
  name: 'Bob',
});
const v2 = g.addVertex('people', {
  name: 'Alice',
});
const v3 = g.addVertex('item', {
  name: 'Pencil',
});
g.addEdge('knows', v1, v2);
g.addEdge('has', v1, v3);

// returns vertices that have 'people' label.
g.V().hasLabel('people').toArray();
// returns the item that Bob has.
g.V(v1).out('has').toArray();
```
