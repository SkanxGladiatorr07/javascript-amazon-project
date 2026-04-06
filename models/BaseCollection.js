export class BaseCollection {
  constructor(items = []) {
    this.items = items;
  }

  getItems() {
    return this.items;
  }

  getAll() {
    return this.items;
  }

  count() {
    return this.items.length;
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }

  filter(predicate) {
    return this.items.filter(predicate);
  }
}