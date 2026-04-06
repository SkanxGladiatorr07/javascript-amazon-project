import { BaseCollection } from '../models/BaseCollection.js';

export class BaseCollectionService extends BaseCollection {
  constructor(items = []) {
    super(items);
  }

  getAllItems() {
    return this.getItems();
  }
}