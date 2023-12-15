import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import { AxiosError } from 'axios'
import qs from 'qs'
import { ProductType, UploadProductType } from './product.types'
import boughtService from '../boughts'

class ProductService extends AxiosService {
    constructor() {
        super('/products')
    }

    _boughtService = boughtService

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
                        name: {
                            $containsi: category,
                        },
                    },
                },
            },
            {
                encodeValuesOnly: true,
            }
        )

        return await this.get<StrapiRes<ProductType[]>>(`?${query}`)
    }

    async createProduct(product: UploadProductType) {
        return await this.post<StrapiRes<ProductType>>(`/`, product)
    }

    async getProducts() {
        const query = qs.stringify(
            {
                populate: ['logo', 'banners'],
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<ProductType>>(`/?${query}`)
    }

    async buy(productId: string, userId: string, cost: number = 0) {
        return this._boughtService.createBought({
            product: productId,
            total: cost,
            users_permissions_user: userId,
        })
    }

    async searchProduct(queryString: string) {
        const query = qs.stringify(
            {
                populate: ['deep'],
                filters: {
                    $or: [
                        {
                            name: {
                                $containsi: queryString,
                            },
                        },
                        {
                            developer: {
                                name: {
                                    $containsi: queryString,
                                },
                            },
                        },
                        {
                            publisher: {
                                name: {
                                    $containsi: queryString,
                                },
                            },
                        },
                    ],
                },
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<ProductType[]>>(`?${query}`)
    }
}

const productService = new ProductService()

export default productService
