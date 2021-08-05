import { css, html, LitElement } from "lit"
import { customElement } from "lit/decorators"

@customElement('x-card')
export class Card extends LitElement {
  static styles = css`
    p { color: blue }
    div {background-color: red}`;

  render() {
    return html`
    <div>
      <p>card title something</p>
    </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-card': Card;
  }
}
