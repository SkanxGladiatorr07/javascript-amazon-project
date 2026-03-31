export let cart = JSON.parse(localStorage.getItem('car

if (!cart) {
	cart = [];
}

cart = cart.map((cartItem) => {
	if (cartItem.deliveryOptionId) {
		return cartItem;
	}

	return {
		...cartItem,
		deliveryOptionId: '1'
	};
});

function saveToStorage() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
	let matchingItem;

	cart.forEach((item) => {
		if (productId === item.productId) {
			matchingItem = item;
		}
	});

	if (matchingItem) {
		matchingItem.quantity += quantity;
	}
	else {
		cart.push({
			productId,
			quantity,
			deliveryOptionId: '1'
		});
	}

	saveToStorage();
}

export function removeFromCart(productId) {
	cart = cart.filter((item) => item.productId !== productId);
	saveToStorage();
}

export function updateCartItemQuantity(productId, newQuantity) {
	const matchingItem = cart.find((item) => item.productId === productId);

	if (!matchingItem) {
		return;
	}

	matchingItem.quantity = newQuantity;
	saveToStorage();
}