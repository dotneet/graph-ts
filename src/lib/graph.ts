import { v4 as uuidv4 } from 'uuid';
import { Traversal } from './traversal';

type PropsValue = string | number;
type PropsParameter =
  | Record<string, PropsValue>
  | ReadonlyMap<string, PropsValue>;

function obj2map(objOrMap: PropsParameter): Map<string, PropsValue> {
  if (objOrMap instanceof Map) {
    return objOrMap as unknown as Map<string, PropsValue>;
  } else if (objOrMap instanceof Object) {
    return new Map(Object.entries(objOrMap));
  } else {
    return new Map();
  }
}

export class Vertex {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public props: Map<string, PropsValue>,
    private _inEdges: Set<Edge> = new Set(),
    private _outEdges: Set<Edge> = new Set()
  ) {}

  inE(edgeLabel?: string): Edge[] {
    return Array.from(this._inEdges).filter(
      (e) => !edgeLabel || e.label === edgeLabel
    );
  }

  outE(edgeLabel?: string): Edge[] {
    return Array.from(this._outEdges).filter(
      (e) => !edgeLabel || e.label === edgeLabel
    );
  }

  out(edgeLabel?: string): Vertex[] {
    return this.outE(edgeLabel).map((e) => e.inVertex);
  }

  in(edgeLabel?: string): Vertex[] {
    return this.inE(edgeLabel).map((e) => e.outVertex);
  }

  addInEdge(edge: Edge) {
    this._inEdges.add(edge);
  }
  addOutEdge(edge: Edge) {
    this._outEdges.add(edge);
  }
  deleteInEdge(edge: Edge) {
    this._inEdges.delete(edge);
  }
  deleteOutEdge(edge: Edge) {
    this._outEdges.delete(edge);
  }
}

export class Edge {
  constructor(
    public readonly id: string,
    public readonly label: string,
    private _outVertex: Vertex,
    private _inVertex: Vertex,
    public props: Map<string, PropsValue>
  ) {}
  get outVertex() {
    return this._outVertex;
  }
  get inVertex() {
    return this._inVertex;
  }
}

export class Graph {
  constructor(
    private _vertices: Map<string, Vertex> = new Map(),
    private _edges: Map<string, Edge> = new Map()
  ) {}

  get vertices(): ReadonlyMap<string, Vertex> {
    return this._vertices;
  }

  get edges(): ReadonlyMap<string, Edge> {
    return this._edges;
  }

  V(idOrVertex?: string | Vertex): Traversal {
    const t = new Traversal(this);
    if (idOrVertex instanceof String) {
      const id = idOrVertex as string;
      if (!this._vertices.has(id)) {
        return t;
      }
      const vertex = this._vertices.get(id);
      return t.V(vertex);
    } else if (idOrVertex instanceof Vertex) {
      const vertex = idOrVertex as Vertex;
      return t.V(vertex);
    } else {
      return t.V();
    }
  }

  traversal(): Traversal {
    return new Traversal(this);
  }

  addVertex(
    label: string,
    props: PropsParameter = new Map(),
    id: string = uuidv4()
  ): Vertex {
    const v: Vertex = new Vertex(id, label, obj2map(props));
    this._vertices.set(id, v);
    return v;
  }

  // outVertex -- edge -> inVertex
  addEdge(
    label: string,
    outVertex: Vertex,
    inVertex: Vertex,
    props: PropsParameter = new Map(),
    id: string = uuidv4()
  ): Edge {
    const e: Edge = new Edge(id, label, outVertex, inVertex, obj2map(props));
    outVertex.addOutEdge(e);
    inVertex.addInEdge(e);
    this._edges.set(id, e);
    return e;
  }

  deleteVertex(vertex: Vertex): void {
    vertex.inE().forEach((e) => this._edges.delete(e.id));
    vertex.outE().forEach((e) => this._edges.delete(e.id));
    this._vertices.delete(vertex.id);
  }

  deleteEdge(edge: Edge): void {
    this._edges.delete(edge.id);
    edge.outVertex.deleteOutEdge(edge);
    edge.inVertex.deleteInEdge(edge);
  }

  dump(): void {
    this._vertices.forEach((v) => {
      console.log(v);
    });
    this._edges.forEach((e) => {
      console.log(e);
    });
  }

  // return new reverse graph.
  reverse(): Graph {
    const graph = this.clone();
    const edges = new Map(graph._edges);
    edges.forEach((e) => {
      graph.deleteEdge(e);
    });
    edges.forEach((e) => {
      graph.addEdge(e.label, e.inVertex, e.outVertex, e.props, e.id);
    });
    return graph;
  }

  clone(): Graph {
    const graph = new Graph();
    const vertices: Map<string, Vertex> = new Map();
    for (const entry of this._vertices) {
      const v = entry[1];
      const newVertex = graph.addVertex(v.label, new Map(v.props), v.id);
      vertices.set(newVertex.id, newVertex);
    }
    for (const entry of this._edges) {
      const e = entry[1];
      const outV = vertices.get(e.outVertex.id);
      const inV = vertices.get(e.inVertex.id);
      const props = new Map(e.props);
      graph.addEdge(e.label, outV, inV, props, e.id);
    }
    return graph;
  }
}
