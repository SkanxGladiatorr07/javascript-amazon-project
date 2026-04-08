import { cart } from '../models/Cart.js';
import { productCatalog } from '../services/ProductCatalog.js';
import { ProductRenderer } from '../renderers/ProductRenderer.js';
import { loadCart } from '../data/cart.js';

const productRenderer = new ProductRenderer(productCatalog, cart);

Promise.all([productCatalog.loadProducts(), loadCart()])
	.then(() => {
		productRenderer.init();
	})
	.catch((error) => {
		console.error('Unable to load products.', error);
	});
