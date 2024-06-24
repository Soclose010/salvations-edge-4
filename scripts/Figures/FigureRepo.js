import { Figure } from "./Figure.js";

export class FigureRepo {
  available = [];
  selected = [];
  blocked = [];
  selectedSides = [];
  selectedEdges = [];
  remainingEdges = [];

  constructor(buttons) {
    this.remainingEdges = [
      "triangle",
      "circle",
      "square",
      "triangle",
      "circle",
      "square",
    ];
    buttons.forEach((button) => {
      this.available.push(
        new Figure(
          button.dataset.side,
          button.dataset.edge1,
          button.dataset.edge2,
          button
        )
      );
    });
  }

  getFromAvailable(side, edge1, edge2) {
    const { newAvailable, needle } = this.available.reduce(
      (acc, figure) => {
        if (
          figure.side == side &&
          figure.edge1 == edge1 &&
          figure.edge2 == edge2
        ) {
          acc.needle = figure;
        } else {
          acc.newAvailable.push(figure);
        }
        return acc;
      },
      { newAvailable: [], needle: null }
    );

    this.available = newAvailable;
    return needle;
  }
  getFromSelected(side, edge1, edge2) {
    const { newSelected, needle } = this.selected.reduce(
      (acc, figure) => {
        if (
          figure.side == side &&
          figure.edge1 == edge1 &&
          figure.edge2 == edge2
        ) {
          acc.needle = figure;
        } else {
          acc.newSelected.push(figure);
        }
        return acc;
      },
      { newSelected: [], needle: null }
    );
    this.selected = newSelected;
    return needle;
  }
  addSelectedSideAndEdges(figure) {
    let idx = this.remainingEdges.indexOf(figure.edge1);
    this.remainingEdges.splice(idx, 1);
    idx = this.remainingEdges.indexOf(figure.edge2);
    this.remainingEdges.splice(idx, 1);
    this.selectedEdges.push(figure.edge1);
    this.selectedEdges.push(figure.edge2);
    this.selectedSides.push(figure.side);
  }
  removeSelectedSideAndEdges(figure) {
    let idx = this.selectedEdges.indexOf(figure.edge1);
    this.selectedEdges.splice(idx, 1);
    idx = this.selectedEdges.indexOf(figure.edge2);
    this.selectedEdges.splice(idx, 1);
    this.remainingEdges.push(figure.edge1);
    this.remainingEdges.push(figure.edge2);
    this.selectedSides = this.selectedSides.filter(
      (value) => figure.side != value
    );
  }
  calculateBlocked() {
    const { newAvailable, newBlocked } = this.available.reduce(
      (acc, item) => {
        if (this.selectedSides.includes(item.side)) {
          item.button.dataset.status = "blocked";
          acc.newBlocked.push(item);
          return acc;
        }
        if (item.fundamental()) {
          if (this.selectedEdges.includes(item.edge1)) {
            item.button.dataset.status = "blocked";
            acc.newBlocked.push(item);
            return acc;
          }
        } else {
          if (
            !(
              this.remainingEdges.includes(item.edge1) &&
              this.remainingEdges.includes(item.edge2)
            )
          ) {
            item.button.dataset.status = "blocked";
            acc.newBlocked.push(item);
            return acc;
          }
        }
        item.button.dataset.status = "available";
        acc.newAvailable.push(item);
        return acc;
      },
      { newAvailable: [], newBlocked: [] }
    );
    this.available = newAvailable;
    this.blocked = this.blocked.concat(newBlocked);
  }
  calculateAvailable() {
    const { newAvailable, newBlocked } = this.blocked.reduce(
      (acc, item) => {
        if (
          item.fundamental() &&
          this.remainingEdges.reduce((acc, edge) => {
            if (edge == item.edge1) {
              acc++;
            }
            return acc;
          }, 0) < 2
        ) {
          item.button.dataset.status = "blocked";
          acc.newBlocked.push(item);
          return acc;
        }
        if (
          this.remainingEdges.includes(item.edge1) &&
          this.remainingEdges.includes(item.edge2) &&
          !this.selectedSides.includes(item.side)
        ) {
          item.button.dataset.status = "available";
          acc.newAvailable.push(item);
          return acc;
        }
        item.button.dataset.status = "blocked";
        acc.newBlocked.push(item);
        return acc;
      },
      { newAvailable: [], newBlocked: [] }
    );
    this.blocked = newBlocked;
    this.available = this.available.concat(newAvailable);
  }
  pushToSelected(figure) {
    figure.button.dataset.status = "selected";
    this.selected.push(figure);
  }
  pushToAvailable(figure) {
    figure.button.dataset.status = "available";
    this.available.push(figure);
  }
}
