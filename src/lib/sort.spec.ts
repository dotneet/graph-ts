import test from 'ava';

import { Graph, Vertex } from './graph';
import { tsort } from './sort';

test('tsort non cyclic', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('human1', {
    name: 'Task1',
  });
  const v2 = g.addVertex('human2', {
    name: 'Task2',
  });
  const v3 = g.addVertex('human3', {
    name: 'Task3',
  });
  const v4 = g.addVertex('human4', {
    name: 'Task4',
  });
  const v5 = g.addVertex('human5', {
    name: 'Task5',
  });
  const addEdge = (from: Vertex, to: Vertex) => g.addEdge('a', from, to);
  addEdge(v1, v3);
  addEdge(v1, v4);
  addEdge(v2, v3);
  addEdge(v2, v4);
  addEdge(v3, v5);
  addEdge(v4, v5);
  const result = tsort(g);
  t.is(result.result.length, 5);
  t.is(result.restEdges.length, 0);
});

test('tsort cyclic', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('human1', {
    name: 'Task1',
  });
  const v2 = g.addVertex('human2', {
    name: 'Task2',
  });
  const v3 = g.addVertex('human3', {
    name: 'Task3',
  });
  const v4 = g.addVertex('human4', {
    name: 'Task4',
  });
  const v5 = g.addVertex('human5', {
    name: 'Task5',
  });
  const addEdge = (from: Vertex, to: Vertex) => g.addEdge('a', from, to);
  addEdge(v1, v3);
  addEdge(v1, v4);
  addEdge(v2, v3);
  addEdge(v2, v4);
  addEdge(v3, v5);
  addEdge(v4, v5);
  addEdge(v5, v1);
  const result = tsort(g);
  t.assert(result.result.length < 5);
  t.assert(result.restEdges.length > 0);
});
