import { Review } from "./Review.type"

export interface ProductOverviewType {
    productId: string,
    productName: string,
    sellerName?: string,
    sellerPic?: string,
    sellerEmail: string,
    shortDesc: string,
    smallImage?: string,
    rating?: number,
    price: number,
    discountPercent: number
    featured?: number,
}

export interface ProductDetailedType extends ProductOverviewType {
    largeImage?: string[],
    productDesc: string,
    productFeatures: string[],
    reviews?: Review[]
}