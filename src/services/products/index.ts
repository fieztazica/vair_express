import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import { AxiosError } from 'axios'
import qs from 'qs'
import { ProductType } from './product.types'

class ProductService extends AxiosService {
    constructor() {
        super('/products')
    }

    async getProductListByDevId(devId: string) {
        const query = qs.stringify(
            {
                fields: ['name'],
                populate: ['users_permissions_user'],
                filters: {
                    users_permissions_user: {
                        id: devId,
                    },
                },
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<ProductType[]>>(`?${query}`)
    }

    async getProductById(productId: string) {
        const query = qs.stringify(
            {
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<ProductType>>(`/${productId}?${query}`)
    }

    async getProductsByCategory(category: string) {
        const query = qs.stringify(
            {
                populate: ['categories'],
                filters: {
                    categories: {
                        name: category,
                    },
                },
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<ProductType[]>>(`?${query}`)
    }

    async getFeaturedProducts() {}

    async createProduct(product: ProductType) {
        return await this.post<StrapiRes<ProductType>>(``, product)
    }

    async getProducts() {
        const query = qs.stringify(
            {
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.post<StrapiRes<ProductType[]>>(`?${query}`)
    }
}

const productService = new ProductService()

export default productService
