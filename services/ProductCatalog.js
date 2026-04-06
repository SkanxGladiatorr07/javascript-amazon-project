import { BaseCollectionService } from './BaseCollectionService.js';
import { Product, ProductRating } from '../models/Product.js';
import { products as productsData } from '../data/products.js';

export class ProductCatalog extends BaseCollectionService {
  constructor() {
    super(
      productsData.map((productData) => new Product(
        productData.id,
        productData.image,
        productData.name,
        new ProductRating(productData.rating.stars, productData.rating.count),
        productData.priceCents,
        productData.keywords,
        productData.type || null,
        productData.sizeChartLink || null
      ))
    );
  }

  getAllProducts() {
    return this.getItems();
  }

  findProductById(productId) {
    return this.findById(productId);
  }

  searchProducts(query) {
    return this.filter((product) => product.matchesSearch(query));
  }

  getClothingProducts() {
    return this.filter((product) => product.isClothing());
  }

  getProductCount() {
    return this.count();
  }
}

export const productCatalog = new ProductCatalog();