import { Component } from "../components/base-component";
import { Validatable, validate } from "../util/validation";
import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputELement: HTMLInputElement;
  descriptionInputELement: HTMLInputElement;
  peopleInputELement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputELement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;

    this.descriptionInputELement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputELement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | undefined {
    const title = this.titleInputELement.value;
    const description = this.descriptionInputELement.value;
    const people = +this.peopleInputELement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    }

    return [title, description, people];
  }

  private clearInput() {
    this.titleInputELement.value = "";
    this.descriptionInputELement.value = "";
    this.peopleInputELement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInput();
    }
  }
}
