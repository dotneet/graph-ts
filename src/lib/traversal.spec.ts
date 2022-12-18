import test from 'ava';

import { Graph, Vertex } from './graph';
import { depthFirstSearch } from './traversal';

test('traversal', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('item', {
    n: 1,
  });
  const v2 = g.addVertex('item', {
    n: 2,
  });
  const v3 = g.addVertex('item', {
    n: 3,
  });
  const v4 = g.addVertex('animal', {
    n: 4,
  });
  const v5 = g.addVertex('animal', {
    n: 5,
  });
  const addEdge = (v1: Vertex, v2: Vertex) => g.addEdge('a', v1, v2);
  addEdge(v1, v3);
  addEdge(v1, v4);
  addEdge(v2, v3);
  addEdge(v2, v4);
  addEdge(v3, v5);
  addEdge(v4, v5);
  addEdge(v5, v1);

  const traversalResult = g.traversal().V(v1).out().toArray();
  const nums = traversalResult.map((v) => v.props.get('n') as number);
  t.assert(JSON.stringify(nums), JSON.stringify([3, 4]));

  const traversalResult2 = g.traversal().V().hasLabel('animal').toArray();
  const nums2 = traversalResult2.map((v) => v.props.get('n') as number);
  t.assert(JSON.stringify(nums2), JSON.stringify([4, 5]));

  // has
  t.is(g.V().has('n', 5).toArray().length, 1);

  // filter
  t.is(
    g
      .V()
      .filter((v) => v.props.get('n') >= 3)
      .toArray().length,
    3
  );

  // limit
  t.is(g.V().limit(2).toArray().length, 2);
});

test('depth first search', (t) => {
  const g: Graph = new Graph();
  const v1 = g.addVertex('human1', {
    n: 1,
  });
  const v2 = g.addVertex('human2', {
    n: 2,
  });
  const v3 = g.addVertex('human3', {
    n: 3,
  });
  const v4 = g.addVertex('human4', {
    n: 4,
  });
  const v5 = g.addVertex('human5', {
    n: 5,
  });
  const addEdge = (v1: Vertex, v2: Vertex) => g.addEdge('a', v1, v2);
  addEdge(v1, v3);
  addEdge(v1, v4);
  addEdge(v2, v3);
  addEdge(v2, v4);
  addEdge(v3, v5);
  addEdge(v4, v5);
  addEdge(v5, v1);

  const resultV1 = depthFirstSearch(v1);
  const resultNumsV1: number[] = resultV1.map(
    (v) => v.props.get('n') as number
  );
  const expectedV1 = [1, 3, 5, 4];
  t.is(JSON.stringify(resultNumsV1), JSON.stringify(expectedV1));

  const resultV2 = depthFirstSearch(v2);
  const resultNumsV2: number[] = resultV2.map(
    (v) => v.props.get('n') as number
  );
  const expectedV2 = [2, 3, 5, 1, 4];
  t.is(JSON.stringify(resultNumsV2), JSON.stringify(expectedV2));
});
