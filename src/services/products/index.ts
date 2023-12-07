import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import { AxiosError } from 'axios'
import qs from 'qs'
import { ProductType, UploadProductType } from './product.types'

class ProductService extends AxiosService {
    constructor() {
        super('/products')
    }

    async getProductListByDevId(devId: string) {
        const query = qs.stringify(
            {
                fields: ['name', 'publishedAt'],
                populate: ['users_permissions_user'],
                filters: {
                    users_permissions_user: {
                        id: devId,
                    },
                },
                publicationState: 'preview',
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

    async getProductByCategory(category: string) {
        const query = qs.stringify(
            {
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
        const countResponse = await this.get<StrapiRes<ProductType[]>>(
            `?${query}`
        )
        const allProducts = countResponse.data
        const shuffled = allProducts.slice(0)
        let i = allProducts.length
        let temp
        let index

        while (i--) {
            index = Math.floor((i + 1) * Math.random())
            temp = shuffled[index]
            shuffled[index] = shuffled[i]
            shuffled[i] = temp
        }

        const randomProducts = shuffled.slice(0, 10)

        return randomProducts
    }

    async createProduct(product: UploadProductType) {
        return await this.post<StrapiRes<ProductType>>(`/`, product)
    }

    async getProducts() {
        return await this.get<StrapiRes<ProductType>>('/')
    }
}

const productService = new ProductService()

export default productService
