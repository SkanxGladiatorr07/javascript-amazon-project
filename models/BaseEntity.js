export class BaseEntity {
  constructor(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id
    };
  }
}