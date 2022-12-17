import { v4 as uuidv4 } from "uuid";

type PropsValue = string | number;
type PropsParameter =
  | Record<string, PropsValue>
  | ReadonlyMap<string, PropsValue>;

function obj2map(
  objOrMap: PropsParameter,
): Map<string, PropsValue> {
  if (objOrMap instanceof Map) {
    return obj2map as unknown as Map<string, PropsValue>;
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
    public inEdges: Set<Edge> = new Set(),
    public outEdges: Set<Edge> = new Set(),
  ) {}

  outVertices(): Set<Vertex> {
    const result: Set<Vertex> = new Set();
    this.outEdges.forEach((e) => result.add(e.outVertex));
    return result;
  }

  inVertices(): Set<Vertex> {
    const result: Set<Vertex> = new Set();
    this.inEdges.forEach((e) => result.add(e.outVertex));
    return result;
  }
}

export class Edge {
  constructor(
    public readonly id: string,
    public inVertex: Vertex,
    public outVertex: Vertex,
    public props: Map<string, PropsValue>,
  ) {}
}

export class Graph {
  vertices: Set<Vertex>;
  edges: Set<Edge>;

  constructor() {
    this.vertices = new Set();
    this.edges = new Set();
  }

  createVertex(
    label: string,
    props: PropsParameter = new Map(),
  ): Vertex {
    const v: Vertex = new Vertex(
      uuidv4(),
      label,
      obj2map(props),
    );
    this.vertices.add(v);
    return v;
  }

  createEdge(
    inVertex: Vertex,
    outVertex: Vertex,
    props: PropsParameter = new Map(),
  ): Edge {
    const e: Edge = new Edge(
      uuidv4(),
      inVertex,
      outVertex,
      obj2map(props),
    );
    inVertex.outEdges.add(e);
    outVertex.inEdges.add(e);
    this.edges.add(e);
    return e;
  }

  deleteVertex(vertex: Vertex): void {
    vertex.inEdges.forEach((e) => this.edges.delete(e));
    vertex.outEdges.forEach((e) => this.edges.delete(e));
    this.vertices.delete(vertex);
  }

  deleteEdge(
    edge: Edge,
  ): void {
    this.edges.delete(edge);
    edge.inVertex.outEdges.delete(edge);
    edge.outVertex.inEdges.delete(edge);
  }
}
