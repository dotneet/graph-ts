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
const v1 = g.createVertex('people', {
  name: 'Bob',
});
const v2 = g.createVertex('people', {
  name: 'Alice',
});
const v3 = g.createVertex('item', {
  name: 'Pencil',
});
g.createEdge(v1, v2);
g.createEdge(v1, v3);

// returns vertices that have 'people' label.
g.traversal().V().hasLabel('people').toArray();
```
