import { Graph, Vertex } from './graph';
import { depthFirstSearch } from './traversal';

export function decomposeSCC(graph: Graph): Vertex[][] {
  const visited: Set<string> = new Set();
  let selected: Vertex | null = null;
  let index = 1;
  while (visited.size !== graph.vertices.size) {
    for (const v of graph.vertices.values()) {
      if (!visited.has(v.id)) {
        selected = v;
        break;
      }
    }
    if (selected === null) {
      break;
    }
    const vertices = depthFirstSearch(selected);
    vertices.reverse().forEach((v) => {
      v.props.set('index', index++);
      visited.add(v.id);
    });
  }

  const components: Vertex[][] = [];
  const reverseGraphVisited: Set<string> = new Set();
  const reverseGraph = graph.reverse();
  while (reverseGraphVisited.size !== graph.vertices.size) {
    let maxNumber = 0;
    let maxIndexVertex: Vertex | null = null;
    for (const v of reverseGraph.vertices.values()) {
      if (!reverseGraphVisited.has(v.id)) {
        const n = v.props.get('index') as number;
        if (n > maxNumber) {
          maxNumber = n;
          maxIndexVertex = v;
        }
      }
    }
    const vertices = depthFirstSearch(maxIndexVertex, [], reverseGraphVisited);
    components.push(vertices);
    vertices.forEach((v) => {
      reverseGraphVisited.add(v.id);
    });
  }
  return components;
}