import { cart } from '../../models/Cart.js';
import { productCatalog } from '../../services/ProductCatalog.js';
import { deliveryService } from '../../services/DeliveryService.js';
import { PaymentSummary } from '../../services/PaymentSummary.js';

const paymentSummary = new PaymentSummary(0.1);

export function renderPaymentSummary() {
  paymentSummary.calculate(cart, productCatalog, deliveryService);

  const summaryMoneyElements = document.querySelectorAll('.payment-summary-money');
  if (summaryMoneyElements.length >= 5) {
    summaryMoneyElements[0].innerText = paymentSummary.getFormattedItemTotal();
    summaryMoneyElements[1].innerText = paymentSummary.getFormattedShippingTotal();
    summaryMoneyElements[2].innerText = paymentSummary.getFormattedSubtotal();
    summaryMoneyElements[3].innerText = paymentSummary.getFormattedTax();
    summaryMoneyElements[4].innerText = paymentSummary.getFormattedTotal();
  }

  const firstSummaryRowLabel = document.querySelector('.payment-summary-row div');
  if (firstSummaryRowLabel) {
    firstSummaryRowLabel.innerText = `Items (${cart.getTotalQuantity()}):`;
  }
}
