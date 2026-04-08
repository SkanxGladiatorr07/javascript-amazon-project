const productsModule = await import('../../data/products.js');

describe('product async loaders', () => {
  it('loads products with callback style', (done) => {
    productsModule.loadProductsWithCallback((error, products) => {
      expect(error).toBeNull();
      expect(Array.isArray(products)).toBeTrue();
      expect(products.length).toBeGreaterThan(0);
      done();
    });
  });

  it('returns an error when XHR is unavailable', async () => {
    const originalXmlHttpRequest = globalThis.XMLHttpRequest;
    globalThis.XMLHttpRequest = undefined;

    try {
      await expectAsync(productsModule.loadProductsWithXhr()).toBeRejectedWithError(
        'XMLHttpRequest is not available in this environment.'
      );
    }
    finally {
      globalThis.XMLHttpRequest = originalXmlHttpRequest;
    }
  });

  it('loads products with XHR when XMLHttpRequest is provided', async () => {
    const originalXmlHttpRequest = globalThis.XMLHttpRequest;

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
            id: 'mock-product-1',
            image: 'images/products/mock.jpg',
            name: 'Mock Product',
            rating: { stars: 5, count: 1 },
            priceCents: 100,
            keywords: []
          }
        ]);

        this.listeners.load?.();
      }
    }

    globalThis.XMLHttpRequest = MockXMLHttpRequest;

    try {
      const products = await productsModule.loadProductsWithXhr();
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('mock-product-1');
    }
    finally {
      globalThis.XMLHttpRequest = originalXmlHttpRequest;
    }
  });
});
