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

export async function loadProducts() {
  try {
    const response = await fetch(getProductsUrl());

    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }

    const productsData = await response.json();

    if (!Array.isArray(productsData)) {
      throw new Error('Products response must be an array.');
    }

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
