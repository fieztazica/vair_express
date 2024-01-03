import { StrapiRes } from 'strapiRes'
import AxiosService from '../axios'
import qs from 'qs'
import { FeedbackType, CreateFeedbackType } from './feedback.types'

class FeedbackService extends AxiosService {
    constructor() {
        super('/feedbacks')
    }

    async getAllFeedbacks() {
        return await this.get<StrapiRes<FeedbackType[]>>('')
    }

    async createFeedback(data: CreateFeedbackType) {
        return await this.post<StrapiRes<FeedbackType>>(`/`, data)
    }

    async getFeedbacksByUserId(userId: string) {
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
        return await this.get<StrapiRes<FeedbackType[]>>(`?${query}`)
    }

    async getFeedbacksByBoughtId(boughtId: string) {
        const query = qs.stringify(
            {
                filters: {
                    bought: {
                        id: boughtId,
                    },
                },
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<FeedbackType[]>>(`?${query}`)
    }

    async getFeedbacksByProductId(productId: string) {
        const query = qs.stringify(
            {
                filters: {
                    bought: {
                        product: {
                            id: productId,
                        },
                    },
                },
                populate: 'deep',
            },
            {
                encodeValuesOnly: true,
            }
        )
        return await this.get<StrapiRes<FeedbackType[]>>(`?${query}`)
    }
}

const feedbackService = new FeedbackService()
export default feedbackService
