import { cart } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import formatCurrency from './money.js';

const TAX_RATE = 0.1;

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getMatchingProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getDeliveryOptionById(deliveryOptionId) {
  return deliveryOptions.find((option) => option.id === deliveryOptionId);
}

export function renderPaymentSummary() {
  const itemPriceCents = cart.reduce((total, cartItem) => {
    const product = getMatchingProductById(cartItem.productId);

    if (!product) {
      return total;
    }

    return total + product.priceCents * cartItem.quantity;
  }, 0);

  const shippingCostCents = cart.reduce((total, cartItem) => {
    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);

    if (!deliveryOption) {
      return total;
    }

    return total + deliveryOption.priceCents;
  }, 0);

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
