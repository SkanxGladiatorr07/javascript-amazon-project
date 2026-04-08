import { cart as cartInstance } from '../models/Cart.js';

export const cart = cartInstance.getItems();

function getCartUrl() {
	if (typeof window !== 'undefined') {
		return '/backend/cart.json';
	}

	return new URL('../backend/cart.json', import.meta.url).href;
}

async function loadCartFromFile() {
	try {
		const fs = await import('node:fs/promises');
		const fileContent = await fs.readFile(new URL('../backend/cart.json', import.meta.url), 'utf-8');
		const cartData = JSON.parse(fileContent);

		if (!Array.isArray(cartData)) {
			throw new Error('Cart data must be an array.');
		}

		return cartData;
	}
	catch (error) {
		throw new Error(`Failed to load cart from file fallback. ${error.message}`);
	}
}

export async function loadCart() {
	if (typeof window !== 'undefined') {
		cartInstance.loadFromStorage();

		if (cart.length > 0) {
			return cart;
		}
	}

	try {
		const response = await fetch(getCartUrl());

		if (!response.ok) {
			throw new Error(`Failed to load cart: ${response.status}`);
		}

		const cartData = await response.json();

		if (!Array.isArray(cartData)) {
			throw new Error('Cart response must be an array.');
		}

		cartInstance.setItems(cartData);
		return cart;
	}
	catch (fetchError) {
		if (typeof window === 'undefined') {
			try {
				const cartData = await loadCartFromFile();
				cartInstance.setItems(cartData);
				return cart;
			}
			catch (fileError) {
				cartInstance.loadFromStorage();
				throw new Error(`Unable to load cart in Node environment. ${fileError.message}`);
			}
		}

		cartInstance.loadFromStorage();
		console.error('Unable to load cart from network. Using local storage cart.', fetchError);
		return cart;
	}
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