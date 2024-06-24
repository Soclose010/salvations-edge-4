export class Form {
  side;
  shadow = null;
  figure = null;

  constructor(side) {
    this.side = side;
  }

  setted() {
    return this.shadow?.setted() && this.figure?.setted();
  }

  getEdgeEqualToShadow() {
    if (this.shadow.edge == this.figure.edge1) {
      const edge = this.figure.edge1;
      this.figure.edge1 = null;
      return edge;
    } else {
      const edge = this.figure.edge2;
      this.figure.edge2 = null;
      return edge;
    }
  }

  ownPairCount() {
    let count = 0;
    if (this.shadow.edge == this.figure.edge1) {
      count++;
    }
    if (this.shadow.edge == this.figure.edge2) {
      count++;
    }
    return count;
  }

  notPerfect() {
    return this.ownPairCount() > 0 || this.figure.pair() == true;
  }

  ideal() {
    return (
      this.shadow.edge == this.figure.edge1 &&
      this.figure.edge1 == this.figure.edge2
    );
  }

  dissect() {
    if (this.figure.pair()) {
      const edge = this.figure.edge1;
      this.figure.edge1 = null;
      return edge;
    } else {
      return this.getEdgeEqualToShadow();
    }
  }

  setFigureEdge(figureEdge) {
    if (this.figure.edge1 === null) {
      this.figure.edge1 = figureEdge;
    } else {
      this.figure.edge2 = figureEdge;
    }
  }
}
