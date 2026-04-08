export let products = [];

function getProductsUrl() {
  if (typeof window !== 'undefined') {
    return '/backend/products.json';
  }

  return new URL('../backend/products.json', import.meta.url).href;
}

async function loadProductsFromFile() {
  try {
    const fs = await import('node:fs/promises');
    const fileContent = await fs.readFile(new URL('../backend/products.json', import.meta.url), 'utf-8');
    const productsData = JSON.parse(fileContent);

    if (!Array.isArray(productsData)) {
      throw new Error('Products data must be an array.');
    }

    return productsData;
  }
  catch (error) {
    throw new Error(`Failed to load products from file fallback. ${error.message}`);
  }
}

function validateProductsData(productsData, context) {
  if (!Array.isArray(productsData)) {
    throw new Error(`${context} must be an array.`);
  }

  return productsData;
}

export function loadProductsWithXhr() {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === 'undefined') {
      reject(new Error('XMLHttpRequest is not available in this environment.'));
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Failed to load products with XHR: ${xhr.status}`));
        return;
      }

      try {
        const productsData = validateProductsData(JSON.parse(xhr.responseText), 'Products response');
        products = productsData;
        resolve(products);
      }
      catch (error) {
        reject(new Error(`Failed to parse products response. ${error.message}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error while loading products with XHR.'));
    });

    xhr.open('GET', '/backend/products.json');
    xhr.send();
  });
}

export function loadProductsWithCallback(callback) {
  loadProducts()
    .then((productsData) => {
      callback(null, productsData);
    })
    .catch((error) => {
      callback(error, []);
    });
}

export async function loadProducts() {
  try {
    const response = await fetch(getProductsUrl());

    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }

    const productsData = await response.json();

    validateProductsData(productsData, 'Products response');

    products = productsData;
    return products;
  }
  catch (error) {
    if (typeof window === 'undefined') {
      const productsData = await loadProductsFromFile();
      products = productsData;
      return products;
    }

    throw new Error(`Unable to load products. ${error.message}`);
  }
}
