import test from 'ava';

import { Graph } from './graph';
import { depthFirstSearch } from './traversal';

test('traversal', (t) => {
  const g: Graph = new Graph();
  const v1 = g.createVertex('item', {
    n: 1,
  });
  const v2 = g.createVertex('item', {
    n: 2,
  });
  const v3 = g.createVertex('item', {
    n: 3,
  });
  const v4 = g.createVertex('animal', {
    n: 4,
  });
  const v5 = g.createVertex('animal', {
    n: 5,
  });
  g.createEdge(v1, v3);
  g.createEdge(v1, v4);
  g.createEdge(v2, v3);
  g.createEdge(v2, v4);
  g.createEdge(v3, v5);
  g.createEdge(v4, v5);
  g.createEdge(v5, v1);

  const traversalResult = g.traversal().V(v1).out().toArray();
  const nums = traversalResult.map((v) => v.props.get('n') as number);
  t.assert(JSON.stringify(nums), JSON.stringify([3, 4]));

  const traversalResult2 = g.traversal().V().hasLabel('animal').toArray();
  const nums2 = traversalResult2.map((v) => v.props.get('n') as number);
  t.assert(JSON.stringify(nums2), JSON.stringify([4, 5]));
});

test('depth first search', (t) => {
  const g: Graph = new Graph();
  const v1 = g.createVertex('human1', {
    n: 1,
  });
  const v2 = g.createVertex('human2', {
    n: 2,
  });
  const v3 = g.createVertex('human3', {
    n: 3,
  });
  const v4 = g.createVertex('human4', {
    n: 4,
  });
  const v5 = g.createVertex('human5', {
    n: 5,
  });
  g.createEdge(v1, v3);
  g.createEdge(v1, v4);
  g.createEdge(v2, v3);
  g.createEdge(v2, v4);
  g.createEdge(v3, v5);
  g.createEdge(v4, v5);
  g.createEdge(v5, v1);

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
