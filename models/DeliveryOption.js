import { BaseEntity } from './BaseEntity.js';

export class DeliveryOption extends BaseEntity {
  constructor(id, deliveryDays, priceCents) {
    super(id);
    this.deliveryDays = deliveryDays;
    this.priceCents = priceCents;
  }

  isFree() {
    return this.priceCents === 0;
  }

  getDisplayText() {
    return this.isFree() ? 'FREE Shipping' : `$${(this.priceCents / 100).toFixed(2)} - Shipping`;
  }

  toJSON() {
    return {
      id: this.id,
      deliveryDays: this.deliveryDays,
      priceCents: this.priceCents
    };
  }
}