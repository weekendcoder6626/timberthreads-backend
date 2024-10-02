import { ProductDetailedType, ProductOverviewType } from "./DBTypes/Product.type";

export interface ProductOverviewWithIDType extends ProductOverviewType {
    _id: string
}

export interface ProductDetailedWithIDType extends ProductDetailedType {
    _id: string
}

export type WithIDType<T> = T & { _id: string }