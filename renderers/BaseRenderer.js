export class BaseRenderer {
  query(selector) {
    return document.querySelector(selector);
  }

  queryAll(selector) {
    return document.querySelectorAll(selector);
  }

  setHTML(selector, html) {
    const element = this.query(selector);

    if (element) {
      element.innerHTML = html;
    }

    return element;
  }

  setText(selector, text) {
    const element = this.query(selector);

    if (element) {
      element.innerText = text;
    }

    return element;
  }
}