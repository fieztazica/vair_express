import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import qs from 'qs'
import { BoughtType, CreateBoughtType } from './boughts.types'

class BoughtService extends AxiosService {
    constructor() {
        super('/boughts')
    }

    async getAllBoughts() {
        return await this.get<StrapiRes<BoughtType[]>>('')
    }

    async getBoughtsByUserId(userId: string) {
        const query = qs.stringify(
            {
                filters: {
                    users_permissions_user: {
                        id: userId,
                    },
                },
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<BoughtType[]>>(`?${query}`)
    }

    async createBought(data: CreateBoughtType) {
        const query = qs.stringify(
            {
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.post<StrapiRes<BoughtType>>(`/?${query}`, data)
    }

    async checkBought(productId: string, userId: string) {
        const query = qs.stringify(
            {
                filters: {
                    product: {
                        id: productId,
                    },
                    users_permissions_user: {
                        id: userId,
                    },
                },
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<BoughtType[]>>(`?${query}`)
    }
}

const boughtService = new BoughtService()
export default boughtService
