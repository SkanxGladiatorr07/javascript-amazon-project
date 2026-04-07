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
const { productCatalog } = await import('../../services/ProductCatalog.js');

class MockXMLHttpRequest {
  constructor() {
    this.listeners = {};
    this.status = 0;
    this.responseText = '';
  }

  addEventListener(eventName, listener) {
    this.listeners[eventName] = listener;
  }

  open() {}

  send() {
    this.status = 200;
    this.responseText = JSON.stringify([
      {
        id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
        name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
        rating: { stars: 4.5, count: 87 },
        priceCents: 1090,
        keywords: ['socks', 'sports', 'apparel']
      },
      {
        id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        image: 'images/products/intermediate-composite-basketball.jpg',
        name: 'Intermediate Size Basketball',
        rating: { stars: 4, count: 127 },
        priceCents: 2095,
        keywords: ['sports', 'basketballs']
      }
    ]);

    this.listeners.load?.();
  }
}

describe('renderPaymentSummary', () => {
  let summaryMoneyElements;
  let summaryRowLabel;

  beforeEach(async () => {
    localStorage.clear();
    cartModule.cart.length = 0;
    summaryMoneyElements = createSummaryMoneyElements();
    summaryRowLabel = { innerText: '' };

    globalThis.XMLHttpRequest = MockXMLHttpRequest;
    await productCatalog.loadProducts();

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