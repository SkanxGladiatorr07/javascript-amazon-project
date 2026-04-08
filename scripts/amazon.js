import { cart } from '../models/Cart.js';
import { productCatalog } from '../services/ProductCatalog.js';
import { ProductRenderer } from '../renderers/ProductRenderer.js';
import { loadCart } from '../data/cart.js';

const productRenderer = new ProductRenderer(productCatalog, cart);

async function initAmazonPage() {
	try {
		await Promise.all([productCatalog.loadProducts(), loadCart()]);
		productRenderer.init();
	}
	catch (error) {
		console.error('Unable to initialize Amazon page data.', error);
	}
}

initAmazonPage();
