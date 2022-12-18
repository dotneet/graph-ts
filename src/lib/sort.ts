import { Edge, Graph, Vertex } from './graph';

export type TSortResult = {
  result: Vertex[];
  restEdges: Edge[];
};

// Topological Sort
export function tsort(graph: Graph): TSortResult {
  const g = graph.clone();
  const result: Vertex[] = [];
  const s: Vertex[] = [];
  g.vertices.forEach((v) => {
    if (v.inEdges.size === 0) {
      s.push(v);
    }
  });
  while (s.length !== 0) {
    const n = s.shift();
    result.push(n);
    for (const e of n.outEdges) {
      const m = e.inVertex;
      g.deleteEdge(e);
      if (m.inEdges.size === 0) {
        s.push(m);
      }
    }
  }
  return {
    result,
    restEdges: Array.from(g.edges.values()),
  };
}
