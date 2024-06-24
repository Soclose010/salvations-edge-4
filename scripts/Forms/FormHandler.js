import { Form } from "./Form.js";

export class FormHandler {
  forms = [];
  solutionForms = [];
  app;

  constructor(app) {
    this.forms = [new Form("left"), new Form("center"), new Form("right")];
    this.solutionForms = [
      new Form("left"),
      new Form("center"),
      new Form("right"),
    ];
    this.app = app;
  }

  setShadow(shadow, side) {
    this.forms = this.forms.map((form) => {
      if (form.side == side) {
        form.shadow = shadow;
      }
      return form;
    });
  }

  setFigure(figure, side) {
    this.forms = this.forms.map((form) => {
      if (form.side == side) {
        form.figure = figure;
      }
      return form;
    });
  }

  allSetted() {
    return (
      this.forms.reduce((acc, form) => {
        if (form.setted()) {
          acc++;
        }
        return acc;
      }, 0) == 3
    );
  }

  countPerfect() {
    return this.solutionForms.reduce((acc, form) => {
      if (!form.notPerfect()) {
        acc++;
      }
      return acc;
    }, 0);
  }

  countOwnPair() {
    return this.solutionForms.reduce((acc, form) => {
      acc += form.ownPairCount();
      return acc;
    }, 0);
  }

  getNotPerfectFigures() {
    return this.solutionForms.filter((form) => form.notPerfect());
  }

  getIdealFigureIdx() {
    for (const idx in this.solutionForms) {
      if (this.solutionForms[idx].ideal()) {
        return {
          index: idx,
          form: this.solutionForms[idx],
        };
      }
    }
  }

  swap(form1, form2) {
    this.app.createSolutionStep();

    const edgeFigure1 = form1.dissect();
    this.app.renderSolutionStepDissect(form1, edgeFigure1, 1);

    const edgeFigure2 = form2.dissect();
    this.app.renderSolutionStepDissect(form2, edgeFigure2, 2);

    form1.setFigureEdge(edgeFigure2);
    form2.setFigureEdge(edgeFigure1);
    this.app.renderSolutionStepFigures(this.solutionForms);

    this.app.renderStep();
  }

  cloneForms() {
    for (const idx in this.forms) {
      this.solutionForms[idx].shadow = this.forms[idx].shadow.clone();
      this.solutionForms[idx].figure = this.forms[idx].figure.clone();
    }
  }
  solve() {
    this.cloneForms();
    const perfectCount = this.countPerfect();
    if (perfectCount == 3) {
      this.app.renderAlreadySolved();
      return;
    }
    if (perfectCount == 1) {
      let notPerfects = this.getNotPerfectFigures();
      this.swap(notPerfects[0], notPerfects[1]);
      return;
    }

    const ownPairCount = this.countOwnPair();
    if (ownPairCount == 6) {
      this.swap(this.solutionForms[0], this.solutionForms[1]);
      this.swap(this.solutionForms[0], this.solutionForms[2]);
      this.swap(this.solutionForms[1], this.solutionForms[2]);
      return;
    }

    if (ownPairCount == 4) {
      const { index, form } = this.getIdealFigureIdx();
      for (const idx in this.solutionForms) {
        if (idx != index) {
          this.swap(form, this.solutionForms[idx]);
        }
      }
      return;
    }

    if (ownPairCount == 3) {
      this.swap(this.solutionForms[0], this.solutionForms[2]);
      this.swap(this.solutionForms[1], this.solutionForms[2]);
      return;
    }
    if (ownPairCount == 2) {
      this.swap(this.solutionForms[0], this.solutionForms[1]);
      this.swap(this.solutionForms[0], this.solutionForms[2]);
      return;
    }
    if (ownPairCount == 0) {
      this.swap(this.solutionForms[0], this.solutionForms[1]);
      this.swap(this.solutionForms[1], this.solutionForms[2]);
      return;
    }
  }
}
