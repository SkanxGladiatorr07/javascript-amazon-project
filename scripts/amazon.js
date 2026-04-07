import { cart } from '../models/Cart.js';
import { productCatalog } from '../services/ProductCatalog.js';
import { ProductRenderer } from '../renderers/ProductRenderer.js';

const productRenderer = new ProductRenderer(productCatalog, cart);

productCatalog.loadProducts()
	.then(() => {
		productRenderer.init();
	})
	.catch((error) => {
		console.error('Unable to load products.', error);
	});
