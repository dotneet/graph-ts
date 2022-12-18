import test from 'ava';

import { Graph } from './graph';

test('graph', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('human', {
    name: 'Bob',
  });
  const v2 = g.addVertex('human', {
    name: 'Alice',
  });
  const edge = g.addEdge('know', v1, v2);
  t.is(edge.outVertex.id, v1.id);
  t.is(edge.inVertex.id, v2.id);
  t.is(v1.props.get('name'), 'Bob');
  t.is(v2.props.get('name'), 'Alice');
  t.is(g.vertices.size, 2);

  t.is(v1.outE().length, 1);
  t.is(v1.out().length, 1);

  t.is(v2.inE().length, 1);
  t.is(v2.in().length, 1);

  t.is(g.edges.size, 1);
  g.deleteEdge(edge);
  t.is(g.edges.size, 0);

  t.is(g.vertices.size, 2);
  g.deleteVertex(v1);
  g.deleteVertex(v2);
  t.is(g.vertices.size, 0);
});

test('vertex in/out', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('people', {
    name: 'Bob',
  });
  const v2 = g.addVertex('people', {
    name: 'Alice',
  });
  const v3 = g.addVertex('item', {
    name: 'Tablet',
  });
  const v4 = g.addVertex('item', {
    name: 'Pencil',
  });
  g.addEdge('knows', v1, v2);
  g.addEdge('has', v1, v3);
  g.addEdge('has', v2, v4);

  t.is(v1.out('knows')[0].props.get('name'), 'Alice');
  t.is(v1.out('has')[0].props.get('name'), 'Tablet');
  t.is(v2.out('has')[0].props.get('name'), 'Pencil');
  t.is(v2.in('knows')[0].props.get('name'), 'Bob');
  const items = g.V().hasLabel('item').toArray();
  t.is(items.length, 2);
  const itemNames = items.map((item) => item.props.get('name')).sort();
  t.is(JSON.stringify(itemNames), JSON.stringify(['Pencil', 'Tablet']));
});

test('reverse graph', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('human', {
    name: 'Bob',
  });
  const v2 = g.addVertex('human', {
    name: 'Alice',
  });
  const e = g.addEdge('known', v1, v2);

  const rg = g.reverse();
  const reversedEdge = rg.edges.get(e.id);
  t.is(reversedEdge.inVertex.id, e.outVertex.id);
  t.is(reversedEdge.outVertex.id, e.inVertex.id);
});
