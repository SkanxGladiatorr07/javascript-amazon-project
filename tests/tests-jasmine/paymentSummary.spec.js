class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

function createSummaryMoneyElements() {
  return Array.from({ length: 5 }, () => ({ innerText: '' }));
}

globalThis.localStorage = new LocalStorageMock();

const cartModule = await import('../../data/cart.js');
const { renderPaymentSummary } = await import('../../scripts/utils/paymentSummary.js');

describe('renderPaymentSummary', () => {
  let summaryMoneyElements;
  let summaryRowLabel;

  beforeEach(() => {
    localStorage.clear();
    cartModule.cart.length = 0;
    summaryMoneyElements = createSummaryMoneyElements();
    summaryRowLabel = { innerText: '' };

    globalThis.document = {
      querySelectorAll(selector) {
        if (selector === '.payment-summary-money') {
          return summaryMoneyElements;
        }

        return [];
      },
      querySelector(selector) {
        if (selector === '.payment-summary-row div') {
          return summaryRowLabel;
        }

        return null;
      }
    };
  });

  it('renders totals and item count for the current cart', () => {
    cartModule.cart.push(
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '2'
      },
      {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '3'
      }
    );

    renderPaymentSummary();

    expect(summaryMoneyElements.map((element) => element.innerText)).toEqual([
      '$42.75',
      '$14.98',
      '$57.73',
      '$5.77',
      '$63.50'
    ]);
    expect(summaryRowLabel.innerText).toBe('Items (3):');
  });

  it('leaves the DOM unchanged when the summary elements are missing', () => {
    globalThis.document = {
      querySelectorAll() {
        return [];
      },
      querySelector() {
        return null;
      }
    };

    cartModule.cart.push({
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    });

    expect(() => renderPaymentSummary()).not.toThrow();
  });
});