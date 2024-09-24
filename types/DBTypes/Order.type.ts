import { ProductOverviewType } from "./Product.type";

export interface Order {
    orderID: String,
    userEmail: String,
    items: {
        product: ProductOverviewType,
        quantity: number
    }[],
    orderDate: String,
}