import test from 'ava';

import { Edge, Graph, Vertex } from './graph';
import { decomposeSCC } from './scc';

test('scc', (t) => {
  const graph: Graph = new Graph();
  const createV = (name: string): Vertex => {
    return graph.addVertex(name);
  };
  const createEdge = (v1: Vertex, v2: Vertex): Edge => {
    return graph.addEdge('connect', v1, v2);
  };
  const a = createV('a');
  const b = createV('b');
  const c = createV('c');
  const d = createV('d');
  const e = createV('e');
  const f = createV('f');
  const g = createV('g');
  createEdge(a, b);
  createEdge(b, c);
  createEdge(c, a);
  createEdge(a, d);
  createEdge(d, e);
  createEdge(e, f);
  createEdge(f, d);
  createEdge(f, g);

  const result = decomposeSCC(graph);
  const scc1 = result[0].map((v) => v.label).sort();
  const scc2 = result[1].map((v) => v.label).sort();
  const scc3 = result[2].map((v) => v.label).sort();
  t.is(JSON.stringify(scc1), JSON.stringify(['a', 'b', 'c']));
  t.is(JSON.stringify(scc2), JSON.stringify(['d', 'e', 'f']));
  t.is(JSON.stringify(scc3), JSON.stringify(['g']));
});
