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

    async getProductByCategory(category: string) {
        const countQuery = qs.stringify(
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
        );
        const countResponse = await this.get<StrapiRes<ProductType[]>>(`?${countQuery}`);
        const totalCount = countResponse.data.length;
        const randomStartIndex = Math.floor(Math.random() * (totalCount - 10)); // Ensure there are at least 10 products

        const randomQuery = qs.stringify(
            {
                populate: ['categories'],
                filters: {
                    categories: {
                        name: category,
                    },
                }, pagination: {
                    start: randomStartIndex,
                    limit: 10,
                },
            },
            {
                encodeValuesOnly: true,
            }
        );

        return await this.get<StrapiRes<ProductType[]>>(`?${randomQuery}`);
    }


    async createProduct(Product: ProductType) {
        return await this.post<StrapiRes<ProductType>>(``, Product)
    }

    async getProducts() {
        return await this.get<StrapiRes<ProductType>>('')
    }
}

const productService = new ProductService()

export default productService
