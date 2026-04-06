import { BaseEntity } from './BaseEntity.js';

export class ProductRating {
  constructor(stars, count) {
    this.stars = stars;
    this.count = count;
  }

  getRatingImageFilename() {
    return `rating-${this.stars * 10}.png`;
  }
}

export class Product extends BaseEntity {
  constructor(id, image, name, rating, priceCents, keywords, type = null, sizeChartLink = null) {
    super(id);
    this.image = image;
    this.name = name;
    this.rating = rating;
    this.priceCents = priceCents;
    this.keywords = keywords;
    this.type = type;
    this.sizeChartLink = sizeChartLink;
  }

  getPriceInDollars() {
    return this.priceCents / 100;
  }

  getFormattedPrice() {
    return `$${this.getPriceInDollars().toFixed(2)}`;
  }

  isClothing() {
    return this.type === 'clothing';
  }

  matchesSearch(query) {
    return this.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase()));
  }

  toJSON() {
    return {
      id: this.id,
      image: this.image,
      name: this.name,
      rating: this.rating,
      priceCents: this.priceCents,
      keywords: this.keywords,
      type: this.type,
      sizeChartLink: this.sizeChartLink
    };
  }
}