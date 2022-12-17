import test from "ava";

import { Graph } from "./graph";

test("graph", (t) => {
  const g: Graph = new Graph();
  const v1 = g.createVertex("human", {
    name: "Bob",
  });
  const v2 = g.createVertex("human", {
    name: "Alice",
  });
  const edge = g.createEdge(v1, v2);
  t.is(edge.inVertex.id, v1.id);
  t.is(edge.outVertex.id, v2.id);
  t.is(v1.props.get("name"), "Bob");
  t.is(v2.props.get("name"), "Alice");
  t.is(g.vertices.size, 2);

  t.is(v1.outEdges.size, 1);
  t.is(v1.outVertices().size, 1);

  t.is(v2.inEdges.size, 1);
  t.is(v2.inVertices().size, 1);

  t.is(g.edges.size, 1);
  g.deleteEdge(edge);
  t.is(g.edges.size, 0);

  t.is(g.vertices.size, 2);
  g.deleteVertex(v1);
  g.deleteVertex(v2);
  t.is(g.vertices.size, 0);
});
