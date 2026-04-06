import { Currency } from '../scripts/utils/Currency.js';

export class SummaryCalculator {
  constructor(taxRate = 0.1) {
    this.taxRate = taxRate;
  }

  calculateTax(subtotalCents) {
    return Math.round(subtotalCents * this.taxRate);
  }

  formatMoney(priceCents) {
    return Currency.formatCurrencyWithSign(priceCents);
  }
}