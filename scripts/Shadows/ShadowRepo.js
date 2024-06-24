import { Shadow } from "./Shadow.js";

export class ShadowRepo {
  available = [];
  selected = [];
  blocked = [];
  selectedSides = [];
  selectedEdges = [];

  constructor(buttons) {
    buttons.forEach((button) => {
      this.available.push(
        new Shadow(button.dataset.side, button.dataset.edge, button)
      );
    });
  }

  getFromAvailable(side, edge) {
    const { newAvailable, needle } = this.available.reduce(
      (acc, shadow) => {
        if (shadow.side == side && shadow.edge == edge) {
          acc.needle = shadow;
        } else {
          acc.newAvailable.push(shadow);
        }
        return acc;
      },
      { newAvailable: [], needle: null }
    );

    this.available = newAvailable;
    return needle;
  }

  getFromSelected(side, edge) {
    const { newSelected, needle } = this.selected.reduce(
      (acc, shadow) => {
        if (shadow.side == side && shadow.edge == edge) {
          acc.needle = shadow;
        } else {
          acc.newSelected.push(shadow);
        }
        return acc;
      },
      { newSelected: [], needle: null }
    );
    this.selected = newSelected;
    return needle;
  }

  pushToAvailables(shadow) {
    shadow.button.dataset.status = "available";
    this.available.push(shadow);
  }

  pushToSelected(shadow) {
    shadow.button.dataset.status = "selected";
    this.selected.push(shadow);
  }

  addSelectedSide(shadow) {
    this.selectedEdges.push(shadow.edge);
    this.selectedSides.push(shadow.side);
  }

  removeSelectedSide(shadow) {
    this.selectedSides = this.selectedSides.filter(
      (value) => shadow.side != value
    );
    this.selectedEdges = this.selectedEdges.filter(
      (value) => shadow.edge != value
    );
  }

  calculateBlocked(shadow) {
    const { newAvailable, newBlocked } = this.available.reduce(
      (acc, item) => {
        if (
          item.edge == shadow.edge ||
          this.selectedSides.includes(item.side)
        ) {
          item.button.dataset.status = "blocked";
          acc.newBlocked.push(item);
        } else {
          item.button.dataset.status = "available";
          acc.newAvailable.push(item);
        }
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
          !this.selectedEdges.includes(item.edge) &&
          !this.selectedSides.includes(item.side)
        ) {
          item.button.dataset.status = "available";
          acc.newAvailable.push(item);
        } else {
          item.button.dataset.status = "blocked";
          acc.newBlocked.push(item);
        }
        return acc;
      },
      { newAvailable: [], newBlocked: [] }
    );
    this.blocked = newBlocked;
    this.available = this.available.concat(newAvailable);
  }
}
