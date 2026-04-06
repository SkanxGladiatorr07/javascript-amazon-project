import { BaseRenderer } from './BaseRenderer.js';

export class ProductRenderer extends BaseRenderer {
  constructor(productCatalog, cart) {
    super();
    this.productCatalog = productCatalog;
    this.cart = cart;
    this.addedMessageTimeoutIds = {};
  }

  renderProductHTML(product) {
    return `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/${product.rating.getRatingImageFilename()}">
            <div class="product-rating-count link-primary"> 
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getFormattedPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector" data-product-id="${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
  }

  renderAllProducts() {
    const productsHTML = this.productCatalog.getAllProducts().map((product) => this.renderProductHTML(product)).join('');
    this.setHTML('.js-product-grid', productsHTML);
  }

  updateCartQuantity() {
    this.setText('.js-cart-quantity', String(this.cart.getTotalQuantity()));
  }

  handleAddToCart(button) {
    const { productId } = button.dataset;
    const quantitySelector = this.query(`.js-quantity-selector[data-product-id="${productId}"]`);
    const quantity = Number(quantitySelector.value);
    const addedMessage = this.query(`.js-added-to-cart-${productId}`);

    addedMessage.classList.add('added-to-cart-visible');

    if (this.addedMessageTimeoutIds[productId]) {
      clearTimeout(this.addedMessageTimeoutIds[productId]);
    }

    this.addedMessageTimeoutIds[productId] = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
      delete this.addedMessageTimeoutIds[productId];
    }, 2000);

    this.cart.addItem(productId, quantity);
    this.updateCartQuantity();
  }

  attachAddToCartListeners() {
    this.queryAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => this.handleAddToCart(button));
    });
  }

  init() {
    this.renderAllProducts();
    this.updateCartQuantity();
    this.attachAddToCartListeners();
  }
}