import { BaseCollection } from './BaseCollection.js';

export class Cart extends BaseCollection {
  constructor(storageKey = 'cart') {
    super([]);
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  get length() {
    return this.items.length;
  }

  set length(value) {
    if (value === 0) {
      this.items.splice(0, this.items.length);
      this.saveToStorage();
      return;
    }

    this.items.length = value;
    this.saveToStorage();
  }

  loadFromStorage() {
    const savedCart = localStorage.getItem(this.storageKey);

    if (!savedCart) {
      return;
    }

    try {
      const loadedItems = JSON.parse(savedCart).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId || '1'
      }));
      this.items.splice(0, this.items.length, ...loadedItems);
    }
    catch {
      this.items.splice(0, this.items.length);
    }
  }

  setItems(items = []) {
    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId || '1'
    }));

    this.items.splice(0, this.items.length, ...normalizedItems);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId || '1'
    }))));
  }

  findItem(productId) {
    return this.items.find((item) => item.productId === productId);
  }

  addItem(productId, quantity) {
    const matchingItem = this.findItem(productId);

    if (matchingItem) {
      matchingItem.quantity += quantity;
    }
    else {
      this.items.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  removeItem(productId) {
    const itemIndex = this.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return;
    }

    this.items.splice(itemIndex, 1);
    this.saveToStorage();
  }

  updateItemQuantity(productId, newQuantity) {
    const matchingItem = this.findItem(productId);

    if (!matchingItem) {
      return;
    }

    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }

  updateItemDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = this.findItem(productId);

    if (!matchingItem) {
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.items.splice(0, this.items.length);
    this.saveToStorage();
  }

  push(...items) {
    const cartItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId || '1'
    }));
    const length = this.items.push(...cartItems);
    this.saveToStorage();
    return length;
  }

  reduce(callback, initialValue) {
    return this.items.reduce(callback, initialValue);
  }

  find(callback) {
    return this.items.find(callback);
  }

  filter(callback) {
    return this.items.filter(callback);
  }

  forEach(callback) {
    this.items.forEach(callback);
  }

  map(callback) {
    return this.items.map(callback);
  }

  some(callback) {
    return this.items.some(callback);
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

export const cart = new Cart();