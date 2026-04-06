export class Currency {
  static formatCurrency(priceCents) {
    return (priceCents / 100).toFixed(2);
  }

  static centsToDollars(cents) {
    return cents / 100;
  }

  static dollarsToCents(dollars) {
    return Math.round(dollars * 100);
  }

  static formatCurrencyWithSign(priceCents) {
    return `$${this.formatCurrency(priceCents)}`;
  }
}