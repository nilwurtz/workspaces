import { html, LitElement } from "lit"
import { customElement, property } from "lit/decorators"

@customElement('x-card')
export class Card extends LitElement {
  @property()
  version = "z"

  render() {
    return html`
    <div>
      <p>card title</p>
    </div>
    `
  }
}