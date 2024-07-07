export class Figure {
  side;
  edge1;
  edge2;
  button;

  constructor(side, edge1, edge2, button) {
    this.side = side;
    this.edge1 = edge1;
    this.edge2 = edge2;
    this.button = button;
  }

  fundamental() {
    return this.edge1 == this.edge2;
  }

  pair() {
    return this.edge1 == this.edge2;
  }

  setted() {
    return this.edge1 != null && this.edge2 != null;
  }

  get name() {
    const edgesSet = new Set([this.edge1, this.edge2]);
    if (edgesSet.size == 1) {
      if (edgesSet.has("triangle")) {
        return "pyramid";
      }
      if (edgesSet.has("circle")) {
        return "sphere";
      }
      if (edgesSet.has("square")) {
        return "cube";
      }
    } else {
      if (edgesSet.has("circle") && edgesSet.has("square")) {
        return "cylinder";
      }
      if (edgesSet.has("triangle") && edgesSet.has("square")) {
        return "prism";
      }
      if (edgesSet.has("triangle") && edgesSet.has("circle")) {
        return "cone";
      }
    }
  }

  clone() {
    return new Figure(this.side, this.edge1, this.edge2, this.button);
  }
}
