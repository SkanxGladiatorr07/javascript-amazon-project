import { BaseRenderer } from './BaseRenderer.js';
import { Currency } from '../scripts/utils/Currency.js';
import { DateCalculator } from '../scripts/utils/DateCalculator.js';

export class CheckoutRenderer extends BaseRenderer {
  constructor(cart, productCatalog, deliveryService, paymentSummary) {
    super();
    this.cart = cart;
    this.productCatalog = productCatalog;
    this.deliveryService = deliveryService;
    this.paymentSummary = paymentSummary;
  }

  getCartSummaryContainer() {
    return this.query('.js-order-summary') || this.query('.order-summary');
  }

  getPaymentSummaryTitleElement() {
    return this.query('.js-payment-summary-title') || this.query('.payment-summary-title');
  }

  getDeliveryOptionsHTML(productId) {
    const deliveryGroupName = `delivery-option-${productId}`;

    const deliveryOptionsHTML = this.deliveryService.getAllOptions().map((deliveryOption, index) => {
      const deliveryDateText = DateCalculator.getDeliveryDate(deliveryOption.deliveryDays);
      const shippingPriceText = deliveryOption.isFree()
        ? 'FREE Shipping'
        : `$${Currency.formatCurrency(deliveryOption.priceCents)} - Shipping`;

      return `
      <div class="delivery-option">
        <input
          id="${productId}-${deliveryOption.id}"
          type="radio"
          ${index === 0 ? 'checked' : ''}
          class="delivery-option-input"
          name="${deliveryGroupName}"
          value="${deliveryOption.id}"
          data-product-id="${productId}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDateText}
          </div>
          <div class="delivery-option-price">
            ${shippingPriceText}
          </div>
        </div>
      </div>`;
    }).join('');

    return `
    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${deliveryOptionsHTML}
    </div>`;
  }

  getCartItemHTMLByProductId(productId, quantity) {
    const product = this.productCatalog.findProductById(productId);
    const defaultDeliveryOption = this.deliveryService.getDefaultOption();

    if (!product) {
      return '';
    }

    return `
    <div class="cart-item-container">
      <div class="delivery-date">
        Delivery date: ${DateCalculator.getDeliveryDate(defaultDeliveryOption.deliveryDays)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${product.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-price">
            ${product.getFormattedPrice()}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${productId}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
              Delete
            </span>
            <span class="js-quantity-input-container" data-product-id="${productId}" style="display: none; margin-left: 8px;">
              <input
                class="js-quantity-input"
                data-product-id="${productId}"
                type="number"
                min="1"
                max="99"
                value="${quantity}"
                style="width: 50px;">
              <span class="link-primary js-save-quantity-link" data-product-id="${productId}" style="margin-left: 6px;">
                Save
              </span>
              <span class="link-primary js-cancel-quantity-link" data-product-id="${productId}" style="margin-left: 6px;">
                Cancel
              </span>
            </span>
          </div>
        </div>

        ${this.getDeliveryOptionsHTML(productId)}
      </div>
    </div>`;
  }

  renderPaymentSummary() {
    this.paymentSummary.calculate(this.cart, this.productCatalog, this.deliveryService);

    const summaryMoneyElements = this.queryAll('.payment-summary-money');
    if (summaryMoneyElements.length >= 5) {
      summaryMoneyElements[0].innerText = this.paymentSummary.getFormattedItemTotal();
      summaryMoneyElements[1].innerText = this.paymentSummary.getFormattedShippingTotal();
      summaryMoneyElements[2].innerText = this.paymentSummary.getFormattedSubtotal();
      summaryMoneyElements[3].innerText = this.paymentSummary.getFormattedTax();
      summaryMoneyElements[4].innerText = this.paymentSummary.getFormattedTotal();
    }

    const firstSummaryRowLabel = this.query('.payment-summary-row div');
    if (firstSummaryRowLabel) {
      firstSummaryRowLabel.innerText = `Items (${this.cart.getTotalQuantity()}):`;
    }
  }

  updateHeaderItemCount() {
    const homeLink = this.query('.return-to-home-link');

    if (!homeLink) {
      return;
    }

    const totalQuantity = this.cart.getTotalQuantity();
    homeLink.innerText = totalQuantity === 1 ? '1 item' : `${totalQuantity} items`;
  }

  attachCheckoutEventListeners() {
    this.queryAll('.js-delete-link').forEach((link) => {
      link.addEventListener('click', () => {
        this.cart.removeItem(link.dataset.productId);
        this.renderCheckoutPage();
      });
    });

    this.queryAll('.js-update-link').forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        const inputContainer = this.query(`.js-quantity-input-container[data-product-id="${productId}"]`);
        const quantityInput = this.query(`.js-quantity-input[data-product-id="${productId}"]`);

        if (!inputContainer || !quantityInput) {
          return;
        }

        inputContainer.style.display = 'inline-block';
        link.style.display = 'none';
        quantityInput.focus();
        quantityInput.select();
      });
    });

    this.queryAll('.js-cancel-quantity-link').forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        const inputContainer = this.query(`.js-quantity-input-container[data-product-id="${productId}"]`);
        const quantityInput = this.query(`.js-quantity-input[data-product-id="${productId}"]`);
        const updateLink = this.query(`.js-update-link[data-product-id="${productId}"]`);

        if (!inputContainer || !quantityInput || !updateLink) {
          return;
        }

        const cartItem = this.cart.findItem(productId);
        if (cartItem) {
          quantityInput.value = cartItem.quantity;
        }

        inputContainer.style.display = 'none';
        updateLink.style.display = 'inline';
      });
    });

    this.queryAll('.js-save-quantity-link').forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        const quantityInput = this.query(`.js-quantity-input[data-product-id="${productId}"]`);

        if (!quantityInput) {
          return;
        }

        const newQuantity = Number(quantityInput.value);

        if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > 99) {
          quantityInput.focus();
          return;
        }

        this.cart.updateItemQuantity(productId, newQuantity);
        this.renderCheckoutPage();
      });
    });

    this.queryAll('.js-quantity-input').forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') {
          return;
        }

        const saveLink = this.query(`.js-save-quantity-link[data-product-id="${input.dataset.productId}"]`);
        if (saveLink) {
          saveLink.click();
        }
      });
    });

    this.queryAll('.delivery-option-input').forEach((input) => {
      input.addEventListener('change', () => {
        this.cart.updateItemDeliveryOption(input.dataset.productId, input.value);
        this.renderPaymentSummary();
      });
    });
  }

  renderCheckoutPage() {
    const cartSummaryContainer = this.getCartSummaryContainer();

    if (!cartSummaryContainer) {
      return;
    }

    const cartSummaryHTML = this.cart.getItems().map((cartItem) => {
      return this.getCartItemHTMLByProductId(cartItem.productId, cartItem.quantity);
    }).join('');

    cartSummaryContainer.innerHTML = cartSummaryHTML || '<div class="cart-item-container">Your cart is empty.</div>';

    const paymentSummaryTitleElement = this.getPaymentSummaryTitleElement();
    if (paymentSummaryTitleElement) {
      paymentSummaryTitleElement.innerText = 'Order Summary';
    }

    this.renderPaymentSummary();
    this.updateHeaderItemCount();
    this.attachCheckoutEventListeners();
  }

  init() {
    this.renderCheckoutPage();
  }
}