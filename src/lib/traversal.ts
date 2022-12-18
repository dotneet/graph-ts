import { Vertex } from './graph';

type TraversalContext = {
  result: Vertex[];
  visited: Set<string>;
};

export function createTraversalContext(): TraversalContext {
  return {
    result: [],
    visited: new Set(),
  };
}

export function depthFirstSearch(origin: Vertex): Vertex[] {
  const context = createTraversalContext();
  return depthFirstSearchWithContext(origin, context);
}
export function depthFirstSearchWithContext(
  origin: Vertex,
  context: TraversalContext
): Vertex[] {
  context.result.push(origin);
  context.visited.add(origin.id);
  origin.outVertices.forEach((v) => {
    if (!context.visited.has(v.id)) {
      depthFirstSearchWithContext(v, context);
    }
  });
  return context.result;
}
