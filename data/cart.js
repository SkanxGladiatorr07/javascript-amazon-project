import { cart as cartInstance } from '../models/Cart.js';

export const cart = cartInstance.getItems();

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