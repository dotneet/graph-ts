import { Graph, Vertex } from './graph';

export type TraversalCommandV = {
  type: 'TraversalCommandV';
  vertex?: Vertex;
};
export type TraversalCommandHasLabel = {
  type: 'TraversalCommandHasLabel';
  label: string;
};
export type TraversalCommandOut = {
  type: 'TraversalCommandOut';
};
export type TraversalCommand =
  | TraversalCommandV
  | TraversalCommandHasLabel
  | TraversalCommandOut;

export class Traversal {
  constructor(
    private _graph: Graph,
    private _commands: TraversalCommand[] = []
  ) {}
  V(vertex?: Vertex): Traversal {
    this._commands.push({ type: 'TraversalCommandV', vertex });
    return this;
  }
  hasLabel(label: string): Traversal {
    this._commands.push({ type: 'TraversalCommandHasLabel', label });
    return this;
  }
  out(): Traversal {
    this._commands.push({ type: 'TraversalCommandOut' });
    return this;
  }
  toArray(): Vertex[] {
    let result: Vertex[] = [];
    const commands = Array.from(this._commands);
    while (commands.length !== 0) {
      const cmd = commands.shift();
      switch (cmd.type) {
        case 'TraversalCommandV':
          if (cmd.vertex) {
            result = [cmd.vertex];
          } else {
            result = Array.from(this._graph.vertices.values());
          }
          break;
        case 'TraversalCommandHasLabel':
          result = result.filter((v) => v.label === cmd.label);
          break;
        case 'TraversalCommandOut': {
          const set: Set<Vertex> = new Set();
          result.map((v) => {
            v.outVertices.forEach((v) => set.add(v));
          });
          result = Array.from(set);
          break;
        }
      }
    }
    return result;
  }
}

type SearchContext = {
  result: Vertex[];
  visited: Set<string>;
};

export function createSearchContext(): SearchContext {
  return {
    result: [],
    visited: new Set(),
  };
}

export function depthFirstSearch(origin: Vertex): Vertex[] {
  const context = createSearchContext();
  return depthFirstSearchWithContext(origin, context);
}
export function depthFirstSearchWithContext(
  origin: Vertex,
  context: SearchContext
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
