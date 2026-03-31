import {
  cart,
  removeFromCart,
  updateCartItemQuantity
} from '../data/cart.js';
import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import formatCurrency from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const SHIPPING_COST_CENTS = 499;
const TAX_RATE = 0.1;
const today = dayjs();

function getDeliveryDateText(deliveryDays) {
  return today.add(deliveryDays, 'days').format('dddd, MMMM D');
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getMatchingProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getCartSummaryContainer() {
  return document.querySelector('.js-order-summary') || document.querySelector('.order-summary');
}

function getPaymentSummaryTitleElement() {
  return document.querySelector('.js-payment-summary-title') || document.querySelector('.payment-summary-title');
}

function getDeliveryOptionsHTML(productId) {
  const deliveryGroupName = `delivery-option-${productId}`;

  const deliveryOptionsHTML = deliveryOptions.map((deliveryOption, index) => {
    const deliveryDateText = getDeliveryDateText(deliveryOption.deliveryDays);
    const shippingPriceText = deliveryOption.priceCents === 0
      ? 'FREE Shipping'
      : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

    return `
      <div class="delivery-option">
        <input
          id="${productId}-${deliveryOption.id}"
          type="radio"
          ${index === 0 ? 'checked' : ''}
          class="delivery-option-input"
          name="${deliveryGroupName}"
          value="${deliveryOption.id}">
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

function getCartItemHTMLByProductId(productId, quantity) {
  const product = getMatchingProductById(productId);
  const defaultDeliveryOption = deliveryOptions[0];

  if (!product) {
    return '';
  }

  return `
    <div class="cart-item-container">
      <div class="delivery-date">
        Delivery date: ${getDeliveryDateText(defaultDeliveryOption.deliveryDays)}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${product.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-price">
            $${formatCurrency(product.priceCents)}
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

        ${getDeliveryOptionsHTML(productId)}
      </div>
    </div>`;
}

function renderPaymentSummary() {
  const itemPriceCents = cart.reduce((total, cartItem) => {
    const product = getMatchingProductById(cartItem.productId);

    if (!product) {
      return total;
    }

    return total + product.priceCents * cartItem.quantity;
  }, 0);

  const shippingCostCents = cart.length > 0 ? SHIPPING_COST_CENTS : 0;
  const totalBeforeTaxCents = itemPriceCents + shippingCostCents;
  const taxCents = Math.round(totalBeforeTaxCents * TAX_RATE);
  const totalCents = totalBeforeTaxCents + taxCents;

  const summaryMoneyElements = document.querySelectorAll('.payment-summary-money');
  if (summaryMoneyElements.length >= 5) {
    summaryMoneyElements[0].innerText = `$${formatCurrency(itemPriceCents)}`;
    summaryMoneyElements[1].innerText = `$${formatCurrency(shippingCostCents)}`;
    summaryMoneyElements[2].innerText = `$${formatCurrency(totalBeforeTaxCents)}`;
    summaryMoneyElements[3].innerText = `$${formatCurrency(taxCents)}`;
    summaryMoneyElements[4].innerText = `$${formatCurrency(totalCents)}`;
  }

  const firstSummaryRowLabel = document.querySelector('.payment-summary-row div');
  if (firstSummaryRowLabel) {
    firstSummaryRowLabel.innerText = `Items (${getCartQuantity()}):`;
  }
}

function updateHeaderItemCount() {
  const totalQuantity = getCartQuantity();
  const homeLink = document.querySelector('.return-to-home-link');
  if (!homeLink) {
    return;
  }

  homeLink.innerText = totalQuantity === 1 ? '1 item' : `${totalQuantity} items`;
}

function attachCheckoutEventListeners() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      removeFromCart(productId);
      renderCheckoutPage();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      const inputContainer = document.querySelector(`.js-quantity-input-container[data-product-id="${productId}"]`);
      const quantityInput = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);

      if (!inputContainer || !quantityInput) {
        return;
      }

      inputContainer.style.display = 'inline-block';
      link.style.display = 'none';
      quantityInput.focus();
      quantityInput.select();
    });
  });

  document.querySelectorAll('.js-cancel-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      const inputContainer = document.querySelector(`.js-quantity-input-container[data-product-id="${productId}"]`);
      const quantityInput = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
      const updateLink = document.querySelector(`.js-update-link[data-product-id="${productId}"]`);

      if (!inputContainer || !quantityInput || !updateLink) {
        return;
      }

      const cartItem = cart.find((item) => item.productId === productId);
      if (cartItem) {
        quantityInput.value = cartItem.quantity;
      }

      inputContainer.style.display = 'none';
      updateLink.style.display = 'inline';
    });
  });

  document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      const quantityInput = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);

      if (!quantityInput) {
        return;
      }

      const newQuantity = Number(quantityInput.value);

      if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > 99) {
        quantityInput.focus();
        return;
      }

      updateCartItemQuantity(productId, newQuantity);
      renderCheckoutPage();
    });
  });

  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') {
        return;
      }

      const { productId } = input.dataset;
      const saveLink = document.querySelector(`.js-save-quantity-link[data-product-id="${productId}"]`);
      if (saveLink) {
        saveLink.click();
      }
    });
  });
}

function renderCheckoutPage() {
  const cartSummaryContainer = getCartSummaryContainer();
  if (!cartSummaryContainer) {
    return;
  }

  const cartSummaryHTML = cart
    .map((cartItem) => getCartItemHTMLByProductId(cartItem.productId, cartItem.quantity))
    .join('');

  cartSummaryContainer.innerHTML = cartSummaryHTML || '<div class="cart-item-container">Your cart is empty.</div>';

  const paymentSummaryTitleElement = getPaymentSummaryTitleElement();
  if (paymentSummaryTitleElement) {
    paymentSummaryTitleElement.innerText = 'Order Summary';
  }

  renderPaymentSummary();
  updateHeaderItemCount();
  attachCheckoutEventListeners();
}

renderCheckoutPage();
