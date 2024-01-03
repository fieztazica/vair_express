import { UsersPermissionsUser } from '../auth/auth.types'
import { FeedbackType } from '../feedbacks/feedback.types'
import { ProductType } from '../products/product.types'

export type BoughtType = {
    total: number
    comment?: string
    recommend?: boolean
    bought_date: string
    users_permissions_user: UsersPermissionsUser
    feedback?: FeedbackType
    product: ProductType
}

export type CreateBoughtType = {
    total: number
    comment?: string
    recommend?: boolean
    bought_date?: string
    users_permissions_user: string
    feedback?: string
    product: string
}
