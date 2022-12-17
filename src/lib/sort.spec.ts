import test from "ava";

import { Graph } from "./graph";
import { tsort } from "./sort";

test("tsort non cyclic", (t) => {
  const g: Graph = new Graph();
  const v1 = g.createVertex("human1", {
    name: "Task1",
  });
  const v2 = g.createVertex("human2", {
    name: "Task2",
  });
  const v3 = g.createVertex("human3", {
    name: "Task3",
  });
  const v4 = g.createVertex("human4", {
    name: "Task4",
  });
  const v5 = g.createVertex("human5", {
    name: "Task5",
  });
  g.createEdge(v1, v3);
  g.createEdge(v1, v4);
  g.createEdge(v2, v3);
  g.createEdge(v2, v4);
  g.createEdge(v3, v5);
  g.createEdge(v4, v5);
  const result = tsort(g);
  t.is(result.result.length, 5);
  t.is(result.restEdges.length, 0);
});

test("tsort cyclic", (t) => {
  const g: Graph = new Graph();
  const v1 = g.createVertex("human1", {
    name: "Task1",
  });
  const v2 = g.createVertex("human2", {
    name: "Task2",
  });
  const v3 = g.createVertex("human3", {
    name: "Task3",
  });
  const v4 = g.createVertex("human4", {
    name: "Task4",
  });
  const v5 = g.createVertex("human5", {
    name: "Task5",
  });
  g.createEdge(v1, v3);
  g.createEdge(v1, v4);
  g.createEdge(v2, v3);
  g.createEdge(v2, v4);
  g.createEdge(v3, v5);
  g.createEdge(v4, v5);
  g.createEdge(v5, v1);
  const result = tsort(g);
  t.assert(result.result.length < 5);
  t.assert(result.restEdges.length > 0);
});
