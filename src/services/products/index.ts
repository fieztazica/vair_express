import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import { AxiosError } from 'axios'
import qs from 'qs'

class ProductService extends AxiosService {
    constructor() {
        super('/products')
    }

    async list(userId: string) {
        const query = qs.stringify(
            {
                fields: ['name'],
                populate: ['developer_user'],
                filters: {
                    developer_user: {
                        id: userId,
                    },
                },
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get(`?${query}`)
    }
}

const productService = new ProductService()

export default productService
