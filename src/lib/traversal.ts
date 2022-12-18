import { Vertex } from './graph';

export function depthFirstSearch(
  origin: Vertex,
  result: Vertex[] = [],
  visited: Set<string> = new Set()
): Vertex[] {
  result.push(origin);
  visited.add(origin.id);
  origin.outVertices.forEach((v) => {
    if (!visited.has(v.id)) {
      depthFirstSearch(v, result, visited);
    }
  });
  return result;
}
