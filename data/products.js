export let products = [];

function getProductsUrl() {
  if (typeof window !== 'undefined') {
    return '/backend/products.json';
  }

  return new URL('../backend/products.json', import.meta.url).href;
}

function loadProductsFromFile() {
  return import('node:fs/promises')
    .then((fs) => fs.readFile(new URL('../backend/products.json', import.meta.url), 'utf-8'))
    .then((fileContent) => JSON.parse(fileContent));
}

export function loadProducts() {
  return fetch(getProductsUrl())
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }

      return response.json();
    })
    .then((productsData) => {
      products = productsData;
      return products;
    })
    .catch((error) => {
      if (typeof window === 'undefined') {
        return loadProductsFromFile().then((productsData) => {
          products = productsData;
          return products;
        });
      }

      throw new Error(`Network error while loading products. ${error.message}`);
    });
}
