import { cart } from '../models/Cart.js';
import { productCatalog } from '../services/ProductCatalog.js';
import { deliveryService } from '../services/DeliveryService.js';
import { PaymentSummary } from '../services/PaymentSummary.js';
import { CheckoutRenderer } from '../renderers/CheckoutRenderer.js';
import { loadCart } from '../data/cart.js';

const paymentSummary = new PaymentSummary(0.1);
const checkoutRenderer = new CheckoutRenderer(cart, productCatalog, deliveryService, paymentSummary);

Promise.all([productCatalog.loadProducts(), loadCart()])
	.then(() => {
		checkoutRenderer.init();
	})
	.catch((error) => {
		console.error('Unable to load products.', error);
	});
