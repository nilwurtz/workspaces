export class GreetingElement extends HTMLElement {
  constructor() {
    super();
    const element = document.createElement("div");
    element.textContent = this.getAttribute("message");

    const shadowRoot = this.attachShadow({mode: "open"});
    shadowRoot.appendChild(element);

    // const template = document.createElement('template');
    // template.innerHTML = `
    // <div>Hello!</div>
    // <slot name="name">Default User</slot>
    // `;
    const template = document.getElementById("template-sample") as HTMLTemplateElement
    setTimeout(() => {
      shadowRoot.appendChild(template.content.cloneNode(true));
    }, 1000)
  }
}
customElements.define('x-greeting', GreetingElement);

