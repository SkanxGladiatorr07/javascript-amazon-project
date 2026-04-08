async function loadOrders() {
  const response = await fetch('/backend/orders.json');

  if (!response.ok) {
    throw new Error(`Failed to load orders: ${response.status}`);
  }

  const orders = await response.json();

  if (!Array.isArray(orders)) {
    throw new Error('Orders response must be an array.');
  }

  return orders;
}

function getTrackingParams() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const productId = params.get('productId');

  if (!orderId || !productId) {
    throw new Error('Missing URL parameters. Expected orderId and productId.');
  }

  return { orderId, productId };
}

function getProgressWidth(status) {
  const normalizedStatus = String(status || '').toLowerCase();

  if (normalizedStatus === 'preparing') {
    return '20%';
  }

  if (normalizedStatus === 'shipped') {
    return '55%';
  }

  if (normalizedStatus === 'delivered') {
    return '100%';
  }

  return '10%';
}

function renderTrackingData(orderProduct) {
  const deliveryDateElement = document.querySelector('.delivery-date');
  const productInfoElements = document.querySelectorAll('.product-info');
  const productImageElement = document.querySelector('.product-image');
  const progressLabels = document.querySelectorAll('.progress-label');
  const progressBar = document.querySelector('.progress-bar');

  if (!deliveryDateElement || productInfoElements.length < 2 || !productImageElement || !progressBar) {
    throw new Error('Tracking page elements are missing.');
  }

  deliveryDateElement.innerText = orderProduct.deliveryDate;
  productInfoElements[0].innerText = orderProduct.name;
  productInfoElements[1].innerText = `Quantity: ${orderProduct.quantity}`;
  productImageElement.src = orderProduct.image;

  progressLabels.forEach((label) => {
    label.classList.remove('current-status');
    if (label.innerText.trim().toLowerCase() === String(orderProduct.status).toLowerCase()) {
      label.classList.add('current-status');
    }
  });

  progressBar.style.width = getProgressWidth(orderProduct.status);
}

function renderTrackingError(message) {
  const errorElement = document.querySelector('.tracking-error');

  if (errorElement) {
    errorElement.innerText = message;
  }
}

async function initTrackingPage() {
  try {
    const { orderId, productId } = getTrackingParams();
    const orders = await loadOrders();

    const order = orders.find((candidateOrder) => candidateOrder.id === orderId);

    if (!order) {
      throw new Error('Order not found.');
    }

    const orderProduct = (order.products || []).find((candidateProduct) => candidateProduct.productId === productId);

    if (!orderProduct) {
      throw new Error('Product not found in this order.');
    }

    renderTrackingData(orderProduct);
  }
  catch (error) {
    console.error('Unable to initialize tracking page.', error);
    renderTrackingError('Unable to load tracking details. Please check the link and try again.');
  }
}

initTrackingPage();
