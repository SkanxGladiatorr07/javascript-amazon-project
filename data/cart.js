import { cart as cartInstance } from '../models/Cart.js';

export const cart = cartInstance.getItems();

function getCartUrl() {
	if (typeof window !== 'undefined') {
		return '/backend/cart.json';
	}

	return new URL('../backend/cart.json', import.meta.url).href;
}

function loadCartFromFile() {
	return import('node:fs/promises')
		.then((fs) => fs.readFile(new URL('../backend/cart.json', import.meta.url), 'utf-8'))
		.then((fileContent) => JSON.parse(fileContent));
}

export function loadCart() {
	if (typeof window !== 'undefined') {
		cartInstance.loadFromStorage();

		if (cart.length > 0) {
			return Promise.resolve(cart);
		}
	}

	return fetch(getCartUrl())
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to load cart: ${response.status}`);
			}

			return response.json();
		})
		.then((cartData) => {
			cartInstance.setItems(cartData);
			return cart;
		})
		.catch(() => {
			if (typeof window === 'undefined') {
				return loadCartFromFile()
					.then((cartData) => {
						cartInstance.setItems(cartData);
						return cart;
					})
					.catch(() => {
						cartInstance.loadFromStorage();
						return cart;
					});
			}

			cartInstance.loadFromStorage();
			return cart;
		});
}

export function addToCart(productId, quantity) {
	cartInstance.addItem(productId, quantity);
}

export function removeFromCart(productId) {
	cartInstance.removeItem(productId);
}

export function updateCartItemQuantity(productId, newQuantity) {
	cartInstance.updateItemQuantity(productId, newQuantity);
}

export function updateDeliveryOption(productId, deliveryOptionId) {
	cartInstance.updateItemDeliveryOption(productId, deliveryOptionId);
}