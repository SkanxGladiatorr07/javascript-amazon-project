import { cart } from '../models/Cart.js';
import { productCatalog } from '../services/ProductCatalog.js';
import { deliveryService } from '../services/DeliveryService.js';
import { PaymentSummary } from '../services/PaymentSummary.js';
import { CheckoutRenderer } from '../renderers/CheckoutRenderer.js';
import { loadCart } from '../data/cart.js';

const paymentSummary = new PaymentSummary(0.1);
const checkoutRenderer = new CheckoutRenderer(cart, productCatalog, deliveryService, paymentSummary);

async function initCheckoutPage() {
	try {
		await Promise.all([productCatalog.loadProducts(), loadCart()]);
		checkoutRenderer.init();
	}
	catch (error) {
		console.error('Unable to initialize checkout page data.', error);
	}
}

initCheckoutPage();
