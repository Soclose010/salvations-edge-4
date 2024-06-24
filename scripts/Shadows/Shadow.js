export class Shadow {
  edge;
  side;
  button;

  constructor(side, edge, button) {
    this.side = side;
    this.edge = edge;
    this.button = button;
  }

  setted() {
    return this.edge != null;
  }

  clone() {
    return new Shadow(this.side, this.edge, this.button);
  }
}
