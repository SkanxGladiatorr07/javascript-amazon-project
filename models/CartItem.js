import { BaseEntity } from './BaseEntity.js';

export class CartItem extends BaseEntity {
  constructor(productId, quantity, deliveryOptionId = '1') {
    super(productId);
    this.productId = productId;
    this.quantity = quantity;
    this.deliveryOptionId = deliveryOptionId;
  }

  increaseQuantity(amount) {
    this.quantity += amount;
  }

  setQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  updateDeliveryOption(deliveryOptionId) {
    this.deliveryOptionId = deliveryOptionId;
  }

  toJSON() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      deliveryOptionId: this.deliveryOptionId
    };
  }

  static fromJSON(obj) {
    return new CartItem(obj.productId, obj.quantity, obj.deliveryOptionId || '1');
  }
}