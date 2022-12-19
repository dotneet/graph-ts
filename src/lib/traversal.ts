import { Edge, Graph, PropsValue, Vertex } from './graph';

export type TraversalCommandV = {
  type: 'TraversalCommandV';
  vertex?: Vertex;
};
export type TraversalCommandFilter = {
  type: 'TraversalCommandFilter';
  pred: (v: Vertex) => boolean;
};
export type TraversalCommandLimit = {
  type: 'TraversalCommandLimit';
  limit: number;
};
export type TraversalCommandHas = {
  type: 'TraversalCommandHas';
  name: string;
  value: PropsValue;
};
export type TraversalCommandHasLabel = {
  type: 'TraversalCommandHasLabel';
  label: string;
};
export type TraversalCommandOut = {
  type: 'TraversalCommandOut';
  edgeLabel?: string;
};
export type TraversalCommandIn = {
  type: 'TraversalCommandIn';
  edgeLabel?: string;
};
export type TraversalCommandOutE = {
  type: 'TraversalCommandOutE';
  edgeLabel?: string;
};
export type TraversalCommandInE = {
  type: 'TraversalCommandInE';
  edgeLabel?: string;
};

export type EdgeTraversalCommandFilter = {
  type: 'EdgeTraversalCommandFilter';
  pred: (e: Edge) => boolean;
};
export type EdgeTraversalCommandLimit = {
  type: 'EdgeTraversalCommandLimit';
  limit: number;
};
export type EdgeTraversalCommandHas = {
  type: 'EdgeTraversalCommandHas';
  name: string;
  value: PropsValue;
};
export type EdgeTraversalCommandHasLabel = {
  type: 'EdgeTraversalCommandHasLabel';
  label: string;
};
export type EdgeTraversalCommandInV = {
  type: 'EdgeTraversalCommandInV';
};
export type EdgeTraversalCommandOutV = {
  type: 'EdgeTraversalCommandOutV';
};
export type TraversalCommand =
  | TraversalCommandV
  | TraversalCommandFilter
  | TraversalCommandLimit
  | TraversalCommandHas
  | TraversalCommandHasLabel
  | TraversalCommandOut
  | TraversalCommandIn
  | TraversalCommandOutE
  | TraversalCommandInE
  | EdgeTraversalCommandFilter
  | EdgeTraversalCommandLimit
  | EdgeTraversalCommandHas
  | EdgeTraversalCommandHasLabel
  | EdgeTraversalCommandOutV
  | EdgeTraversalCommandInV;

type NextCommandKind = 'vertex' | 'edge';
const NextCommandKindVertex: NextCommandKind = 'vertex';
const NextCommandKindEdge: NextCommandKind = 'edge';
type TraversalCommandProcessResult = {
  result: Vertex[] | Edge[];
  nextCommandKind: NextCommandKind;
};
function vertexResult(result: Vertex[]): TraversalCommandProcessResult {
  return {
    result,
    nextCommandKind: NextCommandKindVertex,
  };
}
function edgeResult(result: Edge[]): TraversalCommandProcessResult {
  return {
    result,
    nextCommandKind: NextCommandKindEdge,
  };
}

export class TraversalCommandProcessor {
  constructor(private _graph: Graph) {}

  process(traversalCommands: TraversalCommand[]): Vertex[] | Edge[] {
    const commands = Array.from(traversalCommands);
    let lastProcessResult: TraversalCommandProcessResult = vertexResult([]);
    while (commands.length !== 0) {
      const command = commands.shift();
      switch (lastProcessResult.nextCommandKind) {
        case NextCommandKindVertex: {
          lastProcessResult = this._processVertexCommand(
            command,
            lastProcessResult.result as Vertex[]
          );
          break;
        }
        case NextCommandKindEdge: {
          lastProcessResult = this._processEdgeCommand(
            command,
            lastProcessResult.result as Edge[]
          );
          break;
        }
      }
    }
    return lastProcessResult.result as Vertex[];
  }

