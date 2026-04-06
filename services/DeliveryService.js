import { BaseCollectionService } from './BaseCollectionService.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { deliveryOptions as deliveryOptionsData } from '../data/deliveryOptions.js';

export class DeliveryService extends BaseCollectionService {
  constructor() {
    super(
      deliveryOptionsData.map((deliveryOptionData) => new DeliveryOption(
        deliveryOptionData.id,
        deliveryOptionData.deliveryDays,
        deliveryOptionData.priceCents
      ))
    );
  }

  getAllOptions() {
    return this.getItems();
  }

  findOptionById(optionId) {
    return this.findById(optionId);
  }

  getFreeOptions() {
    return this.filter((option) => option.isFree());
  }

  getDefaultOption() {
    return this.getItems()[0];
  }

  findByDeliveryDays(deliveryDays) {
    return this.filter((option) => option.deliveryDays === deliveryDays)[0];
  }
}

export const deliveryService = new DeliveryService();