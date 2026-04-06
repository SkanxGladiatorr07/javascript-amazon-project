import { SummaryCalculator } from './SummaryCalculator.js';

export class PaymentSummary extends SummaryCalculator {
  constructor(taxRate = 0.1) {
    super(taxRate);
    this.itemPriceCents = 0;
    this.shippingCostCents = 0;
    this.totalBeforeTaxCents = 0;
    this.taxCents = 0;
    this.totalCents = 0;
  }

  calculate(cart, productCatalog, deliveryService) {
    this.itemPriceCents = cart.getItems().reduce((total, cartItem) => {
      const product = productCatalog.findProductById(cartItem.productId);

      if (!product) {
        return total;
      }

      return total + product.priceCents * cartItem.quantity;
    }, 0);

    this.shippingCostCents = cart.getItems().reduce((total, cartItem) => {
      const deliveryOption = deliveryService.findOptionById(cartItem.deliveryOptionId);

      if (!deliveryOption) {
        return total;
      }

      return total + deliveryOption.priceCents;
    }, 0);

    this.totalBeforeTaxCents = this.itemPriceCents + this.shippingCostCents;
    this.taxCents = this.calculateTax(this.totalBeforeTaxCents);
    this.totalCents = this.totalBeforeTaxCents + this.taxCents;
  }

  getItemTotalCents() {
    return this.itemPriceCents;
  }

  getShippingTotalCents() {
    return this.shippingCostCents;
  }

  getSubtotalCents() {
    return this.totalBeforeTaxCents;
  }

  getTaxCents() {
    return this.taxCents;
  }

  getTotalCents() {
    return this.totalCents;
  }

  getFormattedItemTotal() {
    return this.formatMoney(this.itemPriceCents);
  }

  getFormattedShippingTotal() {
    return this.formatMoney(this.shippingCostCents);
  }

  getFormattedSubtotal() {
    return this.formatMoney(this.totalBeforeTaxCents);
  }

  getFormattedTax() {
    return this.formatMoney(this.taxCents);
  }

  getFormattedTotal() {
    return this.formatMoney(this.totalCents);
  }
}