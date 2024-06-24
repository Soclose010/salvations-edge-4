import { FigureRepo } from "../Figures/FigureRepo.js";
import { FormHandler } from "../Forms/FormHandler.js";
import { ShadowRepo } from "../Shadows/ShadowRepo.js";

export class App {
  buttons;
  shadowRepo;
  figureRepo;
  formHandler;
  solutionContainer;
  solutionStep = null;
  constructor() {
    this.buttons = document.querySelectorAll(".figure");
    this.solutionContainer = document.querySelector(".solution__container");
    const shadowBtns = document.querySelectorAll(".figure[data-type=shadow]");
    const figureBtns = document.querySelectorAll(".figure[data-type=figure]");
    this.shadowListeners(shadowBtns);
    this.figureListeners(figureBtns);
    this.shadowRepo = new ShadowRepo(shadowBtns);
    this.figureRepo = new FigureRepo(figureBtns);
    this.formHandler = new FormHandler(this);
  }

  render() {
    this.buttons.forEach((button) => {
      if (button.dataset.status == "available") {
        button.classList.remove("block", "selected");
      }
      if (button.dataset.status == "selected") {
        button.classList.remove("block");
        button.classList.add("selected");
      }
      if (button.dataset.status == "blocked") {
        button.classList.remove("selected");
        button.classList.add("block");
      }
    });
  }

  renderSolution() {
    if (this.formHandler.allSetted()) {
      this.solutionContainer.classList.remove("d-none");
      this.formHandler.solve(this);
    } else {
      this.solutionContainer.classList.add("d-none");
      this.solutionContainer.innerHTML = "";
    }
  }

  createSolutionStep() {
    const stepContainer = document.createElement("div");
    stepContainer.classList.add("solution__step");
    this.solutionStep = stepContainer;
  }

  renderSolutionStepDissect(form, edge, number) {
    const dissect = document.createElement("div");
    const edgeImg = document.createElement("img");
    edgeImg.classList.add("solution__img");
    edgeImg.src = `./images/${edge}.svg`;
    edgeImg.alt = edge;
    dissect.classList.add("solution__step-dissect");
    dissect.innerHTML = `${number}. dissect  ${
      edgeImg.outerHTML
    } from ${form.side.toUpperCase()}.`;
    this.solutionStep.append(dissect);
  }

  renderSolutionStepFigures(forms) {
    const figures = document.createElement("div");
    figures.classList.add("solution__step-figures");
    const figureImg = document.createElement("img");
    figureImg.classList.add("solution__img");
    let currentFigures = "";
    forms.forEach((form) => {
      figureImg.src = `./images/${form.figure.name}.svg`;
      figureImg.alt = form.figure.name;
      currentFigures += `${form.side.toUpperCase()}: ${figureImg.outerHTML} `;
    });
    figures.innerHTML = currentFigures.substring(0, currentFigures.length - 2);
    this.solutionStep.append(figures);
  }

  renderStep() {
    const line = document.createElement("div");
    line.classList.add("solution__line");
    this.solutionContainer.append(this.solutionStep);
    this.solutionContainer.append(line);
    this.resetStep();
  }

  resetStep() {
    this.solutionStep = null;
  }

  renderAlreadySolved() {
    const alreadyDiv = document.createElement("div");
    alreadyDiv.classList.add("solution__already");
    alreadyDiv.innerHTML = "Already Solved!";
    this.solutionContainer.append(alreadyDiv);
  }

  handleShadows(button) {
    const side = button.dataset.side;
    const edge = button.dataset.edge;
    const status = button.dataset.status;
    if (status == "available") {
      const shadow = this.shadowRepo.getFromAvailable(side, edge);
      this.formHandler.setShadow(shadow, side);
      this.shadowRepo.addSelectedSide(shadow);
      this.shadowRepo.calculateBlocked(shadow);
      this.shadowRepo.pushToSelected(shadow);
    }

    if (status == "selected") {
      const shadow = this.shadowRepo.getFromSelected(side, edge);
      this.formHandler.setShadow(null, side);
      this.shadowRepo.removeSelectedSide(shadow);
      this.shadowRepo.calculateAvailable();
      this.shadowRepo.pushToAvailables(shadow);
    }
    this.render();
    this.renderSolution();
  }

  handleFigures(button) {
    const side = button.dataset.side;
    const edge1 = button.dataset.edge1;
    const edge2 = button.dataset.edge2;
    const status = button.dataset.status;

    if (status == "available") {
      const figure = this.figureRepo.getFromAvailable(side, edge1, edge2);
      this.formHandler.setFigure(figure, side);
      this.figureRepo.addSelectedSideAndEdges(figure);
      this.figureRepo.calculateBlocked();
      this.figureRepo.pushToSelected(figure);
    }

    if (status == "selected") {
      const figure = this.figureRepo.getFromSelected(side, edge1, edge2);
      this.formHandler.setFigure(null, side);
      this.figureRepo.removeSelectedSideAndEdges(figure);
      this.figureRepo.calculateAvailable();
      this.figureRepo.pushToAvailable(figure);
    }
    this.render();
    this.renderSolution();
  }

  shadowListeners(buttons) {
    buttons.forEach((button) => {
      button.addEventListener("click", this.shadowListener.bind(this));
    });
  }

  figureListeners(buttons) {
    buttons.forEach((button) => {
      button.addEventListener("click", this.figureListener.bind(this));
    });
  }

  shadowListener(e) {
    const btn = e.currentTarget;
    this.handleShadows(btn);
  }

  figureListener(e) {
    const btn = e.currentTarget;
    this.handleFigures(btn);
  }
}
