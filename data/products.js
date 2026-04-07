export let products = [];

export function loadProducts() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          products = JSON.parse(xhr.responseText);
          resolve(products);
        } catch (error) {
          reject(new Error('Failed to parse product data.'));
        }

        return;
      }

      reject(new Error(`Failed to load products: ${xhr.status}`));
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error while loading products.'));
    });

    xhr.open('GET', '/backend/products.json');
    xhr.send();
  });
}