  private _processVertexCommand(
    cmd: TraversalCommand,
    result: Vertex[] = []
  ): TraversalCommandProcessResult {
    switch (cmd.type) {
      case 'TraversalCommandV':
        if (cmd.vertex) {
          result = [cmd.vertex];
        } else {
          result = Array.from(this._graph.vertices.values());
        }
        return vertexResult(result);
      case 'TraversalCommandLimit':
        result = result.splice(0, cmd.limit);
        return { result, nextCommandKind: NextCommandKindVertex };
      case 'TraversalCommandFilter':
        result = result.filter((v) => {
          return cmd.pred(v);
        });
        return vertexResult(result);
      case 'TraversalCommandHas':
        result = result.filter((v) => {
          const value = v.props.get(cmd.name);
          return value !== undefined && value === cmd.value;
        });
        return vertexResult(result);
      case 'TraversalCommandHasLabel':
        result = result.filter((v) => v.label === cmd.label);
        return vertexResult(result);
      case 'TraversalCommandOut': {
        const set: Set<Vertex> = new Set();
        result.map((v) => {
          v.out(cmd.edgeLabel).forEach((v) => set.add(v));
        });
        result = Array.from(set);
        return vertexResult(result);
      }
      case 'TraversalCommandIn': {
        const set: Set<Vertex> = new Set();
        result.map((v) => {
          v.in(cmd.edgeLabel).forEach((v) => set.add(v));
        });
        result = Array.from(set);
        return vertexResult(result);
      }
      case 'TraversalCommandOutE': {
        const edges: Edge[] = [];
        result.forEach((v: Vertex) => {
          v.outE().forEach((e: Edge) => {
            edges.push(e);
          });
        });
        return edgeResult(edges);
      }
      case 'TraversalCommandInE': {
        const edges: Edge[] = [];
        result.forEach((v: Vertex) => {
          v.inE().forEach((e: Edge) => {
            edges.push(e);
          });
        });
        return edgeResult(edges);
      }
      default:
        throw new Error(`Unknown command: ${cmd} `);
    }
  }
  private _processEdgeCommand(
    cmd: TraversalCommand,
    result: Edge[] = []
  ): TraversalCommandProcessResult {
    switch (cmd.type) {
      case 'EdgeTraversalCommandLimit':
        result = result.splice(0, cmd.limit);
        return edgeResult(result);
      case 'EdgeTraversalCommandFilter':
        result = result.filter((v) => {
          return cmd.pred(v);
        });
        return edgeResult(result);
      case 'EdgeTraversalCommandHas':
        result = result.filter((v) => {
          const value = v.props.get(cmd.name);
          return value !== undefined && value === cmd.value;
        });
        return edgeResult(result);
      case 'EdgeTraversalCommandHasLabel':
        result = result.filter((v) => v.label === cmd.label);
        return edgeResult(result);
      case 'EdgeTraversalCommandOutV': {
        const vertices: Vertex[] = result.map((edge) => edge.outVertex);
        return vertexResult(vertices);
      }
      case 'EdgeTraversalCommandInV': {
        const vertices: Vertex[] = result.map((edge) => edge.inVertex);
        return vertexResult(vertices);
      }
      default:
        throw new Error(`Unknown command: ${cmd} `);
    }
  }
}

export class Traversal {
  constructor(
    protected _graph: Graph,
    protected _commands: TraversalCommand[] = []
  ) {}
  V(vertex?: Vertex): VertexTraversal {
    const command: TraversalCommand = { type: 'TraversalCommandV', vertex };
    return new VertexTraversal(this._graph, [...this._commands, command]);
  }
}

export class VertexTraversal extends Traversal {
  constructor(_graph: Graph, _commands: TraversalCommand[] = []) {
    super(_graph, _commands);
  }
  toArray(): Vertex[] {
    return new TraversalCommandProcessor(this._graph).process(
      this._commands
    ) as Vertex[];
  }
  private addCommand(command: TraversalCommand): VertexTraversal {
    return new VertexTraversal(this._graph, [...this._commands, command]);
  }
  limit(l: number): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandLimit', limit: l });
  }
  filter(pred: (v: Vertex) => boolean): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandFilter', pred });
  }
  has(name: string, value: PropsValue): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandHas', name, value });
  }
  hasLabel(label: string): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandHasLabel', label });
  }
  out(edgeLabel?: string): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandOut', edgeLabel });
  }
  in(): VertexTraversal {
    return this.addCommand({ type: 'TraversalCommandIn' });
  }
  outE(): EdgeTraversal {
    const command: TraversalCommand = { type: 'TraversalCommandOutE' };
    return new EdgeTraversal(this._graph, [...this._commands, command]);
  }
  inE(): EdgeTraversal {
    const command: TraversalCommand = { type: 'TraversalCommandInE' };
    return new EdgeTraversal(this._graph, [...this._commands, command]);
  }
}

export class EdgeTraversal extends Traversal {
  constructor(_graph: Graph, _commands: TraversalCommand[] = []) {
    super(_graph, _commands);
  }
  toArray(): Edge[] {
    return new TraversalCommandProcessor(this._graph).process(
      this._commands
    ) as Edge[];
  }
  private addCommand(command: TraversalCommand): EdgeTraversal {
    return new EdgeTraversal(this._graph, [...this._commands, command]);
  }
  limit(l: number): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandLimit', limit: l });
  }
  filter(pred: (e: Edge) => boolean): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandFilter', pred });
  }
  has(name: string, value: PropsValue): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandHas', name, value });
  }
  hasLabel(label: string): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandHasLabel', label });
  }
  inV(): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandInV' });
  }
  outV(): EdgeTraversal {
    return this.addCommand({ type: 'EdgeTraversalCommandOutV' });
  }
}

type SearchContext = {
  result: Vertex[];
  visited: Set<string>;
  postOrder: boolean;
};

export function createSearchContext(postOrder = false): SearchContext {
  return {
    result: [],
    visited: new Set(),
    postOrder,
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
  context.visited.add(origin.id);
  if (!context.postOrder) {
    context.result.push(origin);
  }
  origin.out().forEach((v) => {
    if (!context.visited.has(v.id)) {
      depthFirstSearchWithContext(v, context);
    }
  });
  if (context.postOrder) {
    context.result.push(origin);
  }
  return context.result;
}
