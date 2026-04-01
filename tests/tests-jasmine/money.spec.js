import formatCurrency from '../../scripts/utils/money.js';

describe('formatCurrency', () => {
  it('formats whole dollars with two decimals', () => {
    expect(formatCurrency(2095)).toBe('20.95');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('0.00');
  });

  it('formats small cent values', () => {
    expect(formatCurrency(5)).toBe('0.05');
  });

  it('formats negative values', () => {
    expect(formatCurrency(-500)).toBe('-5.00');
  });
});
