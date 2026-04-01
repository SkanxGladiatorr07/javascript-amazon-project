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

globalThis.localStorage = new LocalStorageMock();

const cartModule = await import('../../data/cart.js');

const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateDeliveryOption
} = cartModule;

describe('cart helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    cartModule.cart.length = 0;
  });

  it('adds a new item with the default delivery option', () => {
    addToCart('product-1', 2);

    expect(cartModule.cart).toEqual([
      {
        productId: 'product-1',
        quantity: 2,
        deliveryOptionId: '1'
      }
    ]);
    expect(JSON.parse(localStorage.getItem('cart'))).toEqual(cartModule.cart);
  });

  it('increments quantity when the item already exists', () => {
    cartModule.cart.push({
      productId: 'product-1',
      quantity: 2,
      deliveryOptionId: '1'
    });

    addToCart('product-1', 3);

    expect(cartModule.cart).toEqual([
      {
        productId: 'product-1',
        quantity: 5,
        deliveryOptionId: '1'
      }
    ]);
  });

  it('removes an item by product id', () => {
    cartModule.cart.push(
      {
        productId: 'product-1',
        quantity: 2,
        deliveryOptionId: '1'
      },
      {
        productId: 'product-2',
        quantity: 1,
        deliveryOptionId: '2'
      }
    );

    removeFromCart('product-1');

    expect(cartModule.cart).toEqual([
      {
        productId: 'product-2',
        quantity: 1,
        deliveryOptionId: '2'
      }
    ]);
  });

  it('updates quantity for an existing item', () => {
    cartModule.cart.push({
      productId: 'product-1',
      quantity: 2,
      deliveryOptionId: '1'
    });

    updateCartItemQuantity('product-1', 7);

    expect(cartModule.cart[0].quantity).toBe(7);
  });

  it('does not change quantity when the item is missing', () => {
    cartModule.cart.push({
      productId: 'product-1',
      quantity: 2,
      deliveryOptionId: '1'
    });

    updateCartItemQuantity('missing-product', 7);

    expect(cartModule.cart).toEqual([
      {
        productId: 'product-1',
        quantity: 2,
        deliveryOptionId: '1'
      }
    ]);
  });

  it('updates the delivery option for an existing item', () => {
    cartModule.cart.push({
      productId: 'product-1',
      quantity: 2,
      deliveryOptionId: '1'
    });

    updateDeliveryOption('product-1', '3');

    expect(cartModule.cart[0].deliveryOptionId).toBe('3');
  });

  it('does not change delivery option when the item is missing', () => {
    cartModule.cart.push({
      productId: 'product-1',
      quantity: 2,
      deliveryOptionId: '1'
    });

    updateDeliveryOption('missing-product', '3');

    expect(cartModule.cart).toEqual([
      {
        productId: 'product-1',
        quantity: 2,
        deliveryOptionId: '1'
      }
    ]);
  });
});